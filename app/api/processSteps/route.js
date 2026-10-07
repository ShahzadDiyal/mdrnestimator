import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const ALL_STEPS = [
  {
    "id": "stp-1",
    "num": "01",
    "title": "Send Your Plans",
    "desc": "Upload drawings, specs and scope. We respond in under 2 hours with timeline & price.",
    "status": "Published"
  },
  {
    "id": "stp-2",
    "num": "02",
    "title": "Detailed Review",
    "desc": "Senior estimator reviews plans, requests RFIs and confirms the scope of work.",
    "status": "Published"
  },
  {
    "id": "stp-3",
    "num": "03",
    "title": "Takeoff & Pricing",
    "desc": "We perform the takeoff and price every line with current regional cost data.",
    "status": "Published"
  },
  {
    "id": "stp-4",
    "num": "04",
    "title": "Bid-Ready Delivery",
    "desc": "Receive a polished, CSI-coded estimate in Excel + PDF — ready to submit.",
    "status": "Published"
  }
];

export async function GET() {
  try {
    const stepsRef = collection(db, 'processSteps');
    const snapshot = await getDocs(stepsRef);

    let steps = snapshot.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    }));

    // If database collection is empty, auto-seed with initial data!
    if (steps.length === 0) {
      console.log('Seeding initial steps into Firestore DB...');
      for (const item of ALL_STEPS) {
        await setDoc(doc(db, 'processSteps', item.id), item);
      }
      steps = ALL_STEPS;
    }

    return NextResponse.json({ steps });
  } catch (error) {
    console.error('Error fetching steps:', error);
    return NextResponse.json({ error: 'Failed to fetch steps', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      slug, num, title, desc, status
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Step title is required' }, { status: 400 });
    }

    const cleanSlug = (slug || title).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const stepId = `stp-${cleanSlug || Date.now().toString(36)}`;

    const newStep = {
      id: stepId,
      num: num ? num.trim() : '',
      title: title.trim(),
      desc: desc ? desc.trim() : '',
      status: status || 'Published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'processSteps', stepId), newStep);

    return NextResponse.json({ success: true, step: newStep });
  } catch (error) {
    console.error('Error creating step:', error);
    return NextResponse.json({ error: 'Failed to create step', details: error.message }, { status: 500 });
  }
}
