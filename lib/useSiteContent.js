'use client';
// Shared live site content for the public Navbar / Footer.
// Fetches the admin-managed collections once per session, builds menu trees,
// and applies the Visibility switches. Falls back gracefully when offline.

import { useEffect, useState } from 'react';

let cachedPromise = null;

async function fetchJson(path) {
  try {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) return null;
    const j = await res.json();
    return j && 'data' in j ? j.data : j;
  } catch {
    return null;
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

async function load() {
  const [navMenus, navbar, siteSettings, footerMenus, footer, contactInfo, visibility] =
    await Promise.all([
      fetchJson('/api/navMenus'),
      fetchJson('/api/navbar'),
      fetchJson('/api/siteSettings'),
      fetchJson('/api/footerMenus'),
      fetchJson('/api/footer'),
      fetchJson('/api/contactInfo'),
      fetchJson('/api/visibility'),
    ]);

  const pages = visibility?.pages || {};
  const elements = visibility?.elements || {};

  const footerGroups = {};
  (Array.isArray(footerMenus) ? footerMenus : [])
    .filter((i) => i && i.status !== 'Draft' && !i.parentId && !pageHidden(i.href, pages))
    .forEach((i) => {
      const g = i.group || 'company';
      (footerGroups[g] = footerGroups[g] || []).push(i);
    });
  Object.values(footerGroups).forEach((a) =>
    a.sort((x, y) => (x.order || 0) - (y.order || 0))
  );

  return {
    navTree: buildTree(navMenus, pages),
    navbar: navbar || {},
    siteSettings: siteSettings || {},
    footerGroups,
    footer: footer || {},
    contactInfo: contactInfo || {},
    visibility: elements,
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
