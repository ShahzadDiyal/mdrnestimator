import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Option ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const quoteOptionsRef = doc(db, 'quoteOptions', id);
    const snap = await getDoc(quoteOptionsRef);

    if (!snap.exists()) {
      return NextResponse.json({ error: 'Option not found' }, { status: 404 });
    }

    const updates = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(quoteOptionsRef, updates);

    return NextResponse.json({ success: true, id, updates });
  } catch (error) {
    console.error('Error updating option:', error);
    return NextResponse.json({ error: 'Failed to update option', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Option ID is required' }, { status: 400 });
    }

    const quoteOptionsRef = doc(db, 'quoteOptions', id);
    await deleteDoc(quoteOptionsRef);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting option:', error);
    return NextResponse.json({ error: 'Failed to delete option', details: error.message }, { status: 500 });
  }
}
