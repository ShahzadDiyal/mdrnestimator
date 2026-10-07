import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const ALL_STATS = [
  {
    "id": "st-1",
    "label": "Estimates Delivered",
    "value": "2400",
    "suffix": "+",
    "status": "Published"
  },
  {
    "id": "st-2",
    "label": "Projects Completed",
    "value": "580",
    "suffix": "+",
    "status": "Published"
  },
  {
    "id": "st-3",
    "label": "Happy Contractors",
    "value": "320",
    "suffix": "+",
    "status": "Published"
  },
  {
    "id": "st-4",
    "label": "Years of Experience",
    "value": "12",
    "suffix": "+",
    "status": "Published"
  }
];

export async function GET() {
  try {
    const statsRef = collection(db, 'stats');
    const snapshot = await getDocs(statsRef);

    let stats = snapshot.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    }));

    // If database collection is empty, auto-seed with initial data!
    if (stats.length === 0) {
      console.log('Seeding initial stats into Firestore DB...');
      for (const item of ALL_STATS) {
        await setDoc(doc(db, 'stats', item.id), item);
      }
      stats = ALL_STATS;
    }

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      slug, label, value, suffix, status
    } = body;

    if (!label || !label.trim()) {
      return NextResponse.json({ error: 'Stat label is required' }, { status: 400 });
    }

    const cleanSlug = (slug || label).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const statId = `st-${cleanSlug || Date.now().toString(36)}`;

    const newStat = {
      id: statId,
      label: label.trim(),
      value: value ? value.trim() : '',
      suffix: suffix ? suffix.trim() : '',
      status: status || 'Published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'stats', statId), newStat);

    return NextResponse.json({ success: true, stat: newStat });
  } catch (error) {
    console.error('Error creating stat:', error);
    return NextResponse.json({ error: 'Failed to create stat', details: error.message }, { status: 500 });
  }
}
