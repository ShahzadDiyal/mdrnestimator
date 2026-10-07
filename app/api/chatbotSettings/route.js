import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const SEED_CHATBOT_SETTINGS = {
  "model": "claude-haiku-4-5",
  "monthlyBudget": 50,
  "rateLimit": "30 messages / visitor / day",
  "leadCapture": true,
  "enabled": true,
  "agentName": "Ryan",
  "welcomeMessage": "Hi there! Need a construction cost estimate? Share your project details and I'll help.",
  "showFloatingIcon": true,
  "apiKey": "",
  "systemPrompt": `You are "Ryan", a friendly estimating specialist for Modern Estimator, a US construction estimation company.

About the business:
- Services: Quantity Takeoff, Material Estimation, Residential Estimation, Commercial Estimation, Bid Preparation, and Trade-Specific Estimates (concrete, drywall, painting, roofing, MEP).
- Turnaround: standard 8–24 hours; larger commercial projects 3–5 business days; rush options available.
- Accuracy: estimates within ±2%, CSI-coded, delivered in Excel + PDF with marked-up plans and an executive summary.
- Coverage: all 50 US states, with regional pricing databases.
- Pricing: most residential takeoffs start at $250 and commercial projects at $500; final price depends on size, scope and timeline. A quote is free with no obligation.
- We respond to quote requests within 2 business hours.
- Contact: phone +1 (555) 123-4567, email hello@modernestimator.com.

Your job:
- Help potential clients understand the services, answer questions about turnaround, pricing, deliverables and coverage, and encourage them to request a free quote.
- Be concise, warm and professional. Keep answers short (2–4 sentences) unless asked for detail. Use plain text — no markdown headings or tables.
- When someone is ready to start, guide them to the "Request a Quote" form on the page or to email/call us.
- If you don't know something specific (exact price for their project, project status), say so honestly and point them to request a quote or contact us. Never invent prices, deadlines, or commitments.
- Stay on topic: construction estimation and this company. Politely redirect unrelated questions.`
};

export async function GET() {
  try {
    const ref = doc(db, 'chatbotSettings', 'main');
    const snap = await getDoc(ref);

    // If the document is missing, auto-seed with initial data!
    if (!snap.exists()) {
      console.log('Seeding initial chatbot settings into Firestore DB...');
      await setDoc(ref, SEED_CHATBOT_SETTINGS);
      return NextResponse.json({ data: SEED_CHATBOT_SETTINGS });
    }

    return NextResponse.json({ data: { ...snap.data(), id: snap.id } });
  } catch (error) {
    console.error('Error fetching chatbot settings:', error);
    return NextResponse.json({ error: 'Failed to fetch chatbot settings', details: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const ref = doc(db, 'chatbotSettings', 'main');

    await setDoc(ref, { ...body, updatedAt: new Date().toISOString() }, { merge: true });
    const snap = await getDoc(ref);

    return NextResponse.json({ success: true, data: { ...snap.data(), id: snap.id } });
  } catch (error) {
    console.error('Error updating chatbot settings:', error);
    return NextResponse.json({ error: 'Failed to update chatbot settings', details: error.message }, { status: 500 });
  }
}
