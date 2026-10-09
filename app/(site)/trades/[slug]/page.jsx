import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import CtaBanner from '@/components/CtaBanner';
import { getAllTrades } from '@/data/trade-pages';
import { SERVICES } from '@/data/services';
import { getTradeDetail, getTrades, pageRobots, getVisibility } from '@/lib/site';

const BASE_URL = 'https://modernestimator.com';

// Fresh data at most a minute old — admin edits go live quickly,
// pages stay fast and fully server-rendered for SEO.
export const revalidate = 60;
// New trade slugs added in admin resolve on demand even if not pre-rendered.
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const trades = await getTrades();
    const slugs = trades.length ? trades.map((t) => t.slug) : getAllTrades().map((t) => t.slug);
    return slugs.map((slug) => ({ slug }));
  } catch {
    return getAllTrades().map((t) => ({ slug: t.slug }));
  }
}

export async function generateMetadata({ params }) {
  const trade = await getTradeDetail(params.slug);
  if (!trade) return {};
  const title = trade.metaTitle || `${trade.title} Services — Modern Estimator`;
  const description = trade.metaDescription || trade.tagline;
  return {
    robots: await pageRobots('/trades/x'),
    title,
    description,
    alternates: { canonical: `/trades/${trade.slug}` },
    openGraph: { title, description, url: `${BASE_URL}/trades/${trade.slug}`, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

/* ---------- naming helpers ---------- */
// "HVAC Estimating" → "HVAC", "Duct Takeoff Services" → "duct", "Lumber Takeoff" → "lumber".
// Strips trailing generic words and lowercases everything except acronyms (HVAC, MEP…).
const STRIP = new Set(['services', 'estimating', 'takeoff', 'outsourcing']);
function shortName(title) {
  const words = title.split(' ');
  while (words.length > 1 && STRIP.has(words[words.length - 1].toLowerCase())) words.pop();
  return words.map((w) => (w === w.toUpperCase() && /[A-Z]/.test(w) ? w : w.toLowerCase())).join(' ');
}
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- shared, trade-aware copy ---------- */
const benefits = (name) => [
  { title: 'Trade-specialist estimators', desc: `Your ${name} estimate is prepared by an estimator who works in this division every day — not a generalist.` },
  { title: 'Accurate to ±2%', desc: 'Every quantity is measured on-screen and independently checked by a senior estimator before it leaves our desk.' },
  { title: '8–24 hour turnaround', desc: 'Bid-ready delivery inside a day for most projects, with rush options when the deadline is tight.' },
  { title: 'Priced to your market', desc: 'Regional material and labor databases for all 50 states, so your numbers reflect local conditions.' },
  { title: 'Bid-ready formats', desc: 'CSI-coded Excel workbooks, marked-up plans and proposal summaries you can submit as-is or adapt to your template.' },
  { title: 'Free revisions for 30 days', desc: 'Minor clarifications and adjustments after delivery are included — you are never left with a number you cannot use.' },
];

const steps = (name) => [
  { n: '01', title: 'Upload your plans', desc: 'Send drawings, specs and scope notes through our secure form. We confirm scope and price within 2 business hours.' },
  { n: '02', title: 'Specialist review', desc: `A ${name} estimator reviews the set, logs RFIs and confirms every assembly before the takeoff begins.` },
  { n: '03', title: 'Takeoff & pricing', desc: 'Quantities are measured on-screen, cross-checked and priced with current regional cost data and realistic labor units.' },
  { n: '04', title: 'Bid-ready delivery', desc: 'You receive the Excel estimate, marked-up plans and summary — usually within 8–24 hours — ready to submit.' },
];

const TOOLS = [
  { name: 'Bluebeam Revu', desc: 'On-screen measurement & markups' },
  { name: 'PlanSwift', desc: 'Digital takeoff by assembly' },
  { name: 'On-Screen Takeoff', desc: 'Rapid quantity extraction' },
  { name: 'RSMeans & regional data', desc: 'Current material & labor pricing' },
];

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-500 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
);
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
);

export default async function TradeDetailPage({ params }) {
  // Visibility toggle — hidden pages 404 (Website Content → Visibility).
  const __vis = await getVisibility();
  if (__vis?.pages?.['trades'] === false) notFound();
  const trade = await getTradeDetail(params.slug);
  if (!trade) notFound();

  const h1 = trade.h1 || trade.title;
  const name = shortName(trade.title); // e.g. "HVAC", "concrete", "duct"
  const url = `${BASE_URL}/trades/${trade.slug}`;

  const crumbs = trade.parent
    ? [{ label: 'Our Trades', href: '/trades' }, { label: trade.parent.title, href: `/trades/${trade.parent.slug}` }, { label: trade.title }]
    : [{ label: 'Our Trades', href: '/trades' }, { label: trade.title }];

  const related = trade.parent ? trade.parent.children.filter((c) => c.slug !== trade.slug) : trade.children;
  const relatedTitle = trade.parent ? `More in ${trade.parent.title}` : 'Specialized sub-trades';
  const relatedServices = SERVICES.filter((s) => (trade.relatedServices || []).includes(s.slug));
  const faqs = trade.faqs || [];
  const description = trade.metaDescription || trade.tagline;

  /* ---------- structured data ---------- */
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: h1,
      serviceType: `${cap(name)} estimating`,
      description,
      url,
      provider: { '@type': 'Organization', name: 'Modern Estimator', url: BASE_URL },
      areaServed: { '@type': 'Country', name: 'United States' },
      offers: { '@type': 'Offer', url: `${BASE_URL}/contact`, availability: 'https://schema.org/InStock' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        ...crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 2, name: c.label, item: c.href ? `${BASE_URL}${c.href}` : url })),
      ],
    },
    faqs.length > 0 && {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ].filter(Boolean);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHeader eyebrow="Trade Estimating" title={h1} subtitle={trade.tagline} crumbs={crumbs} />

      {/* ===== Intro + quick facts ===== */}
      <section className="py-16 sm:py-20">
        <div className="max-shell container-px grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-4 reveal">
            {(trade.intro || trade.overview || []).map((p, i) => (
              <p key={i} className="text-base sm:text-lg text-ink-700 leading-relaxed">{p}</p>
            ))}
            <p className="text-base sm:text-lg text-ink-700 leading-relaxed">
              {cap(name)} estimating is one of the many <Link href="/services" className="font-semibold text-brand-600 hover:text-brand-700 underline decoration-brand-200 underline-offset-4">construction estimating services</Link> we provide to contractors across the United States. Ready to get started? <Link href="/contact" className="font-semibold text-brand-600 hover:text-brand-700 underline decoration-brand-200 underline-offset-4">Upload your plans</Link> for a free quote.
            </p>
          </div>

          <aside className="lg:col-span-4 reveal">
            <div className="rounded-2xl bg-hero-gradient p-6 text-white shadow-soft">
              <p className="text-xs font-bold uppercase tracking-wider text-white/70">At a glance</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-center justify-between border-b border-white/10 pb-3"><span className="text-white/80">Turnaround</span><span className="font-bold">8–24 hours</span></li>
                <li className="flex items-center justify-between border-b border-white/10 pb-3"><span className="text-white/80">Accuracy</span><span className="font-bold">±2%</span></li>
                <li className="flex items-center justify-between border-b border-white/10 pb-3"><span className="text-white/80">Coverage</span><span className="font-bold">All 50 states</span></li>
                <li className="flex items-center justify-between"><span className="text-white/80">Formats</span><span className="font-bold">Excel + PDF</span></li>
              </ul>
              <Link href="/contact" className="btn-primary mt-6 w-full" style={{ background: '#fff', color: '#14284A' }}>Get a Free Quote
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
              <p className="mt-3 text-center text-xs text-white/60">Free, no-obligation · 30% off your first estimate</p>
            </div>
          </aside>
        </div>
      </section>

      {/* ===== Scope ===== */}
      {trade.scope && trade.scope.length > 0 && (
        <section className="bg-brand-50/40 py-16 sm:py-20">
          <div className="max-shell container-px">
            <div className="max-w-3xl reveal">
              <span className="eyebrow">Scope</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">What we quantify in {name} takeoffs</h2>
              <p className="mt-3 text-ink-600 leading-relaxed">Every item below is measured from your drawings and priced as its own line — so you can see exactly where the cost sits.</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {trade.scope.map((g) => (
                <div key={g.title} className="rounded-2xl border-2 border-brand-100 bg-white p-6 reveal">
                  <h3 className="text-lg font-bold text-ink-900">{g.title}</h3>
                  <span className="mt-2 block h-1 w-10 rounded-full bg-accent-500"></span>
                  <ul className="mt-4 space-y-2.5">
                    {g.items.map((it) => (
                      <li key={it} className="flex items-start gap-2.5 text-sm text-ink-700"><span className="mt-2 h-1.5 w-1.5 rotate-45 bg-accent-500 shrink-0"></span>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Who we serve + Deliverables ===== */}
      <section className="py-16 sm:py-20">
        <div className="max-shell container-px grid gap-12 lg:grid-cols-2">
          <div className="reveal">
            <span className="eyebrow">Who We Serve</span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">{cap(name)} estimating for</h2>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {(trade.serve || []).map((s) => (
                <li key={s} className="rounded-full border-2 border-brand-100 bg-white px-4 py-2 text-sm font-semibold text-ink-800">{s}</li>
              ))}
            </ul>
            <p className="mt-6 text-ink-600 leading-relaxed">Whether you self-perform this trade or manage it as a general contractor, we deliver numbers in the format your team bids and buys from. See our <Link href="/portfolio" className="font-semibold text-brand-600 hover:text-brand-700">recent projects</Link> or <Link href="/about" className="font-semibold text-brand-600 hover:text-brand-700">learn how we work</Link>.</p>
          </div>
          <div className="reveal">
            <span className="eyebrow">Deliverables</span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">What you receive</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {(trade.deliverables || []).map((d) => (
                <div key={d} className="rounded-2xl border-2 border-brand-100 bg-white p-5">
                  <span className="grid place-items-center h-10 w-10 rounded-xl bg-brand-50 text-brand-600"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/></svg></span>
                  <p className="mt-3 text-sm font-semibold text-ink-800">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Why choose us ===== */}
      <section className="bg-ink-900 py-16 sm:py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(35,75,134,0.18), transparent 60%)' }}></div>
        <div className="relative max-shell container-px">
          <div className="max-w-3xl reveal">
            <span className="eyebrow">Why Modern Estimator</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Why contractors trust us with {name} estimates</h2>
          </div>
          <div className="mt-10 grid gap-px rounded-2xl overflow-hidden bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {benefits(name).map((b) => (
              <div key={b.title} className="bg-ink-900 p-6 hover:bg-ink-800 transition reveal">
                <span className="grid place-items-center h-10 w-10 rounded-xl bg-accent-500 text-white"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg></span>
                <h3 className="mt-4 text-base font-bold">{b.title}</h3>
                <p className="mt-1.5 text-sm text-white/70 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Process + Tools ===== */}
      <section className="py-16 sm:py-20">
        <div className="max-shell container-px">
          <div className="max-w-3xl reveal">
            <span className="eyebrow">How It Works</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Our {name} estimating process</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps(name).map((s) => (
              <div key={s.n} className="rounded-2xl border-2 border-brand-100 bg-white p-6 reveal">
                <span className="text-3xl font-extrabold text-accent-500">{s.n}</span>
                <h3 className="mt-3 text-base font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-2xl border-2 border-brand-100 bg-brand-50/40 p-6 sm:p-8 reveal">
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-4">
                <span className="eyebrow">Tools & Data</span>
                <h3 className="mt-3 text-2xl font-bold tracking-tight">Industry-standard takeoff software and live cost data</h3>
                <p className="mt-2 text-sm text-ink-600 leading-relaxed">Digital measurement means every quantity is traceable to the drawing — and current cost databases mean your pricing reflects today&apos;s market, not last year&apos;s.</p>
              </div>
              <ul className="lg:col-span-8 grid gap-4 sm:grid-cols-2">
                {TOOLS.map((t) => (
                  <li key={t.name} className="flex items-start gap-3 rounded-xl bg-white p-4 ring-1 ring-ink-900/5">
                    <CheckIcon />
                    <div><p className="text-sm font-bold text-ink-900">{t.name}</p><p className="text-xs text-ink-600">{t.desc}</p></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Related trades + services ===== */}
      <section className="bg-brand-50/40 py-16 sm:py-20">
        <div className="max-shell container-px grid gap-10 lg:grid-cols-2">
          {related.length > 0 && (
            <div className="reveal">
              <span className="eyebrow">Related Trades</span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">{relatedTitle}</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {related.map((r) => (
                  <Link key={r.slug} href={`/trades/${r.slug}`} className="group rounded-2xl border-2 border-brand-100 bg-white p-4 transition hover:border-brand-500 hover:shadow-soft">
                    <p className="text-sm font-bold text-ink-900 group-hover:text-brand-700">{r.title}</p>
                    <p className="mt-1 text-xs text-ink-600 line-clamp-2">{r.tagline}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-600">Learn more <ArrowIcon /></span>
                  </Link>
                ))}
              </div>
              {trade.parent && (
                <Link href={`/trades/${trade.parent.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                  All {trade.parent.title} services
                </Link>
              )}
            </div>
          )}

          {relatedServices.length > 0 && (
            <div className="reveal">
              <span className="eyebrow">Related Services</span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">Services that pair with {name} estimating</h2>
              <div className="mt-6 space-y-3">
                {relatedServices.map((s) => (
                  <Link key={s.slug} href={`/services/${s.slug}`} className="group flex items-center gap-4 rounded-2xl border-2 border-brand-100 bg-white p-4 transition hover:border-brand-500 hover:shadow-soft">
                    <span className="grid place-items-center h-11 w-11 rounded-xl bg-brand-700 text-white shrink-0 transition group-hover:bg-accent-500">{s.icon}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-ink-900 group-hover:text-brand-700">{s.title}</p>
                      <p className="text-xs text-ink-600 truncate">{s.short}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/trades" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">Browse all trades <ArrowIcon /></Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      {faqs.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="max-shell container-px">
            <div className="max-w-3xl mx-auto text-center reveal">
              <span className="eyebrow">FAQ</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">{cap(name)} estimating — common questions</h2>
            </div>
            <div className="mt-10 mx-auto max-w-3xl divide-y divide-ink-900/10 rounded-2xl border-2 border-brand-100 bg-white px-6 reveal">
              {faqs.map((f, i) => (
                <details key={i} className="group py-5" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left">
                    <h3 className="text-base sm:text-lg font-semibold text-ink-900">{f.q}</h3>
                    <span className="grid place-items-center h-8 w-8 shrink-0 rounded-full bg-brand-50 text-brand-600 transition group-open:rotate-45 group-open:bg-brand-500 group-open:text-white">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    </span>
                  </summary>
                  <p className="mt-3 pr-12 text-sm sm:text-base text-ink-700 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBanner />
    </>
  );
}
