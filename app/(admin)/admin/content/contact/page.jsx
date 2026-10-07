'use client';

import { useState } from 'react';
import { useStore } from '@/components/admin/store';
import { PageHeader, Card, Btn, Field, Input, Textarea, DemoNote, toast } from '@/components/admin/ui';
import { IconCheck, IconPhone } from '@/components/admin/icons';

export default function ContactPage() {
  const { state, setCol } = useStore();
  const [form, setForm] = useState({ ...state.contact });

  const dirty =
    form.phone !== state.contact.phone ||
    form.email !== state.contact.email ||
    form.address !== state.contact.address ||
    form.hours !== state.contact.hours;

  const save = () => {
    setCol('contact', {
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      hours: form.hours.trim(),
    });
    toast('Contact details saved');
  };

  return (
    <>
      <DemoNote />
      <PageHeader
        title="Contact details"
        subtitle="Shown in the website header, footer and contact page."
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
          <Btn onClick={save} disabled={!dirty}>
            <IconCheck size={16} /> Save changes
          </Btn>
        </div>
      </Card>
    </>
  );
}
