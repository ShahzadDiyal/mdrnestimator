import nodemailer from 'nodemailer';
import { db } from './firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

/* ---------- admin-managed email content (Email Settings + Templates) ---------- */

// Replace {{variable}} placeholders in a template string.
function renderTemplate(str, vars) {
  return String(str || '').replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, k) => {
    const v = vars[k];
    return v === undefined || v === null ? '' : String(v);
  });
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Admin template bodies are plain text — make them email-safe HTML.
function textToHtml(text) {
  return escapeHtml(text).replace(/\r?\n/g, '<br/>');
}

async function getEmailSettings() {
  try {
    const snap = await getDoc(doc(db, 'emailSettings', 'main'));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.error('[email] getEmailSettings failed:', e?.message);
    return null;
  }
}

async function getActiveTemplates() {
  try {
    const snap = await getDocs(collection(db, 'emailTemplates'));
    return snap.docs
      .map((d) => ({ ...d.data(), id: d.id }))
      .filter((t) => t.status === 'Active' || !t.status);
  } catch (e) {
    console.error('[email] getActiveTemplates failed:', e?.message);
    return [];
  }
}

function findTemplate(templates, needle) {
  const n = String(needle).toLowerCase();
  return templates.find((t) => String(t.name || '').toLowerCase().includes(n)) || null;
}

// Simple branded wrapper for admin template bodies.
function wrapTemplateBody(innerHtml) {
  return `
    <div style="font-family: Arial, sans-serif; color: #14284A; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background: #ffffff;">
      <p style="font-size: 14px; color: #2d3748; line-height: 1.7;">${innerHtml}</p>
    </div>
  `;
}

// Helper to create Gmail / custom SMTP transporter or Resend client
function getTransporter() {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (gmailUser && gmailPass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass, // 16-character Gmail App Password
      },
    });
  }

  // Fallback to custom SMTP if configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return null;
}

export async function sendTeamLeadAlert(lead) {
  const gmailUser = process.env.GMAIL_USER;
  const teamEmail = process.env.TEAM_NOTIFICATION_EMAIL || gmailUser || 'quotes@modernestimator.com';
  const transporter = getTransporter();

  // Admin-managed settings + template (Email Settings / Email Templates).
  const settings = await getEmailSettings();
  if (settings && settings.notifyTeam === false) {
    console.log('[email] Team lead alerts disabled in Email Settings — skipping.');
    return { success: true, skipped: true };
  }
  const templates = await getActiveTemplates();
  const tpl = findTemplate(templates, 'lead alert');

  const fromName = settings?.fromName || 'Modern Estimator Alert';
  const fromEmail = settings?.fromEmail || gmailUser || 'quotes@modernestimator.com';

  const vars = {
    leadId: lead.id,
    name: lead.name,
    company: lead.company || '',
    email: lead.email,
    phone: lead.phone || '',
    service: lead.service,
    projectType: lead.projectType || '',
    location: lead.location || '',
    deadline: lead.deadline || '',
    details: lead.details || '',
  };

  const subject = tpl?.subject
    ? renderTemplate(tpl.subject, vars)
    : `🚨 New Quote Request: ${lead.name} — ${lead.service}`;
  const html = tpl?.body
    ? wrapTemplateBody(textToHtml(renderTemplate(tpl.body, vars)))
    : `
    <div style="font-family: Arial, sans-serif; color: #14284A; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background: #ffffff;">
      <h2 style="color: #14284A; margin-top: 0;">New Quote Request Received</h2>
      <p style="font-size: 14px; color: #4a5568;">A new client lead has been submitted and saved to your database.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
        <tr style="background: #f7fafc;"><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #edf2f7;">Lead ID</td><td style="padding: 10px; border-bottom: 1px solid #edf2f7;">${lead.id}</td></tr>
        <tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #edf2f7;">Client Name</td><td style="padding: 10px; border-bottom: 1px solid #edf2f7;">${lead.name}</td></tr>
        <tr style="background: #f7fafc;"><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #edf2f7;">Company</td><td style="padding: 10px; border-bottom: 1px solid #edf2f7;">${lead.company || 'N/A'}</td></tr>
        <tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #edf2f7;">Email</td><td style="padding: 10px; border-bottom: 1px solid #edf2f7;"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
        <tr style="background: #f7fafc;"><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #edf2f7;">Phone</td><td style="padding: 10px; border-bottom: 1px solid #edf2f7;">${lead.phone || 'N/A'}</td></tr>
        <tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #edf2f7;">Service Type</td><td style="padding: 10px; border-bottom: 1px solid #edf2f7;">${lead.service}</td></tr>
        <tr style="background: #f7fafc;"><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #edf2f7;">Project Type</td><td style="padding: 10px; border-bottom: 1px solid #edf2f7;">${lead.projectType || 'N/A'}</td></tr>
        <tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #edf2f7;">Files Uploaded</td><td style="padding: 10px; border-bottom: 1px solid #edf2f7;">${lead.files && lead.files.length ? lead.files.map(f => f.name).join(', ') : 'No files'}</td></tr>
      </table>

      <div style="margin-top: 20px; padding: 16px; background: #edf2f7; border-radius: 8px;">
        <h4 style="margin: 0 0 8px 0; color: #2d3748;">Project Details:</h4>
        <p style="margin: 0; font-size: 14px; color: #4a5568; white-space: pre-wrap;">${lead.details || 'No details provided.'}</p>
      </div>

      <p style="margin-top: 24px; text-align: center;">
        <a href="https://modernestimator.com/admin/leads/${lead.id}" style="background: #ED7D22; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View Lead in Admin Panel</a>
      </p>
    </div>
  `;

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: teamEmail,
        subject,
        html,
      });
      console.log('[Gmail/SMTP] Team Lead Alert sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error('Error sending team alert via Gmail/SMTP:', err);
      return { error: err.message };
    }
  }

  // Fallback to Resend API if RESEND_API_KEY is present
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Modern Estimator <notifications@modernestimator.com>',
          to: [teamEmail],
          subject,
          html,
        }),
      });
      return await res.json();
    } catch (err) {
      console.error('Resend email error:', err);
    }
  }

  console.log('[Email Simulation] Team Lead Alert would be sent to:', teamEmail, 'Subject:', subject);
  return { success: true, simulated: true };
}

export async function sendClientAutoReply(lead) {
  const gmailUser = process.env.GMAIL_USER;
  const clientEmail = lead.email;
  const transporter = getTransporter();

  // Admin-managed settings + template (Email Settings / Email Templates).
  const settings = await getEmailSettings();
  if (settings && settings.autoReply === false) {
    console.log('[email] Client auto-reply disabled in Email Settings — skipping.');
    return { success: true, skipped: true };
  }
  const templates = await getActiveTemplates();
  const tpl = findTemplate(templates, 'auto-reply');

  const fromName = settings?.fromName || 'Modern Estimator';
  const fromEmail = settings?.fromEmail || gmailUser || 'hello@modernestimator.com';

  const vars = {
    leadId: lead.id,
    name: lead.name,
    company: lead.company || '',
    email: lead.email,
    service: lead.service,
    projectType: lead.projectType || '',
  };

  const subject = tpl?.subject
    ? renderTemplate(tpl.subject, vars)
    : `We received your quote request — Modern Estimator (${lead.id})`;
  const html = tpl?.body
    ? wrapTemplateBody(textToHtml(renderTemplate(tpl.body, vars)))
    : `
    <div style="font-family: Arial, sans-serif; color: #14284A; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background: #ffffff;">
      <h2 style="color: #14284A; margin-top: 0;">Thank You for Reaching Out!</h2>
      <p style="font-size: 15px; color: #2d3748;">Hi ${lead.name},</p>
      <p style="font-size: 14px; color: #4a5568; line-height: 1.6;">
        We have received your request for <strong>${lead.service}</strong>. One of our senior estimating specialists is reviewing your project requirements and drawings.
      </p>
      
      <div style="margin: 20px 0; padding: 16px; background: #FEF3E9; border-left: 4px solid #ED7D22; border-radius: 4px;">
        <p style="margin: 0; font-weight: bold; color: #B85A0E; font-size: 14px;">What happens next?</p>
        <p style="margin: 6px 0 0 0; font-size: 13px; color: #4a5568;">
          • We will confirm your project scope & pricing within <strong>2 business hours</strong>.<br/>
          • Complete estimate delivery in <strong>8 to 24 hours</strong>.
        </p>
      </div>

      <p style="font-size: 13px; color: #718096; margin-top: 24px; border-top: 1px solid #edf2f7; padding-top: 16px;">
        Reference ID: <strong>${lead.id}</strong><br/>
        Questions? Reply directly to this email or call us at +1 (555) 123-4567.<br/><br/>
        — The Modern Estimator Team
      </p>
    </div>
  `;

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: clientEmail,
        subject,
        html,
      });
      console.log('[Gmail/SMTP] Client Auto-Reply sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error('Error sending client auto-reply via Gmail/SMTP:', err);
      return { error: err.message };
    }
  }

  // Fallback to Resend API if RESEND_API_KEY is present
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Modern Estimator <hello@modernestimator.com>',
          to: [clientEmail],
          subject,
          html,
        }),
      });
      return await res.json();
    } catch (err) {
      console.error('Resend email error:', err);
    }
  }

  console.log('[Email Simulation] Client Auto-Reply would be sent to:', clientEmail, 'Subject:', subject);
  return { success: true, simulated: true };
}
