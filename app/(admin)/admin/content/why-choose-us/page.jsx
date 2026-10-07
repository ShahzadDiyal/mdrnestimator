'use client';
// "Why Choose Us" feature cards — list CRUD.

import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@/components/admin/store';
import {
  PageHeader, Btn, StatusBadge, SearchInput, TableWrap, thCls, tdCls,
  EmptyState, Modal, ConfirmState, Drawer, Field, Input, Textarea,
  Select, toast,
} from '@/components/admin/ui';
import { IconPlus, IconEdit, IconTrash, IconShield, IconRefresh } from '@/components/admin/icons';

const emptyForm = { title: '', desc: '', status: 'Published' };

export default function WhyChooseUsPage() {
  const { state, setCol, update, add, remove } = useStore();
  const [q, setQ] = useState('');
  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleting, setDeleting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/whyChooseUs');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch features');
      if (Array.isArray(data.features)) setCol('whyChooseUs', data.features);
    } catch (err) {
      console.error('Error fetching features:', err);
      toast(err.message || 'Failed to fetch features from database');
    } finally {
      setLoading(false);
    }
  };

  const seedFeatures = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/whyChooseUs/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed features');
      toast(data.message || 'Seeded features successfully!');
      await fetchFeatures();
    } catch (err) {
      toast(err.message || 'Error seeding features');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const features = Array.isArray(state.whyChooseUs) ? state.whyChooseUs : [];

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return features.filter(
      (f) => !needle || `${f.title} ${f.desc}`.toLowerCase().includes(needle)
    );
  }, [features, q]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setDrawer(true);
  };

  const openEdit = (f) => {
    setEditing(f);
    setForm({ title: f.title || '', desc: f.desc || '', status: f.status || 'Published' });
    setDrawer(true);
  };

  const save = async () => {
    if (!form.title.trim()) { toast('Title is required'); return; }
    const payload = { title: form.title.trim(), desc: form.desc.trim(), status: form.status };
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/whyChooseUs/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to save feature');
        update('whyChooseUs', editing.id, payload);
        toast('Feature saved');
      } else {
        const res = await fetch('/api/whyChooseUs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to add feature');
        const created = data.feature || data.data || { id: `feature-${Date.now()}`, ...payload };
        add('whyChooseUs', created);
        toast('Feature added');
      }
      setDrawer(false);
    } catch (err) {
      toast(err.message || 'Error saving feature');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      const res = await fetch(`/api/whyChooseUs/${deleting.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete feature');
      remove('whyChooseUs', deleting.id);
      toast('Feature deleted');
    } catch (err) {
      toast(err.message || 'Error deleting feature');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Why Choose Us"
        subtitle={`${filtered.length} of ${features.length} feature cards on the homepage.`}
        actions={(
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={fetchFeatures} disabled={loading}>
              <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Btn>
            <Btn variant="ghost" onClick={seedFeatures} disabled={seeding}>
              <IconRefresh size={16} className={seeding ? 'animate-spin' : ''} /> Seed
            </Btn>
            <Btn onClick={openAdd}><IconPlus size={16} /> Add feature</Btn>
          </div>
        )}
      />

      <div className="mb-5 max-w-md">
        <SearchInput value={q} onChange={setQ} placeholder="Search features…" />
      </div>

      {loading && filtered.length === 0 ? (
        <TableWrap><p className="px-4 py-10 text-center text-sm text-ink-500">Loading features…</p></TableWrap>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<IconShield size={22} />}
          title="No features found"
          text="Seed the database to restore the default feature cards, or add a new one."
          action={(
            <div className="flex items-center gap-2">
              <Btn variant="ghost" onClick={seedFeatures} disabled={seeding}>Seed features</Btn>
              <Btn onClick={openAdd}><IconPlus size={16} /> Add feature</Btn>
            </div>
          )}
        />
      ) : (
        <TableWrap>
          <thead>
            <tr className="border-b border-ink-900/5 bg-slate-50/60">
              <th className={thCls}>Title</th>
              <th className={thCls}>Description</th>
              <th className={thCls}>Status</th>
              <th className={`${thCls} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => (
              <tr key={f.id} className="border-b border-ink-900/5 transition last:border-0 hover:bg-slate-50/70">
                <td className={`${tdCls} font-semibold text-ink-900`}>{f.title}</td>
                <td className={`${tdCls} max-w-md`}>
                  <p className="line-clamp-2 text-sm text-ink-500">{f.desc}</p>
                </td>
                <td className={tdCls}><StatusBadge status={f.status || 'Published'} /></td>
                <td className={`${tdCls} text-right`}>
                  <div className="flex justify-end gap-1">
                    <button onClick={() => openEdit(f)} aria-label="Edit" className="rounded-lg p-2 text-ink-400 transition hover:bg-brand-50 hover:text-brand-700">
                      <IconEdit size={16} />
                    </button>
                    <button onClick={() => setDeleting(f)} aria-label="Delete" className="rounded-lg p-2 text-ink-400 transition hover:bg-rose-50 hover:text-rose-600">
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
        title={editing ? 'Edit feature' : 'Add feature'}
        footer={(
          <>
            <Btn variant="ghost" onClick={() => setDrawer(false)}>Cancel</Btn>
            <Btn onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Add feature'}</Btn>
          </>
        )}
      >
        <div className="flex flex-col gap-4">
          <Field label="Title">
            <Input value={form.title} onChange={set('title')} placeholder="e.g. Pinpoint accuracy" />
          </Field>
          <Field label="Description">
            <Textarea rows={4} value={form.desc} onChange={set('desc')} placeholder="One or two sentences describing this feature." />
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={set('status')}>
              <option>Published</option>
              <option>Draft</option>
            </Select>
          </Field>
        </div>
      </Drawer>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete feature">
        <ConfirmState
          title="Delete this feature?"
          text={`"${deleting?.title}" will be permanently removed.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      </Modal>
    </>
  );
}
