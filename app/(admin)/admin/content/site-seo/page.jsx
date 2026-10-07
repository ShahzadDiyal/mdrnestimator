'use client';
// Site-wide SEO settings — singleton (root metadata, OpenGraph, Twitter,
// robots, Schema.org business data, sitemap defaults).

import { useEffect, useState } from 'react';
import { PageHeader, Card, Btn, Field, Input, Textarea, Select, Toggle, toast } from '@/components/admin/ui';
import { IconCheck, IconGlobe, IconRefresh } from '@/components/admin/icons';

const emptyForm = {
  siteUrl: '',
  keywords: '',
  ogType: '',
  ogLocale: '',
  ogSiteName: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  twitterCard: '',
  twitterTitle: '',
  twitterDescription: '',
  robotsIndex: true,
  robotsFollow: true,
  businessName: '',
  businessDescription: '',
  telephone: '',
  email: '',
  priceRange: '',
  streetAddress: '',
  addressLocality: '',
  addressRegion: '',
  postalCode: '',
  addressCountry: '',
  areaServed: '',
  ratingValue: '',
  reviewCount: '',
  sitemapChangeFreq: '',
  sitemapHomePriority: '',
  sitemapPagePriority: '',
  sitemapDetailPriority: '',
};

const CHANGE_FREQS = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];

function Section({ title, hint, children }) {
  return (
    <Card className="space-y-5">
      <div>
        <h2 className="text-base font-bold text-ink-900">{title}</h2>
        {hint && <p className="mt-0.5 text-sm text-ink-500">{hint}</p>}
      </div>
      {children}
    </Card>
  );
}

export default function SiteSeoPage() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const fetchSeo = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/siteSeo');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch SEO settings');
      if (data.data) setForm({ ...emptyForm, ...data.data });
    } catch (err) {
      console.error('Error fetching site SEO:', err);
      toast(err.message || 'Failed to fetch SEO settings');
    } finally {
      setLoading(false);
    }
  };

  const seedSeo = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/siteSeo/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed SEO settings');
      toast(data.message || 'Seeded SEO settings successfully!');
      await fetchSeo();
    } catch (err) {
      toast(err.message || 'Error seeding SEO settings');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchSeo();
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/siteSeo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save SEO settings');
      toast('SEO settings saved');
    } catch (err) {
      toast(err.message || 'Error saving SEO settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Site SEO"
        subtitle="Global SEO defaults: keywords, social sharing, crawler rules, structured data and sitemap."
        actions={(
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={fetchSeo} disabled={loading}>
              <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Btn>
            <Btn variant="ghost" onClick={seedSeo} disabled={seeding}>
              {seeding ? 'Seeding…' : 'Seed defaults'}
            </Btn>
            <Btn onClick={save} disabled={saving || loading}>
              <IconCheck size={16} /> {saving ? 'Saving…' : 'Save changes'}
            </Btn>
          </div>
        )}
      />

      {loading ? (
        <Card className="text-center text-sm text-ink-500">Loading SEO settings…</Card>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-5">
            <Section title="General" hint="Base URL and the global keyword list used in the site head.">
              <Field label="Site URL" hint="Canonical domain, no trailing slash.">
                <Input value={form.siteUrl} onChange={set('siteUrl')} placeholder="https://modernestimator.com" />
              </Field>
              <Field label="Keywords" hint="Comma-separated. Used in the global meta keywords tag.">
                <Textarea rows={3} value={form.keywords} onChange={set('keywords')} placeholder="construction estimation, quantity takeoff, …" />
              </Field>
            </Section>

            <Section title="OpenGraph" hint="How links look when shared on Facebook, LinkedIn, etc.">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Type">
                  <Input value={form.ogType} onChange={set('ogType')} placeholder="website" />
                </Field>
                <Field label="Locale">
                  <Input value={form.ogLocale} onChange={set('ogLocale')} placeholder="en_US" />
                </Field>
              </div>
              <Field label="Site name">
                <Input value={form.ogSiteName} onChange={set('ogSiteName')} placeholder="Modern Estimator" />
              </Field>
              <Field label="Default title">
                <Input value={form.ogTitle} onChange={set('ogTitle')} />
              </Field>
              <Field label="Default description">
                <Textarea rows={3} value={form.ogDescription} onChange={set('ogDescription')} />
              </Field>
              <Field label="Default share image" hint="Absolute URL. Leave empty to skip og:image.">
                <Input value={form.ogImage} onChange={set('ogImage')} placeholder="https://…" />
              </Field>
            </Section>

            <Section title="Twitter card" hint="How links look when shared on X / Twitter.">
              <Field label="Card type">
                <Input value={form.twitterCard} onChange={set('twitterCard')} placeholder="summary_large_image" />
              </Field>
              <Field label="Title">
                <Input value={form.twitterTitle} onChange={set('twitterTitle')} />
              </Field>
              <Field label="Description">
                <Textarea rows={3} value={form.twitterDescription} onChange={set('twitterDescription')} />
              </Field>
            </Section>

            <Section title="Crawlers" hint="Tells search engines whether the site may be indexed and followed.">
              <div className="space-y-3">
                <Toggle checked={!!form.robotsIndex} onChange={(v) => setForm((f) => ({ ...f, robotsIndex: v }))} label="Allow indexing (robots index)" />
                <Toggle checked={!!form.robotsFollow} onChange={(v) => setForm((f) => ({ ...f, robotsFollow: v }))} label="Allow following links (robots follow)" />
              </div>
            </Section>
          </div>

          <div className="space-y-5">
            <Section title="Schema.org — business" hint="Feeds the ProfessionalService JSON-LD on every page.">
              <Field label="Business name">
                <Input value={form.businessName} onChange={set('businessName')} />
              </Field>
              <Field label="Business description">
                <Textarea rows={3} value={form.businessDescription} onChange={set('businessDescription')} />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Telephone">
                  <Input value={form.telephone} onChange={set('telephone')} placeholder="+1-555-123-4567" />
                </Field>
                <Field label="Email">
                  <Input value={form.email} onChange={set('email')} placeholder="hello@modernestimator.com" />
                </Field>
              </div>
              <Field label="Price range" hint="E.g. $, $$, $$$ — shown in the schema.">
                <Input value={form.priceRange} onChange={set('priceRange')} placeholder="$$" />
              </Field>
            </Section>

            <Section title="Schema.org — address & area" hint="PostalAddress and areaServed in the JSON-LD.">
              <Field label="Street address">
                <Input value={form.streetAddress} onChange={set('streetAddress')} />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="City">
                  <Input value={form.addressLocality} onChange={set('addressLocality')} />
                </Field>
                <Field label="State / region">
                  <Input value={form.addressRegion} onChange={set('addressRegion')} />
                </Field>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Postal code">
                  <Input value={form.postalCode} onChange={set('postalCode')} />
                </Field>
                <Field label="Country code">
                  <Input value={form.addressCountry} onChange={set('addressCountry')} placeholder="US" />
                </Field>
              </div>
              <Field label="Area served">
                <Input value={form.areaServed} onChange={set('areaServed')} placeholder="United States" />
              </Field>
            </Section>

            <Section title="Schema.org — rating" hint="aggregateRating in the JSON-LD. Only use real numbers.">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Rating value">
                  <Input value={form.ratingValue} onChange={set('ratingValue')} placeholder="4.9" />
                </Field>
                <Field label="Review count">
                  <Input value={form.reviewCount} onChange={set('reviewCount')} placeholder="320" />
                </Field>
              </div>
            </Section>

            <Section title="Sitemap" hint="Defaults written into /sitemap.xml.">
              <Field label="Change frequency">
                <Select value={form.sitemapChangeFreq} onChange={set('sitemapChangeFreq')}>
                  {CHANGE_FREQS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </Select>
              </Field>
              <div className="grid gap-5 sm:grid-cols-3">
                <Field label="Homepage priority">
                  <Input value={form.sitemapHomePriority} onChange={set('sitemapHomePriority')} placeholder="1" />
                </Field>
                <Field label="Page priority">
                  <Input value={form.sitemapPagePriority} onChange={set('sitemapPagePriority')} placeholder="0.8" />
                </Field>
                <Field label="Detail priority">
                  <Input value={form.sitemapDetailPriority} onChange={set('sitemapDetailPriority')} placeholder="0.7" />
                </Field>
              </div>
            </Section>
          </div>
        </div>
      )}

      <p className="mt-6 flex items-start gap-2 text-xs text-ink-400">
        <IconGlobe size={14} className="mt-0.5 shrink-0" />
        These values are stored in Firestore and will drive the site head, JSON-LD and sitemap once the site-side wiring is enabled. Per-page titles and descriptions live under SEO Meta.
      </p>
    </>
  );
}
