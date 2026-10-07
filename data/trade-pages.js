// Server-side helpers that merge the lean trade tree (data/trades.js) with the
// detailed page content. Import from here in pages/sitemap — NOT in client
// components — so the long-form copy never ships in the browser bundle.

import { TRADES } from './trades';
import { PARENT_CONTENT } from './trade-content-parents';
import { CHILD_CONTENT } from './trade-content-children';

const CONTENT = { ...PARENT_CONTENT, ...CHILD_CONTENT };

/** Every trade (parents + children) with full page content merged in. */
export function getAllTrades() {
  const list = [];
  for (const t of TRADES) {
    list.push({ ...t, ...(CONTENT[t.slug] || {}), parent: null });
    for (const c of t.children) {
      list.push({ ...c, ...(CONTENT[c.slug] || {}), parent: t, children: [] });
    }
  }
  return list;
}

export function getTrade(slug) {
  return getAllTrades().find((t) => t.slug === slug) || null;
}
