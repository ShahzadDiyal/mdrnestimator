import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { INITIAL_POSTS } from '../route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    console.log('Force re-seeding blog posts into Firestore...');
    for (const item of INITIAL_POSTS) {
      await setDoc(doc(db, 'posts', item.id), item);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${INITIAL_POSTS.length} blog posts into Firestore!`,
      count: INITIAL_POSTS.length,
    });
  } catch (error) {
    console.error('Error seeding blog posts:', error);
    return NextResponse.json({ error: 'Failed to seed blog posts', details: error.message }, { status: 500 });
  }
}
