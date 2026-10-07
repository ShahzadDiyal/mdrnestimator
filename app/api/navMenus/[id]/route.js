import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Menu item ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const ref = doc(db, 'navMenus', id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    const updates = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(ref, updates);

    return NextResponse.json({ success: true, id, updates });
  } catch (error) {
    console.error('Error updating nav menu item:', error);
    return NextResponse.json({ error: 'Failed to update nav menu item', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Menu item ID is required' }, { status: 400 });
    }

    await deleteDoc(doc(db, 'navMenus', id));

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting nav menu item:', error);
    return NextResponse.json({ error: 'Failed to delete nav menu item', details: error.message }, { status: 500 });
  }
}
