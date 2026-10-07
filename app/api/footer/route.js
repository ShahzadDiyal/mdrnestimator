import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const SEED_FOOTER = {
  "aboutBlurb": "Trusted construction estimation partner for US contractors and builders. Fast, accurate quantity takeoffs, material estimates and winning bid packages.",
  "facebook": "",
  "linkedin": "",
  "twitter": "",
  "instagram": "",
  "address": "1100 Estimator Ave, Suite 210, Austin, TX 78701, USA",
  "phone": "+1 (555) 123-4567",
  "email": "hello@modernestimator.com",
  "copyrightName": "Modern Estimator",
  "privacyHref": "#",
  "termsHref": "#"
};

export async function GET() {
  try {
    const ref = doc(db, 'footer', 'main');
    const snap = await getDoc(ref);

    // If the document is missing, auto-seed with initial data!
    if (!snap.exists()) {
      console.log('Seeding initial footer content into Firestore DB...');
      await setDoc(ref, SEED_FOOTER);
      return NextResponse.json({ data: SEED_FOOTER });
    }

    return NextResponse.json({ data: { ...snap.data(), id: snap.id } });
  } catch (error) {
    console.error('Error fetching footer content:', error);
    return NextResponse.json({ error: 'Failed to fetch footer content', details: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const ref = doc(db, 'footer', 'main');

    await setDoc(ref, { ...body, updatedAt: new Date().toISOString() }, { merge: true });
    const snap = await getDoc(ref);

    return NextResponse.json({ success: true, data: { ...snap.data(), id: snap.id } });
  } catch (error) {
    console.error('Error updating footer content:', error);
    return NextResponse.json({ error: 'Failed to update footer content', details: error.message }, { status: 500 });
  }
}
