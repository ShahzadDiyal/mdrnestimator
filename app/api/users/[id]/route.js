import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const userRef = doc(db, 'users', id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If updating email, check duplicate email across existing users
    if (body.email) {
      const cleanEmail = body.email.trim().toLowerCase();
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const existing = snapshot.docs.find(
        (d) => d.id !== id && d.data().email && d.data().email.trim().toLowerCase() === cleanEmail
      );
      if (existing) {
        return NextResponse.json(
          { error: `User with email "${cleanEmail}" already exists.` },
          { status: 400 }
        );
      }
      body.email = cleanEmail;
    }

    const updates = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(userRef, updates);

    return NextResponse.json({ success: true, id, updates });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const userRef = doc(db, 'users', id);
    await deleteDoc(userRef);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user', details: error.message }, { status: 500 });
  }
}
