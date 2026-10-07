'use client';
// Reusable tree CRUD for menu collections (navbar menus / footer menus).
// Top-level items with indented sub-menu children, drag-free up/down ordering.

import { useEffect, useMemo, useState } from 'react';
import {
  PageHeader, Card, Btn, Field, Input, Select, StatusBadge,
  Modal, ConfirmState, EmptyState, Tabs, toast,
} from '@/components/admin/ui';
import { IconPlus, IconEdit, IconTrash, IconRefresh, IconMenu } from '@/components/admin/icons';

const STATUS_OPTIONS = ['Published', 'Draft'];

const emptyForm = { label: '', href: '', parentId: '', order: '', status: 'Published' };

export default function MenuTreeManager({ title, subtitle, apiBase, groups = null }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [activeGroup, setActiveGroup] = useState(groups ? groups[0].id : null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = new, otherwise item
  const [form, setForm] = useState(emptyForm);
  const [deleting, setDeleting] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiBase);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch menu items');
      if (Array.isArray(data.items)) setItems(data.items);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      toast(err.message || 'Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  };

  const seedItems = async () => {
    setSeeding(true);
    try {
      const res = await fetch(`${apiBase}/seed`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed menu items');
      toast(data.message || 'Seeded menu items successfully!');
      await fetchItems();
    } catch (err) {
      toast(err.message || 'Error seeding menu items');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = useMemo(() => {
    if (!groups) return items;
    return items.filter((i) => (i.group || groups[0].id) === activeGroup);
  }, [items, activeGroup, groups]);

  const tree = useMemo(() => {
    const tops = visible
      .filter((i) => !i.parentId)
      .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    const kids = visible.filter((i) => i.parentId);
    return tops.map((t) => ({
      ...t,
      children: kids
        .filter((k) => k.parentId === t.id)
        .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)),
    }));
  }, [visible]);

  const topLevelOptions = useMemo(
    () => visible.filter((i) => !i.parentId).sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)),
    [visible]
  );

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      label: item.label || '',
      href: item.href || '',
      parentId: item.parentId || '',
      order: item.order ?? '',
      status: item.status || 'Published',
    });
    setModalOpen(true);
  };

  const save = async () => {
    if (!form.label.trim()) { toast('Label is required'); return; }
    const payload = {
      label: form.label.trim(),
      href: form.href.trim() || '#',
      parentId: form.parentId || null,
      status: form.status,
    };
    if (form.order !== '' && form.order !== null) payload.order = Number(form.order);
    if (groups) payload.group = activeGroup;
    try {
      // If a parent item is being moved under another item, promote its
      // children to top level first so no sub-menu becomes unreachable.
      if (editing && payload.parentId) {
        const kids = items.filter((i) => i.parentId === editing.id);
        for (const k of kids) {
          await fetch(`${apiBase}/${k.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ parentId: null }),
          });
        }
      }
      const url = editing ? `${apiBase}/${editing.id}` : apiBase;
      const res = await fetch(url, {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save menu item');
      toast(editing ? 'Menu item saved' : 'Menu item added');
      setModalOpen(false);
      await fetchItems();
    } catch (err) {
      toast(err.message || 'Error saving menu item');
    }
  };

  const move = async (item, dir) => {
    const siblings = visible
      .filter((i) => (i.parentId || null) === (item.parentId || null))
      .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    const idx = siblings.findIndex((s) => s.id === item.id);
    const other = siblings[idx + dir];
    if (!other) return;
    try {
      const patch = (id, order) => fetch(`${apiBase}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order }),
      });
      const [r1, r2] = await Promise.all([
        patch(item.id, Number(other.order) || 0),
        patch(other.id, Number(item.order) || 0),
      ]);
      if (!r1.ok || !r2.ok) throw new Error('Failed to reorder');
      await fetchItems();
    } catch (err) {
      toast(err.message || 'Error reordering menu items');
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      // Cascade: delete children first so no orphan sub-menus remain.
      const kids = items.filter((i) => i.parentId === deleting.id);
      for (const k of kids) {
        await fetch(`${apiBase}/${k.id}`, { method: 'DELETE' });
      }
      const res = await fetch(`${apiBase}/${deleting.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete menu item');
      toast(`"${deleting.label}" deleted${kids.length ? ` (+${kids.length} sub-item${kids.length > 1 ? 's' : ''})` : ''}`);
      setDeleting(null);
      await fetchItems();
    } catch (err) {
      toast(err.message || 'Error deleting menu item');
    }
  };

  const Row = ({ item, child = false, isFirst, isLast }) => (
    <div
      className={`flex items-center gap-2 rounded-xl px-3 py-2 ring-1 ring-ink-900/5 bg-white hover:bg-slate-50/70 ${child ? 'ml-8 border-l-2 border-l-brand-200' : ''}`}
    >
      {child && <span className="text-ink-300 select-none">↳</span>}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink-900">{item.label}</p>
        <p className="truncate font-mono text-[11px] text-ink-400">{item.href || '#'}</p>
      </div>
      <StatusBadge status={item.status || 'Published'} />
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => move(item, -1)}
          disabled={isFirst}
          aria-label="Move up"
          title="Move up"
          className="rounded-lg p-1.5 text-ink-400 hover:bg-slate-100 hover:text-ink-700 disabled:opacity-30"
        >
          <span className="text-sm leading-none">↑</span>
        </button>
        <button
          onClick={() => move(item, 1)}
          disabled={isLast}
          aria-label="Move down"
          title="Move down"
          className="rounded-lg p-1.5 text-ink-400 hover:bg-slate-100 hover:text-ink-700 disabled:opacity-30"
        >
          <span className="text-sm leading-none">↓</span>
        </button>
        <button
          onClick={() => openEdit(item)}
          aria-label="Edit"
          className="rounded-lg p-1.5 text-ink-400 hover:bg-brand-50 hover:text-brand-700"
        >
          <IconEdit size={15} />
        </button>
        <button
          onClick={() => setDeleting(item)}
          aria-label="Delete"
          className="rounded-lg p-1.5 text-ink-400 hover:bg-rose-50 hover:text-rose-600"
        >
          <IconTrash size={15} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="mt-8">
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={(
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={fetchItems} disabled={loading}>
              <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Btn>
            <Btn variant="ghost" onClick={seedItems} disabled={seeding}>
              <IconRefresh size={16} className={seeding ? 'animate-spin' : ''} /> Seed
            </Btn>
            <Btn onClick={openAdd}><IconPlus size={16} /> Add menu item</Btn>
          </div>
        )}
      />

      {groups && (
        <div className="mb-4">
          <Tabs
            value={activeGroup}
            onChange={setActiveGroup}
            tabs={groups.map((g) => ({ id: g.id, label: g.label, icon: <IconMenu size={16} /> }))}
          />
        </div>
      )}

      {loading ? (
        <Card className="py-10 text-center text-sm text-ink-500">Loading menu items…</Card>
      ) : tree.length === 0 ? (
        <EmptyState
          icon={<IconMenu size={22} />}
          title="No menu items"
          text="Seed the current menus or add your first item."
          action={(
            <div className="flex items-center gap-2">
              <Btn variant="ghost" onClick={seedItems} disabled={seeding}>Seed menus</Btn>
              <Btn onClick={openAdd}><IconPlus size={16} /> Add menu item</Btn>
            </div>
          )}
        />
      ) : (
        <div className="space-y-2">
          {tree.map((t, ti) => (
            <div key={t.id} className="space-y-2">
              <Row item={t} isFirst={ti === 0} isLast={ti === tree.length - 1} />
              {t.children.map((c, ci) => (
                <Row key={c.id} item={c} child isFirst={ci === 0} isLast={ci === t.children.length - 1} />
              ))}
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit menu item' : 'Add menu item'}>
        <div className="space-y-4">
          <Field label="Label *">
            <Input value={form.label} onChange={set('label')} placeholder="e.g. Services" />
          </Field>
          <Field label="Link (href)" hint="Use # for a parent that only opens a dropdown.">
            <Input value={form.href} onChange={set('href')} placeholder="e.g. /services" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Parent" hint="Choose a top-level item to make this a sub-menu.">
              <Select value={form.parentId} onChange={set('parentId')}>
                <option value="">Top level</option>
                {topLevelOptions
                  .filter((o) => !editing || o.id !== editing.id)
                  .map((o) => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
              </Select>
            </Field>
            <Field label="Order" hint="Leave empty for automatic (last).">
              <Input type="number" min="1" value={form.order} onChange={set('order')} placeholder="Auto" />
            </Field>
          </div>
          <Field label="Status">
            <Select value={form.status} onChange={set('status')}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </Field>
          <div className="flex justify-end gap-2 border-t border-ink-900/5 pt-4">
            <Btn variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Btn>
            <Btn onClick={save}>{editing ? 'Save changes' : 'Add item'}</Btn>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete menu item">
        <ConfirmState
          title="Delete this menu item?"
          text={`"${deleting?.label}" will be permanently removed${items.some((i) => i.parentId === deleting?.id) ? ' along with its sub-menu items' : ''}.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      </Modal>
    </div>
  );
}
