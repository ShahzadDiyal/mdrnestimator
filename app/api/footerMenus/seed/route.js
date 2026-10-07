import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ALL_FOOTER_MENUS } from '../route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    let count = 0;
    for (const item of ALL_FOOTER_MENUS) {
      await setDoc(doc(db, 'footerMenus', item.id), item, { merge: true });
      count++;
    }

    return NextResponse.json({ success: true, count, message: `Successfully seeded ${count} footer menu items to Firestore DB!` });
  } catch (error) {
    console.error('Error seeding footer menus:', error);
    return NextResponse.json({ error: 'Failed to seed footer menus', details: error.message }, { status: 500 });
  }
}
