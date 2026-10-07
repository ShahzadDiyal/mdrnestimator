import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { SEED_SITE_SETTINGS } from '../route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await setDoc(doc(db, 'siteSettings', 'main'), SEED_SITE_SETTINGS, { merge: true });

    return NextResponse.json({ success: true, count: 1, message: `Successfully seeded site settings to Firestore DB!` });
  } catch (error) {
    console.error('Error seeding site settings:', error);
    return NextResponse.json({ error: 'Failed to seed site settings', details: error.message }, { status: 500 });
  }
}
