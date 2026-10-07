import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { SEED_CTA_BANNER } from '../route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await setDoc(doc(db, 'ctaBanner', 'main'), SEED_CTA_BANNER, { merge: true });

    return NextResponse.json({ success: true, count: 1, message: `Successfully seeded CTA banner content to Firestore DB!` });
  } catch (error) {
    console.error('Error seeding CTA banner content:', error);
    return NextResponse.json({ error: 'Failed to seed CTA banner content', details: error.message }, { status: 500 });
  }
}
