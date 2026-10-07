import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { items } = body; // Array of { id, order }

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Items array is required' }, { status: 400 });
    }

    for (const item of items) {
      if (item.id) {
        const faqRef = doc(db, 'faqs', item.id);
        await updateDoc(faqRef, { order: Number(item.order) || 0, updatedAt: new Date().toISOString() });
      }
    }

    return NextResponse.json({ success: true, message: 'FAQ sequence order updated successfully!' });
  } catch (error) {
    console.error('Error reordering FAQs:', error);
    return NextResponse.json({ error: 'Failed to reorder FAQs', details: error.message }, { status: 500 });
  }
}
