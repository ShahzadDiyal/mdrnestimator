import Link from 'next/link';
import { TRADES } from '@/data/trades';

// Home-page section linking to every parent trade — internal-linking hub for /trades/*.
export default function TradesPreview() {
  return (
    <section className="bg-brand-50/40 py-20 sm:py-24">
      <div className="max-shell container-px">
        <div className="max-w-3xl mx-auto text-center reveal">
          <span className="eyebrow">Our Trades</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">Specialist estimating for every trade</h2>
          <p className="mt-4 text-base sm:text-lg text-ink-600 leading-relaxed">Trade-specific takeoffs from estimators who work in your division every day — from concrete and steel to MEP, finishes and sitework.</p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {TRADES.map((t) => (
            <Link key={t.slug} href={`/trades/${t.slug}`} className="group flex flex-col rounded-2xl border-2 border-brand-100 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-brand-500 hover:shadow-soft reveal">
              <span className="h-1 w-8 rounded-full bg-accent-500 transition-all group-hover:w-12"></span>
              <h3 className="mt-3 text-sm font-bold text-ink-900 group-hover:text-brand-700 leading-snug">{t.title}</h3>
              {t.children.length > 0 && <p className="mt-1 text-[11px] font-medium text-ink-500">{t.children.length} specialized service{t.children.length > 1 ? 's' : ''}</p>}
              <span className="mt-auto pt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 transition group-hover:gap-2">View trade
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
              </span>
            </Link>
          ))}
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
