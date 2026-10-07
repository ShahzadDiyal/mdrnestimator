import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { SEED_EMAIL_SETTINGS } from '../route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await setDoc(doc(db, 'emailSettings', 'main'), SEED_EMAIL_SETTINGS, { merge: true });

    return NextResponse.json({ success: true, count: 1, message: `Successfully seeded email settings to Firestore DB!` });
  } catch (error) {
    console.error('Error seeding email settings:', error);
    return NextResponse.json({ error: 'Failed to seed email settings', details: error.message }, { status: 500 });
  }
}
