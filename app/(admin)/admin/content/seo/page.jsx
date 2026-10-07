'use client';

import { useState } from 'react';
import { useStore } from '@/components/admin/store';
import { PageHeader, Card, Btn, Field, Input, Textarea, DemoNote, toast } from '@/components/admin/ui';
import { IconCheck, IconGlobe } from '@/components/admin/icons';

const TITLE_LIMIT = 60;
const DESC_LIMIT = 160;

function Counter({ len, limit }) {
  const over = len > limit;
  const warn = !over && len > limit * 0.8;
  const cls = over ? 'text-rose-600' : warn ? 'text-amber-600' : 'text-ink-400';
  return (
    <span className={`text-xs font-semibold ${cls}`}>
      {len} / {limit}{over ? ' — over limit' : ''}
    </span>
  );
}

export default function SeoPage() {
  const { state, update } = useStore();
  const [drafts, setDrafts] = useState(() =>
    Object.fromEntries(
      state.seo.map((s) => [s.id, { title: s.title, description: s.description }])
    )
  );

  const dirty = state.seo.some(
    (s) =>
      drafts[s.id]?.title !== s.title ||
      drafts[s.id]?.description !== s.description
  );

  const setDraft = (id, patch) =>
    setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));

  const saveAll = () => {
    state.seo.forEach((s) => {
      update('seo', s.id, {
        title: drafts[s.id].title.trim(),
        description: drafts[s.id].description.trim(),
      });
    });
    toast('SEO settings saved');
  };

  return (
    <>
      <DemoNote />
      <PageHeader
        title="SEO settings"
        subtitle="Search-engine title and meta description for each page. Keep titles under 60 characters and descriptions under 160."
        actions={
          <Btn onClick={saveAll} disabled={!dirty}>
            <IconCheck size={16} /> Save all changes
          </Btn>
        }
      />

      <div className="space-y-4">
        {state.seo.map((s) => {
          const d = drafts[s.id];
          return (
            <Card key={s.id}>
              <div className="mb-4 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <IconGlobe size={17} />
                </span>
                <div>
                  <h3 className="font-bold text-ink-900">{s.page.replace(/^\//, '') || 'Homepage'}</h3>
                  <p className="text-xs text-ink-400">{s.page}</p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-4">
                  <Field
                    label={
                      <span className="flex items-center justify-between">
                        SEO title
                        <Counter len={d.title.length} limit={TITLE_LIMIT} />
                      </span>
                    }
                  >
                    <Input
                      value={d.title}
                      onChange={(e) => setDraft(s.id, { title: e.target.value })}
                      placeholder="Page title shown in search results"
                    />
                  </Field>
                  <Field
                    label={
                      <span className="flex items-center justify-between">
                        Meta description
                        <Counter len={d.description.length} limit={DESC_LIMIT} />
                      </span>
                    }
                  >
                    <Textarea
                      rows={3}
                      value={d.description}
                      onChange={(e) => setDraft(s.id, { description: e.target.value })}
                      placeholder="Short summary shown under the title in search results"
                    />
                  </Field>
                </div>

                {/* Google-style preview */}
                <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-ink-900/5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Search preview</p>
                  <p className="mt-2 truncate text-lg text-[#1a0dab]">{d.title || 'Untitled page'}</p>
                  <p className="truncate text-sm text-[#006621]">modernestimator.com{s.page.replace(/^Homepage.*$/, '/')}</p>
                  <p className="mt-1 line-clamp-3 text-sm text-[#545454]">
                    {d.description || 'No meta description set yet.'}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {dirty && (
        <div className="sticky bottom-4 mt-6 flex items-center justify-between gap-4 rounded-2xl bg-ink-900 px-5 py-3.5 text-white shadow-xl">
          <p className="text-sm font-medium">You have unsaved changes.</p>
          <Btn onClick={saveAll}>
            <IconCheck size={16} /> Save all changes
          </Btn>
        </div>
      )}
    </>
  );
}
