import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const SEED_VISIBILITY = {
  pages: {
    home: true,
    services: true,
    trades: true,
    portfolio: true,
    about: true,
    contact: true,
  },
  sections: {
    hero: true,
    stats: true,
    services: true,
    trades: true,
    whyChooseUs: true,
    process: true,
    portfolio: true,
    testimonials: true,
    faq: true,
    ctaBanner: true,
  },
  elements: {
    navbar: true,
    promoBar: true,
    footer: true,
    floatingChat: true,
  },
};

export async function GET() {
  try {
    const ref = doc(db, 'visibility', 'main');
    const snap = await getDoc(ref);

    // If the document is missing, auto-seed with initial data!
    if (!snap.exists()) {
      console.log('Seeding initial visibility settings into Firestore DB...');
      await setDoc(ref, SEED_VISIBILITY);
      return NextResponse.json({ data: SEED_VISIBILITY });
    }

    return NextResponse.json({ data: { ...snap.data(), id: snap.id } });
  } catch (error) {
    console.error('Error fetching visibility settings:', error);
    return NextResponse.json({ error: 'Failed to fetch visibility settings', details: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const ref = doc(db, 'visibility', 'main');

    await setDoc(ref, { ...body, updatedAt: new Date().toISOString() }, { merge: true });
    const snap = await getDoc(ref);

    return NextResponse.json({ success: true, data: { ...snap.data(), id: snap.id } });
  } catch (error) {
    console.error('Error updating visibility settings:', error);
    return NextResponse.json({ error: 'Failed to update visibility settings', details: error.message }, { status: 500 });
  }
}
