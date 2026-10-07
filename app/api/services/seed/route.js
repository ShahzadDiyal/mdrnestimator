import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ALL_SERVICES } from '../route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    let count = 0;
    for (const svc of ALL_SERVICES) {
      await setDoc(doc(db, 'services', svc.id), svc, { merge: true });
      count++;
    }

    return NextResponse.json({ success: true, count, message: `Successfully seeded ${count} services to Firestore DB!` });
  } catch (error) {
    console.error('Error seeding services:', error);
    return NextResponse.json({ error: 'Failed to seed services', details: error.message }, { status: 500 });
  }
}
