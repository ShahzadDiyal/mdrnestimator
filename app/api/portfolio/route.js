import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const ALL_PROJECTS = [
  {
    "id": "prj-1",
    "title": "Maple Heights Residences",
    "category": "Residential — Multi-family",
    "price": "$3.4M",
    "location": "Austin, TX",
    "img": "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=1200&q=80",
    "alt": "Maple Heights",
    "tags": [
      "Concrete",
      "Framing",
      "MEP"
    ],
    "status": "Published"
  },
  {
    "id": "prj-2",
    "title": "Northgate Medical Plaza",
    "category": "Commercial — Healthcare",
    "price": "$12.8M",
    "location": "Denver, CO",
    "img": "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80",
    "alt": "Northgate Medical Plaza — healthcare facility exterior",
    "tags": [
      "Structural",
      "MEP",
      "Finishes"
    ],
    "status": "Published"
  },
  {
    "id": "prj-3",
    "title": "Riverside Logistics Hub",
    "category": "Industrial — Warehouse",
    "price": "$22.5M",
    "location": "Dallas, TX",
    "img": "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1200&q=80",
    "alt": "Riverside",
    "tags": [
      "Tilt-up Concrete",
      "Roofing",
      "Site Work"
    ],
    "status": "Published"
  },
  {
    "id": "prj-4",
    "title": "Lakeside Custom Home",
    "category": "Residential — Custom",
    "price": "$1.9M",
    "location": "Seattle, WA",
    "img": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "alt": "Lakeside",
    "tags": [
      "Framing",
      "Finishes",
      "Cabinetry"
    ],
    "status": "Published"
  },
  {
    "id": "prj-5",
    "title": "Crestview Office Tower",
    "category": "Commercial — Office",
    "price": "$48.2M",
    "location": "Chicago, IL",
    "img": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    "alt": "Crestview",
    "tags": [
      "Structural Steel",
      "Curtain Wall",
      "MEP"
    ],
    "status": "Published"
  },
  {
    "id": "prj-6",
    "title": "Sunrise Townhomes",
    "category": "Residential — Townhome",
    "price": "$8.7M",
    "location": "Phoenix, AZ",
    "img": "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
    "alt": "Sunrise",
    "tags": [
      "Framing",
      "Roofing",
      "Site Work"
    ],
    "status": "Published"
  }
];

export async function GET() {
  try {
    const projectsRef = collection(db, 'portfolio');
    const snapshot = await getDocs(projectsRef);

    let projects = snapshot.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    }));

    // If database collection is empty, auto-seed with initial data!
    if (projects.length === 0) {
      console.log('Seeding initial projects into Firestore DB...');
      for (const item of ALL_PROJECTS) {
        await setDoc(doc(db, 'portfolio', item.id), item);
      }
      projects = ALL_PROJECTS;
    }

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      slug, title, category, price, location, img, alt, tags, status
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Project title is required' }, { status: 400 });
    }

    const cleanSlug = (slug || title).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const projectId = `prj-${cleanSlug || Date.now().toString(36)}`;

    const newProject = {
      id: projectId,
      title: title.trim(),
      category: category ? category.trim() : '',
      price: price ? price.trim() : '',
      location: location ? location.trim() : '',
      img: img ? img.trim() : '',
      alt: alt ? alt.trim() : '',
      tags: Array.isArray(tags) ? tags : [],
      status: status || 'Published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'portfolio', projectId), newProject);

    return NextResponse.json({ success: true, project: newProject });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project', details: error.message }, { status: 500 });
  }
}
