import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const INITIAL_FAQS = [
  {
    id: 'faq-1',
    q: 'How long does an estimate take?',
    a: 'Standard turnaround is 8–24 hours from receipt of complete plans. Larger commercial projects may take 3–5 business days. Rush options are available for urgent bids.',
    category: 'General',
    order: 1,
    status: 'Published',
  },
  {
    id: 'faq-2',
    q: 'What information do you need from me?',
    a: 'Architectural and structural drawings (PDF or DWG), specifications when available, scope notes and your bid deadline. We handle the rest.',
    category: 'General',
    order: 2,
    status: 'Published',
  },
  {
    id: 'faq-3',
    q: "What's included in the deliverable?",
    a: 'A CSI-coded Excel workbook with quantities, unit costs, labor and materials, plus a PDF summary, marked-up plans and an executive summary. Bid-ready, every time.',
    category: 'Deliverables',
    order: 3,
    status: 'Published',
  },
  {
    id: 'faq-4',
    q: 'Do you cover all 50 states?',
    a: 'Yes. We maintain regional cost databases for all 50 states and adjust labor and material pricing to local markets.',
    category: 'Coverage',
    order: 4,
    status: 'Published',
  },
  {
    id: 'faq-5',
    q: 'How do you price your services?',
    a: 'Pricing depends on project size, scope and timeline. Most residential takeoffs start at $250 and commercial projects start at $500. Send us your plans for a free quote.',
    category: 'Pricing',
    order: 5,
    status: 'Published',
  },
  {
    id: 'faq-6',
    q: 'Are revisions included?',
    a: 'Yes — minor revisions and clarifications are included for 30 days after delivery. Major scope changes are quoted separately.',
    category: 'Policy',
    order: 6,
    status: 'Published',
  },
];

export async function GET() {
  try {
    const faqsRef = collection(db, 'faqs');
    const snapshot = await getDocs(faqsRef);

    let faqs = snapshot.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    }));

    // If database faqs collection is empty, auto-seed with initial FAQs!
    if (faqs.length === 0) {
      console.log('Seeding initial FAQs into Firestore DB...');
      for (const faq of INITIAL_FAQS) {
        await setDoc(doc(db, 'faqs', faq.id), faq);
      }
      faqs = INITIAL_FAQS;
    }

    // Sort by order asc
    faqs.sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

    return NextResponse.json({ faqs });
  } catch (error) {
    console.error('Error fetching faqs:', error);
    return NextResponse.json({ error: 'Failed to fetch FAQs', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { q, a, category, order, status } = body;

    if (!q || !q.trim() || !a || !a.trim()) {
      return NextResponse.json({ error: 'Question and Answer are required' }, { status: 400 });
    }

    const faqId = `faq-${Date.now().toString(36)}`;
    const newFaq = {
      id: faqId,
      q: q.trim(),
      a: a.trim(),
      category: category ? category.trim() : 'General',
      order: Number(order) || 10,
      status: status || 'Published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'faqs', faqId), newFaq);

    return NextResponse.json({ success: true, faq: newFaq });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json({ error: 'Failed to create FAQ', details: error.message }, { status: 500 });
  }
}
