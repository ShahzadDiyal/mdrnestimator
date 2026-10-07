import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const leadsRef = collection(db, 'leads');
    const snapshot = await getDocs(query(leadsRef, orderBy('createdAt', 'desc')));
    
    const leads = snapshot.docs.map((doc) => ({
      ...doc.data(),
      docId: doc.id,
      id: doc.data().id || doc.id,
    }));

    return NextResponse.json({ leads, count: leads.length });
  } catch (error) {
    console.error('Error fetching leads from Firestore:', error);
    return NextResponse.json({ error: 'Failed to fetch leads', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name || !body.email || !body.service) {
      return NextResponse.json({ error: 'Name, email, and service are required' }, { status: 400 });
    }

    const newLead = {
      id: body.id || `lead-${Math.floor(1000 + Math.random() * 9000)}`,
      name: body.name,
      company: body.company || 'N/A',
      email: body.email,
      phone: body.phone || 'N/A',
      service: body.service,
      projectType: body.projectType || body.service,
      location: body.location || 'USA',
      budget: body.budget || 'To be estimated',
      deadline: body.deadline || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      source: body.source || 'Website form',
      status: body.status || 'New',
      createdAt: body.createdAt || new Date().toISOString(),
      details: body.details || '',
      files: body.files || [],
      notes: body.notes || [],
    };

    const docRef = await addDoc(collection(db, 'leads'), newLead);

    return NextResponse.json({
      success: true,
      lead: { ...newLead, docId: docRef.id },
    });
  } catch (error) {
    console.error('Error creating lead in Firestore:', error);
    return NextResponse.json({ error: 'Failed to create lead', details: error.message }, { status: 500 });
  }
}
