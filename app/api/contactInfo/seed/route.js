import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { SEED_CONTACT_INFO } from '../route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await setDoc(doc(db, 'contactInfo', 'main'), SEED_CONTACT_INFO, { merge: true });

    return NextResponse.json({ success: true, count: 1, message: `Successfully seeded contact info to Firestore DB!` });
  } catch (error) {
    console.error('Error seeding contact info:', error);
    return NextResponse.json({ error: 'Failed to seed contact info', details: error.message }, { status: 500 });
  }
}
