import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { SEED_NAVBAR } from '../route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await setDoc(doc(db, 'navbar', 'main'), SEED_NAVBAR, { merge: true });

    return NextResponse.json({ success: true, count: 1, message: `Successfully seeded navbar content to Firestore DB!` });
  } catch (error) {
    console.error('Error seeding navbar content:', error);
    return NextResponse.json({ error: 'Failed to seed navbar content', details: error.message }, { status: 500 });
  }
}
