'use client';
// Quote form dropdown options, grouped by option group — list CRUD.

import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@/components/admin/store';
import {
  PageHeader, Card, Btn, StatusBadge, SearchInput, TableWrap, thCls, tdCls,
  EmptyState, Modal, ConfirmState, Field, Input, Select, toast,
} from '@/components/admin/ui';
import { IconPlus, IconEdit, IconTrash, IconFileText, IconRefresh } from '@/components/admin/icons';

const GROUPS = ['Service options', 'Project type options'];
const emptyForm = { group: GROUPS[0], label: '', status: 'Published' };

function GroupTable({ title, rows, onEdit, onDelete }) {
  return (
    <Card className="p-0">
      <div className="border-b border-ink-900/5 px-5 py-4">
        <h2 className="font-bold text-ink-900">{title}</h2>
        <p className="text-xs text-ink-400">{rows.length} options</p>
      </div>
      <TableWrap>
        <thead>
          <tr className="border-b border-ink-900/5 bg-slate-50/60">
            <th className={thCls}>Option label</th>
            <th className={thCls}>Status</th>
            <th className={`${thCls} text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => (
            <tr key={o.id} className="border-b border-ink-900/5 transition last:border-0 hover:bg-slate-50/70">
              <td className={`${tdCls} font-medium text-ink-900`}>{o.label}</td>
              <td className={tdCls}><StatusBadge status={o.status || 'Published'} /></td>
              <td className={`${tdCls} text-right`}>
                <div className="flex justify-end gap-1">
                  <button onClick={() => onEdit(o)} aria-label="Edit" className="rounded-lg p-2 text-ink-400 transition hover:bg-brand-50 hover:text-brand-700">
                    <IconEdit size={16} />
                  </button>
                  <button onClick={() => onDelete(o)} aria-label="Delete" className="rounded-lg p-2 text-ink-400 transition hover:bg-rose-50 hover:text-rose-600">
                    <IconTrash size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </Card>
  );
}

export default function QuoteOptionsPage() {
  const { state, setCol, update, add, remove } = useStore();
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchOptions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/quoteOptions');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch options');
      if (Array.isArray(data.options)) setCol('quoteOptions', data.options);
    } catch (err) {
      console.error('Error fetching options:', err);
      toast(err.message || 'Failed to fetch options from database');
    } finally {
      setLoading(false);
    }
  };

  const seedOptions = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/quoteOptions/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed options');
      toast(data.message || 'Seeded options successfully!');
      await fetchOptions();
    } catch (err) {
      toast(err.message || 'Error seeding options');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = Array.isArray(state.quoteOptions) ? state.quoteOptions : [];

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return options.filter(
      (o) => !needle || `${o.label} ${o.group}`.toLowerCase().includes(needle)
    );
  }, [options, q]);

  const groups = useMemo(() => {
    const map = {};
    for (const o of filtered) {
      const g = o.group || 'Service options';
      if (!map[g]) map[g] = [];
      map[g].push(o);
    }
    return map;
  }, [filtered]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const openAdd = (group) => {
    setEditing(null);
    setForm({ ...emptyForm, group: group || GROUPS[0] });
    setModalOpen(true);
  };

  const openEdit = (o) => {
    setEditing(o);
    setForm({ group: o.group || GROUPS[0], label: o.label || '', status: o.status || 'Published' });
    setModalOpen(true);
  };

  const save = async () => {
    if (!form.label.trim()) { toast('Option label is required'); return; }
    const payload = { group: form.group, label: form.label.trim(), status: form.status };
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/quoteOptions/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to save option');
        update('quoteOptions', editing.id, payload);
        toast('Option saved');
      } else {
        const res = await fetch('/api/quoteOptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to add option');
        const created = data.option || data.data || { id: `option-${Date.now()}`, ...payload };
        add('quoteOptions', created);
        toast('Option added');
      }
      setModalOpen(false);
    } catch (err) {
      toast(err.message || 'Error saving option');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      const res = await fetch(`/api/quoteOptions/${deleting.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete option');
      remove('quoteOptions', deleting.id);
      toast('Option deleted');
    } catch (err) {
      toast(err.message || 'Error deleting option');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Quote Form Options"
        subtitle="The dropdown options on the website's quote form, grouped by option group."
        actions={(
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={fetchOptions} disabled={loading}>
              <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Btn>
            <Btn variant="ghost" onClick={seedOptions} disabled={seeding}>
              <IconRefresh size={16} className={seeding ? 'animate-spin' : ''} /> Seed
            </Btn>
          </div>
        )}
      />

      <div className="mb-5 max-w-md">
        <SearchInput value={q} onChange={setQ} placeholder="Search options…" />
      </div>

      {loading && options.length === 0 ? (
        <Card className="py-10 text-center text-sm text-ink-500">Loading options…</Card>
      ) : options.length === 0 ? (
        <EmptyState
          icon={<IconFileText size={22} />}
          title="No options found"
          text="Seed the database to restore the default quote form options, or add one."
          action={(
            <div className="flex items-center gap-2">
              <Btn variant="ghost" onClick={seedOptions} disabled={seeding}>Seed options</Btn>
              <Btn onClick={() => openAdd()}><IconPlus size={16} /> Add option</Btn>
            </div>
          )}
        />
      ) : (
        <div className="space-y-6">
          {GROUPS.map((g) => (
            <div key={g}>
              <GroupTable
                title={g}
                rows={groups[g] || []}
                onEdit={openEdit}
                onDelete={setDeleting}
              />
              <div className="mt-3">
                <Btn variant="ghost" onClick={() => openAdd(g)} className="!text-xs">
                  <IconPlus size={14} /> Add {g === 'Service options' ? 'service' : 'project type'} option
                </Btn>
              </div>
            </div>
          ))}
          {Object.keys(groups).filter((g) => !GROUPS.includes(g)).map((g) => (
            <GroupTable
              key={g}
              title={g}
              rows={groups[g]}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit option' : 'Add option'}>
        <div className="space-y-4">
          <Field label="Group">
            <Select value={form.group} onChange={set('group')}>
              {GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
            </Select>
          </Field>
          <Field label="Option label">
            <Input value={form.label} onChange={set('label')} placeholder="e.g. Quantity takeoff" />
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={set('status')}>
              <option>Published</option>
              <option>Draft</option>
            </Select>
          </Field>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Btn>
          <Btn onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Add option'}</Btn>
        </div>
      </Modal>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete option">
        <ConfirmState
          title="Delete this option?"
          text={`"${deleting?.label}" will be permanently removed from the quote form.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      </Modal>
    </>
  );
}
