import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { SEED_SITE_SEO } from '../route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await setDoc(doc(db, 'siteSeo', 'main'), SEED_SITE_SEO, { merge: true });

    return NextResponse.json({ success: true, count: 1, message: `Successfully seeded site SEO settings to Firestore DB!` });
  } catch (error) {
    console.error('Error seeding site SEO settings:', error);
    return NextResponse.json({ error: 'Failed to seed site SEO settings', details: error.message }, { status: 500 });
  }
}
