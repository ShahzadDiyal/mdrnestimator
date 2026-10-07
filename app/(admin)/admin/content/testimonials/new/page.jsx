'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/components/admin/store';
import {
  PageHeader, Card, Btn, Field, Input, Textarea, Select, DemoNote, toast,
} from '@/components/admin/ui';
import { IconArrowLeft } from '@/components/admin/icons';

const emptyForm = {
  name: '',
  role: '',
  quote: '',
  img: '/review-1.png',
  rating: 5,
  order: 10,
  status: 'Published',
};

export default function NewTestimonialPage() {
  const router = useRouter();
  const { add } = useStore();
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const createTestimonial = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.quote.trim()) {
      toast('Client name and quote are required');
      return;
    }

    setBusy(true);
    try {
      const payload = {
        name: form.name.trim(),
        role: form.role.trim(),
        quote: form.quote.trim(),
        img: form.img.trim() || '/review-1.png',
        rating: Number(form.rating) || 5,
        order: Number(form.order) || 10,
        status: form.status,
      };

      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create testimonial');

      add('testimonials', data.testimonial || payload);
      toast('Created client testimonial in database');
      router.push('/admin/content/testimonials');
    } catch (err) {
      toast(err.message || 'Error creating testimonial');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <DemoNote />
      <div className="mb-4">
        <Link href="/admin/content/testimonials" className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 hover:text-brand-700">
          <IconArrowLeft size={16} /> Back to Testimonials Management
        </Link>
      </div>

      <PageHeader
        title="Create New Client Testimonial"
        subtitle="Add a new client review and testimonial entry."
      />

      <div className="max-w-2xl">
        <Card className="p-6 sm:p-8">
          <form onSubmit={createTestimonial} className="space-y-5">
            <Field label="Client Name *">
              <Input
                required
                value={form.name}
                onChange={set('name')}
                placeholder="e.g. Michael Reynolds"
              />
            </Field>

            <Field label="Role / Company / Location">
              <Input
                value={form.role}
                onChange={set('role')}
                placeholder="e.g. Owner, Reynolds Construction • Austin, TX"
              />
            </Field>

            <Field label="Testimonial Quote *">
              <Textarea
                required
                value={form.quote}
                onChange={set('quote')}
                rows={4}
                placeholder="Modern Estimator turned my bid prep from a 3-day grind into a 24-hour deliverable…"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Avatar Image URL">
                <Input value={form.img} onChange={set('img')} placeholder="/review-1.png" />
              </Field>

              <Field label="Star Rating (1 - 5)">
                <Select value={form.rating} onChange={set('rating')}>
                  <option value={5}>★★★★★ (5 Stars)</option>
                  <option value={4}>★★★★☆ (4 Stars)</option>
                  <option value={3}>★★★☆☆ (3 Stars)</option>
                  <option value={2}>★★☆☆☆ (2 Stars)</option>
                  <option value={1}>★☆☆☆☆ (1 Star)</option>
                </Select>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Sequence Order" hint="Lower numbers appear first">
                <Input type="number" value={form.order} onChange={set('order')} placeholder="1" />
              </Field>

              <Field label="Status">
                <Select value={form.status} onChange={set('status')}>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </Select>
              </Field>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-ink-900/5">
              <Link href="/admin/content/testimonials">
                <Btn type="button" variant="ghost">Cancel</Btn>
              </Link>
              <Btn type="submit" disabled={busy}>
                {busy ? 'Saving Testimonial…' : 'Create Testimonial'}
              </Btn>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
