'use client';

import { useState } from 'react';
import { useStore } from '@/components/admin/store';
import { PageHeader, Card, Btn, Field, Input, Select, StatusBadge, DemoNote, toast } from '@/components/admin/ui';
import { IconCheck, IconChart } from '@/components/admin/icons';

const STATUS_OPTIONS = ['Published', 'Draft'];

function StatCard({ stat }) {
  const { update } = useStore();
  const [form, setForm] = useState({
    label: stat.label,
    value: stat.value,
    suffix: stat.suffix,
    status: stat.status,
  });

  const dirty =
    form.label !== stat.label ||
    form.value !== stat.value ||
    form.suffix !== stat.suffix ||
    form.status !== stat.status;

  const save = () => {
    update('stats', stat.id, {
      label: form.label.trim(),
      value: form.value.trim(),
      suffix: form.suffix,
      status: form.status,
    });
    toast('Stat saved');
  };

  return (
    <Card className="flex flex-col">
      {/* Live counter preview */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <IconChart size={18} />
        </div>
        <StatusBadge status={form.status} />
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
        <Btn onClick={save} disabled={!dirty} className="w-full">
          <IconCheck size={16} /> Save
        </Btn>
      </div>
    </Card>
  );
}

export default function StatsPage() {
  const { state } = useStore();

  return (
    <>
      <DemoNote />
      <PageHeader
        title="Stats & Counters"
        subtitle="These numbers feed the animated counters on the homepage. Each card saves independently."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {state.stats.map((s) => (
          <StatCard key={s.id} stat={s} />
        ))}
      </div>
    </>
  );
}
