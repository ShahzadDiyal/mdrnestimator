'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/components/admin/store';
import {
  PageHeader, Btn, StatusBadge, SearchInput, TableWrap, thCls, tdCls,
  DemoNote, EmptyState, Modal, ConfirmState, Select, toast,
} from '@/components/admin/ui';
import { IconPlus, IconEdit, IconTrash, IconFileText, IconRefresh } from '@/components/admin/icons';

export default function ServicesPage() {
  const { state, setCol, remove } = useStore();
  const [q, setQ] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [deleting, setDeleting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (data.services && Array.isArray(data.services)) {
        setCol('services', data.services);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      toast('Failed to fetch services from database');
    } finally {
      setLoading(false);
    }
  };

  const seedAllServices = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/services/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed services');
      toast(data.message || 'Seeded services successfully!');
      await fetchServices();
    } catch (err) {
      toast(err.message || 'Error seeding services');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const services = Array.isArray(state.services) ? state.services : [];
    return services.filter((s) => {
      const matchesCategory = categoryFilter === 'All' || (s.category || 'Primary Service') === categoryFilter;
      const matchesSearch = !needle || `${s.title} ${s.slug} ${s.category} ${s.short}`.toLowerCase().includes(needle);
      return matchesCategory && matchesSearch;
    });
  }, [state.services, q, categoryFilter]);

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      const res = await fetch(`/api/services/${deleting.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete service');

      remove('services', deleting.id);
      toast(`Service "${deleting.title}" removed from database`);
    } catch (err) {
      toast(err.message || 'Error deleting service');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <DemoNote />
      <PageHeader
        title="Services & Trade Offerings"
        subtitle={`${state.services?.length || 0} services and trade estimation`}
        actions={(
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={fetchServices} disabled={loading}>
              <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Btn>
         
            <Link href="/admin/content/services/new">
              <Btn><IconPlus size={16} /> Create New Service</Btn>
            </Link>
          </div>
        )}
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <SearchInput value={q} onChange={setQ} placeholder="Search title, slug or category…" />
        </div>
        <div className="w-full sm:w-56">
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Primary Service">Primary Services (6)</option>
            <option value="Trade Estimating">Trade Estimating (29)</option>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<IconFileText size={22} />}
          title="No services found"
          text="Try a different search or filter, or click 'Sync All 35 User Services' to seed the database."
          action={(
            <div className="flex items-center gap-2">
              <Btn variant="ghost" onClick={seedAllServices} disabled={seeding}>
                Sync All 35 User Services
              </Btn>
              <Link href="/admin/content/services/new">
                <Btn><IconPlus size={16} /> Create New Service</Btn>
              </Link>
            </div>
          )}
        />
      ) : (
        <TableWrap>
          <thead>
            <tr className="border-b border-ink-900/5 bg-slate-50/60">
              <th className={thCls}>Service Title</th>
              <th className={thCls}>Category</th>
              <th className={thCls}>Slug</th>
              <th className={thCls}>Status</th>
              <th className={`${thCls} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id || s.slug} className="border-b border-ink-900/5 transition last:border-0 hover:bg-slate-50/70">
                <td className={tdCls}>
                  <p className="font-semibold text-ink-900">{s.title}</p>
                  <p className="mt-0.5 max-w-xl truncate text-xs text-ink-500">{s.short || s.tagline}</p>
                </td>
                <td className={tdCls}>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    s.category === 'Primary Service'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {s.category || 'Primary Service'}
                  </span>
                </td>
                <td className={`${tdCls} whitespace-nowrap font-mono text-xs text-ink-500`}>/{s.slug}</td>
                <td className={tdCls}><StatusBadge status={s.status || 'Published'} /></td>
                <td className={`${tdCls} text-right`}>
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/admin/content/services/${s.id}/edit`}
                      aria-label="Edit"
                      className="rounded-lg p-2 text-ink-400 transition hover:bg-brand-50 hover:text-brand-700"
                    >
                      <IconEdit size={16} />
                    </Link>
                    <button
                      onClick={() => setDeleting(s)}
                      aria-label="Delete"
                      className="rounded-lg p-2 text-ink-400 transition hover:bg-rose-50 hover:text-rose-600"
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

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete Service">
        <ConfirmState
          title="Delete this service?"
          text={`"${deleting?.title}" will be permanently removed from the database.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      </Modal>
    </>
  );
}
