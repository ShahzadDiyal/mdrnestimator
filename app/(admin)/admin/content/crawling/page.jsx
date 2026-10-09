'use client';
// Crawling & indexing — robots.txt, llms.txt, and per-URL index toggles.
// Drives /robots.txt, /llms.txt, /sitemap.xml and every page's noindex tag.

import { useEffect, useState } from 'react';
import { PageHeader, Card, Btn, Field, Textarea, Toggle, toast } from '@/components/admin/ui';
import { FormSkeleton } from '@/components/admin/Skeleton';
import { IconCheck } from '@/components/admin/icons';

const STATIC_PAGES = [
  { path: '/', label: 'Home', desc: '/' },
  { path: '/services', label: 'Services index', desc: '/services' },
  { path: '/trades', label: 'Trades index', desc: '/trades' },
  { path: '/portfolio', label: 'Portfolio', desc: '/portfolio' },
  { path: '/about', label: 'About', desc: '/about' },
  { path: '/contact', label: 'Contact', desc: '/contact' },
  { path: '/blog', label: 'Blog index', desc: '/blog' },
];

const GROUP_TOGGLES = [
  { key: 'indexServices', label: 'Service detail pages', desc: 'All /services/[slug] pages' },
  { key: 'indexTrades', label: 'Trade detail pages', desc: 'All /trades/[slug] pages' },
  { key: 'indexPosts', label: 'Blog posts', desc: 'All /blog/[slug] pages' },
];

const emptyForm = {
  robotsExtra: '',
  llmsTxt: '',
  pages: {},
  indexServices: true,
  indexTrades: true,
  indexPosts: true,
};

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

export default function CrawlingPage() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchCrawling = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/crawling');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch crawling settings');
      if (data.data) setForm({ ...emptyForm, ...data.data });
    } catch (err) {
      console.error('Error fetching crawling settings:', err);
      toast(err.message || 'Failed to fetch crawling settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrawling();
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const setPageIndex = (path, value) =>
    setForm((f) => ({ ...f, pages: { ...(f.pages || {}), [path]: { index: value } } }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/crawling', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      toast('Crawling settings saved');
    } catch (err) {
      console.error('Error saving crawling settings:', err);
      toast(err.message || 'Failed to save crawling settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Crawling & Indexing"
        subtitle="Control robots.txt, llms.txt, sitemap and which URLs search engines may index."
        actions={
          <Btn onClick={save} disabled={saving || loading}>
            <IconCheck size={16} /> {saving ? 'Saving…' : 'Save changes'}
          </Btn>
        }
      />

      {loading ? (
        <FormSkeleton />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-5">
            <Section
              title="Page indexing"
              hint="Turn a URL off to remove it from the sitemap, add a noindex tag, and disallow it in robots.txt."
            >
              <div className="space-y-3">
                {STATIC_PAGES.map((p) => (
                  <Toggle
                    key={p.path}
                    checked={form.pages?.[p.path]?.index !== false}
                    onChange={(v) => setPageIndex(p.path, v)}
                    label={`${p.label} (${p.desc})`}
                  />
                ))}
              </div>
            </Section>

            <Section
              title="Detail page groups"
              hint="Index switches for all detail pages of each type at once."
            >
              <div className="space-y-3">
                {GROUP_TOGGLES.map((g) => (
                  <Toggle
                    key={g.key}
                    checked={form[g.key] !== false}
                    onChange={(v) => setForm((f) => ({ ...f, [g.key]: v }))}
                    label={`${g.label} (${g.desc})`}
                  />
                ))}
              </div>
            </Section>
          </div>

          <div className="space-y-5">
            <Section
              title="robots.txt — extra rules"
              hint="Disallow lines are generated automatically from the toggles. Add any extra rules below; they are appended verbatim."
            >
              <Field label="Extra robots.txt rules">
                <Textarea
                  rows={6}
                  value={form.robotsExtra}
                  onChange={set('robotsExtra')}
                  placeholder={'User-agent: GPTBot\nDisallow: /admin/'}
                  className="font-mono text-[13px]"
                />
              </Field>
              <p className="text-xs text-ink-400">
                Live at <span className="font-mono">/robots.txt</span> — always ends with the sitemap URL.
              </p>
            </Section>

            <Section
              title="llms.txt"
              hint="Plain-text summary of the site for AI crawlers and assistants. Served verbatim."
            >
              <Field label="llms.txt content">
                <Textarea
                  rows={14}
                  value={form.llmsTxt}
                  onChange={set('llmsTxt')}
                  placeholder={'# Modern Estimator\n\n> What the site is about…'}
                  className="font-mono text-[13px]"
                />
              </Field>
              <p className="text-xs text-ink-400">
                Live at <span className="font-mono">/llms.txt</span>.
              </p>
            </Section>
          </div>
        </div>
      )}
    </>
  );
}
