import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { SEED_FOOTER } from '../route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await setDoc(doc(db, 'footer', 'main'), SEED_FOOTER, { merge: true });

    return NextResponse.json({ success: true, count: 1, message: `Successfully seeded footer content to Firestore DB!` });
  } catch (error) {
    console.error('Error seeding footer content:', error);
    return NextResponse.json({ error: 'Failed to seed footer content', details: error.message }, { status: 500 });
  }
}
