'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/components/admin/store';
import {
  PageHeader, Btn, StatusBadge, SearchInput, TableWrap, thCls, tdCls,
  DemoNote, EmptyState, Modal, ConfirmState, toast, Select,
} from '@/components/admin/ui';
import { IconPlus, IconEdit, IconTrash, IconLayers, IconRefresh } from '@/components/admin/icons';

export default function TradesPage() {
  const { state, setCol, remove } = useStore();
  const [q, setQ] = useState('');
  const [parentFilter, setParentFilter] = useState('All');
  const [deleting, setDeleting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const fetchTrades = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/trades');
      const data = await res.json();
      if (data.trades && Array.isArray(data.trades)) {
        setCol('trades', data.trades);
      }
    } catch (err) {
      console.error('Error fetching trades:', err);
      toast('Failed to fetch trade pages from database');
    } finally {
      setLoading(false);
    }
  };

  const seedAllTrades = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/trades/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed trades');
      toast(data.message || 'Seeded trade pages successfully!');
      await fetchTrades();
    } catch (err) {
      toast(err.message || 'Error seeding trade pages');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const trades = Array.isArray(state.trades) ? state.trades : [];
    return trades.filter((t) => {
      const matchesParent = parentFilter === 'All'
        ? true
        : parentFilter === 'Top'
        ? t.parent === '—' || !t.parent
        : t.parent === parentFilter;
      const matchesSearch = !needle || `${t.title} ${t.slug} ${t.parent} ${t.tagline}`.toLowerCase().includes(needle);
      return matchesParent && matchesSearch;
    });
  }, [state.trades, q, parentFilter]);

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      const res = await fetch(`/api/trades/${deleting.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete trade page');

      remove('trades', deleting.id);
      toast(`Trade page "${deleting.title}" removed from database`);
    } catch (err) {
      toast(err.message || 'Error deleting trade page');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <DemoNote />
      <PageHeader
        title="Trade Estimating Pages"
        subtitle={`${filtered.length} of ${state.trades?.length || 0} parent & sub-trade estimating pages in database`}
        actions={(
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={fetchTrades} disabled={loading}>
              <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Btn>
            <Btn variant="ghost" onClick={seedAllTrades} disabled={seeding}>
              {seeding ? 'Seeding…' : 'Sync All 29 Trade Pages'}
            </Btn>
            <Link href="/admin/content/trades/new">
              <Btn><IconPlus size={16} /> Create Trade Page</Btn>
            </Link>
          </div>
        )}
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <SearchInput value={q} onChange={setQ} placeholder="Search title, slug or parent trade…" />
        </div>
        <div className="w-full sm:w-56">
          <Select value={parentFilter} onChange={(e) => setParentFilter(e.target.value)}>
            <option value="All">All Hierarchy Levels</option>
            <option value="Top">Top-Level Parent Trades</option>
            <option value="Concrete Estimating">Sub-trades under Concrete</option>
            <option value="Electrical Estimating">Sub-trades under Electrical</option>
            <option value="Interior & Exterior Finishes">Sub-trades under Finishes</option>
            <option value="MEP Estimating">Sub-trades under MEP</option>
            <option value="Metals Estimating Services">Sub-trades under Metals</option>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<IconLayers size={22} />}
          title="No trade pages found"
          text="Try a different search or filter, or click 'Sync All 29 Trade Pages' to seed the database."
          action={(
            <div className="flex items-center gap-2">
              <Btn variant="ghost" onClick={seedAllTrades} disabled={seeding}>
                Sync All 29 Trade Pages
              </Btn>
              <Link href="/admin/content/trades/new">
                <Btn><IconPlus size={16} /> Create Trade Page</Btn>
              </Link>
            </div>
          )}
        />
      ) : (
        <TableWrap>
          <thead>
            <tr className="border-b border-ink-900/5 bg-slate-50/60">
              <th className={thCls}>Title</th>
              <th className={thCls}>Slug</th>
              <th className={thCls}>Parent Trade</th>
              <th className={thCls}>Status</th>
              <th className={`${thCls} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id || t.slug} className="border-b border-ink-900/5 transition last:border-0 hover:bg-slate-50/70">
                <td className={tdCls}>
                  <p className="font-semibold text-ink-900">{t.title}</p>
                  {t.tagline && <p className="mt-0.5 max-w-md truncate text-xs text-ink-500">{t.tagline}</p>}
                </td>
                <td className={`${tdCls} whitespace-nowrap font-mono text-xs text-ink-500`}>/{t.slug}</td>
                <td className={tdCls}>
                  {t.parent === '—' || !t.parent
                    ? <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">Top Level Parent</span>
                    : <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">Sub-trade of {t.parent}</span>}
                </td>
                <td className={tdCls}><StatusBadge status={t.status || 'Published'} /></td>
                <td className={`${tdCls} text-right`}>
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/admin/content/trades/${t.id}/edit`}
                      aria-label="Edit"
                      className="rounded-lg p-2 text-ink-400 transition hover:bg-brand-50 hover:text-brand-700"
                    >
                      <IconEdit size={16} />
                    </Link>
                    <button
                      onClick={() => setDeleting(t)}
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

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete Trade Page">
        <ConfirmState
          title="Delete this trade page?"
          text={`"${deleting?.title}" will be permanently removed from the database.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      </Modal>
    </>
  );
}
