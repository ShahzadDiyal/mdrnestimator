import { SERVICES } from '@/data/services';
import { getAllTrades } from '@/data/trades';

const BASE_URL = 'https://modernestimator.com';

export default function sitemap() {
  const now = new Date();

  const staticRoutes = ['', '/services', '/trades', '/portfolio', '/about', '/contact'].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.8,
  }));

  const serviceRoutes = SERVICES.map((s) => ({
    url: `${BASE_URL}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const tradeRoutes = getAllTrades().map((t) => ({
    url: `${BASE_URL}/trades/${t.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes, ...tradeRoutes];
}
