'use client';
// Chatbot management: business facts (API), transcripts (read-only), limits & model (API).

import { useEffect, useState } from 'react';
import { useStore } from '@/components/admin/store';
import {
  PageHeader, Card, Btn, Badge, Field, Input, Textarea, Select, Toggle, Tabs,
  Modal, TableWrap, thCls, tdCls, toast,
} from '@/components/admin/ui';
import { IconPlus, IconTrash, IconBot, IconMessage, IconChart, IconRefresh } from '@/components/admin/icons';

function FactRow({ fact, onSave, onDelete }) {
  const [key, setKey] = useState(fact.key || '');
  const [value, setValue] = useState(fact.value || '');
  const [saving, setSaving] = useState(false);
  const dirty = key !== (fact.key || '') || value !== (fact.value || '');

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(fact.id, { key: key.trim(), value: value.trim() });
    } finally {
      setSaving(false);
    }
  };

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
          <Btn variant={dirty ? 'primary' : 'ghost'} disabled={!dirty || saving} onClick={handleSave}>
            {saving ? 'Saving…' : 'Save'}
          </Btn>
          <button
            onClick={() => onDelete(fact)}
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
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [limitsLoading, setLimitsLoading] = useState(true);
  const [limitsSaving, setLimitsSaving] = useState(false);
  const [limits, setLimits] = useState({ model: '', monthlyBudget: '', rateLimit: '', enabled: false, leadCapture: false });

  const fetchFacts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/chatbotFacts');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch facts');
      if (Array.isArray(data.facts)) setCol('chatbotFacts', data.facts);
    } catch (err) {
      console.error('Error fetching facts:', err);
      toast(err.message || 'Failed to fetch facts from database');
    } finally {
      setLoading(false);
    }
  };

  const seedFacts = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/chatbotFacts/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed facts');
      toast(data.message || 'Seeded facts successfully!');
      await fetchFacts();
    } catch (err) {
      toast(err.message || 'Error seeding facts');
    } finally {
      setSeeding(false);
    }
  };

  const fetchSettings = async () => {
    setLimitsLoading(true);
    try {
      const res = await fetch('/api/chatbotSettings');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch chatbot settings');
      if (data.data) {
        setLimits({
          model: data.data.model || '',
          monthlyBudget: data.data.monthlyBudget ?? '',
          rateLimit: data.data.rateLimit || '',
          enabled: !!data.data.enabled,
          leadCapture: !!data.data.leadCapture,
        });
      }
    } catch (err) {
      console.error('Error fetching chatbot settings:', err);
      toast(err.message || 'Failed to fetch chatbot settings');
    } finally {
      setLimitsLoading(false);
    }
  };

  const seedSettings = async () => {
    try {
      const res = await fetch('/api/chatbotSettings/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed chatbot settings');
      toast(data.message || 'Seeded chatbot settings successfully!');
      await fetchSettings();
    } catch (err) {
      toast(err.message || 'Error seeding chatbot settings');
    }
  };

  useEffect(() => {
    fetchFacts();
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const facts = Array.isArray(state.chatbotFacts) ? state.chatbotFacts : [];
  const transcripts = Array.isArray(state.transcripts) ? state.transcripts : [];

  const saveFact = async (id, patch) => {
    if (!patch.key) { toast('Key is required'); return; }
    try {
      const res = await fetch(`/api/chatbotFacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save fact');
      update('chatbotFacts', id, patch);
      toast('Fact updated');
    } catch (err) {
      toast(err.message || 'Error saving fact');
    }
  };

  const deleteFact = (fact) => setDeleting(fact);

  const confirmDeleteFact = async () => {
    if (!deleting) return;
    try {
      const res = await fetch(`/api/chatbotFacts/${deleting.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete fact');
      remove('chatbotFacts', deleting.id);
      toast('Fact deleted');
    } catch (err) {
      toast(err.message || 'Error deleting fact');
    } finally {
      setDeleting(null);
    }
  };

  const addFact = async () => {
    try {
      const res = await fetch('/api/chatbotFacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'New fact', value: '', status: 'Published' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add fact');
      const created = data.fact || data.data || { id: `fact-${Date.now()}`, key: 'New fact', value: '' };
      add('chatbotFacts', created);
      toast('Fact added — fill it in and hit Save');
    } catch (err) {
      toast(err.message || 'Error adding fact');
    }
  };

  const saveLimits = async () => {
    setLimitsSaving(true);
    try {
      const res = await fetch('/api/chatbotSettings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...limits, monthlyBudget: Number(limits.monthlyBudget) || 0 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save chatbot settings');
      toast('Chatbot settings saved');
    } catch (err) {
      toast(err.message || 'Error saving chatbot settings');
    } finally {
      setLimitsSaving(false);
    }
  };

  const fmtDate = (iso) => {
    try { return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }); }
    catch { return iso; }
  };

  return (
    <div>
      <PageHeader
        title="Chatbot"
        subtitle="Manage Ryan's business facts, review transcripts, and control model & spending limits."
        actions={(
          <div className="flex items-center gap-2">
            {tab === 'facts' && (
              <>
                <Btn variant="ghost" onClick={fetchFacts} disabled={loading}>
                  <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
                </Btn>
                <Btn variant="ghost" onClick={seedFacts} disabled={seeding}>
                  <IconRefresh size={16} className={seeding ? 'animate-spin' : ''} /> Seed
                </Btn>
                <Btn onClick={addFact}><IconPlus size={16} /> Add fact</Btn>
              </>
            )}
            {tab === 'limits' && (
              <Btn variant="ghost" onClick={seedSettings}>
                <IconRefresh size={16} /> Seed
              </Btn>
            )}
          </div>
        )}
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
          {loading && facts.length === 0 && (
            <Card className="text-center text-sm text-ink-500">Loading facts…</Card>
          )}
          {facts.map((f) => (
            <FactRow key={f.id} fact={f} onSave={saveFact} onDelete={deleteFact} />
          ))}
          {facts.length === 0 && !loading && (
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
            {transcripts.map((t) => (
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
          {limitsLoading ? (
            <p className="py-8 text-center text-sm text-ink-500">Loading…</p>
          ) : (
            <>
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
                    ${Number(limits.monthlyBudget || 0).toFixed(2)} <span className="font-normal text-ink-400">budget</span>
                  </p>
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
                <Btn onClick={saveLimits} disabled={limitsSaving}>{limitsSaving ? 'Saving…' : 'Save changes'}</Btn>
              </div>
            </>
          )}
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

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete fact">
        <div className="text-center">
          <h4 className="font-bold text-ink-900">Delete this fact?</h4>
          <p className="mt-1 text-sm text-ink-500">"{deleting?.key}" will be permanently removed. Ryan will no longer know this.</p>
          <div className="mt-5 flex justify-center gap-2">
            <Btn variant="ghost" onClick={() => setDeleting(null)}>Cancel</Btn>
            <Btn variant="danger" onClick={confirmDeleteFact}>Delete</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}
