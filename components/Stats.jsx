'use client';

import { useEffect, useRef } from 'react';
import { useSiteContent } from '@/lib/useSiteContent';
import { StatsSkeleton } from '@/components/Skeletons';

const ICONS = [
  <svg key="i1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/></svg>,
  <svg key="i2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>,
  <svg key="i3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  <svg key="i4" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
];

const FALLBACK_STATS = [
  { id: 'fb-st-1', value: '2400', suffix: '+', label: 'Estimates Delivered' },
  { id: 'fb-st-2', value: '580', suffix: '+', label: 'Projects Completed' },
  { id: 'fb-st-3', value: '320', suffix: '+', label: 'Happy Contractors' },
  { id: 'fb-st-4', value: '12', suffix: '+', label: 'Years of Experience' },
];

export default function Stats() {
  const content = useSiteContent();
  const rootRef = useRef(null);

  const live = !!(content && content.loaded && content.stats && content.stats.length);
  const list = live ? content.stats : FALLBACK_STATS;
  const animKey = live ? 'live' : 'fallback';

  // Self-contained count-up (the global ScrollEffects observer only sees
  // elements present at its own mount, so dynamically loaded stats animate here).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = root.querySelectorAll('[data-countup]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          io.unobserve(el);
          const target = Number(el.dataset.countup) || 0;
          const duration = 1600;
          const start = performance.now();
          const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(target * eased).toLocaleString();
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.05 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [animKey, list.length]);

  // While the live data loads, show a skeleton — never a half-painted section.
  if (!content) return <StatsSkeleton />;

  // Admin can hide this section from Website Content → Visibility.
  if (content.loaded && content.sections?.stats === false) return null;

  return (
    <section className="relative -mt-16 z-10" ref={rootRef}>
      <div className="max-shell container-px">
        <div className="card p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map((s, i) => (
            <div key={s.id || i} className="flex items-center gap-4 reveal">
              <span className="grid place-items-center h-12 w-12 rounded-xl bg-brand-50 text-brand-600">
                {ICONS[i % ICONS.length]}
              </span>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  <span data-countup={String(s.value).replace(/[^0-9]/g, '') || '0'}>0</span>{s.suffix || ''}
                </p>
                <p className="text-xs sm:text-sm text-ink-600 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
