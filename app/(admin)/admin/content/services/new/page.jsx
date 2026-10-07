'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/components/admin/store';
import {
  PageHeader, Card, Btn, Field, Input, Textarea, Select, DemoNote, toast,
} from '@/components/admin/ui';
import { IconArrowLeft, IconFileText } from '@/components/admin/icons';

const emptyForm = {
  title: '',
  slug: '',
  category: 'Primary Service',
  tagline: '',
  short: '',
  h1: '',
  metaTitle: '',
  metaDescription: '',
  overview: '',
  points: '',
  includes: '',
  deliverables: '',
  whoWeServe: '',
  relatedServices: '',
  faqs: '',
  status: 'Published',
};

const fromLines = (str) => String(str || '').split('\n').map((s) => s.trim()).filter(Boolean).join('; ');
const slugify = (s) => String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function NewServicePage() {
  const router = useRouter();
  const { add } = useStore();
  const [form, setForm] = useState(emptyForm);
  const [activeTab, setActiveTab] = useState('general');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const createService = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast('Service title is required');
      return;
    }

    setBusy(true);
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        category: form.category,
        tagline: form.tagline.trim(),
        short: form.short.trim(),
        h1: form.h1.trim() || `${form.title.trim()} Services`,
        metaTitle: form.metaTitle.trim() || `${form.title.trim()} | Modern Estimator`,
        metaDescription: form.metaDescription.trim() || form.short.trim() || form.tagline.trim(),
        overview: form.overview.trim(),
        points: fromLines(form.points),
        includes: fromLines(form.includes),
        deliverables: fromLines(form.deliverables),
        whoWeServe: fromLines(form.whoWeServe),
        relatedServices: fromLines(form.relatedServices),
        faqs: form.faqs.trim(),
        status: form.status,
      };

      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create service');

      add('services', data.service || payload);
      toast(`Created service "${form.title.trim()}" in database`);
      router.push('/admin/content/services');
    } catch (err) {
      toast(err.message || 'Error creating service');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <DemoNote />
      <div className="mb-4">
        <Link href="/admin/content/services" className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 hover:text-brand-700">
          <IconArrowLeft size={16} /> Back to Services Catalog
        </Link>
      </div>

      <PageHeader
        title="Create New Service Offering"
        subtitle="Add a new service or trade estimating offering with complete SEO, scope, and deliverable specifications."
      />

      <div className="max-w-4xl">
        <Card className="p-6 sm:p-8">
          <form onSubmit={createService} className="space-y-6">
            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 text-xs font-semibold">
              {[
                { id: 'general', label: '1. Basic Info' },
                { id: 'seo', label: '2. SEO & Headings' },
                { id: 'scope', label: '3. Scope & Deliverables' },
                { id: 'details', label: '4. Overview & FAQs' },
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

            {/* TAB 1: BASIC INFO */}
            {activeTab === 'general' && (
              <div className="space-y-5">
                <Field label="Service Title *">
                  <Input required value={form.title} onChange={set('title')} placeholder="e.g. Concrete Estimating Services" />
                </Field>
                <Field label="Category *">
                  <Select value={form.category} onChange={set('category')}>
                    <option value="Primary Service">Primary Service</option>
                    <option value="Trade Estimating">Trade Estimating</option>
                  </Select>
                </Field>
                <Field label="URL Slug" hint="URL path for the service page. Auto-generated from title if left blank.">
                  <Input value={form.slug} onChange={set('slug')} placeholder="concrete-estimating" className="font-mono" />
                </Field>
                <Field label="Tagline">
                  <Input value={form.tagline} onChange={set('tagline')} placeholder="Short marketing headline…" />
                </Field>
                <Field label="Short Description">
                  <Textarea value={form.short} onChange={set('short')} rows={3} placeholder="One-paragraph summary shown on cards and list pages…" />
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
                  <Input value={form.h1} onChange={set('h1')} placeholder="e.g. Concrete Estimating Services" />
                </Field>
                <Field label="SEO Meta Title" hint="Browser tab title & search engine snippet title">
                  <Input value={form.metaTitle} onChange={set('metaTitle')} placeholder="e.g. Concrete Estimating Services | Takeoffs in 8–24 Hrs" />
                </Field>
                <Field label="SEO Meta Description" hint="Search engine meta description">
                  <Textarea value={form.metaDescription} onChange={set('metaDescription')} rows={3} placeholder="Accurate concrete estimating and takeoff services for contractors…" />
                </Field>
                <Field label="Related Services Slugs" hint="Comma or newline separated list of related service slugs.">
                  <Textarea value={form.relatedServices} onChange={set('relatedServices')} rows={2} placeholder="quantity-takeoff; material-estimation; commercial-estimation" />
                </Field>
              </div>
            )}

            {/* TAB 3: SCOPE & DELIVERABLES */}
            {activeTab === 'scope' && (
              <div className="space-y-5">
                <Field label="What's Included / Scope" hint="Enter one item per line.">
                  <Textarea value={form.includes} onChange={set('includes')} rows={5} placeholder={'Spread & continuous footings\nFoundation walls & grade beams\nSlabs-on-grade & elevated decks\nFormwork & rebar'} />
                </Field>
                <Field label="Deliverables List" hint="Enter one item per line.">
                  <Textarea value={form.deliverables} onChange={set('deliverables')} rows={4} placeholder={'CSI Division 03 Excel workbook\nMarked-up plans by pour\nConcrete summary sheet'} />
                </Field>
                <Field label="Key Points / Highlights" hint="Feature points shown on summary cards.">
                  <Textarea value={form.points} onChange={set('points')} rows={3} placeholder={'Plan & spec review\nColor-coded markups\nExcel + PDF deliverables'} />
                </Field>
                <Field label="Who We Serve" hint="Target audience list (e.g. General Contractors, Subcontractors).">
                  <Textarea value={form.whoWeServe} onChange={set('whoWeServe')} rows={3} placeholder={'Concrete contractors\nGeneral contractors\nFoundation & flatwork subs'} />
                </Field>
              </div>
            )}

            {/* TAB 4: OVERVIEW & FAQS */}
            {activeTab === 'details' && (
              <div className="space-y-5">
                <Field label="Detailed Overview Text" hint="Full descriptive overview text for the service.">
                  <Textarea value={form.overview} onChange={set('overview')} rows={6} placeholder="Our concrete estimators measure every cubic yard of your project…" />
                </Field>
                <Field label="Frequently Asked Questions (FAQs)" hint="Format each entry as: Q: Question? \n A: Answer details.">
                  <Textarea value={form.faqs} onChange={set('faqs')} rows={6} placeholder={'Q: What do you need to start a concrete estimate?\nA: Structural drawings, foundation plans and specifications.\n\nQ: How fast can I get a concrete estimate?\nA: Standard turnaround is 8–24 hours from receipt of plans.'} />
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
                <Link href="/admin/content/services">
                  <Btn type="button" variant="ghost">Cancel</Btn>
                </Link>
                <Btn type="submit" disabled={busy}>
                  {busy ? 'Creating Service…' : 'Save & Create Service'}
                </Btn>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
