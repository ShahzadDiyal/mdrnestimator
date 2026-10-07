import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { checkRateLimit, isSpamSubmission } from '@/lib/rateLimit';
import { sendTeamLeadAlert, sendClientAutoReply } from '@/lib/email';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_TOTAL_BYTES = 25 * 1024 * 1024; // 25 MB
const ALLOWED_EXT = ['.pdf', '.zip'];

export async function POST(request) {
  // Extract client IP address for rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
             request.headers.get('x-real-ip') || 
             '127.0.0.1';

  // 1. Rate Limiting Check
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a few minutes before trying again.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rateLimit.resetMs / 1000)) } }
    );
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const fields = {};
  const drawings = [];
  for (const [key, value] of form.entries()) {
    if (typeof value === 'string') {
      fields[key] = value;
    } else if (value && value.size > 0) {
      drawings.push(value); // File/Blob
    }
  }

  // 2. Spam Honeypot Protection
  if (isSpamSubmission(fields)) {
    console.warn(`[Spam Blocked] Bot submission detected from IP: ${ip}`);
    return NextResponse.json({ ok: true, leadId: 'lead-spam-blocked' });
  }

  const { fullName, email, service } = fields;

  // Basic validation of required fields
  if (!fullName || !email || !service) {
    return NextResponse.json(
      { error: 'Full name, email and service type are required.' },
      { status: 400 }
    );
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
  }

  // Validate uploaded drawings (type + total size)
  let totalBytes = 0;
  for (const file of drawings) {
    const name = (file.name || '').toLowerCase();
    if (!ALLOWED_EXT.some((ext) => name.endsWith(ext))) {
      return NextResponse.json(
        { error: 'Drawings must be PDF or ZIP files.' },
        { status: 400 }
      );
    }
    totalBytes += file.size;
  }
  if (totalBytes > MAX_TOTAL_BYTES) {
    return NextResponse.json(
      { error: 'Uploaded drawings exceed the 25 MB limit.' },
      { status: 413 }
    );
  }

  const leadId = `lead-${Math.floor(1000 + Math.random() * 9000)}`;
  const nowStr = new Date().toISOString();

  // 3. Save Uploaded Files to Disk (/public/uploads/drawings)
  const savedFiles = [];
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'drawings');
    await mkdir(uploadDir, { recursive: true });

    for (const file of drawings) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Clean filename to prevent path traversal
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const fileName = `${leadId}_${safeName}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);

      savedFiles.push({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        url: `/uploads/drawings/${fileName}`,
      });
    }
  } catch (fileErr) {
    console.error('Error saving drawing files to disk:', fileErr);
    // Fallback metadata if file save fails
    drawings.forEach((f) => {
      savedFiles.push({
        name: f.name || 'drawing.pdf',
        size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
      });
    });
  }

  const newLead = {
    id: leadId,
    name: fullName,
    company: fields.company || 'N/A',
    email: email,
    phone: fields.phone || 'N/A',
    service: service,
    projectType: fields.projectType || service,
    location: fields.location || 'USA',
    budget: fields.budget || 'To be estimated',
    deadline: fields.deadline || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    source: 'Website form',
    status: 'New',
    createdAt: nowStr,
    details: fields.details || 'No additional details provided.',
    files: savedFiles,
    notes: [],
  };

  // 4. Save Lead to Firestore DB
  try {
    const docRef = await addDoc(collection(db, 'leads'), newLead);
    console.log('Quote request saved to Firestore with ID:', docRef.id);
  } catch (err) {
    console.error('Error saving quote request to Firestore:', err);
  }

  // 5. Email Notifications (Team Alert + Client Auto-Reply)
  try {
    await Promise.allSettled([
      sendTeamLeadAlert(newLead),
      sendClientAutoReply(newLead),
    ]);
  } catch (err) {
    console.error('Email notification error:', err);
  }

  return NextResponse.json({ ok: true, leadId });
}
