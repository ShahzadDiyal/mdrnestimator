import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const SEED_SITE_SETTINGS = {
  "siteName": "Modern Estimator",
  "domain": "modernestimator.com",
  "phone": "+1 (555) 123-4567",
  "email": "hello@modernestimator.com",
  "address": "1200 Commerce St, Suite 400, Austin, TX 78701",
  "logoUrl": "/logo.png",
  "logoAlt": "Modern Estimator",
  "faviconUrl": "",
  "require2fa": false,
  "sessionTimeout": "8 hours",
  "fileRetention": "24 months"
};

export async function GET() {
  try {
    const ref = doc(db, 'siteSettings', 'main');
    const snap = await getDoc(ref);

    // If the document is missing, auto-seed with initial data!
    if (!snap.exists()) {
      console.log('Seeding initial site settings into Firestore DB...');
      await setDoc(ref, SEED_SITE_SETTINGS);
      return NextResponse.json({ data: SEED_SITE_SETTINGS });
    }

    return NextResponse.json({ data: { ...snap.data(), id: snap.id } });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json({ error: 'Failed to fetch site settings', details: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const ref = doc(db, 'siteSettings', 'main');

    await setDoc(ref, { ...body, updatedAt: new Date().toISOString() }, { merge: true });
    const snap = await getDoc(ref);

    return NextResponse.json({ success: true, data: { ...snap.data(), id: snap.id } });
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json({ error: 'Failed to update site settings', details: error.message }, { status: 500 });
  }
}
