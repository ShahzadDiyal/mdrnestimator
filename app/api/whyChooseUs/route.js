import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const ALL_FEATURES = [
  {
    "id": "why-1",
    "title": "Pinpoint Accuracy",
    "desc": "Estimates within ±2% — every line item double-checked by senior estimators.",
    "status": "Published"
  },
  {
    "id": "why-2",
    "title": "Fast Turnaround",
    "desc": "Standard delivery in 8–24 hours. Rush options available without sacrificing quality.",
    "status": "Published"
  },
  {
    "id": "why-3",
    "title": "Confidential & Secure",
    "desc": "NDA on every project. Your drawings, scopes and pricing stay private.",
    "status": "Published"
  },
  {
    "id": "why-4",
    "title": "USA Coverage",
    "desc": "Regional pricing databases for all 50 states — from coastal markets to the Midwest.",
    "status": "Published"
  },
  {
    "id": "why-5",
    "title": "Better Margins",
    "desc": "Win more bids and protect profit with realistic, defensible numbers.",
    "status": "Published"
  },
  {
    "id": "why-6",
    "title": "24/7 Support",
    "desc": "Dedicated estimator on every project. Direct line for revisions and questions.",
    "status": "Published"
  }
];

export async function GET() {
  try {
    const featuresRef = collection(db, 'whyChooseUs');
    const snapshot = await getDocs(featuresRef);

    let features = snapshot.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    }));

    // If database collection is empty, auto-seed with initial data!
    if (features.length === 0) {
      console.log('Seeding initial features into Firestore DB...');
      for (const item of ALL_FEATURES) {
        await setDoc(doc(db, 'whyChooseUs', item.id), item);
      }
      features = ALL_FEATURES;
    }

    return NextResponse.json({ features });
  } catch (error) {
    console.error('Error fetching features:', error);
    return NextResponse.json({ error: 'Failed to fetch features', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      slug, title, desc, status
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Feature title is required' }, { status: 400 });
    }

    const cleanSlug = (slug || title).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const featureId = `why-${cleanSlug || Date.now().toString(36)}`;

    const newFeature = {
      id: featureId,
      title: title.trim(),
      desc: desc ? desc.trim() : '',
      status: status || 'Published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'whyChooseUs', featureId), newFeature);

    return NextResponse.json({ success: true, feature: newFeature });
  } catch (error) {
    console.error('Error creating feature:', error);
    return NextResponse.json({ error: 'Failed to create feature', details: error.message }, { status: 500 });
  }
}
