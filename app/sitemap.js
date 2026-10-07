import { SERVICES } from '@/data/services';
import { getAllTrades } from '@/data/trades';
import { getServices, getTrades, getPosts } from '@/lib/site';

const BASE_URL = 'https://modernestimator.com';

export default async function sitemap() {
  const now = new Date();

  const staticRoutes = ['', '/services', '/trades', '/portfolio', '/about', '/contact', '/blog'].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.8,
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
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const tradeRoutes = tradeSlugs.map((slug) => ({
    url: `${BASE_URL}/trades/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const postRoutes = livePosts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...tradeRoutes, ...postRoutes];
}
