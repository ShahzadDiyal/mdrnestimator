'use client';
// Visibility control — hide / unhide any page, homepage section, or site element.
// Singleton backed by /api/visibility.

import { useEffect, useState } from 'react';
import { PageHeader, Card, Btn, Toggle, toast } from '@/components/admin/ui';
import { FormSkeleton } from '@/components/admin/Skeleton';
import { IconCheck, IconEye, IconRefresh } from '@/components/admin/icons';

const emptyForm = {
  pages: {},
  sections: {},
  elements: {},
};

const PAGE_ROWS = [
  { key: 'home', label: 'Homepage', hint: '/' },
  { key: 'services', label: 'Services', hint: '/services + all service detail pages' },
  { key: 'trades', label: 'Trades', hint: '/trades + all trade detail pages' },
  { key: 'portfolio', label: 'Portfolio', hint: '/portfolio' },
  { key: 'about', label: 'About Us', hint: '/about' },
  { key: 'contact', label: 'Contact', hint: '/contact' },
];

const SECTION_ROWS = [
  { key: 'hero', label: 'Hero', hint: 'Homepage hero banner' },
  { key: 'stats', label: 'Stats counters', hint: 'Animated counter strip' },
  { key: 'services', label: 'Services', hint: 'Services section' },
  { key: 'trades', label: 'Trades preview', hint: 'Trades preview section' },
  { key: 'whyChooseUs', label: 'Why Choose Us', hint: 'Feature cards section' },
  { key: 'process', label: 'Process', hint: '4-step process section' },
  { key: 'portfolio', label: 'Portfolio', hint: 'Projects section' },
  { key: 'testimonials', label: 'Testimonials', hint: 'Client stories section' },
  { key: 'faq', label: 'FAQ', hint: 'FAQ accordion section' },
  { key: 'ctaBanner', label: 'CTA banner', hint: 'Call-to-action banner' },
];

const ELEMENT_ROWS = [
  { key: 'navbar', label: 'Navbar', hint: 'Main navigation bar' },
  { key: 'promoBar', label: 'Promo bar', hint: 'Turnaround / 30% off strip' },
  { key: 'footer', label: 'Footer', hint: 'Site footer' },
  { key: 'floatingChat', label: 'Floating chat button', hint: 'Chat bubble on every page' },
];

function ToggleGroup({ title, hint, rows, values, onFlip }) {
  return (
    <Card className="space-y-1">
      <div className="mb-3">
        <h2 className="text-base font-bold text-ink-900">{title}</h2>
        {hint && <p className="mt-0.5 text-sm text-ink-500">{hint}</p>}
      </div>
      {rows.map((r) => {
        const on = values?.[r.key] !== false;
        return (
          <div
            key={r.key}
            className={`flex items-center justify-between gap-4 rounded-xl px-3 py-2.5 transition ${on ? '' : 'bg-slate-50 opacity-70'}`}
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink-900">{r.label}</p>
              <p className="truncate text-xs text-ink-400">{r.hint}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-wide ${on ? 'text-emerald-600' : 'text-ink-300'}`}>
                {on ? 'Visible' : 'Hidden'}
              </span>
              <Toggle checked={on} onChange={() => onFlip(r.key)} />
            </div>
          </div>
        );
      })}
    </Card>
  );
}

export default function VisibilityPage() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const fetchVisibility = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/visibility');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch visibility settings');
      if (data.data) {
        setForm({
          pages: data.data.pages || {},
          sections: data.data.sections || {},
          elements: data.data.elements || {},
        });
      }
    } catch (err) {
      console.error('Error fetching visibility:', err);
      toast(err.message || 'Failed to fetch visibility settings');
    } finally {
      setLoading(false);
    }
  };

  const seedVisibility = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/visibility/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed visibility settings');
      toast(data.message || 'Seeded visibility settings successfully!');
      await fetchVisibility();
    } catch (err) {
      toast(err.message || 'Error seeding visibility settings');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchVisibility();
  }, []);

  const flip = (group, key) =>
    setForm((f) => ({
      ...f,
      [group]: { ...f[group], [key]: !(f[group]?.[key] !== false) },
    }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/visibility', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save visibility settings');
      toast('Visibility settings saved');
    } catch (err) {
      toast(err.message || 'Error saving visibility settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Visibility"
        subtitle="Hide or unhide any page, homepage section, or site element. Hidden items stay in the database."
        actions={(
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={fetchVisibility} disabled={loading}>
              <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Btn>
            <Btn variant="ghost" onClick={seedVisibility} disabled={seeding}>
              {seeding ? 'Seeding…' : 'Seed defaults'}
            </Btn>
            <Btn onClick={save} disabled={saving || loading}>
              <IconCheck size={16} /> {saving ? 'Saving…' : 'Save changes'}
            </Btn>
          </div>
        )}
      />

      {loading ? (
        <FormSkeleton />
      ) : (
        <div className="grid items-start gap-5 lg:grid-cols-3">
          <ToggleGroup
            title="Pages"
            hint="Hidden pages are removed from the site."
            rows={PAGE_ROWS}
            values={form.pages}
            onFlip={(k) => flip('pages', k)}
          />
          <ToggleGroup
            title="Homepage sections"
            hint="Show or hide each homepage block."
            rows={SECTION_ROWS}
            values={form.sections}
            onFlip={(k) => flip('sections', k)}
          />
          <ToggleGroup
            title="Site elements"
            hint="Global elements shown on every page."
            rows={ELEMENT_ROWS}
            values={form.elements}
            onFlip={(k) => flip('elements', k)}
          />
        </div>
      )}

      <p className="mt-6 flex items-start gap-2 text-xs text-ink-400">
        <IconEye size={14} className="mt-0.5 shrink-0" />
        These switches are stored in Firestore and will control what renders once the site-side wiring is enabled. Individual items (services, FAQs, portfolio projects…) already have their own Published / Draft status in their menus.
      </p>
    </>
  );
}
