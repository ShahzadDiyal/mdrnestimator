'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  PageHeader, Card, Btn, Field, Input, Textarea, Select, DemoNote, toast,
} from '@/components/admin/ui';
import { IconArrowLeft, IconSave, IconTrash } from '@/components/admin/icons';

const STATUS_OPTIONS = ['Published', 'Draft'];
const CATEGORY_OPTIONS = ['Guides', 'Bidding', 'Industry News', 'Case Studies', 'Estimating Tech'];

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');

export default function EditBlogPostPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'Guides',
    author: '',
    readTime: '',
    date: '',
    featuredImage: '',
    excerpt: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    tags: '',
    status: 'Draft',
  });

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/posts/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Post not found');

        if (data.post) {
          setForm({
            title: data.post.title || '',
            slug: data.post.slug || '',
            category: data.post.category || 'Guides',
            author: data.post.author || '',
            readTime: data.post.readTime || '',
            date: data.post.date || new Date().toISOString().slice(0, 10),
            featuredImage: data.post.featuredImage || '',
            excerpt: data.post.excerpt || '',
            content: data.post.content || '',
            metaTitle: data.post.metaTitle || '',
            metaDescription: data.post.metaDescription || '',
            tags: data.post.tags || '',
            status: data.post.status || 'Draft',
          });
        }
      } catch (err) {
        console.error('Error loading post:', err);
        toast(err.message || 'Error loading blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast('Please enter a title for the blog post.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update blog post');

      toast('Blog post updated successfully!');
      router.push('/admin/content/blog');
    } catch (err) {
      console.error('Error updating post:', err);
      toast(err.message || 'Error updating post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-ink-500 font-medium">Loading post details from database...</p>
      </div>
    );
  }

  return (
    <>
      <DemoNote />
      <div className="mb-4">
        <Link href="/admin/content/blog" className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 hover:text-brand-600 transition-colors">
          <IconArrowLeft size={14} /> Back to Blog List
        </Link>
      </div>

      <PageHeader
        title={`Edit Post: ${form.title || 'Untitled'}`}
        subtitle={`Database ID: ${id}`}
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
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. How to Read a Quantity Takeoff Like a Pro"
                />
              </Field>
            </div>

            <Field label="URL Slug">
              <Input
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
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
              <Field label="Featured Image URL">
                <Input
                  value={form.featuredImage}
                  onChange={(e) => setForm({ ...form, featuredImage: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Excerpt">
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
          <Field label="Article Body (Markdown / Rich Text)">
            <Textarea
              rows={12}
              className="font-mono text-xs leading-relaxed"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write full article body text..."
            />
          </Field>
        </Card>

        <Card className="space-y-5">
          <h2 className="text-base font-bold text-ink-900 border-b border-ink-900/5 pb-3">SEO & Metadata</h2>

          <div className="space-y-4">
            <Field label="Meta Title">
              <Input
                value={form.metaTitle}
                onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                placeholder="SEO Title..."
              />
            </Field>

            <Field label="Meta Description">
              <Textarea
                rows={2}
                value={form.metaDescription}
                onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                placeholder="SEO Meta Description..."
              />
            </Field>

            <Field label="Tags">
              <Input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="comma-separated tags"
              />
            </Field>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Link href="/admin/content/blog">
            <Btn variant="ghost" type="button">Cancel</Btn>
          </Link>
          <Btn type="submit" disabled={saving}>
            <IconSave size={16} /> {saving ? 'Saving Changes...' : 'Save Changes'}
          </Btn>
        </div>
      </form>
    </>
  );
}
