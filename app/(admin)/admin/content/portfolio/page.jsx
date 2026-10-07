'use client';

import { useMemo, useState } from 'react';
import { useStore } from '@/components/admin/store';
import {
  PageHeader, Btn, StatusBadge, Card, SearchInput,
  DemoNote, EmptyState, Drawer, Modal, ConfirmState, Field, Input,
  Select, toast,
} from '@/components/admin/ui';
import { IconPlus, IconEdit, IconTrash, IconImage } from '@/components/admin/icons';

const emptyForm = { title: '', category: '', price: '', location: '', img: '', status: 'Published' };

export default function PortfolioPage() {
  const { state, update, add, remove } = useStore();
  const [q, setQ] = useState('');
  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleting, setDeleting] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return state.projects.filter(
      (p) => !needle || `${p.title} ${p.category} ${p.location}`.toLowerCase().includes(needle)
    );
  }, [state.projects, q]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setDrawer(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      title: p.title,
      category: p.category || '',
      price: p.price || '',
      location: p.location || '',
      img: p.img || '',
      status: p.status,
    });
    setDrawer(true);
  };

  const save = () => {
    if (!form.title.trim()) { toast('Title is required'); return; }
    const payload = {
      title: form.title.trim(),
      category: form.category.trim(),
      price: form.price.trim(),
      location: form.location.trim(),
      img: form.img.trim(),
      status: form.status,
    };
    if (editing) {
      update('projects', editing.id, payload);
      toast('Project saved');
    } else {
      add('projects', payload);
      toast('Project added');
    }
    setDrawer(false);
  };

  const confirmDelete = () => {
    remove('projects', deleting.id);
    setDeleting(null);
    toast('Project deleted');
  };

  return (
    <>
      <DemoNote />
      <PageHeader
        title="Portfolio"
        subtitle={`${filtered.length} of ${state.projects.length} portfolio projects`}
        actions={(
          <Btn onClick={openAdd}><IconPlus size={16} /> Add project</Btn>
        )}
      />

      <div className="mb-5 max-w-md">
        <SearchInput value={q} onChange={setQ} placeholder="Search title, category or location…" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<IconImage size={22} />}
          title="No projects found"
          text="Try a different search, or add a new portfolio project."
          action={<Btn onClick={openAdd}><IconPlus size={16} /> Add project</Btn>}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.id} className="overflow-hidden p-0">
              <div className="relative h-44 bg-slate-100">
                {p.img ? (
                  <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-300">
                    <IconImage size={40} />
                  </div>
                )}
                <div className="absolute left-3 top-3"><StatusBadge status={p.status} /></div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-ink-900">{p.title}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-400">{p.category}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-brand-700">{p.price}</span>
                  <span className="text-sm text-ink-500">{p.location}</span>
                </div>
                <div className="mt-4 flex gap-2 border-t border-ink-900/5 pt-3">
                  <Btn variant="ghost" className="!px-3 !py-1.5 !text-xs" onClick={() => openEdit(p)}>
                    <IconEdit size={14} /> Edit
                  </Btn>
                  <Btn variant="dangerGhost" className="!px-3 !py-1.5 !text-xs" onClick={() => setDeleting(p)}>
                    <IconTrash size={14} /> Delete
                  </Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title={editing ? 'Edit project' : 'Add project'}
        footer={(
          <>
            <Btn variant="ghost" onClick={() => setDrawer(false)}>Cancel</Btn>
            <Btn onClick={save}>{editing ? 'Save changes' : 'Add project'}</Btn>
          </>
        )}
      >
        <div className="flex flex-col gap-4">
          <Field label="Title">
            <Input value={form.title} onChange={set('title')} placeholder="e.g. Maple Heights Residences" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <Input value={form.category} onChange={set('category')} placeholder="Residential — Multi-family" />
            </Field>
            <Field label="Price">
              <Input value={form.price} onChange={set('price')} placeholder="$3.4M" />
            </Field>
          </div>
          <Field label="Location">
            <Input value={form.location} onChange={set('location')} placeholder="Austin, TX" />
          </Field>
          <Field label="Image URL" hint="Paste a direct link to the project image.">
            <Input value={form.img} onChange={set('img')} placeholder="https://…" />
          </Field>
          {form.img.trim() && (
            <div className="overflow-hidden rounded-xl ring-1 ring-ink-900/10">
              <img src={form.img} alt="Project preview" className="h-40 w-full object-cover" />
            </div>
          )}
          <Field label="Status">
            <Select value={form.status} onChange={set('status')}>
              <option>Published</option>
              <option>Draft</option>
            </Select>
          </Field>
        </div>
      </Drawer>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete project">
        <ConfirmState
          title="Delete this project?"
          text={`"${deleting?.title}" will be permanently removed from the portfolio.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      </Modal>
    </>
  );
}
