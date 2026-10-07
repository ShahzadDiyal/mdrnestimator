'use client';

import { useEffect, useState } from 'react';
import { PageHeader, Card, Btn, Field, Input, Textarea, toast } from '@/components/admin/ui';
import { IconCheck, IconPhone, IconRefresh } from '@/components/admin/icons';

export default function ContactPage() {
  const [form, setForm] = useState({ phone: '', email: '', address: '', hours: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const fetchContact = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contactInfo');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch contact details');
      if (data.data) {
        setForm({
          phone: data.data.phone || '',
          email: data.data.email || '',
          address: data.data.address || '',
          hours: data.data.hours || '',
        });
      }
    } catch (err) {
      console.error('Error fetching contact details:', err);
      toast(err.message || 'Failed to fetch contact details');
    } finally {
      setLoading(false);
    }
  };

  const seedContact = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/contactInfo/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed contact details');
      toast(data.message || 'Seeded contact details successfully!');
      await fetchContact();
    } catch (err) {
      toast(err.message || 'Error seeding contact details');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/contactInfo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: form.phone.trim(),
          email: form.email.trim(),
          address: form.address.trim(),
          hours: form.hours.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save contact details');
      toast('Contact details saved');
    } catch (err) {
      toast(err.message || 'Error saving contact details');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Contact details"
        subtitle="Shown in the website header, footer and contact page."
        actions={(
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={fetchContact} disabled={loading}>
              <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Btn>
            <Btn variant="ghost" onClick={seedContact} disabled={seeding}>
              <IconRefresh size={16} className={seeding ? 'animate-spin' : ''} /> Seed
            </Btn>
          </div>
        )}
      />

      <Card className="max-w-2xl">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <IconPhone size={20} />
          </div>
          <div>
            <h3 className="font-bold text-ink-900">Business contact information</h3>
            <p className="text-sm text-ink-500">Used everywhere the site shows how to reach you.</p>
          </div>
        </div>

        {loading ? (
          <p className="py-8 text-center text-sm text-ink-500">Loading…</p>
        ) : (
          <>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Phone">
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </Field>
                <Field label="Email">
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="hello@modernestimator.com"
                  />
                </Field>
              </div>
              <Field label="Address">
                <Textarea
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Street, suite, city, state and ZIP"
                />
              </Field>
              <Field label="Business hours">
                <Input
                  value={form.hours}
                  onChange={(e) => setForm({ ...form, hours: e.target.value })}
                  placeholder="e.g. Mon–Fri, 8:00am – 6:00pm CT"
                />
              </Field>
            </div>

            <div className="mt-6 flex justify-end border-t border-ink-900/5 pt-4">
              <Btn onClick={save} disabled={saving}>
                <IconCheck size={16} /> {saving ? 'Saving…' : 'Save changes'}
              </Btn>
            </div>
          </>
        )}
      </Card>
    </>
  );
}
