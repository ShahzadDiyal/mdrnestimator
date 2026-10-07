'use client';
// Homepage hero section content — singleton.

import { useEffect, useState } from 'react';
import { PageHeader, Card, Btn, Field, Input, Textarea, toast } from '@/components/admin/ui';
import { IconCheck, IconStar, IconRefresh } from '@/components/admin/icons';

const emptyForm = {
  badge: '',
  title: '',
  titleAccent: '',
  titleSuffix: '',
  intro: '',
  ctaPrimary: '',
  ctaPrimaryHref: '',
  ctaSecondary: '',
  ctaSecondaryHref: '',
  image: '',
  imageAlt: '',
  trustBadges: [{ label: '', value: '' }, { label: '', value: '' }, { label: '', value: '' }],
};

export default function HeroPage() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const fetchHero = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hero');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch hero content');
      if (data.data) {
        const badges = Array.isArray(data.data.trustBadges) && data.data.trustBadges.length === 3
          ? data.data.trustBadges
          : emptyForm.trustBadges;
        setForm({ ...emptyForm, ...data.data, trustBadges: badges.map((b) => ({ label: b.label || '', value: b.value || '' })) });
      }
    } catch (err) {
      console.error('Error fetching hero:', err);
      toast(err.message || 'Failed to fetch hero content');
    } finally {
      setLoading(false);
    }
  };

  const seedHero = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/hero/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed hero content');
      toast(data.message || 'Seeded hero content successfully!');
      await fetchHero();
    } catch (err) {
      toast(err.message || 'Error seeding hero content');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchHero();
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setBadge = (i, k) => (e) => setForm((f) => ({
    ...f,
    trustBadges: f.trustBadges.map((b, bi) => (bi === i ? { ...b, [k]: e.target.value } : b)),
  }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save hero content');
      toast('Hero content saved');
    } catch (err) {
      toast(err.message || 'Error saving hero content');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Hero Section"
        subtitle="The big headline area at the top of the homepage."
        actions={(
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={fetchHero} disabled={loading}>
              <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Btn>
            <Btn variant="ghost" onClick={seedHero} disabled={seeding}>
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
                  <IconStar size={18} />
                </div>
                <h2 className="font-bold text-ink-900">Headline & intro</h2>
              </div>
              <Field label="Badge" hint="Small pill above the headline.">
                <Input value={form.badge} onChange={set('badge')} placeholder="e.g. Trusted by 500+ US Contractors" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Title (before accent)">
                  <Input value={form.title} onChange={set('title')} placeholder="e.g. Win more bids with" />
                </Field>
                <Field label="Title accent" hint="Highlighted words.">
                  <Input value={form.titleAccent} onChange={set('titleAccent')} placeholder="e.g. precise estimates" />
                </Field>
                <Field label="Title suffix">
                  <Input value={form.titleSuffix} onChange={set('titleSuffix')} placeholder="e.g. delivered fast" />
                </Field>
              </div>
              <Field label="Intro paragraph">
                <Textarea rows={3} value={form.intro} onChange={set('intro')} placeholder="One or two sentences under the headline." />
              </Field>
            </Card>

            <Card className="space-y-4">
              <h2 className="font-bold text-ink-900">Call-to-action buttons</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Primary button label">
                  <Input value={form.ctaPrimary} onChange={set('ctaPrimary')} placeholder="e.g. Get a free quote" />
                </Field>
                <Field label="Primary button link">
                  <Input value={form.ctaPrimaryHref} onChange={set('ctaPrimaryHref')} placeholder="e.g. #quote" />
                </Field>
                <Field label="Secondary button label">
                  <Input value={form.ctaSecondary} onChange={set('ctaSecondary')} placeholder="e.g. View services" />
                </Field>
                <Field label="Secondary button link">
                  <Input value={form.ctaSecondaryHref} onChange={set('ctaSecondaryHref')} placeholder="e.g. /services" />
                </Field>
              </div>
            </Card>

            <Card className="space-y-4">
              <h2 className="font-bold text-ink-900">Hero image</h2>
              <Field label="Image URL">
                <Input value={form.image} onChange={set('image')} placeholder="https://…" />
              </Field>
              {form.image.trim() && (
                <div className="overflow-hidden rounded-xl ring-1 ring-ink-900/10">
                  <img src={form.image} alt="Hero preview" className="h-44 w-full object-cover" />
                </div>
              )}
              <Field label="Image alt text">
                <Input value={form.imageAlt} onChange={set('imageAlt')} placeholder="Describe the image for screen readers" />
              </Field>
            </Card>

            <Card className="space-y-4">
              <h2 className="font-bold text-ink-900">Trust badges</h2>
              <p className="text-sm text-ink-500">The three small badges under the CTAs.</p>
              {form.trustBadges.map((b, i) => (
                <div key={i} className="grid gap-4 sm:grid-cols-2">
                  <Field label={`Badge ${i + 1} label`}>
                    <Input value={b.label} onChange={setBadge(i, 'label')} placeholder="e.g. Google Reviews" />
                  </Field>
                  <Field label={`Badge ${i + 1} value`}>
                    <Input value={b.value} onChange={setBadge(i, 'value')} placeholder="e.g. 5.0" />
                  </Field>
                </div>
              ))}
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
