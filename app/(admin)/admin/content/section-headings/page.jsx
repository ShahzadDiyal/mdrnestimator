'use client';
// Section headings: the eyebrow / heading / subtitle trios of each homepage section.

import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@/components/admin/store';
import {
  PageHeader, Card, Btn, Field, Input, Textarea, Select, StatusBadge,
  SearchInput, EmptyState, Modal, ConfirmState, toast,
} from '@/components/admin/ui';
import { IconCheck, IconPen, IconPlus, IconTrash, IconRefresh } from '@/components/admin/icons';

const emptyForm = { section: '', eyebrow: '', heading: '', subtitle: '', status: 'Published' };

function HeadingCard({ item, onSaved, onDeleted }) {
  const [form, setForm] = useState({
    eyebrow: item.eyebrow || '',
    heading: item.heading || '',
    subtitle: item.subtitle || '',
    status: item.status || 'Published',
  });
  const [saving, setSaving] = useState(false);

  const dirty =
    form.eyebrow !== (item.eyebrow || '') ||
    form.heading !== (item.heading || '') ||
    form.subtitle !== (item.subtitle || '') ||
    form.status !== (item.status || 'Published');

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/sectionHeadings/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eyebrow: form.eyebrow.trim(),
          heading: form.heading.trim(),
          subtitle: form.subtitle.trim(),
          status: form.status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save heading');
      onSaved(item.id, { eyebrow: form.eyebrow.trim(), heading: form.heading.trim(), subtitle: form.subtitle.trim(), status: form.status });
      toast('Heading saved');
    } catch (err) {
      toast(err.message || 'Error saving heading');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Section</p>
          <h3 className="font-bold text-ink-900">{item.section}</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <StatusBadge status={form.status} />
          <button
            onClick={onDeleted}
            aria-label={`Delete ${item.section} heading`}
            className="rounded-lg p-1.5 text-ink-400 transition hover:bg-rose-50 hover:text-rose-600"
          >
            <IconTrash size={15} />
          </button>
        </div>
      </div>

      {/* Live preview */}
      <div className="rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-ink-900/5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-brand-600">{form.eyebrow || 'Eyebrow'}</p>
        <p className="mt-1 text-lg font-bold text-ink-900">{form.heading || 'Heading'}</p>
        <p className="mt-1 text-sm text-ink-500">{form.subtitle || 'Subtitle'}</p>
      </div>

      <Field label="Eyebrow">
        <Input value={form.eyebrow} onChange={(e) => setForm({ ...form, eyebrow: e.target.value })} placeholder="Small text above the heading" />
      </Field>
      <Field label="Heading">
        <Input value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} placeholder="Main section heading" />
      </Field>
      <Field label="Subtitle">
        <Textarea rows={2} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Supporting line under the heading" />
      </Field>
      <div className="flex items-end justify-between gap-3">
        <Field label="Status" className="w-40">
          <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option>Published</option>
            <option>Draft</option>
          </Select>
        </Field>
        <Btn onClick={save} disabled={!dirty || saving}>
          <IconCheck size={16} /> {saving ? 'Saving…' : 'Save'}
        </Btn>
      </div>
    </Card>
  );
}

export default function SectionHeadingsPage() {
  const { state, setCol, update, add, remove } = useStore();
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState(emptyForm);

  const fetchHeadings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sectionHeadings');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch headings');
      if (Array.isArray(data.headings)) setCol('sectionHeadings', data.headings);
    } catch (err) {
      console.error('Error fetching headings:', err);
      toast(err.message || 'Failed to fetch headings from database');
    } finally {
      setLoading(false);
    }
  };

  const seedHeadings = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/sectionHeadings/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed headings');
      toast(data.message || 'Seeded headings successfully!');
      await fetchHeadings();
    } catch (err) {
      toast(err.message || 'Error seeding headings');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchHeadings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headings = Array.isArray(state.sectionHeadings) ? state.sectionHeadings : [];

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return headings.filter(
      (h) => !needle || `${h.section} ${h.eyebrow} ${h.heading} ${h.subtitle}`.toLowerCase().includes(needle)
    );
  }, [headings, q]);

  const createHeading = async () => {
    if (!createForm.section.trim()) { toast('Section name is required'); return; }
    try {
      const res = await fetch('/api/sectionHeadings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: createForm.section.trim(),
          eyebrow: createForm.eyebrow.trim(),
          heading: createForm.heading.trim(),
          subtitle: createForm.subtitle.trim(),
          status: createForm.status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create heading');
      const created = data.heading || data.data || { id: `heading-${Date.now()}`, ...createForm };
      add('sectionHeadings', created);
      setCreating(false);
      setCreateForm(emptyForm);
      toast('Heading added');
    } catch (err) {
      toast(err.message || 'Error creating heading');
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      const res = await fetch(`/api/sectionHeadings/${deleting.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete heading');
      remove('sectionHeadings', deleting.id);
      toast('Heading deleted');
    } catch (err) {
      toast(err.message || 'Error deleting heading');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Section Headings"
        subtitle="The eyebrow, heading and subtitle of each homepage content section."
        actions={(
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={fetchHeadings} disabled={loading}>
              <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Btn>
            <Btn variant="ghost" onClick={seedHeadings} disabled={seeding}>
              <IconRefresh size={16} className={seeding ? 'animate-spin' : ''} /> Seed
            </Btn>
            <Btn onClick={() => setCreating(true)}><IconPlus size={16} /> Add section</Btn>
          </div>
        )}
      />

      <div className="mb-5 max-w-md">
        <SearchInput value={q} onChange={setQ} placeholder="Search sections…" />
      </div>

      {loading && filtered.length === 0 ? (
        <Card className="py-10 text-center text-sm text-ink-500">Loading headings…</Card>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<IconPen size={22} />}
          title="No headings found"
          text="Seed the database to restore the default section headings, or add a section."
          action={(
            <div className="flex items-center gap-2">
              <Btn variant="ghost" onClick={seedHeadings} disabled={seeding}>Seed headings</Btn>
              <Btn onClick={() => setCreating(true)}><IconPlus size={16} /> Add section</Btn>
            </div>
          )}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((h) => (
            <HeadingCard
              key={h.id}
              item={h}
              onSaved={(id, patch) => update('sectionHeadings', id, patch)}
              onDeleted={() => setDeleting(h)}
            />
          ))}
        </div>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title="Add section heading">
        <div className="space-y-4">
          <Field label="Section" hint="Name of the homepage section this heading belongs to.">
            <Input value={createForm.section} onChange={(e) => setCreateForm({ ...createForm, section: e.target.value })} placeholder="e.g. Services" />
          </Field>
          <Field label="Eyebrow">
            <Input value={createForm.eyebrow} onChange={(e) => setCreateForm({ ...createForm, eyebrow: e.target.value })} placeholder="Small text above the heading" />
          </Field>
          <Field label="Heading">
            <Input value={createForm.heading} onChange={(e) => setCreateForm({ ...createForm, heading: e.target.value })} placeholder="Main section heading" />
          </Field>
          <Field label="Subtitle">
            <Textarea rows={2} value={createForm.subtitle} onChange={(e) => setCreateForm({ ...createForm, subtitle: e.target.value })} placeholder="Supporting line under the heading" />
          </Field>
          <Field label="Status">
            <Select value={createForm.status} onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}>
              <option>Published</option>
              <option>Draft</option>
            </Select>
          </Field>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setCreating(false)}>Cancel</Btn>
          <Btn onClick={createHeading}><IconPlus size={16} /> Add section</Btn>
        </div>
      </Modal>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete heading">
        <ConfirmState
          title="Delete this heading?"
          text={`The heading for "${deleting?.section}" will be permanently removed.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      </Modal>
    </>
  );
}
