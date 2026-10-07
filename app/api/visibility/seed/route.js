import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { SEED_VISIBILITY } from '../route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await setDoc(doc(db, 'visibility', 'main'), SEED_VISIBILITY, { merge: true });

    return NextResponse.json({ success: true, count: 1, message: `Successfully seeded visibility settings to Firestore DB!` });
  } catch (error) {
    console.error('Error seeding visibility settings:', error);
    return NextResponse.json({ error: 'Failed to seed visibility settings', details: error.message }, { status: 500 });
  }
}
