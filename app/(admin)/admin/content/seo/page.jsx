'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/components/admin/store';
import {
  PageHeader, Card, Btn, Field, Input, Textarea, Select,
  Modal, ConfirmState, EmptyState, toast,
} from '@/components/admin/ui';
import { IconCheck, IconGlobe, IconPlus, IconTrash, IconRefresh } from '@/components/admin/icons';

const TITLE_LIMIT = 60;
const DESC_LIMIT = 160;

function Counter({ len, limit }) {
  const over = len > limit;
  const warn = !over && len > limit * 0.8;
  const cls = over ? 'text-rose-600' : warn ? 'text-amber-600' : 'text-ink-400';
  return (
    <span className={`text-xs font-semibold ${cls}`}>
      {len} / {limit}{over ? ' — over limit' : ''}
    </span>
  );
}

const newPageForm = { page: '', path: '', title: '', description: '', status: 'Published' };

export default function SeoPage() {
  const { state, setCol, update, add, remove } = useStore();
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [savingAll, setSavingAll] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState(newPageForm);
  const [deleting, setDeleting] = useState(null);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/seoPages');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch SEO pages');
      const pages = Array.isArray(data.pages) ? data.pages : [];
      setCol('seoPages', pages);
      setDrafts(Object.fromEntries(
        pages.map((s) => [s.id, { title: s.title || '', description: s.description || '' }])
      ));
    } catch (err) {
      console.error('Error fetching SEO pages:', err);
      toast(err.message || 'Failed to fetch SEO pages from database');
    } finally {
      setLoading(false);
    }
  };

  const seedPages = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/seoPages/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed SEO pages');
      toast(data.message || 'Seeded SEO pages successfully!');
      await fetchPages();
    } catch (err) {
      toast(err.message || 'Error seeding SEO pages');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pages = Array.isArray(state.seoPages) ? state.seoPages : [];

  const dirty = pages.some(
    (s) =>
      drafts[s.id] && (
        drafts[s.id].title !== (s.title || '') ||
        drafts[s.id].description !== (s.description || '')
      )
  );

  const setDraft = (id, patch) =>
    setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));

  const saveAll = async () => {
    setSavingAll(true);
    try {
      for (const s of pages) {
        const d = drafts[s.id];
        if (!d) continue;
        if (d.title === (s.title || '') && d.description === (s.description || '')) continue;
        const res = await fetch(`/api/seoPages/${s.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: d.title.trim(), description: d.description.trim() }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Failed to save "${s.page}"`);
        update('seoPages', s.id, { title: d.title.trim(), description: d.description.trim() });
      }
      toast('SEO settings saved');
    } catch (err) {
      toast(err.message || 'Error saving SEO settings');
    } finally {
      setSavingAll(false);
    }
  };

  const createPage = async () => {
    if (!createForm.page.trim()) { toast('Page name is required'); return; }
    try {
      const res = await fetch('/api/seoPages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: createForm.page.trim(),
          path: createForm.path.trim() || `/${createForm.page.trim().toLowerCase().replace(/\s+/g, '-')}`,
          title: createForm.title.trim(),
          description: createForm.description.trim(),
          status: createForm.status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create SEO page');
      const created = data.page || data.data || { id: `seo-${Date.now()}`, ...createForm };
      add('seoPages', created);
      setDrafts((d) => ({ ...d, [created.id]: { title: created.title || '', description: created.description || '' } }));
      setCreating(false);
      setCreateForm(newPageForm);
      toast('SEO page added');
    } catch (err) {
      toast(err.message || 'Error creating SEO page');
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      const res = await fetch(`/api/seoPages/${deleting.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete SEO page');
      remove('seoPages', deleting.id);
      toast('SEO page deleted');
    } catch (err) {
      toast(err.message || 'Error deleting SEO page');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <PageHeader
        title="SEO settings"
        subtitle="Search-engine title and meta description for each page. Keep titles under 60 characters and descriptions under 160."
        actions={(
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={fetchPages} disabled={loading}>
              <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Btn>
            <Btn variant="ghost" onClick={seedPages} disabled={seeding}>
              <IconRefresh size={16} className={seeding ? 'animate-spin' : ''} /> Seed
            </Btn>
            <Btn onClick={saveAll} disabled={!dirty || savingAll}>
              <IconCheck size={16} /> {savingAll ? 'Saving…' : 'Save all changes'}
            </Btn>
            <Btn onClick={() => setCreating(true)}><IconPlus size={16} /> Add page</Btn>
          </div>
        )}
      />

      {loading && pages.length === 0 ? (
        <Card className="py-10 text-center text-sm text-ink-500">Loading SEO pages…</Card>
      ) : pages.length === 0 ? (
        <EmptyState
          icon={<IconGlobe size={22} />}
          title="No SEO pages found"
          text="Seed the database to restore default page titles and descriptions, or add a page."
          action={(
            <div className="flex items-center gap-2">
              <Btn variant="ghost" onClick={seedPages} disabled={seeding}>Seed pages</Btn>
              <Btn onClick={() => setCreating(true)}><IconPlus size={16} /> Add page</Btn>
            </div>
          )}
        />
      ) : (
        <div className="space-y-4">
          {pages.map((s) => {
            const d = drafts[s.id] || { title: s.title || '', description: s.description || '' };
            return (
              <Card key={s.id}>
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <IconGlobe size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-ink-900">{(s.page || '').replace(/^\//, '') || 'Homepage'}</h3>
                    <p className="text-xs text-ink-400">{s.path || s.page}</p>
                  </div>
                  <button
                    onClick={() => setDeleting(s)}
                    aria-label={`Delete SEO for ${s.page}`}
                    className="rounded-lg p-2 text-ink-400 transition hover:bg-rose-50 hover:text-rose-600"
                  >
                    <IconTrash size={16} />
                  </button>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-4">
                    <Field
                      label={
                        <span className="flex items-center justify-between">
                          SEO title
                          <Counter len={d.title.length} limit={TITLE_LIMIT} />
                        </span>
                      }
                    >
                      <Input
                        value={d.title}
                        onChange={(e) => setDraft(s.id, { title: e.target.value })}
                        placeholder="Page title shown in search results"
                      />
                    </Field>
                    <Field
                      label={
                        <span className="flex items-center justify-between">
                          Meta description
                          <Counter len={d.description.length} limit={DESC_LIMIT} />
                        </span>
                      }
                    >
                      <Textarea
                        rows={3}
                        value={d.description}
                        onChange={(e) => setDraft(s.id, { description: e.target.value })}
                        placeholder="Short summary shown under the title in search results"
                      />
                    </Field>
                  </div>

                  {/* Google-style preview */}
                  <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-ink-900/5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Search preview</p>
                    <p className="mt-2 truncate text-lg text-[#1a0dab]">{d.title || 'Untitled page'}</p>
                    <p className="truncate text-sm text-[#006621]">modernestimator.com{s.path || s.page}</p>
                    <p className="mt-1 line-clamp-3 text-sm text-[#545454]">
                      {d.description || 'No meta description set yet.'}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {dirty && (
        <div className="sticky bottom-4 mt-6 flex items-center justify-between gap-4 rounded-2xl bg-ink-900 px-5 py-3.5 text-white shadow-xl">
          <p className="text-sm font-medium">You have unsaved changes.</p>
          <Btn onClick={saveAll} disabled={savingAll}>
            <IconCheck size={16} /> {savingAll ? 'Saving…' : 'Save all changes'}
          </Btn>
        </div>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title="Add SEO page">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Page name">
              <Input value={createForm.page} onChange={(e) => setCreateForm({ ...createForm, page: e.target.value })} placeholder="e.g. About" />
            </Field>
            <Field label="Path" hint="URL path for this page.">
              <Input value={createForm.path} onChange={(e) => setCreateForm({ ...createForm, path: e.target.value })} placeholder="e.g. /about" />
            </Field>
          </div>
          <Field label="SEO title">
            <Input value={createForm.title} onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })} placeholder="Page title shown in search results" />
          </Field>
          <Field label="Meta description">
            <Textarea rows={3} value={createForm.description} onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} placeholder="Short summary shown under the title" />
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
          <Btn onClick={createPage}><IconPlus size={16} /> Add page</Btn>
        </div>
      </Modal>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete SEO page">
        <ConfirmState
          title="Delete this SEO page?"
          text={`"${deleting?.page}" will be permanently removed.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      </Modal>
    </>
  );
}
