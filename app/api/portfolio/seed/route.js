import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ALL_PROJECTS } from '../route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    let count = 0;
    for (const item of ALL_PROJECTS) {
      await setDoc(doc(db, 'portfolio', item.id), item, { merge: true });
      count++;
    }

    return NextResponse.json({ success: true, count, message: `Successfully seeded ${count} projects to Firestore DB!` });
  } catch (error) {
    console.error('Error seeding projects:', error);
    return NextResponse.json({ error: 'Failed to seed projects', details: error.message }, { status: 500 });
  }
}
