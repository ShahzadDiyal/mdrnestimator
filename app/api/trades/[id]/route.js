import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Trade ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const tradeRef = doc(db, 'trades', id);
    const tradeSnap = await getDoc(tradeRef);

    if (!tradeSnap.exists()) {
      return NextResponse.json({ error: 'Trade not found' }, { status: 404 });
    }

    const updates = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(tradeRef, updates);

    return NextResponse.json({ success: true, id, updates });
  } catch (error) {
    console.error('Error updating trade:', error);
    return NextResponse.json({ error: 'Failed to update trade', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Trade ID is required' }, { status: 400 });
    }

    const tradeRef = doc(db, 'trades', id);
    await deleteDoc(tradeRef);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting trade:', error);
    return NextResponse.json({ error: 'Failed to delete trade', details: error.message }, { status: 500 });
  }
}
