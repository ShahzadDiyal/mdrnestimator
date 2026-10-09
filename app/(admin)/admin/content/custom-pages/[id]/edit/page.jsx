'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  PageHeader, Card, Btn, Field, Input, Textarea, Select, Toggle, toast,
} from '@/components/admin/ui';
import { FormSkeleton } from '@/components/admin/Skeleton';
import BlockEditor from '@/components/admin/BlockEditor';
import { IconArrowLeft, IconSave } from '@/components/admin/icons';

export default function EditCustomPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/customPages/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load page');
        setForm({
          title: data.page.title || '',
          slug: data.page.slug || '',
          metaTitle: data.page.metaTitle || '',
          metaDescription: data.page.metaDescription || '',
          blocks: Array.isArray(data.page.blocks) ? data.page.blocks : [],
          status: data.page.status || 'Draft',
          noindex: !!data.page.noindex,
        });
      } catch (err) {
        toast(err.message || 'Failed to load page');
        router.push('/admin/content/custom-pages');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast('Please enter a page title.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/customPages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save page');
      toast('Page saved successfully!');
      router.push('/admin/content/custom-pages');
    } catch (err) {
      console.error('Error saving custom page:', err);
      toast(err.message || 'Error saving page');
    } finally {
      setSaving(false);
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
        title="Edit Custom Page"
        subtitle={form ? `Live at /${form.slug}` : ''}
        actions={
          <Btn onClick={handleSubmit} disabled={saving || loading}>
            <IconSave size={15} /> {saving ? 'Saving…' : 'Save changes'}
          </Btn>
        }
      />

      {loading || !form ? (
        <FormSkeleton />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl pb-16">
          <Card className="space-y-5">
            <h2 className="text-base font-bold text-ink-900 border-b border-ink-900/5 pb-3">Page details</h2>
            <Field label="Page title">
              <Input required value={form.title} onChange={set('title')} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="URL slug" hint="The page lives at /this-slug.">
                <Input value={form.slug} onChange={set('slug')} className="font-mono" />
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
            <Field label="Meta title">
              <Input value={form.metaTitle} onChange={set('metaTitle')} />
            </Field>
            <Field label="Meta description">
              <Textarea rows={3} value={form.metaDescription} onChange={set('metaDescription')} />
            </Field>
          </Card>
        </form>
      )}
    </>
  );
}
