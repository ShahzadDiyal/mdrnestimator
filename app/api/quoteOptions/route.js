import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const ALL_OPTIONS = [
  {
    "id": "qo-svc-1",
    "group": "service",
    "label": "Quantity Takeoff",
    "status": "Published"
  },
  {
    "id": "qo-svc-2",
    "group": "service",
    "label": "Material Estimation",
    "status": "Published"
  },
  {
    "id": "qo-svc-3",
    "group": "service",
    "label": "Residential Estimation",
    "status": "Published"
  },
  {
    "id": "qo-svc-4",
    "group": "service",
    "label": "Commercial Estimation",
    "status": "Published"
  },
  {
    "id": "qo-svc-5",
    "group": "service",
    "label": "Other",
    "status": "Published"
  },
  {
    "id": "qo-pt-1",
    "group": "projectType",
    "label": "Single-Family Home",
    "status": "Published"
  },
  {
    "id": "qo-pt-2",
    "group": "projectType",
    "label": "Multi-Family / Townhomes",
    "status": "Published"
  },
  {
    "id": "qo-pt-3",
    "group": "projectType",
    "label": "Renovation / Remodel",
    "status": "Published"
  },
  {
    "id": "qo-pt-4",
    "group": "projectType",
    "label": "Office / Retail",
    "status": "Published"
  },
  {
    "id": "qo-pt-5",
    "group": "projectType",
    "label": "Healthcare",
    "status": "Published"
  },
  {
    "id": "qo-pt-6",
    "group": "projectType",
    "label": "Industrial / Warehouse",
    "status": "Published"
  },
  {
    "id": "qo-pt-7",
    "group": "projectType",
    "label": "Other",
    "status": "Published"
  }
];

export async function GET() {
  try {
    const optionsRef = collection(db, 'quoteOptions');
    const snapshot = await getDocs(optionsRef);

    let options = snapshot.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    }));

    // If database collection is empty, auto-seed with initial data!
    if (options.length === 0) {
      console.log('Seeding initial options into Firestore DB...');
      for (const item of ALL_OPTIONS) {
        await setDoc(doc(db, 'quoteOptions', item.id), item);
      }
      options = ALL_OPTIONS;
    }

    return NextResponse.json({ options });
  } catch (error) {
    console.error('Error fetching options:', error);
    return NextResponse.json({ error: 'Failed to fetch options', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      slug, group, label, status
    } = body;

    if (!label || !label.trim()) {
      return NextResponse.json({ error: 'Option label is required' }, { status: 400 });
    }

    const cleanSlug = (slug || label).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const optionId = `qo-${cleanSlug || Date.now().toString(36)}`;

    const newOption = {
      id: optionId,
      group: group || 'service',
      label: label.trim(),
      status: status || 'Published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'quoteOptions', optionId), newOption);

    return NextResponse.json({ success: true, option: newOption });
  } catch (error) {
    console.error('Error creating option:', error);
    return NextResponse.json({ error: 'Failed to create option', details: error.message }, { status: 500 });
  }
}
