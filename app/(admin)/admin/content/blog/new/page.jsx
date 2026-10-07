'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  PageHeader, Card, Btn, Field, Input, Textarea, Select, DemoNote, toast,
} from '@/components/admin/ui';
import { IconArrowLeft, IconSave } from '@/components/admin/icons';

const STATUS_OPTIONS = ['Published', 'Draft'];
const CATEGORY_OPTIONS = ['Guides', 'Bidding', 'Industry News', 'Case Studies', 'Estimating Tech'];

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'Guides',
    author: 'Mike Carter',
    readTime: '5 min read',
    date: new Date().toISOString().slice(0, 10),
    featuredImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80',
    excerpt: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    tags: 'estimation, takeoff, construction',
    status: 'Published',
  });

  const handleTitleChange = (title) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: !slugTouched ? slugify(title) : prev.slug,
      metaTitle: !prev.metaTitle ? `${title} | Modern Estimator` : prev.metaTitle,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast('Please enter a title for the blog post.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create blog post');

      toast('Blog post created successfully!');
      router.push('/admin/content/blog');
    } catch (err) {
      console.error('Error creating post:', err);
      toast(err.message || 'Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DemoNote />
      <div className="mb-4">
        <Link href="/admin/content/blog" className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 hover:text-brand-600 transition-colors">
          <IconArrowLeft size={14} /> Back to Blog List
        </Link>
      </div>

      <PageHeader
        title="Create New Blog Post"
        subtitle="Add a new article to the website blog and database catalog."
      />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl pb-16">
        <Card className="space-y-5">
          <h2 className="text-base font-bold text-ink-900 border-b border-ink-900/5 pb-3">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Field label="Article Title" hint="Primary heading displayed on the blog page and cards.">
                <Input
                  required
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. How to Read a Quantity Takeoff Like a Pro"
                />
              </Field>
            </div>

            <Field label="URL Slug" hint="URL-friendly identifier. Auto-generated from title.">
              <Input
                required
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm({ ...form, slug: slugify(e.target.value) });
                }}
                placeholder="how-to-read-quantity-takeoff"
              />
            </Field>

            <Field label="Category">
              <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
            </Field>

            <Field label="Author Name">
              <Input
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                placeholder="Mike Carter"
              />
            </Field>

            <Field label="Read Time">
              <Input
                value={form.readTime}
                onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                placeholder="e.g. 5 min read"
              />
            </Field>

            <Field label="Publication Date">
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </Field>

            <Field label="Status">
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </Select>
            </Field>

            <div className="md:col-span-2">
              <Field label="Featured Image URL" hint="Direct link to a high-resolution cover image.">
                <Input
                  value={form.featuredImage}
                  onChange={(e) => setForm({ ...form, featuredImage: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Excerpt" hint="Short 1-2 sentence summary displayed on blog listings and cards.">
                <Textarea
                  rows={3}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="CSI divisions, waste factors and markups — a practical walkthrough for GCs..."
                />
              </Field>
            </div>
          </div>
        </Card>

        <Card className="space-y-5">
          <h2 className="text-base font-bold text-ink-900 border-b border-ink-900/5 pb-3">Article Content</h2>
          <Field label="Article Body (Markdown / Rich Text)" hint="Write the full body content. Supports headings, bold, bullet points, and code snippets.">
            <Textarea
              rows={12}
              className="font-mono text-xs leading-relaxed"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder={`## Introduction\nWrite your introduction here...\n\n### Key Takeaway 1\n1. Gross vs Net Quantities\n2. CSI MasterFormat breakdown`}
            />
          </Field>
        </Card>

        <Card className="space-y-5">
          <h2 className="text-base font-bold text-ink-900 border-b border-ink-900/5 pb-3">SEO & Metadata</h2>

          <div className="space-y-4">
            <Field label="Meta Title" hint="SEO Title used by search engines (defaults to title).">
              <Input
                value={form.metaTitle}
                onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                placeholder="How to Read a Quantity Takeoff Like a Pro | Modern Estimator"
              />
            </Field>

            <Field label="Meta Description" hint="SEO snippet shown on search engine results pages.">
              <Textarea
                rows={2}
                value={form.metaDescription}
                onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                placeholder="Master CSI MasterFormat divisions, waste factors, and material markups with our complete guide..."
              />
            </Field>

            <Field label="Tags" hint="Comma-separated keywords for filtering and search index.">
              <Input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="quantity takeoff, csi divisions, estimation guide"
              />
            </Field>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Link href="/admin/content/blog">
            <Btn variant="ghost" type="button">Cancel</Btn>
          </Link>
          <Btn type="submit" disabled={loading}>
            <IconSave size={16} /> {loading ? 'Saving Post...' : 'Save & Publish Post'}
          </Btn>
        </div>
      </form>
    </>
  );
}
