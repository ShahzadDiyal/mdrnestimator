import { NextResponse } from 'next/server';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const STATIC_PAGES = ['/', '/services', '/trades', '/portfolio', '/about', '/contact', '/blog'];

export const SEED_CRAWLING = {
  // Extra robots.txt rules appended after the generated allow/disallow lines.
  robotsExtra: '',
  // Full llms.txt content, served verbatim at /llms.txt.
  llmsTxt: `# Modern Estimator

> Construction estimation services for US contractors — quantity takeoffs, material estimation, and bid preparation with 8–24 hour turnaround.

## Services

- [Construction Estimating Services](https://modernestimator.com/services): quantity takeoff, material estimation, residential and commercial estimating, bid preparation.
- [Trade Estimating Pages](https://modernestimator.com/trades): CSI-division trade estimates — concrete, masonry, metals, carpentry, MEP, finishes and more.

## Company

- [About](https://modernestimator.com/about): who we are and how we work.
- [Portfolio](https://modernestimator.com/portfolio): selected estimates delivered nationwide.
- [Blog](https://modernestimator.com/blog): estimating guides and industry insight.
- [Contact / Get a Quote](https://modernestimator.com/contact): send plans for a free, no-obligation estimate.
`,
  // Per-URL index toggles (static pages).
  pages: Object.fromEntries(STATIC_PAGES.map((p) => [p, { index: true }])),
  // Group toggles for detail pages.
  indexServices: true,
  indexTrades: true,
  indexPosts: true,
};

export async function GET() {
  try {
    const ref = doc(db, 'crawling', 'main');
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, SEED_CRAWLING);
      return NextResponse.json({ data: SEED_CRAWLING });
    }

    return NextResponse.json({ data: { ...snap.data(), id: snap.id } });
  } catch (error) {
    console.error('Error fetching crawling settings:', error);
    return NextResponse.json({ error: 'Failed to fetch crawling settings' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const ref = doc(db, 'crawling', 'main');

    await setDoc(ref, { ...body, updatedAt: new Date().toISOString() }, { merge: true });
    const snap = await getDoc(ref);

    return NextResponse.json({ success: true, data: { ...snap.data(), id: snap.id } });
  } catch (error) {
    console.error('Error saving crawling settings:', error);
    return NextResponse.json({ error: 'Failed to save crawling settings' }, { status: 500 });
  }
}
