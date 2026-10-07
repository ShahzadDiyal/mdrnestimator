'use client';
// Footer content — singleton.

import { useEffect, useState } from 'react';
import { PageHeader, Card, Btn, Field, Input, Textarea, toast } from '@/components/admin/ui';
import { IconCheck, IconLayers, IconRefresh } from '@/components/admin/icons';

const emptyForm = {
  aboutBlurb: '',
  facebook: '',
  linkedin: '',
  twitter: '',
  instagram: '',
  address: '',
  phone: '',
  email: '',
  copyrightName: '',
  privacyHref: '',
  termsHref: '',
};

export default function FooterPage() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const fetchFooter = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/footer');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch footer content');
      if (data.data) setForm({ ...emptyForm, ...data.data });
    } catch (err) {
      console.error('Error fetching footer:', err);
      toast(err.message || 'Failed to fetch footer content');
    } finally {
      setLoading(false);
    }
  };

  const seedFooter = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/footer/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed footer content');
      toast(data.message || 'Seeded footer content successfully!');
      await fetchFooter();
    } catch (err) {
      toast(err.message || 'Error seeding footer content');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchFooter();
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save footer content');
      toast('Footer content saved');
    } catch (err) {
      toast(err.message || 'Error saving footer content');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Footer"
        subtitle="The bottom of every page: about blurb, social links, contact column and legal links."
        actions={(
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={fetchFooter} disabled={loading}>
              <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Btn>
            <Btn variant="ghost" onClick={seedFooter} disabled={seeding}>
              <IconRefresh size={16} className={seeding ? 'animate-spin' : ''} /> Seed
            </Btn>
          </div>
        )}
      />

      <div className="max-w-2xl space-y-6">
        {loading ? (
          <Card className="py-10 text-center text-sm text-ink-500">Loading…</Card>
        ) : (
          <>
            <Card className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <IconLayers size={18} />
                </div>
                <h2 className="font-bold text-ink-900">About blurb</h2>
              </div>
              <Field label="About blurb">
                <Textarea rows={3} value={form.aboutBlurb} onChange={set('aboutBlurb')} placeholder="Short company description shown in the footer." />
              </Field>
            </Card>

            <Card className="space-y-4">
              <h2 className="font-bold text-ink-900">Social links</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Facebook URL">
                  <Input value={form.facebook} onChange={set('facebook')} placeholder="https://facebook.com/…" />
                </Field>
                <Field label="LinkedIn URL">
                  <Input value={form.linkedin} onChange={set('linkedin')} placeholder="https://linkedin.com/…" />
                </Field>
                <Field label="Twitter / X URL">
                  <Input value={form.twitter} onChange={set('twitter')} placeholder="https://x.com/…" />
                </Field>
                <Field label="Instagram URL">
                  <Input value={form.instagram} onChange={set('instagram')} placeholder="https://instagram.com/…" />
                </Field>
              </div>
            </Card>

            <Card className="space-y-4">
              <h2 className="font-bold text-ink-900">Contact column</h2>
              <Field label="Address">
                <Textarea rows={2} value={form.address} onChange={set('address')} placeholder="Street, suite, city, state and ZIP" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Phone">
                  <Input value={form.phone} onChange={set('phone')} placeholder="+1 (555) 123-4567" />
                </Field>
                <Field label="Email">
                  <Input type="email" value={form.email} onChange={set('email')} placeholder="hello@modernestimator.com" />
                </Field>
              </div>
            </Card>

            <Card className="space-y-4">
              <h2 className="font-bold text-ink-900">Legal</h2>
              <Field label="Copyright name">
                <Input value={form.copyrightName} onChange={set('copyrightName')} placeholder="e.g. Modern Estimator" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Privacy policy link">
                  <Input value={form.privacyHref} onChange={set('privacyHref')} placeholder="e.g. /privacy" />
                </Field>
                <Field label="Terms link">
                  <Input value={form.termsHref} onChange={set('termsHref')} placeholder="e.g. /terms" />
                </Field>
              </div>
            </Card>

            <div className="flex justify-end">
              <Btn onClick={save} disabled={saving}>
                <IconCheck size={16} /> {saving ? 'Saving…' : 'Save changes'}
              </Btn>
            </div>
          </>
        )}
      </div>
    </>
  );
}
