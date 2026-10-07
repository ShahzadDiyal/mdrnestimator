'use client';

import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@/components/admin/store';
import {
  PageHeader, Btn, StatusBadge, Card, SearchInput,
  EmptyState, Drawer, Modal, ConfirmState, Field, Input,
  Select, toast,
} from '@/components/admin/ui';
import { IconPlus, IconEdit, IconTrash, IconImage, IconRefresh } from '@/components/admin/icons';

const emptyForm = { title: '', category: '', price: '', location: '', img: '', alt: '', tags: '', status: 'Published' };

export default function PortfolioPage() {
  const { state, setCol, update, add, remove } = useStore();
  const [q, setQ] = useState('');
  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleting, setDeleting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/portfolio');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch projects');
      if (Array.isArray(data.projects)) setCol('projects', data.projects);
    } catch (err) {
      console.error('Error fetching projects:', err);
      toast(err.message || 'Failed to fetch projects from database');
    } finally {
      setLoading(false);
    }
  };

  const seedProjects = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/portfolio/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed projects');
      toast(data.message || 'Seeded projects successfully!');
      await fetchProjects();
    } catch (err) {
      toast(err.message || 'Error seeding projects');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const projects = Array.isArray(state.projects) ? state.projects : [];

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return projects.filter(
      (p) => !needle || `${p.title} ${p.category} ${p.location}`.toLowerCase().includes(needle)
    );
  }, [projects, q]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setDrawer(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      title: p.title || '',
      category: p.category || '',
      price: p.price || '',
      location: p.location || '',
      img: p.img || '',
      alt: p.alt || '',
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''),
      status: p.status || 'Published',
    });
    setDrawer(true);
  };

  const save = async () => {
    if (!form.title.trim()) { toast('Title is required'); return; }
    const payload = {
      title: form.title.trim(),
      category: form.category.trim(),
      price: form.price.trim(),
      location: form.location.trim(),
      img: form.img.trim(),
      alt: form.alt.trim(),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      status: form.status,
    };
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/portfolio/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to save project');
        update('projects', editing.id, payload);
        toast('Project saved');
      } else {
        const res = await fetch('/api/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to add project');
        const created = data.project || data.data || { id: `project-${Date.now()}`, ...payload };
        add('projects', created);
        toast('Project added');
      }
      setDrawer(false);
    } catch (err) {
      toast(err.message || 'Error saving project');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      const res = await fetch(`/api/portfolio/${deleting.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete project');
      remove('projects', deleting.id);
      toast('Project deleted');
    } catch (err) {
      toast(err.message || 'Error deleting project');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Portfolio"
        subtitle={`${filtered.length} of ${projects.length} portfolio projects`}
        actions={(
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={fetchProjects} disabled={loading}>
              <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Btn>
            <Btn variant="ghost" onClick={seedProjects} disabled={seeding}>
              <IconRefresh size={16} className={seeding ? 'animate-spin' : ''} /> Seed
            </Btn>
            <Btn onClick={openAdd}><IconPlus size={16} /> Add project</Btn>
          </div>
        )}
      />

      <div className="mb-5 max-w-md">
        <SearchInput value={q} onChange={setQ} placeholder="Search title, category or location…" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<IconImage size={22} />}
          title="No projects found"
          text="Try a different search, seed the database, or add a new portfolio project."
          action={(
            <div className="flex items-center gap-2">
              <Btn variant="ghost" onClick={seedProjects} disabled={seeding}>Seed projects</Btn>
              <Btn onClick={openAdd}><IconPlus size={16} /> Add project</Btn>
            </div>
          )}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.id} className="overflow-hidden p-0">
              <div className="relative h-44 bg-slate-100">
                {p.img ? (
                  <img src={p.img} alt={p.alt || p.title} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-300">
                    <IconImage size={40} />
                  </div>
                )}
                <div className="absolute left-3 top-3"><StatusBadge status={p.status || 'Published'} /></div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-ink-900">{p.title}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-400">{p.category}</p>
                {Array.isArray(p.tags) && p.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-ink-600">{t}</span>
                    ))}
                  </div>
                )}
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
            <Btn onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Add project'}</Btn>
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
          <Field label="Alt text" hint="Shown when the image can't load, and used by screen readers.">
            <Input value={form.alt} onChange={set('alt')} placeholder="e.g. Front view of the Maple Heights building" />
          </Field>
          <Field label="Tags" hint="Comma-separated.">
            <Input value={form.tags} onChange={set('tags')} placeholder="e.g. Multi-family, Texas, Takeoff" />
          </Field>
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
