import { getCrawling, getVisibility, isIndexable } from '@/lib/site';

const BASE_URL = 'https://modernestimator.com';
const STATIC_PAGES = [
  { path: '/', key: 'home' },
  { path: '/services', key: 'services' },
  { path: '/trades', key: 'trades' },
  { path: '/portfolio', key: 'portfolio' },
  { path: '/about', key: 'about' },
  { path: '/contact', key: 'contact' },
  { path: '/blog', key: 'blog' },
];

// /robots.txt — disallow lines are generated from the admin's per-URL
// index toggles (Crawling & Indexing) and hidden pages (Visibility);
// extra custom rules from Crawling & Indexing are appended verbatim.
export async function GET() {
  const [crawling, vis] = await Promise.all([
    getCrawling().catch(() => null),
    getVisibility().catch(() => null),
  ]);

  const disallow = [];
  for (const { path, key } of STATIC_PAGES) {
    const hidden = vis?.pages?.[key] === false;
    if (path !== '/' && (!isIndexable(crawling, path) || hidden)) disallow.push(`Disallow: ${path}`);
  }
  if (crawling && crawling.indexServices === false) disallow.push('Disallow: /services/');
  if (crawling && crawling.indexTrades === false) disallow.push('Disallow: /trades/');
  if (crawling && crawling.indexPosts === false) disallow.push('Disallow: /blog/');
  if (vis?.pages?.services === false) disallow.push('Disallow: /services/');
  if (vis?.pages?.trades === false) disallow.push('Disallow: /trades/');

  const lines = ['User-agent: *', 'Allow: /', ...disallow];
  const extra = (crawling?.robotsExtra || '').trim();
  if (extra) lines.push('', extra);
  lines.push('', `Sitemap: ${BASE_URL}/sitemap.xml`);

  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
