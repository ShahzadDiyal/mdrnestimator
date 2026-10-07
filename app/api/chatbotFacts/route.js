import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const ALL_FACTS = [
  {
    "id": "fact-1",
    "key": "Turnaround",
    "value": "Standard 8–24 hours from receipt of complete plans; 3–5 business days for large commercial.",
    "status": "Published"
  },
  {
    "id": "fact-2",
    "key": "Coverage",
    "value": "All 50 US states with regional cost databases.",
    "status": "Published"
  },
  {
    "id": "fact-3",
    "key": "Starting prices",
    "value": "Residential takeoffs from $250; commercial from $500.",
    "status": "Published"
  },
  {
    "id": "fact-4",
    "key": "Revisions policy",
    "value": "Minor revisions included for 30 days after delivery.",
    "status": "Published"
  },
  {
    "id": "fact-5",
    "key": "Deliverables",
    "value": "CSI-coded Excel workbook, PDF summary, marked-up plans, executive summary.",
    "status": "Published"
  },
  {
    "id": "fact-6",
    "key": "Contact",
    "value": "Phone +1 (555) 123-4567 · Email hello@modernestimator.com · Mon–Fri 8am–6pm CT.",
    "status": "Published"
  }
];

export async function GET() {
  try {
    const factsRef = collection(db, 'chatbotFacts');
    const snapshot = await getDocs(factsRef);

    let facts = snapshot.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    }));

    // If database collection is empty, auto-seed with initial data!
    if (facts.length === 0) {
      console.log('Seeding initial facts into Firestore DB...');
      for (const item of ALL_FACTS) {
        await setDoc(doc(db, 'chatbotFacts', item.id), item);
      }
      facts = ALL_FACTS;
    }

    return NextResponse.json({ facts });
  } catch (error) {
    console.error('Error fetching facts:', error);
    return NextResponse.json({ error: 'Failed to fetch facts', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      slug, key, value, status
    } = body;

    if (!key || !key.trim()) {
      return NextResponse.json({ error: 'Fact key is required' }, { status: 400 });
    }

    const cleanSlug = (slug || key).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const factId = `fact-${cleanSlug || Date.now().toString(36)}`;

    const newFact = {
      id: factId,
      key: key.trim(),
      value: value ? value.trim() : '',
      status: status || 'Published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'chatbotFacts', factId), newFact);

    return NextResponse.json({ success: true, fact: newFact });
  } catch (error) {
    console.error('Error creating fact:', error);
    return NextResponse.json({ error: 'Failed to create fact', details: error.message }, { status: 500 });
  }
}
