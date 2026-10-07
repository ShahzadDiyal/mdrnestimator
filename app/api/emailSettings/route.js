import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const SEED_EMAIL_SETTINGS = {
  "provider": "Resend",
  "fromName": "Modern Estimator",
  "fromEmail": "quotes@modernestimator.com",
  "notifyTeam": true,
  "autoReply": true,
  "whatsappAlerts": false,
  "slackAlerts": true,
  "newsletter": false
};

export async function GET() {
  try {
    const ref = doc(db, 'emailSettings', 'main');
    const snap = await getDoc(ref);

    // If the document is missing, auto-seed with initial data!
    if (!snap.exists()) {
      console.log('Seeding initial email settings into Firestore DB...');
      await setDoc(ref, SEED_EMAIL_SETTINGS);
      return NextResponse.json({ data: SEED_EMAIL_SETTINGS });
    }

    return NextResponse.json({ data: { ...snap.data(), id: snap.id } });
  } catch (error) {
    console.error('Error fetching email settings:', error);
    return NextResponse.json({ error: 'Failed to fetch email settings', details: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const ref = doc(db, 'emailSettings', 'main');

    await setDoc(ref, { ...body, updatedAt: new Date().toISOString() }, { merge: true });
    const snap = await getDoc(ref);

    return NextResponse.json({ success: true, data: { ...snap.data(), id: snap.id } });
  } catch (error) {
    console.error('Error updating email settings:', error);
    return NextResponse.json({ error: 'Failed to update email settings', details: error.message }, { status: 500 });
  }
}
