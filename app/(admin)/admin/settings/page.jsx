'use client';
// Site settings — ADMIN ONLY. General details, security, and danger zone.
// Demo UI only — store persists to localStorage, no backend integration.

import { useEffect, useState } from 'react';
import { useStore } from '@/components/admin/store';
import { useAuth, isAdmin } from '@/components/admin/auth';
import {
  PageHeader, Card, Btn, Field, Input, Select, Toggle, DemoNote, EmptyState, toast,
} from '@/components/admin/ui';
import { IconShield, IconAlert } from '@/components/admin/icons';

const SESSION_TIMEOUTS = ['1 hour', '4 hours', '8 hours', '24 hours'];
const FILE_RETENTIONS = ['6 months', '12 months', '24 months'];

export default function SettingsPage() {
  const { state, setCol, reset } = useStore();
  const { user } = useAuth();
  const admin = isAdmin(user);

  const ss = state.siteSettings;
  const [general, setGeneral] = useState({
    siteName: ss.siteName,
    domain: ss.domain,
    phone: ss.phone,
    email: ss.email,
    address: ss.address,
  });

  // Keep the local form in sync with the store (e.g. after "Reset demo data").
  useEffect(() => {
    setGeneral({
      siteName: ss.siteName,
      domain: ss.domain,
      phone: ss.phone,
      email: ss.email,
      address: ss.address,
    });
  }, [ss]);

  if (!admin) {
    return (
      <div>
        <DemoNote />
        <PageHeader title="Settings" subtitle="Site details, security and danger zone." />
        <EmptyState
          icon={<IconShield size={22} />}
          title="Restricted"
          text="Only admins can manage users & roles."
        />
      </div>
    );
  }

  const saveGeneral = () => {
    setCol('siteSettings', { ...ss, ...general });
    toast('Site settings saved');
  };

  const setSec = (patch, msg) => {
    setCol('siteSettings', { ...state.siteSettings, ...patch });
    toast(msg);
  };

  const resetDemo = () => {
    reset();
    toast('Demo data reset');
  };

  return (
    <div>
      <DemoNote />
      <PageHeader
        title="Settings"
        subtitle="Placeholder details — the domain, phone number and address — should be replaced before launch."
      />

      <div className="max-w-2xl space-y-6">
        <Card className="space-y-5">
          <h2 className="text-base font-bold text-ink-900">General</h2>
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
            <Btn onClick={saveGeneral}>Save changes</Btn>
          </div>
        </Card>

        <Card className="space-y-5">
          <h2 className="text-base font-bold text-ink-900">Security</h2>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-ink-900">Two-factor authentication</p>
              <p className="mt-0.5 text-xs text-ink-500">Require a one-time code on every admin sign-in.</p>
            </div>
            <Toggle checked={!!ss.require2fa} onChange={(v) => setSec({ require2fa: v }, `Two-factor authentication ${v ? 'enabled' : 'disabled'}`)} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Session timeout">
              <Select value={ss.sessionTimeout} onChange={(e) => setSec({ sessionTimeout: e.target.value }, `Session timeout set to ${e.target.value}`)}>
                {SESSION_TIMEOUTS.map((o) => <option key={o} value={o}>{o}</option>)}
              </Select>
            </Field>
            <Field label="Uploaded drawing retention">
              <Select value={ss.fileRetention} onChange={(e) => setSec({ fileRetention: e.target.value }, `File retention set to ${e.target.value}`)}>
                {FILE_RETENTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </Select>
            </Field>
          </div>
        </Card>

        <Card className="space-y-4 ring-2 ring-rose-500">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <IconAlert size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-rose-700">Danger zone</h2>
              <p className="mt-1 text-sm text-ink-500">
                Resetting restores the original demo content (leads, facts, templates, users) and wipes anything you changed in this browser.
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Btn variant="danger" onClick={resetDemo}>Reset demo data</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}
