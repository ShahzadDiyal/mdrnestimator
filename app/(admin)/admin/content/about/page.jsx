'use client';
// About page content — singleton with dynamic paragraph and highlight lists.

import { useEffect, useState } from 'react';
import { PageHeader, Card, Btn, Field, Input, Textarea, toast } from '@/components/admin/ui';
import { FormSkeleton } from '@/components/admin/Skeleton';
import { IconCheck, IconPlus, IconTrash, IconBriefcase, IconRefresh } from '@/components/admin/icons';

const emptyForm = {
  headerEyebrow: '',
  headerTitle: '',
  headerSubtitle: '',
  whoEyebrow: '',
  whoHeading: '',
  paragraphs: [''],
  highlights: [''],
  mission: '',
  vision: '',
};

export default function AboutPage() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const fetchAbout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/aboutPage');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch about page');
      if (data.data) {
        setForm({
          ...emptyForm,
          ...data.data,
          paragraphs: Array.isArray(data.data.paragraphs) && data.data.paragraphs.length > 0 ? data.data.paragraphs : [''],
          highlights: Array.isArray(data.data.highlights) && data.data.highlights.length > 0 ? data.data.highlights : [''],
        });
      }
    } catch (err) {
      console.error('Error fetching about page:', err);
      toast(err.message || 'Failed to fetch about page');
    } finally {
      setLoading(false);
    }
  };

  const seedAbout = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/aboutPage/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed about page');
      toast(data.message || 'Seeded about page successfully!');
      await fetchAbout();
    } catch (err) {
      toast(err.message || 'Error seeding about page');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const setListItem = (list, i, value) =>
    setForm((f) => ({ ...f, [list]: f[list].map((v, vi) => (vi === i ? value : v)) }));
  const addListItem = (list) =>
    setForm((f) => ({ ...f, [list]: [...f[list], ''] }));
  const removeListItem = (list, i) =>
    setForm((f) => ({ ...f, [list]: f[list].filter((_, vi) => vi !== i) }));

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        paragraphs: form.paragraphs.map((p) => p.trim()).filter(Boolean),
        highlights: form.highlights.map((h) => h.trim()).filter(Boolean),
      };
      const res = await fetch('/api/aboutPage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save about page');
      toast('About page saved');
    } catch (err) {
      toast(err.message || 'Error saving about page');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="About Page"
        subtitle="Page header, who-we-are story, highlights checklist, mission and vision."
        actions={(
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={fetchAbout} disabled={loading}>
              <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Btn>
            <Btn variant="ghost" onClick={seedAbout} disabled={seeding}>
              <IconRefresh size={16} className={seeding ? 'animate-spin' : ''} /> Seed
            </Btn>
          </div>
        )}
      />

      <div className="max-w-2xl space-y-6">
        {loading ? (
          <FormSkeleton />
        ) : (
          <>
            <Card className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <IconBriefcase size={18} />
                </div>
                <h2 className="font-bold text-ink-900">Page header</h2>
              </div>
              <Field label="Eyebrow">
                <Input value={form.headerEyebrow} onChange={set('headerEyebrow')} placeholder="Small text above the title" />
              </Field>
              <Field label="Title">
                <Input value={form.headerTitle} onChange={set('headerTitle')} placeholder="e.g. About Modern Estimator" />
              </Field>
              <Field label="Subtitle">
                <Textarea rows={2} value={form.headerSubtitle} onChange={set('headerSubtitle')} placeholder="Short subtitle under the title" />
              </Field>
            </Card>

            <Card className="space-y-4">
              <h2 className="font-bold text-ink-900">Who we are</h2>
              <Field label="Eyebrow">
                <Input value={form.whoEyebrow} onChange={set('whoEyebrow')} placeholder="e.g. Who we are" />
              </Field>
              <Field label="Heading">
                <Input value={form.whoHeading} onChange={set('whoHeading')} placeholder="Section heading" />
              </Field>
              <div className="space-y-3">
                {form.paragraphs.map((p, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Field label={`Paragraph ${i + 1}`} className="flex-1">
                      <Textarea rows={3} value={p} onChange={(e) => setListItem('paragraphs', i, e.target.value)} placeholder="Story paragraph…" />
                    </Field>
                    <button
                      onClick={() => removeListItem('paragraphs', i)}
                      aria-label={`Remove paragraph ${i + 1}`}
                      className="mt-7 rounded-lg p-2 text-ink-400 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                ))}
                <Btn variant="ghost" onClick={() => addListItem('paragraphs')} className="!text-xs">
                  <IconPlus size={14} /> Add paragraph
                </Btn>
              </div>
            </Card>

            <Card className="space-y-4">
              <h2 className="font-bold text-ink-900">Highlights</h2>
              <p className="text-sm text-ink-500">The checklist shown next to the story.</p>
              <div className="space-y-3">
                {form.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Field label={`Highlight ${i + 1}`} className="flex-1">
                      <Input value={h} onChange={(e) => setListItem('highlights', i, e.target.value)} placeholder="e.g. Certified estimators" />
                    </Field>
                    <button
                      onClick={() => removeListItem('highlights', i)}
                      aria-label={`Remove highlight ${i + 1}`}
                      className="mt-7 rounded-lg p-2 text-ink-400 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                ))}
                <Btn variant="ghost" onClick={() => addListItem('highlights')} className="!text-xs">
                  <IconPlus size={14} /> Add highlight
                </Btn>
              </div>
            </Card>

            <Card className="space-y-4">
              <h2 className="font-bold text-ink-900">Mission & vision</h2>
              <Field label="Mission">
                <Textarea rows={3} value={form.mission} onChange={set('mission')} placeholder="Our mission statement…" />
              </Field>
              <Field label="Vision">
                <Textarea rows={3} value={form.vision} onChange={set('vision')} placeholder="Our vision statement…" />
              </Field>
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
