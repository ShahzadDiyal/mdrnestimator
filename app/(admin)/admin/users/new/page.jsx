'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/components/admin/store';
import {
  PageHeader, Card, Btn, Field, Input, Select, DemoNote, toast,
} from '@/components/admin/ui';
import { IconArrowLeft, IconPlus, IconShield } from '@/components/admin/icons';

const ROLES = ['Estimator', 'Admin'];

export default function NewUserPage() {
  const router = useRouter();
  const { add } = useStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Estimator' });
  const [busy, setBusy] = useState(false);

  const createUser = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast('Name and email are required');
      return;
    }
    if (form.password && form.password.trim().length < 6) {
      toast('Password must be at least 6 characters long');
      return;
    }

    setBusy(true);
    try {
      const cleanEmail = form.email.trim().toLowerCase();

      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: cleanEmail,
          password: form.password.trim(),
          role: form.role,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');

      add('users', data.user || { name: form.name.trim(), email: cleanEmail, role: form.role, status: 'Active', lastActive: '—' });
      toast(`Created account for ${form.name.trim()} in Firebase Auth`);
      router.push('/admin/users');
    } catch (err) {
      toast(err.message || 'Error creating user');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <DemoNote />
      <div className="mb-4">
        <Link href="/admin/users" className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 hover:text-brand-700">
          <IconArrowLeft size={16} /> Back to Users & Roles
        </Link>
      </div>

      <PageHeader
        title="Create New User / Estimator"
        subtitle="Add a new team member with assigned role and credentials."
      />

      <div className="max-w-2xl">
        <Card className="p-6 sm:p-8">
          <form onSubmit={createUser} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-ink-900/5 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <IconShield size={20} />
              </div>
              <div>
                <h3 className="font-bold text-ink-900 text-base">User Account Details</h3>
                <p className="text-xs text-ink-500">All fields marked with * are required.</p>
              </div>
            </div>

            <Field label="Full Name *">
              <Input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. John Doe"
              />
            </Field>

            <Field label="Email Address *">
              <Input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="estimator@modernestimator.com"
              />
            </Field>

            <Field label="Password *" hint="Minimum 6 characters for Firebase Authentication.">
              <Input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
              />
            </Field>

            <Field label="Role *" hint="Estimators process quote requests; Admins manage full system settings and users.">
              <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </Select>
            </Field>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-ink-900/5">
              <Link href="/admin/users">
                <Btn type="button" variant="ghost">Cancel</Btn>
              </Link>
              <Btn type="submit" disabled={busy}>
                {busy ? 'Creating User…' : 'Create User Account'}
              </Btn>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
