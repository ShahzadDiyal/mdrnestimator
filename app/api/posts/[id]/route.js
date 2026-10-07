import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const docRef = doc(db, 'posts', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post: { id: docSnap.id, ...docSnap.data() } });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post', details: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const docRef = doc(db, 'posts', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Post not found in database' }, { status: 404 });
    }

    const updateData = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    // Remove id if passed in body to avoid overriding document ID field incorrectly
    delete updateData.id;

    await updateDoc(docRef, updateData);

    const updatedSnap = await getDoc(docRef);
    return NextResponse.json({
      success: true,
      post: { id: updatedSnap.id, ...updatedSnap.data() },
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Failed to update blog post', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const docRef = doc(db, 'posts', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Post not found in database' }, { status: 404 });
    }

    await deleteDoc(docRef);

    return NextResponse.json({ success: true, message: `Post ${id} deleted successfully` });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post', details: error.message }, { status: 500 });
  }
}
