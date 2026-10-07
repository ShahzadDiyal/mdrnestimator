'use client';
// Chatbot management: business facts, transcripts, limits & model.
// Demo UI only — store persists to localStorage, no backend integration.

import { useState } from 'react';
import { useStore } from '@/components/admin/store';
import {
  PageHeader, Card, Btn, Badge, Field, Input, Textarea, Select, Toggle, Tabs,
  Modal, DemoNote, TableWrap, thCls, tdCls, toast,
} from '@/components/admin/ui';
import { IconPlus, IconTrash, IconBot, IconMessage, IconChart } from '@/components/admin/icons';

function FactRow({ fact, onSave, onDelete }) {
  const [key, setKey] = useState(fact.key);
  const [value, setValue] = useState(fact.value);
  const dirty = key !== fact.key || value !== fact.value;
  return (
    <Card>
      <div className="flex flex-col gap-4 md:flex-row">
        <Field label="Key" className="md:w-64 md:shrink-0">
          <Input value={key} onChange={(e) => setKey(e.target.value)} placeholder="e.g. Turnaround" />
        </Field>
        <Field label="Answer" className="flex-1">
          <Textarea value={value} onChange={(e) => setValue(e.target.value)} rows={3} placeholder="What Ryan should answer…" />
        </Field>
        <div className="flex items-start gap-2 md:pt-7">
          <Btn variant={dirty ? 'primary' : 'ghost'} disabled={!dirty} onClick={() => onSave(fact.id, { key, value })}>
            Save
          </Btn>
          <button
            onClick={() => onDelete(fact.id)}
            className="rounded-xl p-2.5 text-ink-400 ring-1 ring-ink-900/10 hover:bg-rose-50 hover:text-rose-600"
            aria-label={`Delete ${fact.key}`}
          >
            <IconTrash size={17} />
          </button>
        </div>
      </div>
    </Card>
  );
}

const MODEL_OPTIONS = [
  { value: 'claude-haiku-4-5', label: 'claude-haiku-4-5 — cheapest' },
  { value: 'claude-sonnet-4-6', label: 'claude-sonnet-4-6 — balanced' },
  { value: 'claude-opus-4-8', label: 'claude-opus-4-8 — most expensive' },
];

export default function ChatbotPage() {
  const { state, setCol, update, add, remove } = useStore();
  const [tab, setTab] = useState('facts');
  const [viewing, setViewing] = useState(null);

  const bot = state.chatbot;
  const [limits, setLimits] = useState({
    model: bot.model,
    monthlyBudget: bot.monthlyBudget,
    rateLimit: bot.rateLimit,
    enabled: bot.enabled,
    leadCapture: bot.leadCapture,
  });
  const spent = Number(bot.spentThisMonth) || 0;
  const budget = Number(bot.monthlyBudget) || 1;
  const pct = Math.min(100, Math.round((spent / budget) * 100));

  const saveFact = (id, patch) => {
    update('facts', id, patch);
    toast('Fact updated');
  };
  const deleteFact = (id) => {
    remove('facts', id);
    toast('Fact deleted');
  };
  const addFact = () => {
    const id = add('facts', { key: '', value: '' });
    toast('Fact added — fill it in and hit Save');
    return id;
  };

  const saveLimits = () => {
    setCol('chatbot', { ...bot, ...limits, monthlyBudget: Number(limits.monthlyBudget) || 0 });
    toast('Chatbot settings saved');
  };

  const fmtDate = (iso) => {
    try { return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }); }
    catch { return iso; }
  };

  return (
    <div>
      <DemoNote />
      <PageHeader
        title="Chatbot"
        subtitle="Manage Ryan's business facts, review transcripts, and control model & spending limits."
        actions={tab === 'facts' ? (
          <Btn onClick={addFact}><IconPlus size={16} /> Add fact</Btn>
        ) : undefined}
      />

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'facts', label: 'Business facts', icon: <IconBot size={16} /> },
          { id: 'transcripts', label: 'Transcripts', icon: <IconMessage size={16} /> },
          { id: 'limits', label: 'Limits & model', icon: <IconChart size={16} /> },
        ]}
      />

      {tab === 'facts' && (
        <div className="space-y-4">
          <p className="text-sm text-ink-500">These facts power the Ryan chatbot's answers. Keep them short — Ryan quotes them verbatim.</p>
          {state.facts.map((f) => (
            <FactRow key={f.id} fact={f} onSave={saveFact} onDelete={deleteFact} />
          ))}
          {state.facts.length === 0 && (
            <Card className="text-center text-sm text-ink-500">No facts yet — add one to teach Ryan something.</Card>
          )}
        </div>
      )}

      {tab === 'transcripts' && (
        <TableWrap>
          <thead>
            <tr className="border-b border-ink-900/5 bg-slate-50/60">
              <th className={thCls}>ID</th>
              <th className={thCls}>Visitor</th>
              <th className={thCls}>Messages</th>
              <th className={thCls}>Lead captured</th>
              <th className={thCls}>Cost</th>
              <th className={thCls}>Date</th>
            </tr>
          </thead>
          <tbody>
            {state.transcripts.map((t) => (
              <tr
                key={t.id}
                onClick={() => setViewing(t)}
                className="cursor-pointer border-b border-ink-900/5 last:border-0 hover:bg-slate-50"
              >
                <td className={`${tdCls} font-semibold text-brand-700`}>{t.id}</td>
                <td className={tdCls}>{t.visitor}</td>
                <td className={tdCls}>{t.messages}</td>
                <td className={tdCls}>
                  <Badge tone={t.leadCaptured ? 'green' : 'slate'}>{t.leadCaptured ? 'Yes' : 'No'}</Badge>
                </td>
                <td className={tdCls}>{t.cost}</td>
                <td className={tdCls}>{fmtDate(t.started)}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}

      {tab === 'limits' && (
        <Card className="max-w-2xl space-y-5">
          <Field label="Model" hint="claude-opus-4-8 is the most expensive option for a public widget; Haiku or Sonnet are cheaper.">
            <Select value={limits.model} onChange={(e) => setLimits({ ...limits, model: e.target.value })}>
              {MODEL_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </Field>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="label">Monthly budget</p>
              <p className="text-sm font-semibold text-ink-900">
                ${spent.toFixed(2)} <span className="font-normal text-ink-400">of ${budget.toFixed(2)} spent</span>
              </p>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all ${pct > 90 ? 'bg-rose-500' : pct > 70 ? 'bg-amber-500' : 'bg-brand-600'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-3 max-w-xs">
              <Input
                type="number"
                min="0"
                value={limits.monthlyBudget}
                onChange={(e) => setLimits({ ...limits, monthlyBudget: e.target.value })}
                placeholder="50"
              />
            </div>
          </div>

          <Field label="Rate limit">
            <Input value={limits.rateLimit} onChange={(e) => setLimits({ ...limits, rateLimit: e.target.value })} placeholder="30 messages / visitor / day" />
          </Field>

          <div className="space-y-3 border-t border-ink-900/5 pt-5">
            <Toggle checked={limits.enabled} onChange={(v) => setLimits({ ...limits, enabled: v })} label="Chatbot enabled" />
            <Toggle checked={limits.leadCapture} onChange={(v) => setLimits({ ...limits, leadCapture: v })} label="Capture leads from chats" />
          </div>

          <div className="flex justify-end border-t border-ink-900/5 pt-5">
            <Btn onClick={saveLimits}>Save changes</Btn>
          </div>
        </Card>
      )}

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing ? `Transcript ${viewing.id}` : ''}>
        {viewing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="label">Visitor</p><p className="font-medium text-ink-900">{viewing.visitor}</p></div>
              <div><p className="label">Date</p><p className="font-medium text-ink-900">{fmtDate(viewing.started)}</p></div>
              <div><p className="label">Messages</p><p className="font-medium text-ink-900">{viewing.messages}</p></div>
              <div><p className="label">Cost</p><p className="font-medium text-ink-900">{viewing.cost}</p></div>
            </div>
            <div>
              <p className="label">Summary</p>
              <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-ink-700">{viewing.summary}</p>
            </div>
            <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-800 ring-1 ring-amber-200">
              The full message log viewer ships with the backend. Transcripts are stored once chat logging is connected.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
