import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const tstRef = doc(db, 'testimonials', id);
    const tstSnap = await getDoc(tstRef);

    if (!tstSnap.exists()) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    const updates = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(tstRef, updates);

    return NextResponse.json({ success: true, id, updates });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json({ error: 'Failed to update testimonial', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 });
    }

    const tstRef = doc(db, 'testimonials', id);
    await deleteDoc(tstRef);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial', details: error.message }, { status: 500 });
  }
}
