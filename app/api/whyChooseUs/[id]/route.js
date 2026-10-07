import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Feature ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const whyChooseUsRef = doc(db, 'whyChooseUs', id);
    const snap = await getDoc(whyChooseUsRef);

    if (!snap.exists()) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
    }

    const updates = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(whyChooseUsRef, updates);

    return NextResponse.json({ success: true, id, updates });
  } catch (error) {
    console.error('Error updating feature:', error);
    return NextResponse.json({ error: 'Failed to update feature', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Feature ID is required' }, { status: 400 });
    }

    const whyChooseUsRef = doc(db, 'whyChooseUs', id);
    await deleteDoc(whyChooseUsRef);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting feature:', error);
    return NextResponse.json({ error: 'Failed to delete feature', details: error.message }, { status: 500 });
  }
}
