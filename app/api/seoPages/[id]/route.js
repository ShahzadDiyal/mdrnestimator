import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const seoPagesRef = doc(db, 'seoPages', id);
    const snap = await getDoc(seoPagesRef);

    if (!snap.exists()) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const updates = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(seoPagesRef, updates);

    return NextResponse.json({ success: true, id, updates });
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json({ error: 'Failed to update page', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    const seoPagesRef = doc(db, 'seoPages', id);
    await deleteDoc(seoPagesRef);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json({ error: 'Failed to delete page', details: error.message }, { status: 500 });
  }
}
