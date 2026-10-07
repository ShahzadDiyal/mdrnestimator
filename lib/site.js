// Server-side Firestore readers for public pages (SEO-friendly SSR).
// Reads the same collections the /api/* routes serve, so the public site
// always shows the admin-managed data. Never throws — falls back to [].

import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// Split a Firestore string-or-array field into a list.
// One item per line; a single line with semicolons also splits on ";".
export function toArray(v) {
  if (Array.isArray(v)) return v.filter(Boolean);
  if (typeof v === 'string') {
    let parts = v
      .split(/\r?\n/)
      .map((s) => s.trim().replace(/^[-•*]\s*/, ''))
      .filter(Boolean);
    if (parts.length <= 1 && parts[0] && parts[0].includes(';')) {
      parts = parts[0]
        .split(';')
        .map((s) => s.trim().replace(/^[-•*]\s*/, ''))
        .filter(Boolean);
    }
    return parts;
  }
  return [];
}

// Split into paragraphs (blank-line separated).
export function toParagraphs(v) {
  if (Array.isArray(v)) return v.filter(Boolean);
  if (typeof v === 'string') {
    return v
      .split(/\r?\n\s*\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

async function getAll(name) {
  try {
    const snap = await getDocs(collection(db, name));
    return snap.docs.map((d) => ({ ...d.data(), id: d.id }));
  } catch (e) {
    console.error(`[site] getAll(${name}) failed:`, e?.message);
    return [];
  }
}

export const publishedOnly = (arr) =>
  (Array.isArray(arr) ? arr : []).filter((i) => i && i.status !== 'Draft');

export const byOrder = (arr) =>
  publishedOnly(arr).sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

export async function getServices() {
  return byOrder(await getAll('services'));
}

export async function getServiceBySlug(slug) {
  const all = await getServices();
  return all.find((s) => s.slug === slug) || null;
}

export async function getTrades() {
  return publishedOnly(await getAll('trades'));
}

export async function getTradeBySlug(slug) {
  const all = await getTrades();
  return all.find((t) => t.slug === slug) || null;
}

export async function getFaqs() {
  return byOrder(await getAll('faqs'));
}

export async function getTestimonials() {
  return byOrder(await getAll('testimonials'));
}

// Per-page SEO (Website Content → SEO Meta), matched by path e.g. "/services".
export async function getSeoPage(path) {
  const all = await getAll('seoPages');
  return publishedOnly(all).find((p) => p.path === path) || null;
}

// About page content (Website Content → About Page), singleton doc.
export async function getAboutPage() {
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const snap = await getDoc(doc(db, 'aboutPage', 'main'));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.error('[site] getAboutPage failed:', e?.message);
    return null;
  }
}

// Contact details (Website Content → Contact), singleton doc.
export async function getContactInfo() {
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const snap = await getDoc(doc(db, 'contactInfo', 'main'));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.error('[site] getContactInfo failed:', e?.message);
    return null;
  }
}

// Portfolio projects (Website Content → Portfolio).
export async function getPortfolio() {
  return byOrder(await getAll('portfolio'));
}

// Site-wide SEO defaults (Website Content → Site SEO).
export async function getSiteSeo() {
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const snap = await getDoc(doc(db, 'siteSeo', 'main'));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.error('[site] getSiteSeo failed:', e?.message);
    return null;
  }
}

/* ---------------- trades ---------------- */

// Parse a scope string into groups:
// "Group title: item; item | Other: item; item"
export function parseScope(v) {
  if (Array.isArray(v)) return v;
  if (typeof v !== 'string' || !v.trim()) return [];
  return v
    .split('|')
    .map((g) => {
      const idx = g.indexOf(':');
      if (idx === -1) return null;
      const title = g.slice(0, idx).trim();
      const items = g
        .slice(idx + 1)
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean);
      return title && items.length ? { title, items } : null;
    })
    .filter(Boolean);
}

// Parse FAQs: either [{q,a}] or "Q: ...\nA: ...\n\nQ: ...\nA: ..."
export function parseFaqs(v) {
  if (Array.isArray(v)) {
    return v
      .map((f) => ({ q: f.q || f.question || '', a: f.a || f.answer || '' }))
      .filter((f) => f.q);
  }
  if (typeof v !== 'string' || !v.trim()) return [];
  const out = [];
  for (const block of v.split(/\r?\n\s*\r?\n/)) {
    const m = block.match(/Q:\s*([\s\S]*?)\r?\nA:\s*([\s\S]*)/i);
    if (m) out.push({ q: m[1].trim(), a: m[2].trim() });
  }
  return out;
}

// Parent → children tree for the /trades index cards.
export async function getTradeTree() {
  const all = await getTrades();
  if (!all.length) return [];
  const parents = all.filter((t) => !t.parent || t.parent === '—');
  return parents.map((p) => ({
    slug: p.slug,
    title: p.title,
    tagline: p.tagline || '',
    children: all
      .filter((c) => c.parent === p.title)
      .map((c) => ({ slug: c.slug, title: c.title })),
  }));
}

// Full trade detail, normalized to the shape /trades/[slug] renders.
// Live Firestore first; static fallback so the page never breaks.
export async function getTradeDetail(slug) {
  const all = await getTrades();
  const doc = all.find((t) => t.slug === slug);
  if (doc) {
    const parentDoc = all.find((t) => t.title === doc.parent);
    const siblings = parentDoc
      ? all
          .filter((t) => t.parent === parentDoc.title && t.slug !== doc.slug)
          .map((t) => ({ slug: t.slug, title: t.title, tagline: t.tagline || '' }))
      : [];
    const children = all
      .filter((t) => t.parent === doc.title)
      .map((t) => ({ slug: t.slug, title: t.title, tagline: t.tagline || '' }));
    return {
      slug: doc.slug,
      title: doc.title,
      tagline: doc.tagline || '',
      h1: doc.h1 || doc.title,
      metaTitle: doc.metaTitle || '',
      metaDescription: doc.metaDescription || '',
      intro: toParagraphs(doc.intro),
      overview: [],
      scope: parseScope(doc.scope),
      serve: toArray(doc.serve),
      deliverables: toArray(doc.deliverables),
      relatedServices: toArray(doc.relatedServices),
      faqs: parseFaqs(doc.faqs),
      parent: parentDoc
        ? { title: parentDoc.title, slug: parentDoc.slug, children: siblings }
        : null,
      children,
    };
  }
  // Static fallback — normalize to the same shape.
  try {
    const { getTrade } = await import('@/data/trade-pages');
    const t = getTrade(slug);
    if (!t) return null;
    return {
      slug: t.slug,
      title: t.title,
      tagline: t.tagline || '',
      h1: t.h1 || t.title,
      metaTitle: t.meta?.title || '',
      metaDescription: t.meta?.description || '',
      intro: toParagraphs(t.intro),
      overview: toParagraphs(t.overview),
      scope: parseScope(t.scope),
      serve: toArray(t.serve),
      deliverables: toArray(t.deliverables),
      relatedServices: toArray(t.relatedServices),
      faqs: parseFaqs(t.faqs),
      parent: t.parent
        ? {
            title: t.parent.title,
            slug: t.parent.slug,
            children: (t.parent.children || []).map((c) => ({
              slug: c.slug,
              title: c.title,
              tagline: c.tagline || '',
            })),
          }
        : null,
      children: (t.children || []).map((c) => ({
        slug: c.slug,
        title: c.title,
        tagline: c.tagline || '',
      })),
    };
  } catch {
    return null;
  }
}
