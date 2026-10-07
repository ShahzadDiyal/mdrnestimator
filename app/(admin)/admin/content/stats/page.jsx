'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/components/admin/store';
import {
  PageHeader, Card, Btn, Field, Input, Select, StatusBadge,
  EmptyState, Modal, ConfirmState, toast,
} from '@/components/admin/ui';
import { IconCheck, IconChart, IconPlus, IconTrash, IconRefresh } from '@/components/admin/icons';

const STATUS_OPTIONS = ['Published', 'Draft'];

function StatCard({ stat, onSaved, onDeleted }) {
  const [form, setForm] = useState({
    label: stat.label || '',
    value: stat.value || '',
    suffix: stat.suffix || '',
    status: stat.status || 'Published',
  });
  const [saving, setSaving] = useState(false);

  const dirty =
    form.label !== (stat.label || '') ||
    form.value !== (stat.value || '') ||
    form.suffix !== (stat.suffix || '') ||
    form.status !== (stat.status || 'Published');

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/stats/${stat.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: form.label.trim(),
          value: form.value.trim(),
          suffix: form.suffix,
          status: form.status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save stat');
      onSaved(stat.id, { label: form.label.trim(), value: form.value.trim(), suffix: form.suffix, status: form.status });
      toast('Stat saved');
    } catch (err) {
      toast(err.message || 'Error saving stat');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="flex flex-col">
      {/* Live counter preview */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <IconChart size={18} />
        </div>
        <div className="flex items-center gap-1.5">
          <StatusBadge status={form.status} />
          <button
            onClick={onDeleted}
            aria-label="Delete stat"
            className="rounded-lg p-1.5 text-ink-400 transition hover:bg-rose-50 hover:text-rose-600"
          >
            <IconTrash size={15} />
          </button>
        </div>
      </div>
      <p className="mt-3 truncate text-3xl font-extrabold tracking-tight text-ink-900">
        {form.value}
        <span className="text-brand-600">{form.suffix}</span>
      </p>
      <p className="mt-1 text-sm font-medium text-ink-500">{form.label || 'Untitled stat'}</p>

      <div className="mt-5 space-y-3 border-t border-ink-900/5 pt-4">
        <Field label="Label">
          <Input
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            placeholder="e.g. Projects estimated"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Value">
            <Input
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              placeholder="e.g. 4,800"
            />
          </Field>
          <Field label="Suffix">
            <Input
              value={form.suffix}
              onChange={(e) => setForm({ ...form, suffix: e.target.value })}
              placeholder="e.g. + or %"
            />
          </Field>
        </div>
        <Field label="Status" hint="Draft stats are hidden from the homepage.">
          <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </Field>
        <Btn onClick={save} disabled={!dirty || saving} className="w-full">
          <IconCheck size={16} /> {saving ? 'Saving…' : 'Save'}
        </Btn>
      </div>
    </Card>
  );
}

export default function StatsPage() {
  const { state, setCol, update, add, remove } = useStore();
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch stats');
      if (Array.isArray(data.stats)) setCol('stats', data.stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
      toast(err.message || 'Failed to fetch stats from database');
    } finally {
      setLoading(false);
    }
  };

  const seedStats = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/stats/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed stats');
      toast(data.message || 'Seeded stats successfully!');
      await fetchStats();
    } catch (err) {
      toast(err.message || 'Error seeding stats');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = Array.isArray(state.stats) ? state.stats : [];

  const addStat = async () => {
    try {
      const res = await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: 'New stat', value: '0', suffix: '+', status: 'Draft' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create stat');
      const created = data.stat || data.data || { id: `stat-${Date.now()}` };
      add('stats', created);
      toast('Stat added — edit it and hit Save');
    } catch (err) {
      toast(err.message || 'Error creating stat');
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      const res = await fetch(`/api/stats/${deleting.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete stat');
      remove('stats', deleting.id);
      toast('Stat deleted');
    } catch (err) {
      toast(err.message || 'Error deleting stat');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Stats & Counters"
        subtitle="These numbers feed the animated counters on the homepage. Each card saves independently."
        actions={(
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={fetchStats} disabled={loading}>
              <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Btn>
            <Btn variant="ghost" onClick={seedStats} disabled={seeding}>
              <IconRefresh size={16} className={seeding ? 'animate-spin' : ''} /> Seed
            </Btn>
            <Btn onClick={addStat}><IconPlus size={16} /> Add stat</Btn>
          </div>
        )}
      />
      {loading && stats.length === 0 ? (
        <Card className="py-10 text-center text-sm text-ink-500">Loading stats…</Card>
      ) : stats.length === 0 ? (
        <EmptyState
          icon={<IconChart size={22} />}
          title="No stats found"
          text="Seed the database to restore the default counters, or add a new stat."
          action={(
            <Btn variant="ghost" onClick={seedStats} disabled={seeding}>
              Seed stats
            </Btn>
          )}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <StatCard
              key={s.id}
              stat={s}
              onSaved={(id, patch) => update('stats', id, patch)}
              onDeleted={() => setDeleting(s)}
            />
          ))}
        </div>
      )}

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete stat">
        <ConfirmState
          title="Delete this stat?"
          text={`"${deleting?.label}" will be permanently removed from the database.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      </Modal>
    </>
  );
}
