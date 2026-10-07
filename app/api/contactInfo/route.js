import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const SEED_CONTACT_INFO = {
  "phone": "+1 (555) 123-4567",
  "email": "hello@modernestimator.com",
  "address": "1100 Estimator Ave, Suite 210, Austin, TX 78701",
  "hours": "Mon–Fri, 8:00am – 6:00pm CT"
};

export async function GET() {
  try {
    const ref = doc(db, 'contactInfo', 'main');
    const snap = await getDoc(ref);

    // If the document is missing, auto-seed with initial data!
    if (!snap.exists()) {
      console.log('Seeding initial contact info into Firestore DB...');
      await setDoc(ref, SEED_CONTACT_INFO);
      return NextResponse.json({ data: SEED_CONTACT_INFO });
    }

    return NextResponse.json({ data: { ...snap.data(), id: snap.id } });
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json({ error: 'Failed to fetch contact info', details: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const ref = doc(db, 'contactInfo', 'main');

    await setDoc(ref, { ...body, updatedAt: new Date().toISOString() }, { merge: true });
    const snap = await getDoc(ref);

    return NextResponse.json({ success: true, data: { ...snap.data(), id: snap.id } });
  } catch (error) {
    console.error('Error updating contact info:', error);
    return NextResponse.json({ error: 'Failed to update contact info', details: error.message }, { status: 500 });
  }
}
