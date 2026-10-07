'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/components/admin/store';
import {
  PageHeader, Btn, StatusBadge, SearchInput, TableWrap, thCls, tdCls,
  DemoNote, EmptyState, Modal, ConfirmState, toast,
} from '@/components/admin/ui';
import { IconPlus, IconEdit, IconTrash, IconStar, IconRefresh } from '@/components/admin/icons';

export default function TestimonialsPage() {
  const { state, setCol, remove } = useStore();
  const [q, setQ] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [reordering, setReordering] = useState(false);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      if (data.testimonials && Array.isArray(data.testimonials)) {
        setCol('testimonials', data.testimonials);
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      toast('Failed to fetch testimonials from database');
    } finally {
      setLoading(false);
    }
  };

  const seedTestimonials = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/testimonials/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed testimonials');
      toast(data.message || 'Seeded testimonials successfully!');
      await fetchTestimonials();
    } catch (err) {
      toast(err.message || 'Error seeding testimonials');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const testimonialsList = useMemo(() => {
    const list = Array.isArray(state.testimonials) ? [...state.testimonials] : [];
    list.sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
    return list;
  }, [state.testimonials]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return testimonialsList.filter(
      (t) => !needle || `${t.name} ${t.role} ${t.quote}`.toLowerCase().includes(needle)
    );
  }, [testimonialsList, q]);

  const moveTestimonial = async (index, direction) => {
    const newList = [...testimonialsList];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newList.length) return;

    // Swap items
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;

    // Update orders
    const updatedWithOrder = newList.map((item, i) => ({
      ...item,
      order: i + 1,
    }));

    setCol('testimonials', updatedWithOrder);
    setReordering(true);

    try {
      const res = await fetch('/api/testimonials/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: updatedWithOrder.map((t) => ({ id: t.id, order: t.order })),
        }),
      });
      if (!res.ok) throw new Error('Failed to save sequence order');
      toast('Testimonials sequence updated');
    } catch (err) {
      toast('Failed to save order changes');
      await fetchTestimonials();
    } finally {
      setReordering(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      const res = await fetch(`/api/testimonials/${deleting.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete testimonial');

      remove('testimonials', deleting.id);
      toast('Testimonial removed from database');
    } catch (err) {
      toast(err.message || 'Error deleting testimonial');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <DemoNote />
      <PageHeader
        title="Client Testimonials & Reviews"
        subtitle={`${filtered.length} of ${state.testimonials?.length || 0} client review entries in database`}
        actions={(
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={fetchTestimonials} disabled={loading}>
              <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Btn>
            <Btn variant="ghost" onClick={seedTestimonials} disabled={seeding}>
              {seeding ? 'Seeding…' : 'Sync / Reset Reviews'}
            </Btn>
            <Link href="/admin/content/testimonials/new">
              <Btn><IconPlus size={16} /> Create Testimonial</Btn>
            </Link>
          </div>
        )}
      />

      <div className="mb-4 max-w-md">
        <SearchInput value={q} onChange={setQ} placeholder="Search name, company or review quote…" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<IconStar size={22} />}
          title="No testimonials found"
          text="Try a different search, or click 'Sync / Reset Reviews' to seed default testimonials."
          action={(
            <div className="flex items-center gap-2">
              <Btn variant="ghost" onClick={seedTestimonials} disabled={seeding}>
                Sync / Reset Reviews
              </Btn>
              <Link href="/admin/content/testimonials/new">
                <Btn><IconPlus size={16} /> Create Testimonial</Btn>
              </Link>
            </div>
          )}
        />
      ) : (
        <TableWrap>
          <thead>
            <tr className="border-b border-ink-900/5 bg-slate-50/60">
              <th className={`${thCls} w-16 text-center`}>Seq</th>
              <th className={thCls}>Client</th>
              <th className={thCls}>Quote Snippet</th>
              <th className={thCls}>Rating</th>
              <th className={thCls}>Status</th>
              <th className={`${thCls} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, idx) => (
              <tr key={t.id || t.name} className="border-b border-ink-900/5 transition last:border-0 hover:bg-slate-50/70">
                <td className={`${tdCls} text-center`}>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <span className="font-mono text-xs font-bold text-ink-700">#{t.order || idx + 1}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveTestimonial(idx, -1)}
                        disabled={idx === 0 || reordering}
                        className="rounded p-1 text-ink-400 hover:bg-slate-200 hover:text-ink-900 disabled:opacity-30"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveTestimonial(idx, 1)}
                        disabled={idx === filtered.length - 1 || reordering}
                        className="rounded p-1 text-ink-400 hover:bg-slate-200 hover:text-ink-900 disabled:opacity-30"
                        title="Move Down"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </td>
                <td className={tdCls}>
                  <div className="flex items-center gap-2.5">
                    {t.img ? (
                      <Image
                        src={t.img}
                        alt={t.name}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover ring-1 ring-brand-200"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                        {t.name?.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-ink-900">{t.name}</p>
                      <p className="text-xs text-ink-500">{t.role}</p>
                    </div>
                  </div>
                </td>
                <td className={tdCls}>
                  <p className="max-w-xl text-xs text-ink-700 italic line-clamp-2">&quot;{t.quote}&quot;</p>
                </td>
                <td className={tdCls}>
                  <span className="text-amber-500 text-xs font-bold tracking-widest">
                    {'★'.repeat(Number(t.rating) || 5)}
                  </span>
                </td>
                <td className={tdCls}><StatusBadge status={t.status || 'Published'} /></td>
                <td className={`${tdCls} text-right`}>
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/admin/content/testimonials/${t.id}/edit`}
                      aria-label="Edit"
                      className="rounded-lg p-2 text-ink-400 transition hover:bg-brand-50 hover:text-brand-700"
                    >
                      <IconEdit size={16} />
                    </Link>
                    <button
                      onClick={() => setDeleting(t)}
                      aria-label="Delete"
                      className="rounded-lg p-2 text-ink-400 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete Testimonial">
        <ConfirmState
          title="Delete this testimonial?"
          text={`"${deleting?.name}"'s review will be permanently removed from the database.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      </Modal>
    </>
  );
}
