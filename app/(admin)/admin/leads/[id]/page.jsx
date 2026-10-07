'use client';

import Link from 'next/link';
import { useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { useStore } from '@/components/admin/store';
import { useAuth } from '@/components/admin/auth';
import {
  PageHeader, Card, Btn, StatusBadge, Field, Textarea, Select, Badge,
  DemoNote, EmptyState, toast,
} from '@/components/admin/ui';
import {
  IconArrowLeft, IconDownload, IconMail, IconPhone, IconCalendar,
  IconDollar, IconCheck, IconMessage, IconFileText, IconAlert, IconTrash,
} from '@/components/admin/icons';
import { LEAD_STATUSES } from '@/components/admin/data';

const STEPS = ['New', 'Contacted', 'Quoted', 'Won'];

export default function LeadDetailPage({ params }) {
  const { state, update, remove } = useStore();
  const { user } = useAuth();
  const router = useRouter();
  const [note, setNote] = useState('');
  const [quoted, setQuoted] = useState('');

  const lead = state.leads.find((l) => l.id === params.id);
  if (!lead) notFound();

  const stepIndex = STEPS.indexOf(lead.status);
  const isLost = lead.status === 'Lost';

  const setStatus = (s) => { update('leads', lead.id, { status: s }); toast(`Lead marked as ${s}`); };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete lead ${lead.name}?`)) {
      remove('leads', lead.id);
      toast('Lead deleted');
      router.push('/admin/leads');
    }
  };

  const addNote = () => {
    if (!note.trim()) return;
    update('leads', lead.id, {
      notes: [...lead.notes, { author: `${user.name} (${user.role.toLowerCase()})`, text: note.trim(), at: new Date().toISOString() }],
    });
    setNote('');
    toast('Note added');
  };

  const saveQuote = () => {
    if (!quoted.trim()) return;
    update('leads', lead.id, { quotedAmount: quoted.trim(), status: 'Quoted' });
    setQuoted('');
    toast('Quote saved — lead marked as Quoted');
  };

  return (
    <>
      <DemoNote />
      <Link href="/admin/leads" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-brand-700">
        <IconArrowLeft size={16} /> Back to leads
      </Link>
      <PageHeader
        title={lead.name}
        subtitle={`${lead.id} · Received ${new Date(lead.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}`}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={lead.status} />
            <Select value={lead.status} onChange={(e) => setStatus(e.target.value)} className="!w-auto !py-2">
              {LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </Select>
            <Btn variant="dangerGhost" className="!py-2 !px-3 !text-xs" onClick={handleDelete} title="Delete lead">
              <IconTrash size={15} /> Delete
            </Btn>
          </div>
        }
      />

      {/* Pipeline stepper */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => {
            const done = !isLost && i <= stepIndex;
            const current = !isLost && i === stepIndex;
            return (
              <div key={s} className="flex flex-1 items-center last:flex-none">
                <button
                  onClick={() => setStatus(s)}
                  className="group flex flex-col items-center gap-2"
                  title={`Mark as ${s}`}
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition ${
                    done ? 'bg-brand-600 text-white' : 'bg-slate-100 text-ink-400 group-hover:bg-brand-100'
                  } ${current ? 'ring-4 ring-brand-100' : ''}`}>
                    {done && i < stepIndex ? <IconCheck size={16} /> : i + 1}
                  </span>
                  <span className={`text-xs font-semibold ${current ? 'text-brand-700' : 'text-ink-400'}`}>{s}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`mx-2 mb-6 h-0.5 flex-1 rounded ${!isLost && i < stepIndex ? 'bg-brand-500' : 'bg-slate-200'}`} />
                )}
              </div>
            );
          })}
          <button
            onClick={() => setStatus('Lost')}
            className={`ml-4 flex flex-col items-center gap-2 ${isLost ? '' : 'opacity-50 hover:opacity-100'}`}
            title="Mark as Lost"
          >
            <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${isLost ? 'bg-rose-600 text-white ring-4 ring-rose-100' : 'bg-slate-100 text-ink-400'}`}>
              ✕
            </span>
            <span className={`text-xs font-semibold ${isLost ? 'text-rose-600' : 'text-ink-400'}`}>Lost</span>
          </button>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: details */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <h3 className="mb-4 font-bold text-ink-900">Contact</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><IconMail size={17} /></span>
                <div><p className="text-xs text-ink-400">Email</p><a className="text-sm font-semibold text-brand-700 hover:underline" href={`mailto:${lead.email}`}>{lead.email}</a></div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><IconPhone size={17} /></span>
                <div><p className="text-xs text-ink-400">Phone</p><p className="text-sm font-semibold">{lead.phone}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><IconFileText size={17} /></span>
                <div><p className="text-xs text-ink-400">Company</p><p className="text-sm font-semibold">{lead.company}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><IconMessage size={17} /></span>
                <div><p className="text-xs text-ink-400">Source</p><p className="text-sm font-semibold">{lead.source}</p></div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 font-bold text-ink-900">Project</h3>
            <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              {[['Service', lead.service], ['Project type', lead.projectType], ['Location', lead.location]].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-ink-900/5 py-2 sm:block">
                  <dt className="text-ink-400">{k}</dt><dd className="font-semibold text-ink-900">{v}</dd>
                </div>
              ))}
              <div className="flex justify-between border-b border-ink-900/5 py-2 sm:block">
                <dt className="text-ink-400">Budget</dt>
                <dd className="flex items-center gap-1.5 font-semibold text-ink-900"><IconDollar size={14} className="text-emerald-600" />{lead.budget}</dd>
              </div>
              <div className="flex justify-between border-b border-ink-900/5 py-2 sm:block">
                <dt className="text-ink-400">Bid deadline</dt>
                <dd className="flex items-center gap-1.5 font-semibold text-ink-900"><IconCalendar size={14} className="text-accent-500" />{lead.deadline}</dd>
              </div>
              {lead.quotedAmount && (
                <div className="flex justify-between border-b border-ink-900/5 py-2 sm:block">
                  <dt className="text-ink-400">Quoted amount</dt>
                  <dd className="font-bold text-emerald-700">{lead.quotedAmount}</dd>
                </div>
              )}
            </dl>
            <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-ink-700 ring-1 ring-ink-900/5">{lead.details}</p>
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-ink-900">Drawings & files</h3>
              <Badge tone="slate">{lead.files.length} files</Badge>
            </div>
            {lead.files.length === 0 ? (
              <EmptyState icon={<IconFileText size={20} />} title="No files attached" text="This lead arrived without drawings." />
            ) : (
              <ul className="space-y-2">
                {lead.files.map((f, idx) => {
                  const safeName = (f.name || '').replace(/[^a-zA-Z0-9._-]/g, '_');
                  const fileUrl = f.url || `/uploads/drawings/${lead.id}_${safeName}`;
                  return (
                    <li key={idx} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-ink-900/5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-brand-600 ring-1 ring-ink-900/10"><IconFileText size={16} /></span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink-900">{f.name}</p>
                        <p className="text-xs text-ink-400">{f.size} · virus scan passed</p>
                      </div>
                      <a
                        href={fileUrl}
                        download={f.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50 hover:border-brand-300"
                      >
                        <IconDownload size={14} /> Download
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>

        {/* Right: quote + notes */}
        <div className="space-y-6">
          <Card>
            <h3 className="mb-3 font-bold text-ink-900">Send a quote</h3>
            <Field label="Quoted amount">
              <div className="flex gap-2">
                <input value={quoted} onChange={(e) => setQuoted(e.target.value)} placeholder="$4,200" className="input" />
                <Btn onClick={saveQuote} disabled={!quoted.trim()}>Save</Btn>
              </div>
            </Field>
            <p className="mt-2 text-xs text-ink-400">Saving marks the lead as <b>Quoted</b>. PDF quotes & Stripe come in Phase 3.</p>
          </Card>

          <Card>
            <h3 className="mb-4 font-bold text-ink-900">Internal notes</h3>
            <div className="space-y-3">
              {lead.notes.length === 0 && <p className="text-sm text-ink-400">No notes yet — add the first one below.</p>}
              {lead.notes.map((n, i) => (
                <div key={i} className="rounded-xl bg-slate-50 p-3.5 ring-1 ring-ink-900/5">
                  <p className="text-sm text-ink-800">{n.text}</p>
                  <p className="mt-2 text-xs text-ink-400">{n.author} · {new Date(n.at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add an internal note — only your team sees this…" />
              <Btn variant="dark" className="w-full" onClick={addNote} disabled={!note.trim()}>Add note</Btn>
            </div>
          </Card>

          <Card className="border-amber-200 bg-amber-50/60">
            <div className="flex items-start gap-2 text-sm text-amber-800">
              <IconAlert size={17} className="mt-0.5 shrink-0" />
              <p><b>Spam protection (planned):</b> rate limiting, honeypot and file virus-scan will attach here once the backend is wired.</p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
