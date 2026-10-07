import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const SEED_NAVBAR = {
  "phoneDisplay": "+1 (555) 123-4567",
  "phoneHref": "+15551234567",
  "email": "hello@modernestimator.com",
  "promoLeft": "Turnaround Time: 8–24 Hours",
  "promoText": "Affordable Estimate — 30% Off",
  "ctaLabel": "Get a Free Quote",
  "ctaHref": "/contact"
};

export async function GET() {
  try {
    const ref = doc(db, 'navbar', 'main');
    const snap = await getDoc(ref);

    // If the document is missing, auto-seed with initial data!
    if (!snap.exists()) {
      console.log('Seeding initial navbar content into Firestore DB...');
      await setDoc(ref, SEED_NAVBAR);
      return NextResponse.json({ data: SEED_NAVBAR });
    }

    return NextResponse.json({ data: { ...snap.data(), id: snap.id } });
  } catch (error) {
    console.error('Error fetching navbar content:', error);
    return NextResponse.json({ error: 'Failed to fetch navbar content', details: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const ref = doc(db, 'navbar', 'main');

    await setDoc(ref, { ...body, updatedAt: new Date().toISOString() }, { merge: true });
    const snap = await getDoc(ref);

    return NextResponse.json({ success: true, data: { ...snap.data(), id: snap.id } });
  } catch (error) {
    console.error('Error updating navbar content:', error);
    return NextResponse.json({ error: 'Failed to update navbar content', details: error.message }, { status: 500 });
  }
}
