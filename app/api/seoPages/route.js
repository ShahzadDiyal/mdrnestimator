import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const ALL_PAGES = [
  {
    "id": "seo-1",
    "page": "Homepage (/)",
    "path": "/",
    "title": "Modern Estimator — USA Construction Estimation Services",
    "description": "Premium construction estimation services for US contractors. Quantity takeoffs, material estimation, residential and commercial bid preparation with 8–24 hour turnaround.",
    "status": "Published"
  },
  {
    "id": "seo-2",
    "page": "/services",
    "path": "/services",
    "title": "Construction Estimating Services — Modern Estimator",
    "description": "Quantity takeoff, material estimation, residential and commercial estimating, bid preparation and trade-specific estimates for US contractors. 8–24 hour turnaround.",
    "status": "Published"
  },
  {
    "id": "seo-3",
    "page": "/trades",
    "path": "/trades",
    "title": "Our Trades — CSI Trade Estimating Services | Modern Estimator",
    "description": "Trade-specific construction estimating and takeoff services for every CSI division: concrete, electrical, MEP, metals, finishes, roofing, sitework, lumber and more. 8–24 hour turnaround.",
    "status": "Published"
  },
  {
    "id": "seo-4",
    "page": "/portfolio",
    "path": "/portfolio",
    "title": "Portfolio — Modern Estimator",
    "description": "A selection of construction estimates delivered across residential, commercial and industrial projects nationwide.",
    "status": "Published"
  },
  {
    "id": "seo-5",
    "page": "/about",
    "path": "/about",
    "title": "About Us — Modern Estimator",
    "description": "Modern Estimator is a US construction estimating company delivering accurate, CSI-coded quantity takeoffs and bid-ready estimates with a 8–24 hour turnaround.",
    "status": "Published"
  },
  {
    "id": "seo-6",
    "page": "/contact",
    "path": "/contact",
    "title": "Contact Us & Get a Free Quote — Modern Estimator",
    "description": "Send us your plans for a free, no-obligation construction estimate. We respond within 2 business hours — complete estimate in 8–24 hours.",
    "status": "Published"
  }
];

export async function GET() {
  try {
    const pagesRef = collection(db, 'seoPages');
    const snapshot = await getDocs(pagesRef);

    let pages = snapshot.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    }));

    // If database collection is empty, auto-seed with initial data!
    if (pages.length === 0) {
      console.log('Seeding initial pages into Firestore DB...');
      for (const item of ALL_PAGES) {
        await setDoc(doc(db, 'seoPages', item.id), item);
      }
      pages = ALL_PAGES;
    }

    return NextResponse.json({ pages });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ error: 'Failed to fetch pages', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      slug, page, path, title, description, status
    } = body;

    if (!page || !page.trim()) {
      return NextResponse.json({ error: 'Page name is required' }, { status: 400 });
    }

    const cleanSlug = (slug || page).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const pageId = `seo-${cleanSlug || Date.now().toString(36)}`;

    const newPage = {
      id: pageId,
      page: page.trim(),
      path: path ? path.trim() : '',
      title: title ? title.trim() : '',
      description: description ? description.trim() : '',
      status: status || 'Published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'seoPages', pageId), newPage);

    return NextResponse.json({ success: true, page: newPage });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json({ error: 'Failed to create page', details: error.message }, { status: 500 });
  }
}
