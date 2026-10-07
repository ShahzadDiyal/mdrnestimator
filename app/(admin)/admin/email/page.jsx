'use client';
// Email & notifications: provider setup (API), templates (API), notification toggles (API).

import { useEffect, useState } from 'react';
import { useStore } from '@/components/admin/store';
import {
  PageHeader, Card, Btn, Badge, Field, Input, Textarea, Select, Toggle, Tabs,
  Drawer, Modal, ConfirmState, TableWrap, thCls, tdCls,
  EmptyState, StatusBadge, SearchInput, toast,
} from '@/components/admin/ui';
import { IconEdit, IconTrash, IconMail, IconFileText, IconBell, IconPlus, IconRefresh } from '@/components/admin/icons';

const PROVIDERS = ['Resend', 'SendGrid', 'Amazon SES', 'Mailgun', 'Postmark'];
const VARIABLES = ['{{name}}', '{{company}}', '{{service}}', '{{projectType}}', '{{leadId}}', '{{quotedAmount}}', '{{date}}'];

const NOTIF_ROWS = [
  { key: 'notifyTeam', title: 'Email the team on new lead', hint: 'Notify estimators the moment a quote request arrives.' },
  { key: 'autoReply', title: 'Auto-reply to client', hint: 'Send the "we received your request" email instantly.' },
  { key: 'whatsappAlerts', title: 'WhatsApp alerts', hint: 'Push new-lead alerts to the team WhatsApp number.' },
  { key: 'slackAlerts', title: 'Slack alerts', hint: 'Post new leads to the #leads Slack channel.' },
  { key: 'newsletter', title: 'Follow-up newsletter sequence', hint: 'Drip follow-ups to cold leads until they convert.' },
];

const emptyTplForm = { name: '', subject: '', body: '', status: 'Active' };

export default function EmailPage() {
  const { state, setCol, update, add, remove } = useStore();
  const [tab, setTab] = useState('setup');
  const [editing, setEditing] = useState(null); // template being edited in drawer
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [tplForm, setTplForm] = useState({ subject: '', body: '' });
  const [createForm, setCreateForm] = useState(emptyTplForm);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [setup, setSetup] = useState({ provider: '', fromName: '', fromEmail: '' });
  const [q, setQ] = useState('');

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/emailTemplates');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch templates');
      if (Array.isArray(data.templates)) setCol('emailTemplates', data.templates);
    } catch (err) {
      console.error('Error fetching templates:', err);
      toast(err.message || 'Failed to fetch templates from database');
    } finally {
      setLoading(false);
    }
  };

  const seedTemplates = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/emailTemplates/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed templates');
      toast(data.message || 'Seeded templates successfully!');
      await fetchTemplates();
    } catch (err) {
      toast(err.message || 'Error seeding templates');
    } finally {
      setSeeding(false);
    }
  };

  const fetchSettings = async () => {
    setSettingsLoading(true);
    try {
      const res = await fetch('/api/emailSettings');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch email settings');
      if (data.data) {
        setCol('emailSettings', data.data);
        setSetup({
          provider: data.data.provider || '',
          fromName: data.data.fromName || '',
          fromEmail: data.data.fromEmail || '',
        });
      }
    } catch (err) {
      console.error('Error fetching email settings:', err);
      toast(err.message || 'Failed to fetch email settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const seedSettings = async () => {
    try {
      const res = await fetch('/api/emailSettings/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed email settings');
      toast(data.message || 'Seeded email settings successfully!');
      await fetchSettings();
    } catch (err) {
      toast(err.message || 'Error seeding email settings');
    }
  };

  useEffect(() => {
    fetchTemplates();
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const templates = Array.isArray(state.emailTemplates) ? state.emailTemplates : [];
  const es = state.emailSettings || {};

  const filteredTemplates = templates.filter((t) => {
    const needle = q.trim().toLowerCase();
    return !needle || `${t.name} ${t.subject}`.toLowerCase().includes(needle);
  });

  const saveSetup = async () => {
    setSettingsSaving(true);
    try {
      const res = await fetch('/api/emailSettings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setup),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save email setup');
      setCol('emailSettings', { ...es, ...setup });
      toast('Email setup saved');
    } catch (err) {
      toast(err.message || 'Error saving email setup');
    } finally {
      setSettingsSaving(false);
    }
  };

  const openEdit = (tpl) => {
    setTplForm({ subject: tpl.subject || '', body: tpl.body || '' });
    setEditing(tpl);
  };

  const saveTemplate = async () => {
    try {
      const res = await fetch(`/api/emailTemplates/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tplForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save template');
      update('emailTemplates', editing.id, { ...tplForm });
      setEditing(null);
      toast('Template saved');
    } catch (err) {
      toast(err.message || 'Error saving template');
    }
  };

  const createTemplate = async () => {
    if (!createForm.name.trim()) { toast('Template name is required'); return; }
    try {
      const res = await fetch('/api/emailTemplates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: createForm.name.trim(),
          subject: createForm.subject.trim(),
          body: createForm.body,
          status: createForm.status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create template');
      const created = data.template || data.data || { id: `template-${Date.now()}`, ...createForm };
      add('emailTemplates', created);
      setCreating(false);
      setCreateForm(emptyTplForm);
      toast('Template created');
    } catch (err) {
      toast(err.message || 'Error creating template');
    }
  };

  const toggleStatus = async (tpl) => {
    const next = tpl.status === 'Active' ? 'Paused' : 'Active';
    try {
      const res = await fetch(`/api/emailTemplates/${tpl.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status');
      update('emailTemplates', tpl.id, { status: next });
      toast(`Template ${next.toLowerCase()}`);
    } catch (err) {
      toast(err.message || 'Error updating template');
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      const res = await fetch(`/api/emailTemplates/${deleting.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete template');
      remove('emailTemplates', deleting.id);
      toast('Template deleted');
    } catch (err) {
      toast(err.message || 'Error deleting template');
    } finally {
      setDeleting(null);
    }
  };

  const flipNotif = async (key, title) => {
    const next = !es[key];
    try {
      const res = await fetch('/api/emailSettings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update notification');
      setCol('emailSettings', { ...es, [key]: next });
      toast(`${title} ${next ? 'on' : 'off'}`);
    } catch (err) {
      toast(err.message || 'Error updating notification');
    }
  };

  return (
    <div>
      <PageHeader
        title="Email & notifications"
        subtitle="Choose the email service, edit templates, and control who gets notified when leads arrive."
        actions={tab === 'templates' ? (
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={fetchTemplates} disabled={loading}>
              <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Btn>
            <Btn variant="ghost" onClick={seedTemplates} disabled={seeding}>
              <IconRefresh size={16} className={seeding ? 'animate-spin' : ''} /> Seed
            </Btn>
            <Btn onClick={() => setCreating(true)}><IconPlus size={16} /> New template</Btn>
          </div>
        ) : (
          <Btn variant="ghost" onClick={seedSettings}>
            <IconRefresh size={16} /> Seed
          </Btn>
        )}
      />

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'setup', label: 'Setup', icon: <IconMail size={16} /> },
          { id: 'templates', label: 'Templates', icon: <IconFileText size={16} /> },
          { id: 'notifications', label: 'Notifications', icon: <IconBell size={16} /> },
        ]}
      />

      {tab === 'setup' && (
        <Card className="max-w-2xl space-y-5">
          {settingsLoading ? (
            <p className="py-8 text-center text-sm text-ink-500">Loading…</p>
          ) : (
            <>
              <Field label="Email provider" hint="The email service used to send team alerts, auto-replies and quotes.">
                <Select value={setup.provider} onChange={(e) => setSetup({ ...setup, provider: e.target.value })}>
                  {PROVIDERS.map((p) => <option key={p} value={p}>{p}</option>)}
                </Select>
              </Field>
              <Field label="From name">
                <Input value={setup.fromName} onChange={(e) => setSetup({ ...setup, fromName: e.target.value })} placeholder="Modern Estimator" />
              </Field>
              <Field label="From email" hint="Use a verified sending domain to avoid spam folders.">
                <Input type="email" value={setup.fromEmail} onChange={(e) => setSetup({ ...setup, fromEmail: e.target.value })} placeholder="quotes@modernestimator.com" />
              </Field>
              <div className="flex justify-end border-t border-ink-900/5 pt-5">
                <Btn onClick={saveSetup} disabled={settingsSaving}>{settingsSaving ? 'Saving…' : 'Save changes'}</Btn>
              </div>
            </>
          )}
        </Card>
      )}

      {tab === 'templates' && (
        <>
          <div className="mb-5 max-w-md">
            <SearchInput value={q} onChange={setQ} placeholder="Search templates…" />
          </div>
          {loading && filteredTemplates.length === 0 ? (
            <Card className="py-10 text-center text-sm text-ink-500">Loading templates…</Card>
          ) : filteredTemplates.length === 0 ? (
            <EmptyState
              icon={<IconFileText size={22} />}
              title="No templates found"
              text="Seed the database to restore the default email templates, or create a new one."
              action={(
                <div className="flex items-center gap-2">
                  <Btn variant="ghost" onClick={seedTemplates} disabled={seeding}>Seed templates</Btn>
                  <Btn onClick={() => setCreating(true)}><IconPlus size={16} /> New template</Btn>
                </div>
              )}
            />
          ) : (
            <TableWrap>
              <thead>
                <tr className="border-b border-ink-900/5 bg-slate-50/60">
                  <th className={thCls}>Template name</th>
                  <th className={thCls}>Subject</th>
                  <th className={thCls}>Status</th>
                  <th className={`${thCls} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTemplates.map((tpl) => (
                  <tr key={tpl.id} className="border-b border-ink-900/5 last:border-0 hover:bg-slate-50">
                    <td className={`${tdCls} font-semibold text-ink-900`}>{tpl.name}</td>
                    <td className={tdCls}>{tpl.subject}</td>
                    <td className={tdCls}>
                      <div className="flex items-center gap-2">
                        <Toggle checked={tpl.status === 'Active'} onChange={() => toggleStatus(tpl)} />
                        <StatusBadge status={tpl.status || 'Active'} />
                      </div>
                    </td>
                    <td className={tdCls}>
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(tpl)}
                          className="rounded-lg p-2 text-ink-400 hover:bg-brand-50 hover:text-brand-700"
                          aria-label={`Edit ${tpl.name}`}
                        >
                          <IconEdit size={17} />
                        </button>
                        <button
                          onClick={() => setDeleting(tpl)}
                          className="rounded-lg p-2 text-ink-400 hover:bg-rose-50 hover:text-rose-600"
                          aria-label={`Delete ${tpl.name}`}
                        >
                          <IconTrash size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          )}
        </>
      )}

      {tab === 'notifications' && (
        <Card className="max-w-2xl divide-y divide-ink-900/5 p-0">
          {settingsLoading ? (
            <p className="py-8 text-center text-sm text-ink-500">Loading…</p>
          ) : NOTIF_ROWS.map((row) => (
            <div key={row.key} className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-ink-900">{row.title}</p>
                <p className="mt-0.5 text-xs text-ink-500">{row.hint}</p>
              </div>
              <Toggle
                checked={!!es[row.key]}
                onChange={() => flipNotif(row.key, row.title)}
              />
            </div>
          ))}
        </Card>
      )}

      <Drawer
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing ? `Edit — ${editing.name}` : ''}
        footer={
          <>
            <Btn variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn>
            <Btn onClick={saveTemplate}>Save template</Btn>
          </>
        }
      >
        <div className="space-y-5">
          <Field label="Subject">
            <Input value={tplForm.subject} onChange={(e) => setTplForm({ ...tplForm, subject: e.target.value })} />
          </Field>
          <Field label="Body">
            <Textarea rows={14} value={tplForm.body} onChange={(e) => setTplForm({ ...tplForm, body: e.target.value })} className="font-mono text-[13px]" />
          </Field>
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">Available variables</p>
            <div className="flex flex-wrap gap-1.5">
              {VARIABLES.map((v) => (
                <Badge key={v} tone="brand"><code>{v}</code></Badge>
              ))}
            </div>
          </div>
        </div>
      </Drawer>

      <Modal open={creating} onClose={() => setCreating(false)} title="New template" wide>
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Template name">
              <Input value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} placeholder="e.g. Quote follow-up" />
            </Field>
            <Field label="Status">
              <Select value={createForm.status} onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}>
                <option>Active</option>
                <option>Paused</option>
              </Select>
            </Field>
          </div>
          <Field label="Subject">
            <Input value={createForm.subject} onChange={(e) => setCreateForm({ ...createForm, subject: e.target.value })} placeholder="Subject line — supports {{variables}}" />
          </Field>
          <Field label="Body">
            <Textarea rows={12} value={createForm.body} onChange={(e) => setCreateForm({ ...createForm, body: e.target.value })} className="font-mono text-[13px]" placeholder="Email body…" />
          </Field>
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">Available variables</p>
            <div className="flex flex-wrap gap-1.5">
              {VARIABLES.map((v) => (
                <Badge key={v} tone="brand"><code>{v}</code></Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setCreating(false)}>Cancel</Btn>
          <Btn onClick={createTemplate}><IconPlus size={16} /> Create template</Btn>
        </div>
      </Modal>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="">
        {deleting && (
          <ConfirmState
            title="Delete template?"
            text={`"${deleting.name}" will be removed. Leads arriving without it won't get that email.`}
            onCancel={() => setDeleting(null)}
            onConfirm={confirmDelete}
          />
        )}
      </Modal>
    </div>
  );
}
