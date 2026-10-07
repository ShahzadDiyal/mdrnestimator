import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const INITIAL_TESTIMONIALS = [
  {
    id: 'tst-1',
    name: 'Michael Reynolds',
    role: 'Owner, Reynolds Construction • Austin, TX',
    quote: 'Modern Estimator turned my bid prep from a 3-day grind into a 24-hour deliverable. Our win-rate jumped 18% in the first quarter.',
    img: '/review-1.png',
    rating: 5,
    order: 1,
    status: 'Published',
  },
  {
    id: 'tst-2',
    name: 'Steve Parker',
    role: 'Pre-Construction Manager • Denver, CO',
    quote: "Accurate, fast and bid-ready. Their CSI breakdowns make sub-leveling effortless. They've become an extension of our pre-con team.",
    img: '/review-2.png',
    rating: 5,
    order: 2,
    status: 'Published',
  },
  {
    id: 'tst-3',
    name: 'David Chen',
    role: 'GC, Chen Builders • Seattle, WA',
    quote: "We used to outsource estimates to three firms. Now it's just Modern Estimator. Numbers I can defend, deadlines they always hit.",
    img: '/review-3.png',
    rating: 5,
    order: 3,
    status: 'Published',
  },
  {
    id: 'tst-4',
    name: 'Laura Simmons',
    role: 'Estimator, Simmons & Co. • Phoenix, AZ',
    quote: 'Solid takeoff work on our multifamily bids. Turnaround was exactly as promised.',
    img: '/review-1.png',
    rating: 4,
    order: 4,
    status: 'Draft',
  },
];

export async function GET() {
  try {
    const tstRef = collection(db, 'testimonials');
    const snapshot = await getDocs(tstRef);

    let testimonials = snapshot.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    }));

    // If database testimonials collection is empty, auto-seed with initial Testimonials!
    if (testimonials.length === 0) {
      console.log('Seeding initial Testimonials into Firestore DB...');
      for (const tst of INITIAL_TESTIMONIALS) {
        await setDoc(doc(db, 'testimonials', tst.id), tst);
      }
      testimonials = INITIAL_TESTIMONIALS;
    }

    // Sort by order asc
    testimonials.sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, role, quote, img, rating, order, status } = body;

    if (!name || !name.trim() || !quote || !quote.trim()) {
      return NextResponse.json({ error: 'Client name and quote are required' }, { status: 400 });
    }

    const tstId = `tst-${Date.now().toString(36)}`;
    const newTst = {
      id: tstId,
      name: name.trim(),
      role: role ? role.trim() : '',
      quote: quote.trim(),
      img: img ? img.trim() : '/review-1.png',
      rating: Number(rating) || 5,
      order: Number(order) || 10,
      status: status || 'Published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'testimonials', tstId), newTst);

    return NextResponse.json({ success: true, testimonial: newTst });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to create testimonial', details: error.message }, { status: 500 });
  }
}
