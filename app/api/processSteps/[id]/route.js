import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Step ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const processStepsRef = doc(db, 'processSteps', id);
    const snap = await getDoc(processStepsRef);

    if (!snap.exists()) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 });
    }

    const updates = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(processStepsRef, updates);

    return NextResponse.json({ success: true, id, updates });
  } catch (error) {
    console.error('Error updating step:', error);
    return NextResponse.json({ error: 'Failed to update step', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Step ID is required' }, { status: 400 });
    }

    const processStepsRef = doc(db, 'processSteps', id);
    await deleteDoc(processStepsRef);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting step:', error);
    return NextResponse.json({ error: 'Failed to delete step', details: error.message }, { status: 500 });
  }
}
