import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { SERVICES } from '@/data/services';

export function normalizeService(raw) {
  if (!raw) return null;

  const toList = (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') return val.split(/[;\n]/).map((s) => s.trim()).filter(Boolean);
    return [];
  };

  const toParagraphs = (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') return val.split(/\n\n|\r\n\r\n/).map((s) => s.trim()).filter(Boolean);
    return [];
  };

  return {
    ...raw,
    title: raw.title || '',
    slug: raw.slug || '',
    tagline: raw.tagline || raw.short || '',
    overview: toParagraphs(raw.overview),
    includes: toList(raw.includes),
    deliverables: toList(raw.deliverables),
    points: toList(raw.points),
    status: raw.status || 'Published',
  };
}

export async function fetchLiveServices() {
  try {
    const snapshot = await getDocs(collection(db, 'services'));
    if (!snapshot.empty) {
      const items = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
      const published = items.filter((s) => (s.status || 'Published') === 'Published');
      if (published.length > 0) {
        return published.map(normalizeService);
      }
    }
  } catch (err) {
    console.error('Error fetching live services from Firestore:', err);
  }
  return SERVICES.map(normalizeService);
}

export async function fetchLiveServiceBySlug(slug) {
  try {
    const snapshot = await getDocs(collection(db, 'services'));
    if (!snapshot.empty) {
      const found = snapshot.docs.find(
        (d) => d.data().slug === slug && (d.data().status || 'Published') === 'Published'
      );
      if (found) return normalizeService({ ...found.data(), id: found.id });
    }
  } catch (err) {
    console.error('Error fetching live service by slug from Firestore:', err);
  }
  const fallback = SERVICES.find((s) => s.slug === slug);
  return fallback ? normalizeService(fallback) : null;
}
