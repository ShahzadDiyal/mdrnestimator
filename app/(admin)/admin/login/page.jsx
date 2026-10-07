'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/admin/auth';
import { Btn, Input, Field } from '@/components/admin/ui';
import { IconShield, IconCheck, IconAlert } from '@/components/admin/icons';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setBusy(true);
    setError('');
    
    try {
      const res = await login(email, password);
      if (res.ok) {
        router.replace('/admin/dashboard');
      } else {
        setError(res.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Brand panel */}
      <div className="relative hidden w-[46%] overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-ink-900 lg:block">
        <div className="grid-bg absolute inset-0" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Modern Estimator" width={1422} height={388} priority className="h-9 w-auto brightness-0 invert" />
            <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider border-l border-white/20 pl-2.5">Admin</span>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
              Construction estimation<br />management console.
            </h1>
            <ul className="mt-8 space-y-4 text-white/80">
              {['Secure Firebase Authentication for administrators', 'Real-time project pipeline & lead management', 'Centralized estimating dashboard'].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-500/20 text-accent-300">
                    <IconCheck size={14} />
                  </span>
                  <span className="text-[15px]">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-white/40">Secured with Firebase Backend Authentication &amp; Firestore.</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <Image src="/logo.png" alt="Modern Estimator" width={1422} height={388} priority className="h-8 w-auto" />
            <span className="text-xs font-semibold text-ink-400">· Admin</span>
          </div>

          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <IconShield size={22} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-ink-900">Admin Sign In</h2>
          <p className="mt-2 text-sm text-ink-500">Enter your administrator credentials to access the console.</p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <Field label="Email address">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@modernestimator.com"
                autoComplete="email"
              />
            </Field>
            <Field label="Password">
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </Field>

            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
                <IconAlert size={17} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Btn type="submit" className="w-full !py-3" disabled={busy}>
              {busy ? 'Authenticating…' : 'Sign In'}
            </Btn>
          </form>

          <div className="mt-8 rounded-2xl bg-slate-50 p-4 ring-1 ring-ink-900/5">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Firebase Setup</p>
            <p className="mt-1 text-xs text-ink-600 leading-relaxed">
              Ensure your Firebase credentials are in <code className="rounded bg-slate-200 px-1 font-mono">.env.local</code>. You can create an admin user in your Firebase Console under Authentication &gt; Users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
