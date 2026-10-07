import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ALL_PAGES } from '../route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    let count = 0;
    for (const item of ALL_PAGES) {
      await setDoc(doc(db, 'seoPages', item.id), item, { merge: true });
      count++;
    }

    return NextResponse.json({ success: true, count, message: `Successfully seeded ${count} pages to Firestore DB!` });
  } catch (error) {
    console.error('Error seeding pages:', error);
    return NextResponse.json({ error: 'Failed to seed pages', details: error.message }, { status: 500 });
  }
}
