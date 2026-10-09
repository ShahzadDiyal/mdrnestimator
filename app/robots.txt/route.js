import { getCrawling, isIndexable } from '@/lib/site';

const BASE_URL = 'https://modernestimator.com';
const STATIC_PAGES = ['/', '/services', '/trades', '/portfolio', '/about', '/contact', '/blog'];

// /robots.txt — disallow lines are generated from the admin's per-URL
// index toggles (Website Content → Crawling & Indexing); extra custom
// rules from the same page are appended verbatim.
export async function GET() {
  const crawling = await getCrawling().catch(() => null);

  const disallow = [];
  for (const p of STATIC_PAGES) {
    if (p !== '/' && !isIndexable(crawling, p)) disallow.push(`Disallow: ${p}`);
  }
  if (crawling && crawling.indexServices === false) disallow.push('Disallow: /services/');
  if (crawling && crawling.indexTrades === false) disallow.push('Disallow: /trades/');
  if (crawling && crawling.indexPosts === false) disallow.push('Disallow: /blog/');

  const lines = ['User-agent: *', 'Allow: /', ...disallow];
  const extra = (crawling?.robotsExtra || '').trim();
  if (extra) lines.push('', extra);
  lines.push('', `Sitemap: ${BASE_URL}/sitemap.xml`);

  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
