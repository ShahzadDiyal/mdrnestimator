'use client';
// CTA banner content — singleton. Rendered on the homepage and detail pages.

import { useEffect, useState } from 'react';
import { PageHeader, Card, Btn, Field, Input, Textarea, toast } from '@/components/admin/ui';
import { FormSkeleton } from '@/components/admin/Skeleton';
import { IconCheck, IconSend, IconRefresh } from '@/components/admin/icons';

const emptyForm = {
  badge: '',
  heading: '',
  paragraph: '',
  ctaPrimary: '',
  ctaPrimaryHref: '',
  ctaSecondary: '',
  ctaSecondaryHref: '',
};

export default function CtaBannerPage() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const fetchBanner = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ctaBanner');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch CTA banner');
      if (data.data) setForm({ ...emptyForm, ...data.data });
    } catch (err) {
      console.error('Error fetching CTA banner:', err);
      toast(err.message || 'Failed to fetch CTA banner');
    } finally {
      setLoading(false);
    }
  };

  const seedBanner = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/ctaBanner/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed CTA banner');
      toast(data.message || 'Seeded CTA banner successfully!');
      await fetchBanner();
    } catch (err) {
      toast(err.message || 'Error seeding CTA banner');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/ctaBanner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save CTA banner');
      toast('CTA banner saved');
    } catch (err) {
      toast(err.message || 'Error saving CTA banner');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="CTA Banner"
        subtitle="The call-to-action banner shown on the homepage and every detail page."
        actions={(
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={fetchBanner} disabled={loading}>
              <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Btn>
            <Btn variant="ghost" onClick={seedBanner} disabled={seeding}>
              <IconRefresh size={16} className={seeding ? 'animate-spin' : ''} /> Seed
            </Btn>
          </div>
        )}
      />

      <div className="max-w-2xl space-y-6">
        {loading ? (
          <FormSkeleton />
        ) : (
          <>
            <Card className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <IconSend size={18} />
                </div>
                <h2 className="font-bold text-ink-900">Banner copy</h2>
              </div>
              <Field label="Badge">
                <Input value={form.badge} onChange={set('badge')} placeholder="e.g. Free quote — no obligation" />
              </Field>
              <Field label="Heading">
                <Input value={form.heading} onChange={set('heading')} placeholder="e.g. Ready to win your next bid?" />
              </Field>
              <Field label="Paragraph">
                <Textarea rows={3} value={form.paragraph} onChange={set('paragraph')} placeholder="Supporting sentence under the heading." />
              </Field>
            </Card>

            <Card className="space-y-4">
              <h2 className="font-bold text-ink-900">Buttons</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Primary button label">
                  <Input value={form.ctaPrimary} onChange={set('ctaPrimary')} placeholder="e.g. Get a free quote" />
                </Field>
                <Field label="Primary button link">
                  <Input value={form.ctaPrimaryHref} onChange={set('ctaPrimaryHref')} placeholder="e.g. #quote" />
                </Field>
                <Field label="Secondary button label">
                  <Input value={form.ctaSecondary} onChange={set('ctaSecondary')} placeholder="e.g. Call us" />
                </Field>
                <Field label="Secondary button link">
                  <Input value={form.ctaSecondaryHref} onChange={set('ctaSecondaryHref')} placeholder="e.g. tel:+15551234567" />
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
