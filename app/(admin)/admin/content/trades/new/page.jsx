'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/components/admin/store';
import {
  PageHeader, Card, Btn, Field, Input, Textarea, Select, DemoNote, toast,
} from '@/components/admin/ui';
import { IconArrowLeft } from '@/components/admin/icons';

const PARENT_TRADES = [
  '—',
  'Concrete Estimating',
  'Electrical Estimating',
  'Interior & Exterior Finishes',
  'Masonry Estimating',
  'MEP Estimating',
  'Metals Estimating Services',
  'Openings Estimating Services',
  'Thermal & Moisture Protection Estimating',
  'Sitework Estimating Services',
  'Lumber Takeoff Services',
];

const emptyForm = {
  title: '',
  slug: '',
  parent: '—',
  tagline: '',
  h1: '',
  metaTitle: '',
  metaDescription: '',
  intro: '',
  scope: '',
  serve: '',
  deliverables: '',
  relatedServices: '',
  faqs: '',
  status: 'Published',
};

const slugify = (s) => String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function NewTradePage() {
  const router = useRouter();
  const { add } = useStore();
  const [form, setForm] = useState(emptyForm);
  const [activeTab, setActiveTab] = useState('general');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const createTrade = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast('Trade title is required');
      return;
    }

    setBusy(true);
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        parent: form.parent,
        tagline: form.tagline.trim(),
        h1: form.h1.trim() || `${form.title.trim()} Services`,
        metaTitle: form.metaTitle.trim() || `${form.title.trim()} | Modern Estimator`,
        metaDescription: form.metaDescription.trim() || form.tagline.trim(),
        intro: form.intro.trim(),
        scope: form.scope.trim(),
        serve: form.serve.trim(),
        deliverables: form.deliverables.trim(),
        relatedServices: form.relatedServices.trim(),
        faqs: form.faqs.trim(),
        status: form.status,
      };

      const res = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create trade page');

      add('trades', data.trade || payload);
      toast(`Created trade page "${form.title.trim()}" in database`);
      router.push('/admin/content/trades');
    } catch (err) {
      toast(err.message || 'Error creating trade page');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <DemoNote />
      <div className="mb-4">
        <Link href="/admin/content/trades" className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 hover:text-brand-700">
          <IconArrowLeft size={16} /> Back to Trade Pages
        </Link>
      </div>

      <PageHeader
        title="Create New Trade Estimating Page"
        subtitle="Configure trade or sub-trade page specs, parent hierarchy, SEO parameters, and scope breakdowns."
      />

      <div className="max-w-4xl">
        <Card className="p-6 sm:p-8">
          <form onSubmit={createTrade} className="space-y-6">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 text-xs font-semibold">
              {[
                { id: 'general', label: '1. Basic Info & Hierarchy' },
                { id: 'seo', label: '2. SEO & Headings' },
                { id: 'scope', label: '3. Scope & Deliverables' },
                { id: 'details', label: '4. Intro & FAQs' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 border-b-2 transition ${
                    activeTab === tab.id
                      ? 'border-brand-600 text-brand-700 font-bold'
                      : 'border-transparent text-ink-400 hover:text-ink-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: BASIC INFO & HIERARCHY */}
            {activeTab === 'general' && (
              <div className="space-y-5">
                <Field label="Trade Title *">
                  <Input required value={form.title} onChange={set('title')} placeholder="e.g. Drywall Takeoff Services" />
                </Field>
                <Field label="Parent Trade Page" hint="Select a Parent Trade to make this a Sub-trade page, or choose '—' for a Top-Level Parent Trade.">
                  <Select value={form.parent} onChange={set('parent')}>
                    {PARENT_TRADES.map((p) => (
                      <option key={p} value={p}>{p === '—' ? '— (Top-Level Parent Trade)' : p}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="URL Slug" hint="URL path for the trade page. Auto-generated from title if left blank.">
                  <Input value={form.slug} onChange={set('slug')} placeholder="drywall-takeoff-services" className="font-mono" />
                </Field>
                <Field label="Tagline">
                  <Input value={form.tagline} onChange={set('tagline')} placeholder="Board, framing, tape and finish quantified for every wall…" />
                </Field>
                <Field label="Publication Status">
                  <Select value={form.status} onChange={set('status')}>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </Select>
                </Field>
              </div>
            )}

            {/* TAB 2: SEO & HEADINGS */}
            {activeTab === 'seo' && (
              <div className="space-y-5">
                <Field label="H1 Page Heading">
                  <Input value={form.h1} onChange={set('h1')} placeholder="e.g. Drywall Takeoff & Estimating Services" />
                </Field>
                <Field label="SEO Meta Title">
                  <Input value={form.metaTitle} onChange={set('metaTitle')} placeholder="e.g. Drywall Takeoff Services | Framing, Board & Compound" />
                </Field>
                <Field label="SEO Meta Description">
                  <Textarea value={form.metaDescription} onChange={set('metaDescription')} rows={3} placeholder="Drywall takeoff services for framing and drywall contractors…" />
                </Field>
                <Field label="Related Services Slugs" hint="Semicolon or comma separated list of related slugs.">
                  <Input value={form.relatedServices} onChange={set('relatedServices')} placeholder="interior-exterior-finishes; quantity-takeoff" />
                </Field>
              </div>
            )}

            {/* TAB 3: SCOPE & DELIVERABLES */}
            {activeTab === 'scope' && (
              <div className="space-y-5">
                <Field label="Scope Breakdown" hint="Format as: Section Title: Item 1; Item 2 | Section Title 2: Item 1; Item 2">
                  <Textarea value={form.scope} onChange={set('scope')} rows={5} placeholder={'Framing & board: Metal stud & track framing; Drywall sheets by type | Finishing: Taping, mud & corner beads; Sound insulation'} />
                </Field>
                <Field label="Deliverables List" hint="Semicolon or line separated list of deliverables.">
                  <Textarea value={form.deliverables} onChange={set('deliverables')} rows={3} placeholder={'CSI Division 09 drywall takeoff\nStud & board count sheet\nMarked-up wall plans'} />
                </Field>
                <Field label="Who We Serve" hint="Target audience list.">
                  <Textarea value={form.serve} onChange={set('serve')} rows={3} placeholder={'Drywall contractors\nLath & plaster subs\nGeneral contractors'} />
                </Field>
              </div>
            )}

            {/* TAB 4: INTRO & FAQS */}
            {activeTab === 'details' && (
              <div className="space-y-5">
                <Field label="Introduction Paragraphs">
                  <Textarea value={form.intro} onChange={set('intro')} rows={5} placeholder="Our drywall takeoffs count every sheet, stud, track and pound of compound…" />
                </Field>
                <Field label="Frequently Asked Questions (FAQs)" hint="Format as: Q: Question?\nA: Answer details.">
                  <Textarea value={form.faqs} onChange={set('faqs')} rows={6} placeholder={'Q: How do you handle fire-rated wall assemblies?\nA: We categorize each wall by UL assembly code and rating hour requirements.'} />
                </Field>
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-ink-900/5">
              <div className="flex gap-2">
                {activeTab !== 'general' && (
                  <Btn type="button" variant="ghost" onClick={() => {
                    const tabs = ['general', 'seo', 'scope', 'details'];
                    setActiveTab(tabs[tabs.indexOf(activeTab) - 1]);
                  }}>
                    Previous Section
                  </Btn>
                )}
                {activeTab !== 'details' && (
                  <Btn type="button" variant="ghost" onClick={() => {
                    const tabs = ['general', 'seo', 'scope', 'details'];
                    setActiveTab(tabs[tabs.indexOf(activeTab) + 1]);
                  }}>
                    Next Section
                  </Btn>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Link href="/admin/content/trades">
                  <Btn type="button" variant="ghost">Cancel</Btn>
                </Link>
                <Btn type="submit" disabled={busy}>
                  {busy ? 'Creating Trade…' : 'Save & Create Trade Page'}
                </Btn>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
