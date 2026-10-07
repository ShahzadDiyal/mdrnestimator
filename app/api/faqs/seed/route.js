import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { INITIAL_FAQS } from '../route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    let count = 0;
    for (const faq of INITIAL_FAQS) {
      await setDoc(doc(db, 'faqs', faq.id), faq, { merge: true });
      count++;
    }

    return NextResponse.json({ success: true, count, message: `Successfully seeded ${count} FAQs to Firestore DB!` });
  } catch (error) {
    console.error('Error seeding FAQs:', error);
    return NextResponse.json({ error: 'Failed to seed FAQs', details: error.message }, { status: 500 });
  }
}
