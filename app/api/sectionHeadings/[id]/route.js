import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Heading ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const sectionHeadingsRef = doc(db, 'sectionHeadings', id);
    const snap = await getDoc(sectionHeadingsRef);

    if (!snap.exists()) {
      return NextResponse.json({ error: 'Heading not found' }, { status: 404 });
    }

    const updates = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(sectionHeadingsRef, updates);

    return NextResponse.json({ success: true, id, updates });
  } catch (error) {
    console.error('Error updating heading:', error);
    return NextResponse.json({ error: 'Failed to update heading', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Heading ID is required' }, { status: 400 });
    }

    const sectionHeadingsRef = doc(db, 'sectionHeadings', id);
    await deleteDoc(sectionHeadingsRef);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting heading:', error);
    return NextResponse.json({ error: 'Failed to delete heading', details: error.message }, { status: 500 });
  }
}
