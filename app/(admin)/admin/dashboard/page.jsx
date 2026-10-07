'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/components/admin/auth';
import { useStore } from '@/components/admin/store';
import { PageHeader, Card, Stat, StatusBadge, tdCls, thCls, TableWrap, EmptyState, Btn } from '@/components/admin/ui';
import { IconInbox, IconDollar, IconChart, IconClock, IconShield, IconRefresh } from '@/components/admin/icons';
import { LEAD_STATUSES } from '@/components/admin/data';

export default function DashboardPage() {
  const { user } = useAuth();
  const { state, setCol } = useStore();
  const [loading, setLoading] = useState(false);
  const leads = state?.leads || [];

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.leads && Array.isArray(data.leads)) {
        setCol('leads', data.leads);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = useMemo(() => {
    const by = (s) => leads.filter((l) => l.status === s).length;
    const pipeline = leads.filter((l) => ['New', 'Contacted', 'Quoted'].includes(l.status)).length;
    const won = by('Won');
    const value = leads
      .filter((l) => l.status !== 'Lost')
      .reduce((sum, l) => sum + Number(String(l.quotedAmount || l.budget || '0').replace(/[^0-9.]/g, '') || 0), 0);
    return { total: leads.length, fresh: by('New'), pipeline, won, value };
  }, [leads]);

  const recent = useMemo(
    () => [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    [leads]
  );

  const funnel = LEAD_STATUSES.map((s) => ({
    status: s,
    count: leads.filter((l) => l.status === s).length,
  }));
  const funnelMax = Math.max(1, ...funnel.map((f) => f.count));

  return (
    <>
      {/* Active Admin Banner */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-brand-900 to-brand-800 p-5 text-white shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-accent-400">
            <IconShield size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold">Welcome back, {user?.name || user?.email?.split('@')[0] || 'Admin'}</h2>
            <p className="text-xs text-white/70">Connected as <span className="font-mono text-white/90">{user?.email}</span> ({user?.role || 'Admin'})</p>
          </div>
        </div>
      </div>

      <PageHeader
        title="Dashboard"
        subtitle="A centralized overview of your estimating pipeline and incoming quote requests."
        actions={
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={fetchDashboardData} disabled={loading}>
              <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Btn>
            <Link href="/admin/leads"><Btn variant="ghost"><IconInbox size={16} /> View all leads</Btn></Link>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total leads" value={stats.total} sub="All time" icon={<IconInbox size={20} />} tone="brand" />
        <Stat label="New leads" value={stats.fresh} sub="Need first contact" icon={<IconClock size={20} />} tone="blue" />
        <Stat label="In pipeline" value={stats.pipeline} sub="New · Contacted · Quoted" icon={<IconChart size={20} />} tone="amber" />
        <Stat label="Pipeline value" value={`$${stats.value.toLocaleString()}`} sub={`${stats.won} won`} icon={<IconDollar size={20} />} tone="green" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Funnel */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-ink-900">Lead funnel</h3>
            <span className="text-xs font-semibold text-ink-400">Pipeline Status</span>
          </div>
          <div className="space-y-3">
            {funnel.map((f) => (
              <div key={f.status}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <StatusBadge status={f.status} />
                  <span className="font-bold text-ink-900">{f.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-400 transition-all"
                    style={{ width: `${(f.count / funnelMax) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl bg-brand-50 p-4 text-sm text-brand-800 ring-1 ring-brand-100">
            <p className="font-bold">Attention Needed</p>
            <p className="mt-1">{stats.fresh} new {stats.fresh === 1 ? 'quote request has' : 'quote requests have'} not been contacted yet.</p>
          </div>
        </Card>

        {/* Recent leads */}
        <div className="lg:col-span-3">
          <TableWrap>
            <thead>
              <tr className="border-b border-ink-900/5 bg-slate-50/60">
                <th className={thCls}>Lead</th>
                <th className={thCls}>Service</th>
                <th className={thCls}>Status</th>
                <th className={thCls}>Received</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((l) => (
                <tr key={l.id} className="border-b border-ink-900/5 last:border-0 transition hover:bg-slate-50/70">
                  <td className={tdCls}>
                    <p className="font-semibold text-ink-900">{l.name}</p>
                    <p className="text-xs text-ink-400">{l.company}</p>
                  </td>
                  <td className={tdCls}>{l.service}</td>
                  <td className={tdCls}><StatusBadge status={l.status} /></td>
                  <td className={tdCls + ' text-ink-400'}>{new Date(l.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </div>
      </div>

      {leads.length === 0 && (
        <div className="mt-6">
          <EmptyState icon={<IconInbox size={22} />} title="No leads yet" text="Quote requests from the website will appear here." />
        </div>
      )}
    </>
  );
}
