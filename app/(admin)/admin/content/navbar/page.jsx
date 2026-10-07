'use client';
// Navbar chrome: announcement bar, contact bits, promo bar, CTA — singleton.

import { useEffect, useState } from 'react';
import { PageHeader, Card, Btn, Field, Input, toast } from '@/components/admin/ui';
import { IconCheck, IconMenu, IconRefresh } from '@/components/admin/icons';
import MenuTreeManager from '@/components/admin/MenuTree';

const emptyForm = {
  phoneDisplay: '',
  phoneHref: '',
  email: '',
  promoLeft: '',
  promoText: '',
  ctaLabel: '',
  ctaHref: '',
};

export default function NavbarPage() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const fetchNavbar = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/navbar');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch navbar content');
      if (data.data) setForm({ ...emptyForm, ...data.data });
    } catch (err) {
      console.error('Error fetching navbar:', err);
      toast(err.message || 'Failed to fetch navbar content');
    } finally {
      setLoading(false);
    }
  };

  const seedNavbar = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/navbar/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed navbar content');
      toast(data.message || 'Seeded navbar content successfully!');
      await fetchNavbar();
    } catch (err) {
      toast(err.message || 'Error seeding navbar content');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchNavbar();
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/navbar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save navbar content');
      toast('Navbar content saved');
    } catch (err) {
      toast(err.message || 'Error saving navbar content');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Navbar"
        subtitle="Announcement bar, contact details, promo strip and the header call-to-action."
        actions={(
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={fetchNavbar} disabled={loading}>
              <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Btn>
            <Btn variant="ghost" onClick={seedNavbar} disabled={seeding}>
              <IconRefresh size={16} className={seeding ? 'animate-spin' : ''} /> Seed
            </Btn>
          </div>
        )}
      />

      <div className="max-w-2xl space-y-6">
        {loading ? (
          <Card className="py-10 text-center text-sm text-ink-500">Loading…</Card>
        ) : (
          <>
            <Card className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <IconMenu size={18} />
                </div>
                <h2 className="font-bold text-ink-900">Announcement bar contact</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Phone (display)">
                  <Input value={form.phoneDisplay} onChange={set('phoneDisplay')} placeholder="+1 (555) 123-4567" />
                </Field>
                <Field label="Phone link (href)">
                  <Input value={form.phoneHref} onChange={set('phoneHref')} placeholder="tel:+15551234567" />
                </Field>
              </div>
              <Field label="Email">
                <Input type="email" value={form.email} onChange={set('email')} placeholder="hello@modernestimator.com" />
              </Field>
            </Card>

            <Card className="space-y-4">
              <h2 className="font-bold text-ink-900">Promo strip</h2>
              <Field label="Left text" hint="e.g. turnaround time.">
                <Input value={form.promoLeft} onChange={set('promoLeft')} placeholder="e.g. Turnaround time: 8–24 hours" />
              </Field>
              <Field label="Promo text" hint="e.g. current offer.">
                <Input value={form.promoText} onChange={set('promoText')} placeholder="e.g. Affordable estimate — 30% off" />
              </Field>
            </Card>

            <Card className="space-y-4">
              <h2 className="font-bold text-ink-900">Header call-to-action</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Button label">
                  <Input value={form.ctaLabel} onChange={set('ctaLabel')} placeholder="e.g. Get a quote" />
                </Field>
                <Field label="Button link">
                  <Input value={form.ctaHref} onChange={set('ctaHref')} placeholder="e.g. #quote" />
                </Field>
              </div>
            </Card>

            <div className="flex justify-end">
              <Btn onClick={save} disabled={saving}>
                <IconCheck size={16} /> {saving ? 'Saving…' : 'Save changes'}
              </Btn>
            </div>
          </>
        )}
      </div>

      <MenuTreeManager
        title="Menu items"
        subtitle="Every link in the navbar, with sub-menus. Drag-free ordering via the arrow buttons."
        apiBase="/api/navMenus"
      />
    </>
  );
}
