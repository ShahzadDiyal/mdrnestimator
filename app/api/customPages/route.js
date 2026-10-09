import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, getDoc, query, where } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Slugs that collide with real routes — a custom page can never use these.
export const RESERVED_SLUGS = [
  'about', 'contact', 'services', 'trades', 'blog', 'portfolio',
  'admin', 'api', 'login', '_next', 'favicon.ico', 'sitemap.xml', 'robots.txt', 'llms.txt',
];

export function cleanSlug(raw) {
  return (raw || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, 'customPages'));
    const pages = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
    pages.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
    return NextResponse.json({ pages });
  } catch (error) {
    console.error('Error fetching custom pages:', error);
    return NextResponse.json({ error: 'Failed to fetch custom pages', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, slug, metaTitle, metaDescription, blocks, status, noindex } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Page title is required' }, { status: 400 });
    }

    const finalSlug = cleanSlug(slug || title);
    if (!finalSlug) {
      return NextResponse.json({ error: 'A valid URL slug is required' }, { status: 400 });
    }
    if (RESERVED_SLUGS.includes(finalSlug)) {
      return NextResponse.json({ error: `"${finalSlug}" is a reserved URL and can't be used` }, { status: 400 });
    }

    // Slug must be unique.
    const dup = await getDocs(query(collection(db, 'customPages'), where('slug', '==', finalSlug)));
    if (!dup.empty) {
      return NextResponse.json({ error: 'Another page already uses this URL slug' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const pageId = `cpg-${finalSlug || Date.now().toString(36)}`;
    const newPage = {
      id: pageId,
      title: title.trim(),
      slug: finalSlug,
      metaTitle: (metaTitle || '').trim(),
      metaDescription: (metaDescription || '').trim(),
      blocks: Array.isArray(blocks) ? blocks : [],
      status: status || 'Draft',
      noindex: !!noindex,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(doc(db, 'customPages', pageId), newPage);
    return NextResponse.json({ success: true, page: newPage });
  } catch (error) {
    console.error('Error creating custom page:', error);
    return NextResponse.json({ error: 'Failed to create page', details: error.message }, { status: 500 });
  }
}
