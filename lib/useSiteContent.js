'use client';
// Shared live site content for the public site.
// Fetches the admin-managed collections once per session, builds menu trees,
// and applies the Visibility switches. Falls back gracefully when offline.

import { useEffect, useState } from 'react';

let cachedPromise = null;

// List APIs use different envelope keys ({ data }, { items }, { stats }, …) —
// extract the array tolerantly so a shape mismatch can never silently
// fall back to hardcoded content.
function extractList(j) {
  if (Array.isArray(j)) return j;
  if (!j || typeof j !== 'object') return null;
  if (Array.isArray(j.data)) return j.data;
  if (Array.isArray(j.items)) return j.items;
  for (const v of Object.values(j)) {
    if (Array.isArray(v)) return v;
  }
  return null;
}

async function fetchJson(path, { list = false } = {}) {
  try {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) return list ? [] : null;
    const j = await res.json();
    if (list) return extractList(j) || [];
    if (j && typeof j === 'object' && 'data' in j) return j.data;
    return j;
  } catch {
    return list ? [] : null;
  }
}

const PAGE_PATHS = {
  home: '/',
  services: '/services',
  trades: '/trades',
  portfolio: '/portfolio',
  about: '/about',
  contact: '/contact',
};

function pageHidden(href, pages) {
  if (!href || !pages) return false;
  for (const [key, path] of Object.entries(PAGE_PATHS)) {
    if (pages[key] === false && (href === path || href.startsWith(path + '/'))) return true;
  }
  return false;
}

function buildTree(items, pages) {
  const list = Array.isArray(items) ? items : [];
  const live = list.filter(
    (i) => i && i.status !== 'Draft' && !pageHidden(i.href, pages)
  );
  const byParent = {};
  live.forEach((i) => {
    const k = i.parentId || '__root';
    (byParent[k] = byParent[k] || []).push(i);
  });
  Object.values(byParent).forEach((a) =>
    a.sort((x, y) => (x.order || 0) - (y.order || 0))
  );
  const nest = (pid) =>
    (byParent[pid || '__root'] || []).map((i) => ({
      ...i,
      children: nest(i.id),
    }));
  return nest(null);
}

// Published items only, sorted by `order`.
const liveList = (arr) =>
  (Array.isArray(arr) ? arr : []).filter((i) => i && i.status !== 'Draft');
const byOrder = (arr) =>
  liveList(arr).sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

async function load() {
  const [
    navMenus, navbar, siteSettings, footerMenus, footer, contactInfo, visibility,
    hero, stats, services, trades, portfolio, whyChooseUs, processSteps,
    sectionHeadings, faqs, testimonials, ctaBanner,
  ] = await Promise.all([
    fetchJson('/api/navMenus', { list: true }),
    fetchJson('/api/navbar'),
    fetchJson('/api/siteSettings'),
    fetchJson('/api/footerMenus', { list: true }),
    fetchJson('/api/footer'),
    fetchJson('/api/contactInfo'),
    fetchJson('/api/visibility'),
    fetchJson('/api/hero'),
    fetchJson('/api/stats', { list: true }),
    fetchJson('/api/services', { list: true }),
    fetchJson('/api/trades', { list: true }),
    fetchJson('/api/portfolio', { list: true }),
    fetchJson('/api/whyChooseUs', { list: true }),
    fetchJson('/api/processSteps', { list: true }),
    fetchJson('/api/sectionHeadings', { list: true }),
    fetchJson('/api/faqs', { list: true }),
    fetchJson('/api/testimonials', { list: true }),
    fetchJson('/api/ctaBanner'),
  ]);

  const pages = visibility?.pages || {};
  const elements = visibility?.elements || {};
  const sections = visibility?.sections || {};

  const footerGroups = {};
  liveList(footerMenus)
    .filter((i) => !i.parentId && !pageHidden(i.href, pages))
    .forEach((i) => {
      const g = i.group || 'company';
      (footerGroups[g] = footerGroups[g] || []).push(i);
    });
  Object.values(footerGroups).forEach((a) =>
    a.sort((x, y) => (x.order || 0) - (y.order || 0))
  );

  // Section headings keyed by section: { services: { eyebrow, heading, subtitle } }
  const headings = {};
  liveList(sectionHeadings).forEach((h) => {
    if (h.section) headings[h.section] = h;
  });

  return {
    // Chrome
    navTree: buildTree(navMenus, pages),
    navbar: navbar || {},
    siteSettings: siteSettings || {},
    footerGroups,
    footer: footer || {},
    contactInfo: contactInfo || {},
    visibility: elements,
    sections,
    // Homepage
    hero: hero || {},
    stats: byOrder(stats),
    services: byOrder(services),
    trades: liveList(trades),
    portfolio: byOrder(portfolio),
    whyChooseUs: byOrder(whyChooseUs),
    processSteps: liveList(processSteps).sort((a, b) =>
      String(a.num || '').localeCompare(String(b.num || ''))
    ),
    headings,
    faqs: byOrder(faqs),
    testimonials: byOrder(testimonials),
    ctaBanner: ctaBanner || {},
    loaded: true,
  };
}

export function useSiteContent() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (!cachedPromise) cachedPromise = load();
    cachedPromise.then(setContent).catch(() => setContent({ loaded: false }));
  }, []);

  return content;
}

// Split a Firestore string-or-array field into an array of lines.
export function toArray(v) {
  if (Array.isArray(v)) return v.filter(Boolean);
  if (typeof v === 'string') {
    return v
      .split(/\r?\n|,/)
      .map((s) => s.trim().replace(/^[-•*]\s*/, ''))
      .filter(Boolean);
  }
  return [];
}
