// Server-side Firestore readers for public pages (SEO-friendly SSR).
// Reads the same collections the /api/* routes serve, so the public site
// always shows the admin-managed data. Never throws — falls back to [].

import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// Split a Firestore string-or-array field into a list (one item per line).
export function toArray(v) {
  if (Array.isArray(v)) return v.filter(Boolean);
  if (typeof v === 'string') {
    return v
      .split(/\r?\n/)
      .map((s) => s.trim().replace(/^[-•*]\s*/, ''))
      .filter(Boolean);
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
