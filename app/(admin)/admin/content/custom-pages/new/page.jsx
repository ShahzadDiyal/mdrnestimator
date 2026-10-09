'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  PageHeader, Card, Btn, Field, Input, Textarea, Select, Toggle, toast,
} from '@/components/admin/ui';
import BlockEditor from '@/components/admin/BlockEditor';
import { IconArrowLeft, IconSave } from '@/components/admin/icons';

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-');

export default function NewCustomPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    blocks: [],
    status: 'Published',
    noindex: false,
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleTitleChange = (title) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: !slugTouched ? slugify(title) : prev.slug,
      metaTitle: !prev.metaTitle ? `${title} — Modern Estimator` : prev.metaTitle,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast('Please enter a page title.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/customPages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create page');
      toast('Page created successfully!');
      router.push('/admin/content/custom-pages');
    } catch (err) {
      console.error('Error creating custom page:', err);
      toast(err.message || 'Error creating page');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-4">
        <Link href="/admin/content/custom-pages" className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 hover:text-brand-600 transition-colors">
          <IconArrowLeft size={14} /> Back to Custom Pages
        </Link>
      </div>

      <PageHeader
        title="New Custom Page"
        subtitle="The page goes live at /your-slug as soon as you publish it."
        actions={
          <Btn onClick={handleSubmit} disabled={loading}>
            <IconSave size={15} /> {loading ? 'Saving…' : 'Create page'}
          </Btn>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl pb-16">
        <Card className="space-y-5">
          <h2 className="text-base font-bold text-ink-900 border-b border-ink-900/5 pb-3">Page details</h2>
          <Field label="Page title" hint="Shown in the page header and browser tab.">
            <Input required value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="e.g. Our Team" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="URL slug" hint="The page will live at /this-slug.">
              <Input
                value={form.slug}
                onChange={(e) => { setSlugTouched(true); setForm((f) => ({ ...f, slug: e.target.value })); }}
                placeholder="e.g. our-team"
                className="font-mono"
              />
            </Field>
            <Field label="Status">
              <Select value={form.status} onChange={set('status')}>
                <option>Published</option>
                <option>Draft</option>
              </Select>
            </Field>
          </div>
          <Toggle
            checked={form.noindex}
            onChange={(v) => setForm((f) => ({ ...f, noindex: v }))}
            label="Hide from search engines (noindex)"
          />
        </Card>

        <Card className="space-y-5">
          <h2 className="text-base font-bold text-ink-900 border-b border-ink-900/5 pb-3">Content blocks</h2>
          <BlockEditor blocks={form.blocks} onChange={(blocks) => setForm((f) => ({ ...f, blocks }))} />
        </Card>

        <Card className="space-y-5">
          <h2 className="text-base font-bold text-ink-900 border-b border-ink-900/5 pb-3">SEO</h2>
          <Field label="Meta title" hint="Defaults to the page title.">
            <Input value={form.metaTitle} onChange={set('metaTitle')} placeholder="Page title — Modern Estimator" />
          </Field>
          <Field label="Meta description" hint="Shown in search results and link previews.">
            <Textarea rows={3} value={form.metaDescription} onChange={set('metaDescription')} placeholder="One or two sentences…" />
          </Field>
        </Card>
      </form>
    </>
  );
}
