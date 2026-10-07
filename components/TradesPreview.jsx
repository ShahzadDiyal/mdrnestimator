'use client';

import Link from 'next/link';
import { TRADES } from '@/data/trades';
import { useSiteContent } from '@/lib/useSiteContent';

// Home-page section linking to every parent trade — internal-linking hub for /trades/*.
export default function TradesPreview() {
  const content = useSiteContent();

  // Admin can hide this section from Website Content → Visibility.
  if (content && content.loaded && content.sections?.trades === false) return null;

  const live = !!(content && content.loaded && content.trades && content.trades.length);
  const all = live ? content.trades : [];
  const tops = live
    ? all
        .filter((t) => !t.parent || t.parent === '—')
        .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
    : [];
  const childCount = (t) => all.filter((c) => c.parent === t.title).length;
  const list = live ? tops : TRADES;

  const h = content?.headings?.trades || {};
  const eyebrow = h.eyebrow ?? 'Our Trades';
  const heading = h.heading ?? 'Specialist estimating for every trade';
  const subtitle = h.subtitle ?? 'Trade-specific takeoffs from estimators who work in your division every day — from concrete and steel to MEP, finishes and sitework.';

  return (
    <section className="bg-brand-50/40 py-20 sm:py-24">
      <div className="max-shell container-px">
        <div className="max-w-3xl mx-auto text-center reveal">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">{heading}</h2>
          {subtitle && <p className="mt-4 text-base sm:text-lg text-ink-600 leading-relaxed">{subtitle}</p>}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {list.map((t) => {
            const n = live ? childCount(t) : (t.children ? t.children.length : 0);
            return (
              <Link key={t.slug} href={`/trades/${t.slug}`} className="group flex flex-col rounded-2xl border-2 border-brand-100 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-brand-500 hover:shadow-soft reveal">
                <span className="h-1 w-8 rounded-full bg-accent-500 transition-all group-hover:w-12"></span>
                <h3 className="mt-3 text-sm font-bold text-ink-900 group-hover:text-brand-700 leading-snug">{t.title}</h3>
                {n > 0 && <p className="mt-1 text-[11px] font-medium text-ink-500">{n} specialized service{n > 1 ? 's' : ''}</p>}
                <span className="mt-auto pt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 transition group-hover:gap-2">View trade
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center reveal">
          <Link href="/trades" className="btn-primary">View all trades
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
