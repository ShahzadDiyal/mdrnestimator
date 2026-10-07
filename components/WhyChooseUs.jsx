'use client';

import { useSiteContent } from '@/lib/useSiteContent';

const ICONS = [
  <svg key="w1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  <svg key="w2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  <svg key="w3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>,
  <svg key="w4" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  <svg key="w5" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>,
  <svg key="w6" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
];

const FALLBACK_FEATURES = [
  { id: 'fb-w1', title: 'Pinpoint Accuracy', desc: 'Estimates within ±2% — every line item double-checked by senior estimators.' },
  { id: 'fb-w2', title: 'Fast Turnaround', desc: 'Standard delivery in 8–24 hours. Rush options available without sacrificing quality.' },
  { id: 'fb-w3', title: 'Confidential & Secure', desc: 'NDA on every project. Your drawings, scopes and pricing stay private.' },
  { id: 'fb-w4', title: 'USA Coverage', desc: 'Regional pricing databases for all 50 states — from coastal markets to the Midwest.' },
  { id: 'fb-w5', title: 'Better Margins', desc: 'Win more bids and protect profit with realistic, defensible numbers.' },
  { id: 'fb-w6', title: '24/7 Support', desc: 'Dedicated estimator on every project. Direct line for revisions and questions.' },
];

export default function WhyChooseUs() {
  const content = useSiteContent();

  // Admin can hide this section from Website Content → Visibility.
  if (content && content.loaded && content.sections?.whyChooseUs === false) return null;

  const live = !!(content && content.loaded && content.whyChooseUs && content.whyChooseUs.length);
  const list = live ? content.whyChooseUs : FALLBACK_FEATURES;

  return (
    <section className="py-20 sm:py-24 bg-ink-900 text-white relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(35,75,134,0.18), transparent 60%)' }}></div>
      <div className="relative max-shell container-px">
        <div className="max-w-3xl mx-auto text-center reveal">
          <span className="eyebrow">Why Choose Us</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">The estimating partner contractors trust to win</h2>
          <p className="mt-4 text-base sm:text-lg text-white/70 leading-relaxed">We combine senior estimator expertise with modern takeoff software to deliver bid-ready packages that hold up to scrutiny.</p>
        </div>
        <div className="mt-14 grid gap-px rounded-2xl overflow-hidden bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((f, i) => (
            <div key={f.id || f.title} className="bg-ink-900 p-7 hover:bg-ink-800 transition reveal">
              <span className="grid place-items-center h-12 w-12 rounded-xl bg-brand-500 text-white">{ICONS[i % ICONS.length]}</span>
              <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
