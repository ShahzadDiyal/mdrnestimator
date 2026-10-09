import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { cleanSlug, RESERVED_SLUGS } from '../route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const snap = await getDoc(doc(db, 'customPages', params.id));
    if (!snap.exists()) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    return NextResponse.json({ page: { ...snap.data(), id: snap.id } });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch page', details: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const ref = doc(db, 'customPages', id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const body = await request.json();
    const updates = { ...body, updatedAt: new Date().toISOString() };
    delete updates.id;

    // Validate slug changes.
    if (body.slug !== undefined) {
      const finalSlug = cleanSlug(body.slug);
      if (!finalSlug) {
        return NextResponse.json({ error: 'A valid URL slug is required' }, { status: 400 });
      }
      if (RESERVED_SLUGS.includes(finalSlug)) {
        return NextResponse.json({ error: `"${finalSlug}" is a reserved URL and can't be used` }, { status: 400 });
      }
      const dup = await getDocs(query(collection(db, 'customPages'), where('slug', '==', finalSlug)));
      const clash = dup.docs.find((d) => d.id !== id);
      if (clash) {
        return NextResponse.json({ error: 'Another page already uses this URL slug' }, { status: 400 });
      }
      updates.slug = finalSlug;
    }

    await updateDoc(ref, updates);
    return NextResponse.json({ success: true, id, updates });
  } catch (error) {
    console.error('Error updating custom page:', error);
    return NextResponse.json({ error: 'Failed to update page', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const ref = doc(db, 'customPages', id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    await deleteDoc(ref);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting custom page:', error);
    return NextResponse.json({ error: 'Failed to delete page', details: error.message }, { status: 500 });
  }
}
