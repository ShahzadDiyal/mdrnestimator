'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/components/admin/store';
import { useAuth } from '@/components/admin/auth';
import {
  PageHeader, Btn, Select, StatusBadge, Modal, DemoNote,
  ConfirmState, TableWrap, thCls, tdCls, toast,
} from '@/components/admin/ui';
import { IconPlus, IconTrash, IconRefresh } from '@/components/admin/icons';

const ROLES = ['Estimator', 'Admin'];

export default function UsersPage() {
  const { state, setCol, update, remove } = useStore();
  const { user } = useAuth();

  const [deleting, setDeleting] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.users && Array.isArray(data.users)) {
        setCol('users', data.users);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fmtDate = (iso) => {
    if (!iso || iso === '—') return '—';
    try { return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }); }
    catch { return iso; }
  };

  const changeRole = async (u, role) => {
    try {
      const res = await fetch(`/api/users/${u.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update role');

      update('users', u.id, { role });
      toast(`${u.name} role set to ${role}`);
    } catch (err) {
      toast(err.message || 'Error updating user role');
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      const res = await fetch(`/api/users/${deleting.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user');

      remove('users', deleting.id);
      toast(`User ${deleting.name} removed`);
    } catch (err) {
      toast(err.message || 'Error removing user');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <DemoNote />
      <PageHeader
        title="Users & roles"
        subtitle="Create and manage estimators and admin team members."
        actions={
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={fetchUsers} disabled={loading}>
              <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Btn>
            <Link href="/admin/users/new">
              <Btn><IconPlus size={16} /> Create User / Estimator</Btn>
            </Link>
          </div>
        }
      />

      <TableWrap>
        <thead>
          <tr className="border-b border-ink-900/5 bg-slate-50/60">
            <th className={thCls}>Name</th>
            <th className={thCls}>Email</th>
            <th className={thCls}>Role</th>
            <th className={thCls}>Status</th>
            <th className={thCls}>Last active</th>
            <th className={`${thCls} text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(state.users || []).map((u) => (
            <tr key={u.id || u.email} className="border-b border-ink-900/5 last:border-0 hover:bg-slate-50">
              <td className={`${tdCls} font-semibold text-ink-900`}>{u.name}</td>
              <td className={tdCls}>{u.email}</td>
              <td className={tdCls}>
                <StatusBadge status={u.role || 'Estimator'} />
              </td>
              <td className={tdCls}>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${u.status === 'Active' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {u.status || 'Active'}
                </span>
              </td>
              <td className={tdCls}>{fmtDate(u.lastActive || u.createdAt)}</td>
              <td className={tdCls}>
                <div className="flex items-center justify-end gap-2">
                  <div className="w-36">
                    <Select value={u.role || 'Estimator'} onChange={(e) => changeRole(u, e.target.value)}>
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </Select>
                  </div>
                  <button
                    onClick={() => setDeleting(u)}
                    className="rounded-lg p-2 text-ink-400 hover:bg-rose-50 hover:text-rose-600"
                    aria-label={`Remove ${u.name}`}
                  >
                    <IconTrash size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="">
        {deleting && (
          <ConfirmState
            title="Remove user?"
            text={`${deleting.name} (${deleting.email}) will lose access to the admin panel.`}
            confirmLabel="Remove"
            onCancel={() => setDeleting(null)}
            onConfirm={confirmDelete}
          />
        )}
      </Modal>
    </div>
  );
}
