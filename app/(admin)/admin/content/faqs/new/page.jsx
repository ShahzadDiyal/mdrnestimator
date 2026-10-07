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
  q: '',
  a: '',
  category: 'General',
  order: 10,
  status: 'Published',
};

export default function NewFaqPage() {
  const router = useRouter();
  const { add } = useStore();
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const createFaq = async (e) => {
    e.preventDefault();
    if (!form.q.trim() || !form.a.trim()) {
      toast('Question and Answer are required');
      return;
    }

    setBusy(true);
    try {
      const payload = {
        q: form.q.trim(),
        a: form.a.trim(),
        category: form.category.trim(),
        order: Number(form.order) || 10,
        status: form.status,
      };

      const res = await fetch('/api/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create FAQ');

      add('faqs', data.faq || payload);
      toast('Created FAQ item in database');
      router.push('/admin/content/faqs');
    } catch (err) {
      toast(err.message || 'Error creating FAQ');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <DemoNote />
      <div className="mb-4">
        <Link href="/admin/content/faqs" className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 hover:text-brand-700">
          <IconArrowLeft size={16} /> Back to FAQs Management
        </Link>
      </div>

      <PageHeader
        title="Create New FAQ"
        subtitle="Add a new frequently asked question and answer entry."
      />

      <div className="max-w-2xl">
        <Card className="p-6 sm:p-8">
          <form onSubmit={createFaq} className="space-y-5">
            <Field label="Question *">
              <Input
                required
                value={form.q}
                onChange={set('q')}
                placeholder="e.g. How long does an estimate take?"
              />
            </Field>

            <Field label="Answer *">
              <Textarea
                required
                value={form.a}
                onChange={set('a')}
                rows={4}
                placeholder="Standard turnaround is 8–24 hours from receipt of complete plans…"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Category">
                <Input value={form.category} onChange={set('category')} placeholder="General / Pricing / Policy" />
              </Field>

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
              <Link href="/admin/content/faqs">
                <Btn type="button" variant="ghost">Cancel</Btn>
              </Link>
              <Btn type="submit" disabled={busy}>
                {busy ? 'Saving FAQ…' : 'Create FAQ'}
              </Btn>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
