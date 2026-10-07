import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import Stats from '@/components/Stats';
import WhyChooseUs from '@/components/WhyChooseUs';
import CtaBanner from '@/components/CtaBanner';

export const metadata = {
  title: 'About Us — Modern Estimator',
  description:
    'Modern Estimator is a US construction estimating company delivering accurate, CSI-coded quantity takeoffs and bid-ready estimates with a 8–24 hour turnaround.',
  alternates: { canonical: '/about' },
};

const HIGHLIGHTS = [
  'Senior estimators with 12+ years of experience',
  'Coverage across all 50 states and every CSI division',
  'Estimates accurate to within ±2%',
  'Standard 8–24 hour turnaround, rush options available',
  'NDA on every project — your plans stay private',
  'Dedicated estimator and direct line on every job',
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="Your estimating partner, from plans to bid"
        subtitle="Modern Estimator helps contractors and builders across the United States bid faster, win more work and protect their margins with accurate, defensible numbers."
        crumbs={[{ label: 'About Us' }]}
      />

      <Stats />

      {/* Who we are */}
      <section className="py-20 sm:py-24">
        <div className="max-shell container-px grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 reveal">
            <span className="eyebrow">Who We Are</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight leading-tight">Built by estimators, for contractors</h2>
            <div className="mt-5 space-y-4 text-base sm:text-lg text-ink-700 leading-relaxed">
              <p>Modern Estimator was founded by senior cost estimators who spent years inside general contracting and trade firms — and saw how often good contractors lost good work to slow, inconsistent bidding.</p>
              <p>Today we act as an extension of your pre-construction team. We take in your drawings and specifications, perform detailed CSI-coded takeoffs, price every line with current regional cost data, and hand back a clean, bid-ready estimate in 8–24 hours.</p>
              <p>From single-family homes to multi-million-dollar commercial builds, our mission is simple: give you numbers you can defend, on a deadline you can count on.</p>
            </div>
            <Link href="/contact" className="btn-primary mt-8">Work with us
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>

          <div className="lg:col-span-5 reveal">
            <div className="rounded-2xl border-2 border-brand-100 bg-white p-6 sm:p-8">
              <h3 className="text-lg font-bold">Why contractors choose us</h3>
              <ul className="mt-5 space-y-3">
                {HIGHLIGHTS.map((h) => (
                  <li key={h} className="flex items-start gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-500 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                    <span className="text-sm font-medium text-ink-700">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="pb-4">
        <div className="max-shell container-px grid gap-6 md:grid-cols-2">
          <div className="reveal rounded-2xl border-2 border-brand-100 bg-white p-7">
            <span className="grid place-items-center h-12 w-12 rounded-xl bg-brand-700 text-white"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></span>
            <h3 className="mt-5 text-xl font-bold">Our mission</h3>
            <p className="mt-2 text-ink-600 leading-relaxed">To make accurate, professional estimating accessible to every contractor — so winning the next bid comes down to the work, not the paperwork.</p>
          </div>
          <div className="reveal rounded-2xl border-2 border-brand-100 bg-white p-7">
            <span className="grid place-items-center h-12 w-12 rounded-xl bg-accent-500 text-white"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></span>
            <h3 className="mt-5 text-xl font-bold">Our vision</h3>
            <p className="mt-2 text-ink-600 leading-relaxed">To be the most trusted estimating partner in the US construction industry — known for accuracy, speed and numbers contractors can stand behind.</p>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <CtaBanner />
    </>
  );
}
