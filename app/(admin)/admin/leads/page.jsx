'use client';

import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/components/admin/store';
import {
  PageHeader, Btn, StatusBadge, SearchInput, Select, TableWrap,
  thCls, tdCls, DemoNote, EmptyState, toast,
} from '@/components/admin/ui';
import { IconDownload, IconInbox, IconEye, IconTrash, IconRefresh } from '@/components/admin/icons';
import { LEAD_STATUSES } from '@/components/admin/data';

function toCsv(rows) {
  const head = ['ID', 'Name', 'Company', 'Email', 'Phone', 'Service', 'Project Type', 'Location', 'Budget', 'Deadline', 'Status', 'Source', 'Created'];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return [head, ...rows.map((l) => [
    l.id, l.name, l.company, l.email, l.phone, l.service, l.projectType, l.location,
    l.budget, l.deadline, l.status, l.source, l.createdAt,
  ])].map((r) => r.map(esc).join(',')).join('\n');
}

export default function LeadsPage() {
  const { state, setCol, remove } = useStore();
  const params = useSearchParams();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const s = params.get('status');
    if (s) setStatus(s);
    const query = params.get('q');
    if (query) setQ(query);
  }, [params]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.leads && Array.isArray(data.leads)) {
        setCol('leads', data.leads);
      }
    } catch (err) {
      console.error('Error fetching leads from API:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch live leads from backend API once on page load/refresh
  useEffect(() => {
    fetchLeads();
  }, []);

  const leads = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return [...state.leads]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .filter((l) => (status === 'All' ? true : l.status === status))
      .filter((l) => !needle || [l.name, l.company, l.email, l.service, l.location, l.id].join(' ').toLowerCase().includes(needle));
  }, [state.leads, q, status]);

  const exportCsv = () => {
    const blob = new Blob([toCsv(leads)], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast(`Exported ${leads.length} leads to CSV`);
  };

  const handleDelete = (lead) => {
    if (confirm(`Are you sure you want to delete lead for ${lead.name}?`)) {
      remove('leads', lead.id);
      toast(`Lead for ${lead.name} deleted`);
    }
  };

  return (
    <>
      <DemoNote />
      <PageHeader
        title="Leads & Quotes"
        subtitle={`${leads.length} of ${state.leads.length} quote requests`}
        actions={
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={fetchLeads} disabled={loading}>
              <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Btn>
            <Btn variant="ghost" onClick={exportCsv}><IconDownload size={16} /> Export CSV</Btn>
          </div>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1"><SearchInput value={q} onChange={setQ} placeholder="Search name, company, email, service…" /></div>
        <div className="w-full sm:w-52">
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>All</option>
            {LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </Select>
        </div>
      </div>

      {leads.length === 0 ? (
        <EmptyState
          icon={<IconInbox size={22} />}
          title="No leads match"
          text="Try a different search or status filter."
          action={<Btn variant="ghost" onClick={() => { setQ(''); setStatus('All'); }}>Clear filters</Btn>}
        />
      ) : (
        <TableWrap>
          <thead>
            <tr className="border-b border-ink-900/5 bg-slate-50/60">
              <th className={thCls}>Lead</th>
              <th className={thCls}>Service</th>
              <th className={thCls}>Budget</th>
              <th className={thCls}>Deadline</th>
              <th className={thCls}>Status</th>
              <th className={thCls}>Source</th>
              <th className={thCls + ' text-right'}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} className="border-b border-ink-900/5 last:border-0 transition hover:bg-slate-50/70">
                <td className={tdCls}>
                  <Link href={`/admin/leads/${l.id}`} className="font-semibold text-ink-900 hover:text-brand-700">{l.name}</Link>
                  <p className="text-xs text-ink-400">{l.company} · {l.location}</p>
                </td>
                <td className={tdCls}>{l.service}</td>
                <td className={tdCls + ' font-semibold'}>{l.budget}</td>
                <td className={tdCls + ' text-ink-500'}>{l.deadline}</td>
                <td className={tdCls}><StatusBadge status={l.status} /></td>
                <td className={tdCls}><span className="text-xs font-medium text-ink-500">{l.source}</span></td>
                <td className={tdCls + ' text-right'}>
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/leads/${l.id}`} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50">
                      <IconEye size={14} /> Open
                    </Link>
                    <button
                      onClick={() => handleDelete(l)}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                      title="Delete lead"
                    >
                      <IconTrash size={14} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </>
  );
}
