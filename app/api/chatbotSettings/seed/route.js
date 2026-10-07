import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { SEED_CHATBOT_SETTINGS } from '../route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await setDoc(doc(db, 'chatbotSettings', 'main'), SEED_CHATBOT_SETTINGS, { merge: true });

    return NextResponse.json({ success: true, count: 1, message: `Successfully seeded chatbot settings to Firestore DB!` });
  } catch (error) {
    console.error('Error seeding chatbot settings:', error);
    return NextResponse.json({ error: 'Failed to seed chatbot settings', details: error.message }, { status: 500 });
  }
}
