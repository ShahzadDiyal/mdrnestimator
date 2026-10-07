import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const ALL_HEADINGS = [
  {
    "id": "sh-services",
    "section": "services",
    "eyebrow": "What We Do",
    "heading": "Estimation services built to win you work",
    "subtitle": "From quantity takeoffs to full bid packages — we cover every scope contractors need to estimate accurately and win profitably.",
    "status": "Published"
  },
  {
    "id": "sh-trades",
    "section": "trades",
    "eyebrow": "Our Trades",
    "heading": "Specialist estimating for every trade",
    "subtitle": "Trade-specific takeoffs from estimators who work in your division every day — from concrete and steel to MEP, finishes and sitework.",
    "status": "Published"
  },
  {
    "id": "sh-testimonials",
    "section": "testimonials",
    "eyebrow": "Client Stories",
    "heading": "What contractors say about us",
    "subtitle": "Trusted by general contractors and builders across the United States.",
    "status": "Published"
  },
  {
    "id": "sh-faq",
    "section": "faq",
    "eyebrow": "FAQ",
    "heading": "Answers to common questions",
    "subtitle": "Everything you need to know before you send your first project.",
    "status": "Published"
  },
  {
    "id": "sh-portfolio",
    "section": "portfolio",
    "eyebrow": "Recent Work",
    "heading": "Projects we've helped contractors win",
    "subtitle": "A selection of estimates delivered across residential, commercial and industrial scopes.",
    "status": "Published"
  }
];

export async function GET() {
  try {
    const headingsRef = collection(db, 'sectionHeadings');
    const snapshot = await getDocs(headingsRef);

    let headings = snapshot.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    }));

    // If database collection is empty, auto-seed with initial data!
    if (headings.length === 0) {
      console.log('Seeding initial headings into Firestore DB...');
      for (const item of ALL_HEADINGS) {
        await setDoc(doc(db, 'sectionHeadings', item.id), item);
      }
      headings = ALL_HEADINGS;
    }

    return NextResponse.json({ headings });
  } catch (error) {
    console.error('Error fetching headings:', error);
    return NextResponse.json({ error: 'Failed to fetch headings', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      slug, section, eyebrow, heading, subtitle, status
    } = body;

    if (!section || !section.trim()) {
      return NextResponse.json({ error: 'Heading section is required' }, { status: 400 });
    }

    const cleanSlug = (slug || section).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const headingId = `sh-${cleanSlug || Date.now().toString(36)}`;

    const newHeading = {
      id: headingId,
      section: section.trim(),
      eyebrow: eyebrow ? eyebrow.trim() : '',
      heading: heading ? heading.trim() : '',
      subtitle: subtitle ? subtitle.trim() : '',
      status: status || 'Published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'sectionHeadings', headingId), newHeading);

    return NextResponse.json({ success: true, heading: newHeading });
  } catch (error) {
    console.error('Error creating heading:', error);
    return NextResponse.json({ error: 'Failed to create heading', details: error.message }, { status: 500 });
  }
}
