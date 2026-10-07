'use client';
// "How it works" process steps — list CRUD.

import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@/components/admin/store';
import {
  PageHeader, Btn, StatusBadge, SearchInput, TableWrap, thCls, tdCls,
  EmptyState, Modal, ConfirmState, Drawer, Field, Input, Textarea,
  Select, toast,
} from '@/components/admin/ui';
import { IconPlus, IconEdit, IconTrash, IconClock, IconRefresh } from '@/components/admin/icons';

const emptyForm = { num: '', title: '', desc: '', status: 'Published' };

export default function ProcessStepsPage() {
  const { state, setCol, update, add, remove } = useStore();
  const [q, setQ] = useState('');
  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleting, setDeleting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchSteps = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/processSteps');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch steps');
      if (Array.isArray(data.steps)) setCol('processSteps', data.steps);
    } catch (err) {
      console.error('Error fetching steps:', err);
      toast(err.message || 'Failed to fetch steps from database');
    } finally {
      setLoading(false);
    }
  };

  const seedSteps = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/processSteps/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed steps');
      toast(data.message || 'Seeded steps successfully!');
      await fetchSteps();
    } catch (err) {
      toast(err.message || 'Error seeding steps');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchSteps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const steps = Array.isArray(state.processSteps) ? state.processSteps : [];

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return steps.filter(
      (s) => !needle || `${s.num} ${s.title} ${s.desc}`.toLowerCase().includes(needle)
    );
  }, [steps, q]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setDrawer(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({ num: s.num || '', title: s.title || '', desc: s.desc || '', status: s.status || 'Published' });
    setDrawer(true);
  };

  const save = async () => {
    if (!form.title.trim()) { toast('Title is required'); return; }
    const payload = { num: form.num.trim(), title: form.title.trim(), desc: form.desc.trim(), status: form.status };
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/processSteps/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to save step');
        update('processSteps', editing.id, payload);
        toast('Step saved');
      } else {
        const res = await fetch('/api/processSteps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to add step');
        const created = data.step || data.data || { id: `step-${Date.now()}`, ...payload };
        add('processSteps', created);
        toast('Step added');
      }
      setDrawer(false);
    } catch (err) {
      toast(err.message || 'Error saving step');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      const res = await fetch(`/api/processSteps/${deleting.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete step');
      remove('processSteps', deleting.id);
      toast('Step deleted');
    } catch (err) {
      toast(err.message || 'Error deleting step');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Process Steps"
        subtitle={`The ${filtered.length} "how it works" steps shown on the homepage.`}
        actions={(
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={fetchSteps} disabled={loading}>
              <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Btn>
            <Btn variant="ghost" onClick={seedSteps} disabled={seeding}>
              <IconRefresh size={16} className={seeding ? 'animate-spin' : ''} /> Seed
            </Btn>
            <Btn onClick={openAdd}><IconPlus size={16} /> Add step</Btn>
          </div>
        )}
      />

      <div className="mb-5 max-w-md">
        <SearchInput value={q} onChange={setQ} placeholder="Search steps…" />
      </div>

      {loading && filtered.length === 0 ? (
        <TableWrap><p className="px-4 py-10 text-center text-sm text-ink-500">Loading steps…</p></TableWrap>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<IconClock size={22} />}
          title="No steps found"
          text="Seed the database to restore the default process steps, or add a new one."
          action={(
            <div className="flex items-center gap-2">
              <Btn variant="ghost" onClick={seedSteps} disabled={seeding}>Seed steps</Btn>
              <Btn onClick={openAdd}><IconPlus size={16} /> Add step</Btn>
            </div>
          )}
        />
      ) : (
        <TableWrap>
          <thead>
            <tr className="border-b border-ink-900/5 bg-slate-50/60">
              <th className={thCls}>Step</th>
              <th className={thCls}>Title</th>
              <th className={thCls}>Description</th>
              <th className={thCls}>Status</th>
              <th className={`${thCls} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-ink-900/5 transition last:border-0 hover:bg-slate-50/70">
                <td className={`${tdCls} whitespace-nowrap`}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
                    {s.num}
                  </span>
                </td>
                <td className={`${tdCls} font-semibold text-ink-900`}>{s.title}</td>
                <td className={`${tdCls} max-w-md`}>
                  <p className="line-clamp-2 text-sm text-ink-500">{s.desc}</p>
                </td>
                <td className={tdCls}><StatusBadge status={s.status || 'Published'} /></td>
                <td className={`${tdCls} text-right`}>
                  <div className="flex justify-end gap-1">
                    <button onClick={() => openEdit(s)} aria-label="Edit" className="rounded-lg p-2 text-ink-400 transition hover:bg-brand-50 hover:text-brand-700">
                      <IconEdit size={16} />
                    </button>
                    <button onClick={() => setDeleting(s)} aria-label="Delete" className="rounded-lg p-2 text-ink-400 transition hover:bg-rose-50 hover:text-rose-600">
                      <IconTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}

      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title={editing ? 'Edit step' : 'Add step'}
        footer={(
          <>
            <Btn variant="ghost" onClick={() => setDrawer(false)}>Cancel</Btn>
            <Btn onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Add step'}</Btn>
          </>
        )}
      >
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Step number">
              <Input value={form.num} onChange={set('num')} placeholder="e.g. 01" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Title">
                <Input value={form.title} onChange={set('title')} placeholder="e.g. Send your plans" />
              </Field>
            </div>
          </div>
          <Field label="Description">
            <Textarea rows={4} value={form.desc} onChange={set('desc')} placeholder="What happens in this step." />
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={set('status')}>
              <option>Published</option>
              <option>Draft</option>
            </Select>
          </Field>
        </div>
      </Drawer>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete step">
        <ConfirmState
          title="Delete this step?"
          text={`"${deleting?.title}" will be permanently removed.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      </Modal>
    </>
  );
}
