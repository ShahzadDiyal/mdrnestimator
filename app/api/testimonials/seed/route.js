import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { INITIAL_TESTIMONIALS } from '../route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    let count = 0;
    for (const tst of INITIAL_TESTIMONIALS) {
      await setDoc(doc(db, 'testimonials', tst.id), tst, { merge: true });
      count++;
    }

    return NextResponse.json({ success: true, count, message: `Successfully seeded ${count} testimonials to Firestore DB!` });
  } catch (error) {
    console.error('Error seeding testimonials:', error);
    return NextResponse.json({ error: 'Failed to seed testimonials', details: error.message }, { status: 500 });
  }
}
