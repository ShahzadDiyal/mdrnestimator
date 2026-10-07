import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const ALL_FOOTER_MENUS = [
  // Company column
  { id: 'ftr-home', group: 'company', label: 'Home', href: '/', parentId: null, order: 1, status: 'Published' },
  { id: 'ftr-services', group: 'company', label: 'Services', href: '/services', parentId: null, order: 2, status: 'Published' },
  { id: 'ftr-trades', group: 'company', label: 'Our Trades', href: '/trades', parentId: null, order: 3, status: 'Published' },
  { id: 'ftr-portfolio', group: 'company', label: 'Portfolio', href: '/portfolio', parentId: null, order: 4, status: 'Published' },
  { id: 'ftr-about', group: 'company', label: 'About Us', href: '/about', parentId: null, order: 5, status: 'Published' },
  { id: 'ftr-contact', group: 'company', label: 'Contact', href: '/contact', parentId: null, order: 6, status: 'Published' },
  // Services column
  { id: 'ftr-svc-quantity-takeoff', group: 'services', label: 'Quantity Takeoff', href: '/services/quantity-takeoff', parentId: null, order: 1, status: 'Published' },
  { id: 'ftr-svc-material-estimation', group: 'services', label: 'Material Estimation', href: '/services/material-estimation', parentId: null, order: 2, status: 'Published' },
  { id: 'ftr-svc-residential-estimation', group: 'services', label: 'Residential Estimation', href: '/services/residential-estimation', parentId: null, order: 3, status: 'Published' },
  { id: 'ftr-svc-commercial-estimation', group: 'services', label: 'Commercial Estimation', href: '/services/commercial-estimation', parentId: null, order: 4, status: 'Published' },
  { id: 'ftr-svc-bid-preparation', group: 'services', label: 'Bid Preparation', href: '/services/bid-preparation', parentId: null, order: 5, status: 'Published' },
  { id: 'ftr-svc-trade-specific', group: 'services', label: 'Trade-Specific Estimates', href: '/services/trade-specific-estimates', parentId: null, order: 6, status: 'Published' },
  // Legal row
  { id: 'ftr-privacy', group: 'legal', label: 'Privacy Policy', href: '#', parentId: null, order: 1, status: 'Published' },
  { id: 'ftr-terms', group: 'legal', label: 'Terms of Service', href: '#', parentId: null, order: 2, status: 'Published' },
];

function sortMenus(items) {
  return [...items].sort((a, b) => {
    if (a.group !== b.group) return String(a.group).localeCompare(String(b.group));
    const aTop = a.parentId ? 1 : 0;
    const bTop = b.parentId ? 1 : 0;
    if (aTop !== bTop) return aTop - bTop;
    if (aTop === 1 && a.parentId !== b.parentId) return String(a.parentId).localeCompare(String(b.parentId));
    return (Number(a.order) || 0) - (Number(b.order) || 0);
  });
}

export async function GET() {
  try {
    const ref = collection(db, 'footerMenus');
    const snapshot = await getDocs(ref);

    let items = snapshot.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    }));

    // If the collection is empty, auto-seed with the current footer menus!
    if (items.length === 0) {
      console.log('Seeding initial footer menus into Firestore DB...');
      for (const item of ALL_FOOTER_MENUS) {
        await setDoc(doc(db, 'footerMenus', item.id), item);
      }
      items = ALL_FOOTER_MENUS;
    }

    return NextResponse.json({ items: sortMenus(items) });
  } catch (error) {
    console.error('Error fetching footer menus:', error);
    return NextResponse.json({ error: 'Failed to fetch footer menus', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { label, href, group, parentId, order, status } = body;

    if (!label || !label.trim()) {
      return NextResponse.json({ error: 'Menu label is required' }, { status: 400 });
    }

    const cleanSlug = label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const itemId = `ftr-${cleanSlug || Date.now().toString(36)}`;
    const itemGroup = group || 'company';

    // Default order: max sibling order + 1 (same group + parent)
    const snapshot = await getDocs(collection(db, 'footerMenus'));
    const siblings = snapshot.docs
      .map((d) => d.data())
      .filter((d) => (d.group || 'company') === itemGroup && (d.parentId || null) === (parentId || null));
    const maxOrder = siblings.reduce((m, s) => Math.max(m, Number(s.order) || 0), 0);

    const newItem = {
      id: itemId,
      group: itemGroup,
      label: label.trim(),
      href: href && href.trim() ? href.trim() : '#',
      parentId: parentId || null,
      order: order !== undefined && order !== '' && order !== null ? Number(order) : maxOrder + 1,
      status: status || 'Published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'footerMenus', itemId), newItem);

    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    console.error('Error creating footer menu item:', error);
    return NextResponse.json({ error: 'Failed to create footer menu item', details: error.message }, { status: 500 });
  }
}
