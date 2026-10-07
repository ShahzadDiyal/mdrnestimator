'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/components/admin/store';
import {
  PageHeader, Btn, Badge, StatusBadge, SearchInput, TableWrap, thCls, tdCls,
  DemoNote, EmptyState, Modal, ConfirmState, Select, toast,
} from '@/components/admin/ui';
import { IconPlus, IconEdit, IconTrash, IconPen, IconRefresh } from '@/components/admin/icons';

export default function BlogPage() {
  const { state, setCol, remove } = useStore();
  const [q, setQ] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleting, setDeleting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (data.posts && Array.isArray(data.posts)) {
        setCol('posts', data.posts);
      }
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      toast('Failed to fetch blog posts from database');
    } finally {
      setLoading(false);
    }
  };

  const seedAllPosts = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/posts/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed posts');
      toast(data.message || 'Seeded blog posts successfully!');
      await fetchPosts();
    } catch (err) {
      toast(err.message || 'Error seeding blog posts');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const posts = Array.isArray(state.posts) ? state.posts : [];
    return posts.filter((p) => {
      const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchesSearch =
        !needle ||
        `${p.title} ${p.slug} ${p.category} ${p.author} ${p.excerpt} ${p.tags}`
          .toLowerCase()
          .includes(needle);
      return matchesCat && matchesStatus && matchesSearch;
    });
  }, [state.posts, q, categoryFilter, statusFilter]);

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      const res = await fetch(`/api/posts/${deleting.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete blog post');

      remove('posts', deleting.id);
      toast(`Blog post "${deleting.title}" deleted from database`);
    } catch (err) {
      toast(err.message || 'Error deleting blog post');
    } finally {
      setDeleting(null);
    }
  };

  const fmtDate = (d) => {
    if (!d) return '—';
    const dt = new Date(`${d}T00:00:00`);
    return Number.isNaN(dt.getTime())
      ? d
      : dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <DemoNote />
      <PageHeader
        title="Blog & Articles"
        subtitle={`${state.posts?.length || 0} articles in the database catalog`}
        actions={(
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={fetchPosts} disabled={loading}>
              <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Btn>
            <Btn variant="ghost" onClick={seedAllPosts} disabled={seeding}>
              {seeding ? 'Syncing...' : 'Sync Default Posts'}
            </Btn>
            <Link href="/admin/content/blog/new">
              <Btn><IconPlus size={16} /> New Article</Btn>
            </Link>
          </div>
        )}
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <SearchInput value={q} onChange={setQ} placeholder="Search title, category, author, tags…" />
        </div>
        <div className="w-full sm:w-48">
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Guides">Guides</option>
            <option value="Bidding">Bidding</option>
            <option value="Industry News">Industry News</option>
            <option value="Case Studies">Case Studies</option>
          </Select>
        </div>
        <div className="w-full sm:w-40">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<IconPen size={22} />}
          title="No articles found"
          text="Try changing your search or filters, or click 'Sync Default Posts' to seed initial blog content."
          action={(
            <div className="flex items-center gap-2">
              <Btn variant="ghost" onClick={seedAllPosts} disabled={seeding}>
                Sync Default Posts
              </Btn>
              <Link href="/admin/content/blog/new">
                <Btn><IconPlus size={16} /> New Article</Btn>
              </Link>
            </div>
          )}
        />
      ) : (
        <TableWrap>
          <thead>
            <tr className="border-b border-ink-900/5 bg-slate-50/60">
              <th className={thCls}>Title & Details</th>
              <th className={thCls}>Category</th>
              <th className={thCls}>Author</th>
              <th className={thCls}>Date</th>
              <th className={thCls}>Status</th>
              <th className={`${thCls} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-ink-900/5 transition last:border-0 hover:bg-slate-50/70">
                <td className={tdCls}>
                  <p className="font-semibold text-ink-900">{p.title}</p>
                  <p className="mt-0.5 font-mono text-xs text-ink-400">/{p.slug}</p>
                  {p.excerpt && (
                    <p className="mt-1 max-w-lg truncate text-xs text-ink-500">{p.excerpt}</p>
                  )}
                </td>
                <td className={tdCls}>
                  <Badge tone="blue">{p.category || 'Guides'}</Badge>
                </td>
                <td className={`${tdCls} text-ink-600 text-xs`}>
                  {p.author || 'Mike Carter'}
                </td>
                <td className={`${tdCls} whitespace-nowrap text-xs text-ink-500`}>
                  {fmtDate(p.date)}
                </td>
                <td className={tdCls}>
                  <StatusBadge status={p.status || 'Draft'} />
                </td>
                <td className={`${tdCls} text-right`}>
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/admin/content/blog/${p.id}/edit`}
                      className="rounded-lg p-2 text-ink-400 transition hover:bg-brand-50 hover:text-brand-700"
                      aria-label={`Edit ${p.title}`}
                    >
                      <IconEdit size={16} />
                    </Link>
                    <button
                      onClick={() => setDeleting(p)}
                      className="rounded-lg p-2 text-ink-400 transition hover:bg-rose-50 hover:text-rose-600"
                      aria-label={`Delete ${p.title}`}
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}

      {/* Delete confirmation */}
      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete Article">
        <ConfirmState
          title="Delete this article?"
          text={`"${deleting?.title}" will be permanently removed from the Firestore database.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      </Modal>
    </>
  );
}
