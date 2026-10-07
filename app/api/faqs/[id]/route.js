import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'FAQ ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const faqRef = doc(db, 'faqs', id);
    const faqSnap = await getDoc(faqRef);

    if (!faqSnap.exists()) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    const updates = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(faqRef, updates);

    return NextResponse.json({ success: true, id, updates });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json({ error: 'Failed to update FAQ', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'FAQ ID is required' }, { status: 400 });
    }

    const faqRef = doc(db, 'faqs', id);
    await deleteDoc(faqRef);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json({ error: 'Failed to delete FAQ', details: error.message }, { status: 500 });
  }
}
