import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const SEED_CTA_BANNER = {
  "badge": "Free Quote — No Obligation",
  "heading": "Ready to win your next bid?",
  "paragraph": "Send us your plans today. Get a free, no-obligation quote in under 2 hours and a complete estimate in 8–24 hours.",
  "ctaPrimary": "Get a Free Quote",
  "ctaPrimaryHref": "/contact",
  "ctaSecondary": "Chat with us",
  "ctaSecondaryHref": "#chat"
};

export async function GET() {
  try {
    const ref = doc(db, 'ctaBanner', 'main');
    const snap = await getDoc(ref);

    // If the document is missing, auto-seed with initial data!
    if (!snap.exists()) {
      console.log('Seeding initial CTA banner content into Firestore DB...');
      await setDoc(ref, SEED_CTA_BANNER);
      return NextResponse.json({ data: SEED_CTA_BANNER });
    }

    return NextResponse.json({ data: { ...snap.data(), id: snap.id } });
  } catch (error) {
    console.error('Error fetching CTA banner content:', error);
    return NextResponse.json({ error: 'Failed to fetch CTA banner content', details: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const ref = doc(db, 'ctaBanner', 'main');

    await setDoc(ref, { ...body, updatedAt: new Date().toISOString() }, { merge: true });
    const snap = await getDoc(ref);

    return NextResponse.json({ success: true, data: { ...snap.data(), id: snap.id } });
  } catch (error) {
    console.error('Error updating CTA banner content:', error);
    return NextResponse.json({ error: 'Failed to update CTA banner content', details: error.message }, { status: 500 });
  }
}
