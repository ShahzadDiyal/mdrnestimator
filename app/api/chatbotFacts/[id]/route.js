import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Fact ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const chatbotFactsRef = doc(db, 'chatbotFacts', id);
    const snap = await getDoc(chatbotFactsRef);

    if (!snap.exists()) {
      return NextResponse.json({ error: 'Fact not found' }, { status: 404 });
    }

    const updates = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(chatbotFactsRef, updates);

    return NextResponse.json({ success: true, id, updates });
  } catch (error) {
    console.error('Error updating fact:', error);
    return NextResponse.json({ error: 'Failed to update fact', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Fact ID is required' }, { status: 400 });
    }

    const chatbotFactsRef = doc(db, 'chatbotFacts', id);
    await deleteDoc(chatbotFactsRef);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting fact:', error);
    return NextResponse.json({ error: 'Failed to delete fact', details: error.message }, { status: 500 });
  }
}
