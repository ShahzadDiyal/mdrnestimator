'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/components/admin/store';
import {
  PageHeader, Btn, StatusBadge, SearchInput, TableWrap, thCls, tdCls,
  DemoNote, EmptyState, Modal, ConfirmState, toast, Select,
} from '@/components/admin/ui';
import { IconPlus, IconEdit, IconTrash, IconHelp, IconRefresh } from '@/components/admin/icons';

export default function FaqsPage() {
  const { state, setCol, remove } = useStore();
  const [q, setQ] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [reordering, setReordering] = useState(false);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/faqs');
      const data = await res.json();
      if (data.faqs && Array.isArray(data.faqs)) {
        setCol('faqs', data.faqs);
      }
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      toast('Failed to fetch FAQs from database');
    } finally {
      setLoading(false);
    }
  };

  const seedFaqs = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/faqs/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed FAQs');
      toast(data.message || 'Seeded FAQs successfully!');
      await fetchFaqs();
    } catch (err) {
      toast(err.message || 'Error seeding FAQs');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const faqsList = useMemo(() => {
    const list = Array.isArray(state.faqs) ? [...state.faqs] : [];
    list.sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
    return list;
  }, [state.faqs]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return faqsList.filter(
      (f) => !needle || `${f.q} ${f.a} ${f.category}`.toLowerCase().includes(needle)
    );
  }, [faqsList, q]);

  const moveFaq = async (index, direction) => {
    const newList = [...faqsList];
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

    setCol('faqs', updatedWithOrder);
    setReordering(true);

    try {
      const res = await fetch('/api/faqs/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: updatedWithOrder.map((f) => ({ id: f.id, order: f.order })),
        }),
      });
      if (!res.ok) throw new Error('Failed to save sequence order');
      toast('FAQ sequence updated');
    } catch (err) {
      toast('Failed to save order changes');
      await fetchFaqs();
    } finally {
      setReordering(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      const res = await fetch(`/api/faqs/${deleting.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete FAQ');

      remove('faqs', deleting.id);
      toast('FAQ item removed from database');
    } catch (err) {
      toast(err.message || 'Error deleting FAQ');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <DemoNote />
      <PageHeader
        title="Frequently Asked Questions (FAQs)"
        subtitle={`${filtered.length} of ${state.faqs?.length || 0} FAQ entries in database`}
        actions={(
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={fetchFaqs} disabled={loading}>
              <IconRefresh size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Btn>
            <Btn variant="ghost" onClick={seedFaqs} disabled={seeding}>
              {seeding ? 'Seeding…' : 'Sync / Reset FAQs'}
            </Btn>
            <Link href="/admin/content/faqs/new">
              <Btn><IconPlus size={16} /> Create New FAQ</Btn>
            </Link>
          </div>
        )}
      />

      <div className="mb-4 max-w-md">
        <SearchInput value={q} onChange={setQ} placeholder="Search question or answer text…" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<IconHelp size={22} />}
          title="No FAQ entries found"
          text="Try a different search, or click 'Sync / Reset FAQs' to seed default FAQs."
          action={(
            <div className="flex items-center gap-2">
              <Btn variant="ghost" onClick={seedFaqs} disabled={seeding}>
                Sync / Reset FAQs
              </Btn>
              <Link href="/admin/content/faqs/new">
                <Btn><IconPlus size={16} /> Create New FAQ</Btn>
              </Link>
            </div>
          )}
        />
      ) : (
        <TableWrap>
          <thead>
            <tr className="border-b border-ink-900/5 bg-slate-50/60">
              <th className={`${thCls} w-16 text-center`}>Seq</th>
              <th className={thCls}>Question & Answer</th>
              <th className={thCls}>Category</th>
              <th className={thCls}>Status</th>
              <th className={`${thCls} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f, idx) => (
              <tr key={f.id || f.q} className="border-b border-ink-900/5 transition last:border-0 hover:bg-slate-50/70">
                <td className={`${tdCls} text-center`}>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <span className="font-mono text-xs font-bold text-ink-700">#{f.order || idx + 1}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveFaq(idx, -1)}
                        disabled={idx === 0 || reordering}
                        className="rounded p-1 text-ink-400 hover:bg-slate-200 hover:text-ink-900 disabled:opacity-30"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveFaq(idx, 1)}
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
                  <p className="font-semibold text-ink-900">{f.q}</p>
                  <p className="mt-1 max-w-2xl text-xs text-ink-600 line-clamp-2">{f.a}</p>
                </td>
                <td className={tdCls}>
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                    {f.category || 'General'}
                  </span>
                </td>
                <td className={tdCls}><StatusBadge status={f.status || 'Published'} /></td>
                <td className={`${tdCls} text-right`}>
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/admin/content/faqs/${f.id}/edit`}
                      aria-label="Edit"
                      className="rounded-lg p-2 text-ink-400 transition hover:bg-brand-50 hover:text-brand-700"
                    >
                      <IconEdit size={16} />
                    </Link>
                    <button
                      onClick={() => setDeleting(f)}
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

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete FAQ">
        <ConfirmState
          title="Delete this FAQ?"
          text={`"${deleting?.q}" will be permanently removed from the database.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      </Modal>
    </>
  );
}
