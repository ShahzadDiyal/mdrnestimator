import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const leadsRef = collection(db, 'leads');
    const q = query(leadsRef, where('id', '==', id));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Try by document ID
      try {
        const docRef = doc(db, 'leads', id);
        const docSnap = await docRef.get();
        if (docSnap.exists()) {
          return NextResponse.json({ lead: { ...docSnap.data(), docId: docSnap.id, id: docSnap.data().id || docSnap.id } });
        }
      } catch {}
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const docSnap = snapshot.docs[0];
    return NextResponse.json({ lead: { ...docSnap.data(), docId: docSnap.id, id: docSnap.data().id || docSnap.id } });
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json({ error: 'Failed to fetch lead', details: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const patch = await request.json();

    const leadsRef = collection(db, 'leads');
    const q = query(leadsRef, where('id', '==', id));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      const targetDocRef = doc(db, 'leads', docSnap.id);
      await updateDoc(targetDocRef, patch);
      return NextResponse.json({ success: true, updated: { ...docSnap.data(), ...patch } });
    }

    // Try direct doc ID match
    try {
      const targetDocRef = doc(db, 'leads', id);
      await updateDoc(targetDocRef, patch);
      return NextResponse.json({ success: true, updatedId: id });
    } catch {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Failed to update lead', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const leadsRef = collection(db, 'leads');
    const q = query(leadsRef, where('id', '==', id));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      for (const d of snapshot.docs) {
        await deleteDoc(doc(db, 'leads', d.id));
      }
      return NextResponse.json({ success: true });
    }

    // Try direct doc ID match
    try {
      await deleteDoc(doc(db, 'leads', id));
      return NextResponse.json({ success: true });
    } catch {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: 'Failed to delete lead', details: error.message }, { status: 500 });
  }
}
