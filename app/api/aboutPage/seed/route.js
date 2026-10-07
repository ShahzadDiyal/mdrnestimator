import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { SEED_ABOUT_PAGE } from '../route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await setDoc(doc(db, 'aboutPage', 'main'), SEED_ABOUT_PAGE, { merge: true });

    return NextResponse.json({ success: true, count: 1, message: `Successfully seeded about page content to Firestore DB!` });
  } catch (error) {
    console.error('Error seeding about page content:', error);
    return NextResponse.json({ error: 'Failed to seed about page content', details: error.message }, { status: 500 });
  }
}
