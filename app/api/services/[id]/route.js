import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const serviceRef = doc(db, 'services', id);
    const serviceSnap = await getDoc(serviceRef);

    if (!serviceSnap.exists()) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const updates = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(serviceRef, updates);

    return NextResponse.json({ success: true, id, updates });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Failed to update service', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    const serviceRef = doc(db, 'services', id);
    await deleteDoc(serviceRef);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Failed to delete service', details: error.message }, { status: 500 });
  }
}
