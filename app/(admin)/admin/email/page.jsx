'use client';
// Email & notifications: provider setup, templates, notification toggles.
// Demo UI only — store persists to localStorage, no backend integration.

import { useState } from 'react';
import { useStore } from '@/components/admin/store';
import {
  PageHeader, Card, Btn, Badge, Field, Input, Textarea, Select, Toggle, Tabs,
  Drawer, Modal, DemoNote, ConfirmState, TableWrap, thCls, tdCls, toast,
} from '@/components/admin/ui';
import { IconEdit, IconTrash, IconMail, IconFileText, IconBell } from '@/components/admin/icons';

const PROVIDERS = ['Resend', 'SendGrid', 'Amazon SES', 'Mailgun', 'Postmark'];
const VARIABLES = ['{{name}}', '{{company}}', '{{service}}', '{{projectType}}', '{{leadId}}', '{{quotedAmount}}', '{{date}}'];

const NOTIF_ROWS = [
  { key: 'notifyTeam', title: 'Email the team on new lead', hint: 'Notify estimators the moment a quote request arrives.' },
  { key: 'autoReply', title: 'Auto-reply to client', hint: 'Send the "we received your request" email instantly.' },
  { key: 'whatsappAlerts', title: 'WhatsApp alerts', hint: 'Push new-lead alerts to the team WhatsApp number.' },
  { key: 'slackAlerts', title: 'Slack alerts', hint: 'Post new leads to the #leads Slack channel.' },
  { key: 'newsletter', title: 'Follow-up newsletter sequence', hint: 'Drip follow-ups to cold leads until they convert.' },
];

export default function EmailPage() {
  const { state, setCol, update, remove } = useStore();
  const [tab, setTab] = useState('setup');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const es = state.emailSettings;
  const [setup, setSetup] = useState({ provider: es.provider, fromName: es.fromName, fromEmail: es.fromEmail });
  const [tplForm, setTplForm] = useState({ subject: '', body: '' });

  const saveSetup = () => {
    setCol('emailSettings', { ...es, ...setup });
    toast('Email setup saved');
  };

  const openEdit = (tpl) => {
    setTplForm({ subject: tpl.subject, body: tpl.body });
    setEditing(tpl);
  };
  const saveTemplate = () => {
    update('templates', editing.id, { ...tplForm });
    setEditing(null);
    toast('Template saved');
  };

  const toggleStatus = (tpl) => {
    const next = tpl.status === 'Active' ? 'Paused' : 'Active';
    update('templates', tpl.id, { status: next });
    toast(`Template ${next.toLowerCase()}`);
  };

  const confirmDelete = () => {
    remove('templates', deleting.id);
    setDeleting(null);
    toast('Template deleted');
  };

  const flipNotif = (key, title) => {
    setCol('emailSettings', { ...state.emailSettings, [key]: !state.emailSettings[key] });
    toast(`${title} ${state.emailSettings[key] ? 'off' : 'on'}`);
  };

  return (
    <div>
      <DemoNote />
      <PageHeader
        title="Email & notifications"
        subtitle="Choose the email service, edit templates, and control who gets notified when leads arrive."
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
            <Btn onClick={saveSetup}>Save changes</Btn>
          </div>
        </Card>
      )}

      {tab === 'templates' && (
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
            {state.templates.map((tpl) => (
              <tr key={tpl.id} className="border-b border-ink-900/5 last:border-0 hover:bg-slate-50">
                <td className={`${tdCls} font-semibold text-ink-900`}>{tpl.name}</td>
                <td className={tdCls}>{tpl.subject}</td>
                <td className={tdCls}>
                  <Toggle checked={tpl.status === 'Active'} onChange={() => toggleStatus(tpl)} />
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

      {tab === 'notifications' && (
        <Card className="max-w-2xl divide-y divide-ink-900/5 p-0">
          {NOTIF_ROWS.map((row) => (
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
