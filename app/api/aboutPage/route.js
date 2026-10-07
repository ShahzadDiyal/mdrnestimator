import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const SEED_ABOUT_PAGE = {
  "headerEyebrow": "About Us",
  "headerTitle": "Your estimating partner, from plans to bid",
  "headerSubtitle": "Modern Estimator helps contractors and builders across the United States bid faster, win more work and protect their margins with accurate, defensible numbers.",
  "whoEyebrow": "Who We Are",
  "whoHeading": "Built by estimators, for contractors",
  "paragraphs": [
    "Modern Estimator was founded by senior cost estimators who spent years inside general contracting and trade firms — and saw how often good contractors lost good work to slow, inconsistent bidding.",
    "Today we act as an extension of your pre-construction team. We take in your drawings and specifications, perform detailed CSI-coded takeoffs, price every line with current regional cost data, and hand back a clean, bid-ready estimate in 8–24 hours.",
    "From single-family homes to multi-million-dollar commercial builds, our mission is simple: give you numbers you can defend, on a deadline you can count on."
  ],
  "highlights": [
    "Senior estimators with 12+ years of experience",
    "Coverage across all 50 states and every CSI division",
    "Estimates accurate to within ±2%",
    "Standard 8–24 hour turnaround, rush options available",
    "NDA on every project — your plans stay private",
    "Dedicated estimator and direct line on every job"
  ],
  "mission": "To make accurate, professional estimating accessible to every contractor — so winning the next bid comes down to the work, not the paperwork.",
  "vision": "To be the most trusted estimating partner in the US construction industry — known for accuracy, speed and numbers contractors can stand behind."
};

export async function GET() {
  try {
    const ref = doc(db, 'aboutPage', 'main');
    const snap = await getDoc(ref);

    // If the document is missing, auto-seed with initial data!
    if (!snap.exists()) {
      console.log('Seeding initial about page content into Firestore DB...');
      await setDoc(ref, SEED_ABOUT_PAGE);
      return NextResponse.json({ data: SEED_ABOUT_PAGE });
    }

    return NextResponse.json({ data: { ...snap.data(), id: snap.id } });
  } catch (error) {
    console.error('Error fetching about page content:', error);
    return NextResponse.json({ error: 'Failed to fetch about page content', details: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const ref = doc(db, 'aboutPage', 'main');

    await setDoc(ref, { ...body, updatedAt: new Date().toISOString() }, { merge: true });
    const snap = await getDoc(ref);

    return NextResponse.json({ success: true, data: { ...snap.data(), id: snap.id } });
  } catch (error) {
    console.error('Error updating about page content:', error);
    return NextResponse.json({ error: 'Failed to update about page content', details: error.message }, { status: 500 });
  }
}
