import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ALL_STATS } from '../route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    let count = 0;
    for (const item of ALL_STATS) {
      await setDoc(doc(db, 'stats', item.id), item, { merge: true });
      count++;
    }

    return NextResponse.json({ success: true, count, message: `Successfully seeded ${count} stats to Firestore DB!` });
  } catch (error) {
    console.error('Error seeding stats:', error);
    return NextResponse.json({ error: 'Failed to seed stats', details: error.message }, { status: 500 });
  }
}
