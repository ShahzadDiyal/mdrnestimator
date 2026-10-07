import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const SEED_HERO = {
  "badge": "Trusted by 500+ US Contractors",
  "title": "Win More Bids With",
  "titleAccent": "Accurate Construction Estimating",
  "titleSuffix": "Services",
  "intro": "Every bid you lose to a rough guess is money left on the table. Modern Estimator delivers precise, bid-ready construction estimating and quantity takeoff services in 8 to 24 hours, giving you the accurate numbers to quote fast and win more work.",
  "ctaPrimary": "Get a Free Quote",
  "ctaPrimaryHref": "/contact",
  "ctaSecondary": "Upload Your Plans",
  "ctaSecondaryHref": "/contact",
  "image": "/hero.jpg",
  "imageAlt": "Modern Estimator team preparing construction estimates from blueprints on site",
  "trustBadges": [
    {
      "label": "Google Reviews",
      "value": "5.0"
    },
    {
      "label": "Certified",
      "value": "Estimators"
    },
    {
      "label": "Top Rated",
      "value": "Estimating Service 2025"
    }
  ]
};

export async function GET() {
  try {
    const ref = doc(db, 'hero', 'main');
    const snap = await getDoc(ref);

    // If the document is missing, auto-seed with initial data!
    if (!snap.exists()) {
      console.log('Seeding initial hero content into Firestore DB...');
      await setDoc(ref, SEED_HERO);
      return NextResponse.json({ data: SEED_HERO });
    }

    return NextResponse.json({ data: { ...snap.data(), id: snap.id } });
  } catch (error) {
    console.error('Error fetching hero content:', error);
    return NextResponse.json({ error: 'Failed to fetch hero content', details: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const ref = doc(db, 'hero', 'main');

    await setDoc(ref, { ...body, updatedAt: new Date().toISOString() }, { merge: true });
    const snap = await getDoc(ref);

    return NextResponse.json({ success: true, data: { ...snap.data(), id: snap.id } });
  } catch (error) {
    console.error('Error updating hero content:', error);
    return NextResponse.json({ error: 'Failed to update hero content', details: error.message }, { status: 500 });
  }
}
