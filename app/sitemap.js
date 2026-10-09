import { SERVICES } from '@/data/services';
import { getAllTrades } from '@/data/trades';
import { getServices, getTrades, getPosts, getSiteSeo, getCrawling, getVisibility, isIndexable } from '@/lib/site';

const BASE_URL = 'https://modernestimator.com';

// Visibility page keys for the static routes (Website Content → Visibility).
const VIS_KEY = { '': 'home', '/services': 'services', '/trades': 'trades', '/portfolio': 'portfolio', '/about': 'about', '/contact': 'contact', '/blog': 'blog' };

export default async function sitemap() {
  const now = new Date();

  // Frequencies & priorities — managed in Site SEO → Sitemap.
  // Index toggles — managed in Website Content → Crawling & Indexing.
  // Page visibility — managed in Website Content → Visibility.
  const [seo, crawling, vis] = await Promise.all([
    getSiteSeo(),
    getCrawling().catch(() => null),
    getVisibility().catch(() => null),
  ]);
  const changeFreq = seo?.sitemapChangeFreq || 'monthly';
  const homePriority = Number(seo?.sitemapHomePriority) || 1;
  const pagePriority = Number(seo?.sitemapPagePriority) || 0.8;
  const detailPriority = Number(seo?.sitemapDetailPriority) || 0.7;

  const pageVisible = (path) => vis?.pages?.[VIS_KEY[path]] !== false;

  const staticRoutes = ['', '/services', '/trades', '/portfolio', '/about', '/contact', '/blog']
    .filter((path) => isIndexable(crawling, path === '' ? '/' : path) && pageVisible(path))
    .map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: changeFreq,
      priority: path === '' ? homePriority : pagePriority,
    }));

  // Live data first (admin-managed), static catalog as fallback.
  const [liveServices, liveTrades, livePosts] = await Promise.all([
    getServices(),
    getTrades(),
    getPosts(),
  ]);

  const serviceSlugs = (liveServices.length ? liveServices : SERVICES).map((s) => s.slug);
  const tradeSlugs = (liveTrades.length ? liveTrades : getAllTrades()).map((t) => t.slug);

  const serviceRoutes = isIndexable(crawling, '/services/x') && pageVisible('/services')
    ? serviceSlugs.map((slug) => ({
        url: `${BASE_URL}/services/${slug}`,
        lastModified: now,
        changeFrequency: changeFreq,
        priority: detailPriority,
      }))
    : [];

  const tradeRoutes = isIndexable(crawling, '/trades/x') && pageVisible('/trades')
    ? tradeSlugs.map((slug) => ({
        url: `${BASE_URL}/trades/${slug}`,
        lastModified: now,
        changeFrequency: changeFreq,
        priority: detailPriority,
      }))
    : [];

  const postRoutes = isIndexable(crawling, '/blog/x')
    ? livePosts.map((p) => ({
        url: `${BASE_URL}/blog/${p.slug}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
        changeFrequency: 'weekly',
        priority: 0.6,
      }))
    : [];

  return [...staticRoutes, ...serviceRoutes, ...tradeRoutes, ...postRoutes];
}
