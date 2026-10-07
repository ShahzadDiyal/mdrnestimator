import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import CtaBanner from '@/components/CtaBanner';
import { SERVICES, getService } from '@/data/services';
import { getAllTrades } from '@/data/trade-pages';
import { getServices, getServiceBySlug, getTrades, toArray, toParagraphs } from '@/lib/site';

// Fresh data at most a minute old — admin edits go live quickly,
// pages stay fast and fully server-rendered for SEO.
export const revalidate = 60;
// New slugs added in admin resolve on demand even if not pre-rendered.
export const dynamicParams = true;

// Trades most relevant to each service — powers the "Related trades" cross-links.
const SERVICE_TRADES = {
  'quantity-takeoff': ['concrete-estimating', 'drywall-takeoff-services', 'duct-takeoff-services', 'lumber-takeoff', 'rebar-estimating', 'roofing-estimating'],
  'material-estimation': ['lumber-takeoff', 'concrete-estimating', 'drywall-takeoff-services', 'flooring-estimating-services', 'insulation-estimating-services', 'gutter-estimating'],
  'residential-estimation': ['lumber-takeoff', 'roofing-estimating', 'drywall-takeoff-services', 'flooring-estimating-services', 'painting-estimating-services', 'hvac-estimating'],
  'commercial-estimation': ['concrete-estimating', 'structural-steel-estimating-services', 'mep-estimating', 'electrical-estimating', 'openings-estimating', 'sitework-estimating'],
  'bid-preparation': ['mep-estimating', 'electrical-estimating', 'metals-estimating', 'thermal-moisture-protection-estimating', 'sitework-estimating', 'masonry-estimating'],
  'trade-specific-estimates': ['concrete-estimating', 'electrical-estimating', 'mep-estimating', 'metals-estimating', 'interior-exterior-finishes', 'thermal-moisture-protection-estimating'],
};

const iconFor = (slug) => SERVICES.find((x) => x.slug === slug)?.icon || null;

export async function generateStaticParams() {
  try {
    const services = await getServices();
    const list = services.length ? services : SERVICES;
    return list.map((s) => ({ slug: s.slug }));
  } catch {
    return SERVICES.map((s) => ({ slug: s.slug }));
  }
}

export async function generateMetadata({ params }) {
  const service = (await getServiceBySlug(params.slug)) || getService(params.slug);
  if (!service) return {};
  return {
    title: service.metaTitle || `${service.title} — Modern Estimator`,
    description: service.metaDescription || service.tagline || service.short || '',
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({ params }) {
  // One parallel roundtrip for everything the page needs.
  const [liveServices, liveTrades] = await Promise.all([getServices(), getTrades()]);
  const raw = liveServices.find((s) => s.slug === params.slug) || getService(params.slug);
  if (!raw) notFound();

  const service = {
    ...raw,
    icon: iconFor(raw.slug),
    overview: toParagraphs(raw.overview),
    includes: toArray(raw.includes),
    deliverables: toArray(raw.deliverables),
  };

  const all = liveServices.length ? liveServices : SERVICES;
  const others = all
    .filter((s) => s.slug !== service.slug)
    .slice(0, 4)
    .map((s) => ({ slug: s.slug, title: s.title, icon: iconFor(s.slug) }));

  const tradePool = liveTrades.length ? liveTrades : getAllTrades();
  const relatedTrades = (SERVICE_TRADES[service.slug] || [])
    .map((slug) => tradePool.find((t) => t.slug === slug))
    .filter(Boolean);

  return (
    <>
      <PageHeader
        eyebrow="Service"
        title={service.h1 || service.title}
        subtitle={service.tagline}
        crumbs={[{ label: 'Services', href: '/services' }, { label: service.title }]}
      />

      <section className="py-16 sm:py-20">
        <div className="max-shell container-px grid lg:grid-cols-12 gap-10">
          {/* Main */}
          <div className="lg:col-span-8">
            <span className="grid place-items-center h-14 w-14 rounded-2xl bg-brand-700 text-white shadow-soft reveal">{service.icon}</span>

            <div className="mt-6 space-y-4 reveal">
              {service.overview.map((p, i) => (
                <p key={i} className="text-base sm:text-lg text-ink-700 leading-relaxed">{p}</p>
              ))}
            </div>

            {service.includes.length > 0 && (
              <>
                <h2 className="mt-10 text-2xl font-bold reveal">What&apos;s included</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2 reveal">
                  {service.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3 rounded-xl border border-brand-100 bg-white p-3.5">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-500 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                      <span className="text-sm font-medium text-ink-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {service.deliverables.length > 0 && (
              <>
                <h2 className="mt-10 text-2xl font-bold reveal">What you receive</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-3 reveal">
                  {service.deliverables.map((d) => (
                    <div key={d} className="rounded-2xl border-2 border-brand-100 bg-white p-5">
                      <span className="grid place-items-center h-10 w-10 rounded-xl bg-brand-50 text-brand-600"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/></svg></span>
                      <p className="mt-3 text-sm font-semibold text-ink-800">{d}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="reveal rounded-2xl bg-hero-gradient p-6 text-white shadow-soft">
              <h3 className="text-lg font-bold">Need this estimated?</h3>
              <p className="mt-2 text-sm text-white/80">Send us your plans and get a free quote in under 2 hours — complete estimate in 8–24 hours.</p>
              <Link href="/contact" className="btn-primary mt-5 w-full" style={{ background: '#fff', color: '#14284A' }}>Get a Free Quote
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>

            <div className="reveal rounded-2xl border-2 border-brand-100 bg-white p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-ink-500">Other services</h3>
              <ul className="mt-4 space-y-1">
                {others.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-700 transition">
                      <span className="grid place-items-center h-8 w-8 rounded-lg bg-brand-50 text-brand-600 shrink-0">{s.icon}</span>
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Related trades — cross-links into /trades/* */}
      {relatedTrades.length > 0 && (
        <section className="bg-brand-50/40 py-16 sm:py-20">
          <div className="max-shell container-px">
            <div className="max-w-3xl reveal">
              <span className="eyebrow">Related Trades</span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">Trade-specific estimates for {service.title.toLowerCase()}</h2>
              <p className="mt-3 text-ink-600 leading-relaxed">Need a single trade priced on its own? Our specialist estimators cover every CSI division — <Link href="/trades" className="font-semibold text-brand-600 hover:text-brand-700">browse all trades</Link>.</p>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTrades.map((t) => (
                <Link key={t.slug} href={`/trades/${t.slug}`} className="group rounded-2xl border-2 border-brand-100 bg-white p-4 transition hover:border-brand-500 hover:shadow-soft reveal">
                  <p className="text-sm font-bold text-ink-900 group-hover:text-brand-700">{t.title}</p>
                  <p className="mt-1 text-xs text-ink-600 line-clamp-2">{t.tagline}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBanner />
    </>
  );
}
