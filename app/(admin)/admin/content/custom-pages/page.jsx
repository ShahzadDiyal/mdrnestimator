'use client';
// Custom pages manager — WordPress-style pages created entirely from admin.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  PageHeader, Btn, Badge, SearchInput, TableWrap, thCls, tdCls,
  EmptyState, Modal, ConfirmState, Select, toast,
} from '@/components/admin/ui';
import { TableSkeleton } from '@/components/admin/Skeleton';
import { IconPlus, IconEdit, IconTrash, IconFileText } from '@/components/admin/icons';

export default function CustomPagesPage() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleting, setDeleting] = useState(null);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/customPages');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch pages');
      setPages(Array.isArray(data.pages) ? data.pages : []);
    } catch (err) {
      console.error('Error fetching custom pages:', err);
      toast(err.message || 'Failed to fetch custom pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const confirmDelete = async () => {
    try {
      const res = await fetch(`/api/customPages/${deleting.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      toast('Page deleted');
      setDeleting(null);
      fetchPages();
    } catch (err) {
      toast(err.message || 'Error deleting page');
    }
  };

  const filtered = pages.filter((p) => {
    const matchQ =
      !q || p.title?.toLowerCase().includes(q.toLowerCase()) || p.slug?.includes(q.toLowerCase());
    const matchS = statusFilter === 'All' || p.status === statusFilter;
    return matchQ && matchS;
  });

  return (
    <>
      <PageHeader
        title="Custom Pages"
        subtitle="Create standalone pages (e.g. /team, /pricing) — no code needed. Link them from the Navbar/Footer menus."
        actions={
          <Link href="/admin/content/custom-pages/new">
            <Btn>
              <IconPlus size={15} /> New page
            </Btn>
          </Link>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchInput value={q} onChange={setQ} placeholder="Search pages…" />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="!w-auto">
          <option>All</option>
          <option>Published</option>
          <option>Draft</option>
        </Select>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<IconFileText size={28} />}
          title="No custom pages yet"
          text="Create your first standalone page — it goes live at /your-slug as soon as you publish it."
          action={
            <Link href="/admin/content/custom-pages/new">
              <Btn>
                <IconPlus size={15} /> New page
              </Btn>
            </Link>
          }
        />
      ) : (
        <TableWrap>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-900/10">
                <th className={thCls}>Title</th>
                <th className={thCls}>URL</th>
                <th className={thCls}>Status</th>
                <th className={thCls}>Updated</th>
                <th className={thCls}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-ink-900/5 hover:bg-slate-50">
                  <td className={tdCls}>
                    <span className="font-semibold text-ink-900">{p.title}</span>
                  </td>
                  <td className={tdCls}>
                    <a
                      href={`/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[13px] text-brand-600 hover:underline"
                    >
                      /{p.slug}
                    </a>
                  </td>
                  <td className={tdCls}>
                    <Badge tone={p.status === 'Published' ? 'green' : 'slate'}>{p.status}</Badge>
                  </td>
                  <td className={tdCls}>
                    {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : '—'}
                  </td>
                  <td className={tdCls}>
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/content/custom-pages/${p.id}/edit`} title="Edit">
                        <Btn variant="ghost">
                          <IconEdit size={15} />
                        </Btn>
                      </Link>
                      <Btn variant="ghost" onClick={() => setDeleting(p)} title="Delete">
                        <IconTrash size={15} />
                      </Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      )}

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete page">
        <ConfirmState
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
          title="Delete this page?"
          text={`"${deleting?.title}" will be removed and /${deleting?.slug} will stop working.`}
          confirmLabel="Delete"
        />
      </Modal>
    </>
  );
}
