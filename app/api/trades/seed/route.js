import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ALL_TRADES } from '../route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    let count = 0;
    for (const trd of ALL_TRADES) {
      await setDoc(doc(db, 'trades', trd.id), trd, { merge: true });
      count++;
    }

    return NextResponse.json({ success: true, count, message: `Successfully seeded ${count} trade pages to Firestore DB!` });
  } catch (error) {
    console.error('Error seeding trades:', error);
    return NextResponse.json({ error: 'Failed to seed trades', details: error.message }, { status: 500 });
  }
}
