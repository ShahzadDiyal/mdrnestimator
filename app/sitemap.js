import { SERVICES } from '@/data/services';
import { getAllTrades } from '@/data/trades';
import { getServices, getTrades, getPosts, getSiteSeo } from '@/lib/site';

const BASE_URL = 'https://modernestimator.com';

export default async function sitemap() {
  const now = new Date();

  // Frequencies & priorities — managed in Site SEO → Sitemap.
  const seo = await getSiteSeo();
  const changeFreq = seo?.sitemapChangeFreq || 'monthly';
  const homePriority = Number(seo?.sitemapHomePriority) || 1;
  const pagePriority = Number(seo?.sitemapPagePriority) || 0.8;
  const detailPriority = Number(seo?.sitemapDetailPriority) || 0.7;

  const staticRoutes = ['', '/services', '/trades', '/portfolio', '/about', '/contact', '/blog'].map((path) => ({
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

  const serviceRoutes = serviceSlugs.map((slug) => ({
    url: `${BASE_URL}/services/${slug}`,
    lastModified: now,
    changeFrequency: changeFreq,
    priority: detailPriority,
  }));

  const tradeRoutes = tradeSlugs.map((slug) => ({
    url: `${BASE_URL}/trades/${slug}`,
    lastModified: now,
    changeFrequency: changeFreq,
    priority: detailPriority,
  }));

  const postRoutes = livePosts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...tradeRoutes, ...postRoutes];
}
