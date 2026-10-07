import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import CtaBanner from '@/components/CtaBanner';
import { TRADES } from '@/data/trades';

const BASE_URL = 'https://modernestimator.com';

export const metadata = {
  title: 'Our Trades — CSI Trade Estimating Services | Modern Estimator',
  description:
    'Trade-specific construction estimating and takeoff services for every CSI division: concrete, electrical, MEP, metals, finishes, roofing, sitework, lumber and more. 8–24 hour turnaround.',
  alternates: { canonical: '/trades' },
  openGraph: { title: 'Our Trades — CSI Trade Estimating Services', description: 'Specialist estimators for every construction trade. Bid-ready in 8–24 hours.', url: `${BASE_URL}/trades`, type: 'website' },
};

const WHY = [
  { title: 'A specialist for every division', desc: 'Concrete, MEP, steel, finishes — each trade is estimated by someone who works in it daily.' },
  { title: 'One format across all trades', desc: 'Every estimate follows the same CSI-coded structure, so multi-trade bids roll up cleanly.' },
  { title: 'No scope gaps between trades', desc: 'Our scope matrix assigns every item to exactly one trade before pricing.' },
  { title: 'Priced to your market', desc: 'Regional material and labor data for all 50 states, refreshed continuously.' },
];

export default function TradesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Construction Trade Estimating Services',
    itemListElement: TRADES.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.title, url: `${BASE_URL}/trades/${t.slug}` })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHeader
        eyebrow="Our Trades"
        title="Trade estimating services for every CSI division"
        subtitle="Specialist estimators for each trade — pick yours to see exactly what we measure, how we price it and what you receive."
        crumbs={[{ label: 'Our Trades' }]}
      />

      {/* Intro */}
      <section className="py-14 sm:py-16">
        <div className="max-shell container-px grid gap-10 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7 space-y-4 reveal">
            <p className="text-base sm:text-lg text-ink-700 leading-relaxed">General contractors, subcontractors and suppliers use Modern Estimator to bid trade-specific scopes with confidence. From a single <Link href="/trades/concrete-estimating" className="font-semibold text-brand-600 hover:text-brand-700">concrete</Link> pour to a coordinated <Link href="/trades/mep-estimating" className="font-semibold text-brand-600 hover:text-brand-700">MEP</Link> package, every trade is taken off by an estimator who specializes in that division and priced to your local market.</p>
            <p className="text-base sm:text-lg text-ink-700 leading-relaxed">Each trade page below explains what we quantify, who we serve and what you receive — and every estimate is delivered bid-ready in <strong>8–24 hours</strong>. Need a whole-project number instead? See our <Link href="/services" className="font-semibold text-brand-600 hover:text-brand-700">construction estimating services</Link> or <Link href="/contact" className="font-semibold text-brand-600 hover:text-brand-700">request a free quote</Link>.</p>
          </div>
          <div className="lg:col-span-5 grid gap-3 sm:grid-cols-2 reveal">
            {WHY.map((w) => (
              <div key={w.title} className="rounded-2xl border-2 border-brand-100 bg-white p-4">
                <p className="text-sm font-bold text-ink-900">{w.title}</p>
                <p className="mt-1 text-xs text-ink-600 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trade cards */}
      <section className="bg-brand-50/40 py-16 sm:py-20">
        <div className="max-shell container-px">
          <div className="max-w-3xl reveal">
            <span className="eyebrow">All Trades</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Choose your trade</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TRADES.map((t, i) => (
              <div key={t.slug} className="group flex flex-col rounded-2xl border-2 border-brand-100 bg-white transition duration-300 hover:-translate-y-1 hover:border-brand-500 hover:shadow-soft reveal">
                <div className="relative flex items-center justify-between overflow-hidden rounded-t-xl bg-brand-700 px-6 py-4 text-white">
                  <span aria-hidden className="absolute inset-0 grid-bg opacity-[0.07]"></span>
                  <Link href={`/trades/${t.slug}`} className="relative text-lg font-bold hover:text-accent-300 transition">{t.title}</Link>
                  <span className="relative text-3xl font-extrabold leading-none text-white/10 transition duration-300 group-hover:text-accent-500/70">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-sm text-ink-600">{t.tagline}</p>
                  {t.children.length > 0 && (
                    <ul className="mt-4 space-y-1.5">
                      {t.children.map((c) => (
                        <li key={c.slug}>
                          <Link href={`/trades/${c.slug}`} className="flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-brand-600 transition">
                            <span className="h-1.5 w-1.5 rotate-45 bg-accent-500 shrink-0"></span>{c.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link href={`/trades/${t.slug}`} className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition group-hover:gap-2.5">View details
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
