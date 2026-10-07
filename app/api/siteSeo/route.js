import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const SEED_SITE_SEO = {
  // General
  siteUrl: 'https://modernestimator.com',
  keywords: 'construction estimation, quantity takeoff, material estimation, bid preparation, residential estimation, commercial estimation, US contractors',
  // OpenGraph
  ogType: 'website',
  ogLocale: 'en_US',
  ogSiteName: 'Modern Estimator',
  ogTitle: 'Modern Estimator — USA Construction Estimation Services',
  ogDescription: 'Quantity takeoffs, material estimation and bid preparation for residential and commercial projects across the United States. Fast turnarounds. Bank-grade accuracy.',
  ogImage: '',
  // Twitter
  twitterCard: 'summary_large_image',
  twitterTitle: 'Modern Estimator — USA Construction Estimation Services',
  twitterDescription: 'Premium construction estimation services for US contractors. 8–24 hour turnaround. Accurate to ±2%.',
  // Robots
  robotsIndex: true,
  robotsFollow: true,
  // Schema.org — business
  businessName: 'Modern Estimator',
  businessDescription: 'Premium construction estimation services for US contractors. Quantity takeoffs, material estimation, residential and commercial bid preparation with 8–24 hour turnaround.',
  telephone: '+1-555-123-4567',
  email: 'hello@modernestimator.com',
  priceRange: '$$',
  // Schema.org — address
  streetAddress: '1100 Estimator Ave, Suite 210',
  addressLocality: 'Austin',
  addressRegion: 'TX',
  postalCode: '78701',
  addressCountry: 'US',
  areaServed: 'United States',
  // Schema.org — rating
  ratingValue: '4.9',
  reviewCount: '320',
  // Sitemap
  sitemapChangeFreq: 'monthly',
  sitemapHomePriority: '1',
  sitemapPagePriority: '0.8',
  sitemapDetailPriority: '0.7',
};

export async function GET() {
  try {
    const ref = doc(db, 'siteSeo', 'main');
    const snap = await getDoc(ref);

    // If the document is missing, auto-seed with initial data!
    if (!snap.exists()) {
      console.log('Seeding initial site SEO settings into Firestore DB...');
      await setDoc(ref, SEED_SITE_SEO);
      return NextResponse.json({ data: SEED_SITE_SEO });
    }

    return NextResponse.json({ data: { ...snap.data(), id: snap.id } });
  } catch (error) {
    console.error('Error fetching site SEO settings:', error);
    return NextResponse.json({ error: 'Failed to fetch site SEO settings', details: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const ref = doc(db, 'siteSeo', 'main');

    await setDoc(ref, { ...body, updatedAt: new Date().toISOString() }, { merge: true });
    const snap = await getDoc(ref);

    return NextResponse.json({ success: true, data: { ...snap.data(), id: snap.id } });
  } catch (error) {
    console.error('Error updating site SEO settings:', error);
    return NextResponse.json({ error: 'Failed to update site SEO settings', details: error.message }, { status: 500 });
  }
}
