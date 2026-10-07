import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Stat ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const statsRef = doc(db, 'stats', id);
    const snap = await getDoc(statsRef);

    if (!snap.exists()) {
      return NextResponse.json({ error: 'Stat not found' }, { status: 404 });
    }

    const updates = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(statsRef, updates);

    return NextResponse.json({ success: true, id, updates });
  } catch (error) {
    console.error('Error updating stat:', error);
    return NextResponse.json({ error: 'Failed to update stat', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Stat ID is required' }, { status: 400 });
    }

    const statsRef = doc(db, 'stats', id);
    await deleteDoc(statsRef);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting stat:', error);
    return NextResponse.json({ error: 'Failed to delete stat', details: error.message }, { status: 500 });
  }
}
