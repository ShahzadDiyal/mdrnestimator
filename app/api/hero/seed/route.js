import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { SEED_HERO } from '../route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await setDoc(doc(db, 'hero', 'main'), SEED_HERO, { merge: true });

    return NextResponse.json({ success: true, count: 1, message: `Successfully seeded hero content to Firestore DB!` });
  } catch (error) {
    console.error('Error seeding hero content:', error);
    return NextResponse.json({ error: 'Failed to seed hero content', details: error.message }, { status: 500 });
  }
}
