import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const ALL_TEMPLATES = [
  {
    "id": "tpl-1",
    "name": "New lead alert (team)",
    "subject": "New quote request — {{service}}",
    "body": "Hi team,\n\nA new quote request just came in:\n\nName: {{name}}\nCompany: {{company}}\nService: {{service}}\nProject: {{projectType}} — {{location}}\nDeadline: {{deadline}}\n\nView it in the admin panel to assign an estimator.",
    "status": "Active"
  },
  {
    "id": "tpl-2",
    "name": "Auto-reply (client)",
    "subject": "We received your request — {{service}}",
    "body": "Hi {{name}},\n\nThanks for reaching out to Modern Estimator. We have your {{service}} request and an estimator will review your drawings within 2 business hours.\n\nYour reference: {{leadId}}\n\n— The Modern Estimator team",
    "status": "Active"
  },
  {
    "id": "tpl-3",
    "name": "Quote delivered",
    "subject": "Your estimate is ready — {{projectType}}",
    "body": "Hi {{name}},\n\nYour estimate for {{projectType}} is ready. Quoted amount: {{quotedAmount}}.\n\nReply to this email with any questions — revisions are included for 30 days.",
    "status": "Active"
  },
  {
    "id": "tpl-4",
    "name": "Follow-up (7 days)",
    "subject": "Still need that estimate?",
    "body": "Hi {{name}},\n\nJust checking in on your {{service}} request from {{date}}. Your bid deadline is approaching — shall we get started?",
    "status": "Paused"
  }
];

export async function GET() {
  try {
    const templatesRef = collection(db, 'emailTemplates');
    const snapshot = await getDocs(templatesRef);

    let templates = snapshot.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    }));

    // If database collection is empty, auto-seed with initial data!
    if (templates.length === 0) {
      console.log('Seeding initial templates into Firestore DB...');
      for (const item of ALL_TEMPLATES) {
        await setDoc(doc(db, 'emailTemplates', item.id), item);
      }
      templates = ALL_TEMPLATES;
    }

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      slug, name, subject, body: templateBody, status
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Template name is required' }, { status: 400 });
    }

    const cleanSlug = (slug || name).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const templateId = `tpl-${cleanSlug || Date.now().toString(36)}`;

    const newTemplate = {
      id: templateId,
      name: name.trim(),
      subject: subject ? subject.trim() : '',
      body: templateBody ? templateBody.trim() : '',
      status: status || 'Published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'emailTemplates', templateId), newTemplate);

    return NextResponse.json({ success: true, template: newTemplate });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json({ error: 'Failed to create template', details: error.message }, { status: 500 });
  }
}
