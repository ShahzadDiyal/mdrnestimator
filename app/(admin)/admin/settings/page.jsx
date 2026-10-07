'use client';
// Site settings — ADMIN ONLY. General details and security.

import { useEffect, useState } from 'react';
import { useStore } from '@/components/admin/store';
import { useAuth, isAdmin } from '@/components/admin/auth';
import {
  PageHeader, Card, Btn, Field, Input, Select, Toggle, EmptyState, toast,
} from '@/components/admin/ui';
import { FormSkeleton } from '@/components/admin/Skeleton';
import { IconShield, IconRefresh } from '@/components/admin/icons';

const SESSION_TIMEOUTS = ['1 hour', '4 hours', '8 hours', '24 hours'];
const FILE_RETENTIONS = ['6 months', '12 months', '24 months'];

export default function SettingsPage() {
  const { setCol } = useStore();
  const { user } = useAuth();
  const admin = isAdmin(user);

  const [general, setGeneral] = useState({
    siteName: '',
    domain: '',
    phone: '',
    email: '',
    address: '',
  });
  const [brand, setBrand] = useState({
    logoUrl: '/logo.png',
    logoAlt: '',
    faviconUrl: '',
  });
  const [security, setSecurity] = useState({
    require2fa: false,
    sessionTimeout: SESSION_TIMEOUTS[0],
    fileRetention: FILE_RETENTIONS[0],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/siteSettings');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch site settings');
      if (data.data) {
        setCol('siteSettings', data.data);
        setGeneral({
          siteName: data.data.siteName || '',
          domain: data.data.domain || '',
          phone: data.data.phone || '',
          email: data.data.email || '',
          address: data.data.address || '',
        });
        setSecurity({
          require2fa: !!data.data.require2fa,
          sessionTimeout: data.data.sessionTimeout || SESSION_TIMEOUTS[0],
          fileRetention: data.data.fileRetention || FILE_RETENTIONS[0],
        });
        setBrand({
          logoUrl: data.data.logoUrl || '/logo.png',
          logoAlt: data.data.logoAlt || '',
          faviconUrl: data.data.faviconUrl || '',
        });
      }
    } catch (err) {
      console.error('Error fetching site settings:', err);
      toast(err.message || 'Failed to fetch site settings');
    } finally {
      setLoading(false);
    }
  };

  const seedSettings = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/siteSettings/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed site settings');
      toast(data.message || 'Seeded site settings successfully!');
      await fetchSettings();
    } catch (err) {
      toast(err.message || 'Error seeding site settings');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const putSettings = async (patch, msg) => {
    try {
      const res = await fetch('/api/siteSettings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save site settings');
      setCol('siteSettings', data.data || patch);
      if (msg) toast(msg);
    } catch (err) {
      toast(err.message || 'Error saving site settings');
    }
  };

  if (!admin) {
    return (
      <div>
        <PageHeader title="Settings" subtitle="Site details and security." />
        <EmptyState
          icon={<IconShield size={22} />}
          title="Restricted"
          text="Only admins can manage site settings."
        />
      </div>
    );
  }

  const saveGeneral = async () => {
    setSaving(true);
    await putSettings(general, 'Site settings saved');
    setSaving(false);
  };

  const saveBrand = async () => {
    setSaving(true);
    await putSettings(brand, 'Brand settings saved');
    setSaving(false);
  };

  const setSec = async (patch, msg) => {
    setSecurity((s) => ({ ...s, ...patch }));
    await putSettings(patch, msg);
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Placeholder details — the domain, phone number and address — should be replaced before launch."
        actions={(
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={fetchSettings} disabled={loading}>
              <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Btn>
            <Btn variant="ghost" onClick={seedSettings} disabled={seeding}>
              <IconRefresh size={16} className={seeding ? 'animate-spin' : ''} /> Seed
            </Btn>
          </div>
        )}
      />

      <div className="max-w-2xl space-y-6">
        <Card className="space-y-5">
          <h2 className="text-base font-bold text-ink-900">General</h2>
          {loading ? (
            <FormSkeleton />
          ) : (
            <>
              <Field label="Site name">
                <Input value={general.siteName} onChange={(e) => setGeneral({ ...general, siteName: e.target.value })} />
              </Field>
              <Field label="Domain">
                <Input value={general.domain} onChange={(e) => setGeneral({ ...general, domain: e.target.value })} placeholder="modernestimator.com" />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Phone">
                  <Input value={general.phone} onChange={(e) => setGeneral({ ...general, phone: e.target.value })} placeholder="+1 (555) 123-4567" />
                </Field>
                <Field label="Email">
                  <Input type="email" value={general.email} onChange={(e) => setGeneral({ ...general, email: e.target.value })} placeholder="hello@modernestimator.com" />
                </Field>
              </div>
              <Field label="Address">
                <Input value={general.address} onChange={(e) => setGeneral({ ...general, address: e.target.value })} />
              </Field>
              <div className="flex justify-end border-t border-ink-900/5 pt-5">
                <Btn onClick={saveGeneral} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Btn>
              </div>
            </>
          )}
        </Card>

        <Card className="space-y-5">
          <div>
            <h2 className="text-base font-bold text-ink-900">Brand</h2>
            <p className="mt-0.5 text-sm text-ink-500">Logo and favicon used across the website, navbar, and admin panel.</p>
          </div>
          {loading ? (
            <FormSkeleton />
          ) : (
            <>
              <div className="flex items-start gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-ink-900/10 bg-slate-50 p-2">
                  {brand.logoUrl ? (
                    <img src={brand.logoUrl} alt={brand.logoAlt || 'Logo preview'} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-xs text-ink-300">No logo</span>
                  )}
                </div>
                <div className="flex-1 space-y-5">
                  <Field label="Logo image URL" hint="Used in the navbar, admin sidebar, and loading screen.">
                    <Input value={brand.logoUrl} onChange={(e) => setBrand({ ...brand, logoUrl: e.target.value })} placeholder="/logo.png or https://…" className="font-mono" />
                  </Field>
                  <Field label="Logo alt text">
                    <Input value={brand.logoAlt} onChange={(e) => setBrand({ ...brand, logoAlt: e.target.value })} placeholder="Modern Estimator" />
                  </Field>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-ink-900/10 bg-slate-50 p-2">
                  {brand.faviconUrl ? (
                    <img src={brand.faviconUrl} alt="Favicon preview" className="h-8 w-8 object-contain" />
                  ) : (
                    <span className="text-xs text-ink-300">No favicon</span>
                  )}
                </div>
                <div className="flex-1">
                  <Field label="Favicon URL" hint="Small icon shown in the browser tab. Use a 32×32 or 64×64 PNG/ICO.">
                    <Input value={brand.faviconUrl} onChange={(e) => setBrand({ ...brand, faviconUrl: e.target.value })} placeholder="https://…/favicon.png" className="font-mono" />
                  </Field>
                </div>
              </div>
              <div className="flex justify-end border-t border-ink-900/5 pt-5">
                <Btn onClick={saveBrand} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Btn>
              </div>
            </>
          )}
        </Card>

        <Card className="space-y-5">
          <h2 className="text-base font-bold text-ink-900">Security</h2>
          {loading ? (
            <FormSkeleton />
          ) : (
            <>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-ink-900">Two-factor authentication</p>
                  <p className="mt-0.5 text-xs text-ink-500">Require a one-time code on every admin sign-in.</p>
                </div>
                <Toggle checked={!!security.require2fa} onChange={(v) => setSec({ require2fa: v }, `Two-factor authentication ${v ? 'enabled' : 'disabled'}`)} />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Session timeout">
                  <Select value={security.sessionTimeout} onChange={(e) => setSec({ sessionTimeout: e.target.value }, `Session timeout set to ${e.target.value}`)}>
                    {SESSION_TIMEOUTS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </Select>
                </Field>
                <Field label="Uploaded drawing retention">
                  <Select value={security.fileRetention} onChange={(e) => setSec({ fileRetention: e.target.value }, `File retention set to ${e.target.value}`)}>
                    {FILE_RETENTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </Select>
                </Field>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
