'use client';

import { useState, useEffect } from 'react';
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

export default function EditFaqPage({ params }) {
  const router = useRouter();
  const { state, setCol, update } = useStore();
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const faqId = params.id;

  useEffect(() => {
    const loadFaq = async () => {
      let existing = (state.faqs || []).find((f) => f.id === faqId);
      if (!existing) {
        try {
          const res = await fetch('/api/faqs');
          const data = await res.json();
          if (data.faqs && Array.isArray(data.faqs)) {
            setCol('faqs', data.faqs);
            existing = data.faqs.find((f) => f.id === faqId);
          }
        } catch (err) {
          console.error('Error fetching FAQ:', err);
        }
      }

      if (existing) {
        setForm({
          q: existing.q || '',
          a: existing.a || '',
          category: existing.category || 'General',
          order: existing.order || 10,
          status: existing.status || 'Published',
        });
      } else {
        toast('FAQ item not found');
      }
      setLoading(false);
    };

    loadFaq();
  }, [faqId]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const updateFaq = async (e) => {
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

      const res = await fetch(`/api/faqs/${faqId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update FAQ');

      update('faqs', faqId, payload);
      toast('Updated FAQ item in database');
      router.push('/admin/content/faqs');
    } catch (err) {
      toast(err.message || 'Error updating FAQ');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-ink-500">Loading FAQ details…</div>;
  }

  return (
    <>
      <DemoNote />
      <div className="mb-4">
        <Link href="/admin/content/faqs" className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 hover:text-brand-700">
          <IconArrowLeft size={16} /> Back to FAQs Management
        </Link>
      </div>

      <PageHeader
        title="Edit FAQ Item"
        subtitle="Update question text, answer, category, or order."
      />

      <div className="max-w-2xl">
        <Card className="p-6 sm:p-8">
          <form onSubmit={updateFaq} className="space-y-5">
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
                {busy ? 'Saving Changes…' : 'Save Changes'}
              </Btn>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
