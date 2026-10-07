import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const ALL_NAV_MENUS = [
  // Top-level items
  { id: 'nav-home', label: 'Home', href: '/', parentId: null, order: 1, status: 'Published' },
  { id: 'nav-services', label: 'Services', href: '/services', parentId: null, order: 2, status: 'Published' },
  { id: 'nav-trades', label: 'Our Trades', href: '/trades', parentId: null, order: 3, status: 'Published' },
  { id: 'nav-portfolio', label: 'Portfolio', href: '/portfolio', parentId: null, order: 4, status: 'Published' },
  { id: 'nav-about', label: 'About Us', href: '/about', parentId: null, order: 5, status: 'Published' },
  { id: 'nav-contact', label: 'Contact', href: '/contact', parentId: null, order: 6, status: 'Published' },
  // Services dropdown
  { id: 'nav-svc-quantity-takeoff', label: 'Quantity Takeoff', href: '/services/quantity-takeoff', parentId: 'nav-services', order: 1, status: 'Published' },
  { id: 'nav-svc-material-estimation', label: 'Material Estimation', href: '/services/material-estimation', parentId: 'nav-services', order: 2, status: 'Published' },
  { id: 'nav-svc-residential-estimation', label: 'Residential Estimation', href: '/services/residential-estimation', parentId: 'nav-services', order: 3, status: 'Published' },
  { id: 'nav-svc-commercial-estimation', label: 'Commercial Estimation', href: '/services/commercial-estimation', parentId: 'nav-services', order: 4, status: 'Published' },
  { id: 'nav-svc-bid-preparation', label: 'Bid Preparation', href: '/services/bid-preparation', parentId: 'nav-services', order: 5, status: 'Published' },
  { id: 'nav-svc-trade-specific', label: 'Trade-Specific Estimates', href: '/services/trade-specific-estimates', parentId: 'nav-services', order: 6, status: 'Published' },
  { id: 'nav-svc-all', label: 'View all services', href: '/services', parentId: 'nav-services', order: 7, status: 'Published' },
  // Trades dropdown
  { id: 'nav-trd-concrete', label: 'Concrete Estimating', href: '/trades/concrete-estimating', parentId: 'nav-trades', order: 1, status: 'Published' },
  { id: 'nav-trd-electrical', label: 'Electrical Estimating', href: '/trades/electrical-estimating', parentId: 'nav-trades', order: 2, status: 'Published' },
  { id: 'nav-trd-finishes', label: 'Interior & Exterior Finishes', href: '/trades/interior-exterior-finishes', parentId: 'nav-trades', order: 3, status: 'Published' },
  { id: 'nav-trd-masonry', label: 'Masonry Estimating', href: '/trades/masonry-estimating', parentId: 'nav-trades', order: 4, status: 'Published' },
  { id: 'nav-trd-mep', label: 'MEP Estimating', href: '/trades/mep-estimating', parentId: 'nav-trades', order: 5, status: 'Published' },
  { id: 'nav-trd-metals', label: 'Metals Estimating', href: '/trades/metals-estimating', parentId: 'nav-trades', order: 6, status: 'Published' },
  { id: 'nav-trd-openings', label: 'Openings Estimating', href: '/trades/openings-estimating', parentId: 'nav-trades', order: 7, status: 'Published' },
  { id: 'nav-trd-thermal', label: 'Thermal / Moisture Protection Estimating', href: '/trades/thermal-moisture-protection-estimating', parentId: 'nav-trades', order: 8, status: 'Published' },
  { id: 'nav-trd-sitework', label: 'Sitework Estimating', href: '/trades/sitework-estimating', parentId: 'nav-trades', order: 9, status: 'Published' },
  { id: 'nav-trd-lumber', label: 'Lumber Takeoff', href: '/trades/lumber-takeoff', parentId: 'nav-trades', order: 10, status: 'Published' },
  { id: 'nav-trd-all', label: 'View all trades', href: '/trades', parentId: 'nav-trades', order: 11, status: 'Published' },
];

function sortMenus(items) {
  return [...items].sort((a, b) => {
    const aTop = a.parentId ? 1 : 0;
    const bTop = b.parentId ? 1 : 0;
    if (aTop !== bTop) return aTop - bTop;
    if (aTop === 1 && a.parentId !== b.parentId) return String(a.parentId).localeCompare(String(b.parentId));
    return (Number(a.order) || 0) - (Number(b.order) || 0);
  });
}

export async function GET() {
  try {
    const ref = collection(db, 'navMenus');
    const snapshot = await getDocs(ref);

    let items = snapshot.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    }));

    // If the collection is empty, auto-seed with the current navbar menus!
    if (items.length === 0) {
      console.log('Seeding initial navbar menus into Firestore DB...');
      for (const item of ALL_NAV_MENUS) {
        await setDoc(doc(db, 'navMenus', item.id), item);
      }
      items = ALL_NAV_MENUS;
    }

    return NextResponse.json({ items: sortMenus(items) });
  } catch (error) {
    console.error('Error fetching nav menus:', error);
    return NextResponse.json({ error: 'Failed to fetch nav menus', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { label, href, parentId, order, status } = body;

    if (!label || !label.trim()) {
      return NextResponse.json({ error: 'Menu label is required' }, { status: 400 });
    }

    const cleanSlug = label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const itemId = `nav-${cleanSlug || Date.now().toString(36)}`;

    // Default order: max sibling order + 1
    const snapshot = await getDocs(collection(db, 'navMenus'));
    const siblings = snapshot.docs
      .map((d) => d.data())
      .filter((d) => (d.parentId || null) === (parentId || null));
    const maxOrder = siblings.reduce((m, s) => Math.max(m, Number(s.order) || 0), 0);

    const newItem = {
      id: itemId,
      label: label.trim(),
      href: href && href.trim() ? href.trim() : '#',
      parentId: parentId || null,
      order: order !== undefined && order !== '' && order !== null ? Number(order) : maxOrder + 1,
      status: status || 'Published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'navMenus', itemId), newItem);

    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    console.error('Error creating nav menu item:', error);
    return NextResponse.json({ error: 'Failed to create nav menu item', details: error.message }, { status: 500 });
  }
}
