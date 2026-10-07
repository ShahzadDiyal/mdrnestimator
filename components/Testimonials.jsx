'use client';

import { useSiteContent } from '@/lib/useSiteContent';
import { TestimonialsSkeleton } from '@/components/Skeletons';

const FALLBACK_TESTIMONIALS = [
  {
    id: 'fb-tst-1',
    quote: 'Modern Estimator turned my bid prep from a 3-day grind into a 24-hour deliverable. Our win-rate jumped 18% in the first quarter.',
    img: '/review-1.png',
    name: 'Michael Reynolds',
    role: 'Owner, Reynolds Construction • Austin, TX',
    rating: 5,
  },
  {
    id: 'fb-tst-2',
    quote: "Accurate, fast and bid-ready. Their CSI breakdowns make sub-leveling effortless. They've become an extension of our pre-con team.",
    img: '/review-2.png',
    name: 'Steve Parker',
    role: 'Pre-Construction Manager • Denver, CO',
    rating: 5,
  },
  {
    id: 'fb-tst-3',
    quote: "We used to outsource estimates to three firms. Now it's just Modern Estimator. Numbers I can defend, deadlines they always hit.",
    img: '/review-3.png',
    name: 'David Chen',
    role: 'GC, Chen Builders • Seattle, WA',
    rating: 5,
  },
];

const stars = (n) => '★★★★★'.slice(0, Math.max(0, Math.min(5, Number(n) || 5)));

export default function Testimonials() {
  const content = useSiteContent();

  // While the live data loads, show a skeleton — never a half-painted section.
  if (!content) return <TestimonialsSkeleton />;

  // Admin can hide this section from Website Content → Visibility.
  if (content.loaded && content.sections?.testimonials === false) return null;

  const live = !!(content && content.loaded && content.testimonials && content.testimonials.length);
  const list = live ? content.testimonials : FALLBACK_TESTIMONIALS;

  const h = content?.headings?.testimonials || {};
  const eyebrow = h.eyebrow ?? 'Client Stories';
  const heading = h.heading ?? 'What contractors say about us';
  const subtitle = h.subtitle ?? 'Trusted by general contractors and builders across the United States.';

  return (
    <section className="py-20 sm:py-24">
      <div className="max-shell container-px">
        <div className="max-w-3xl mx-auto text-center reveal">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">{heading}</h2>
          {subtitle && <p className="mt-4 text-base sm:text-lg text-ink-600 leading-relaxed">{subtitle}</p>}
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {list.map((t) => (
            <div key={t.id || t.name} className="card p-7 relative overflow-hidden reveal">
              <span className="absolute -right-2 -top-2 text-brand-50 text-[120px] leading-none font-serif">&rdquo;</span>
              <div className="relative">
                <div className="text-yellow-400 text-lg">{stars(t.rating)}</div>
                <p className="mt-4 text-ink-800 leading-relaxed">&quot;{t.quote}&quot;</p>
                <div className="mt-6 pt-6 border-t border-ink-900/5 flex items-center gap-3">
                  {t.img && (
                    <img
                      src={t.img}
                      alt={t.name}
                      loading="lazy"
                      className="h-11 w-11 rounded-full object-cover object-top ring-2 ring-brand-100"
                    />
                  )}
                  <div><p className="text-sm font-bold">{t.name}</p><p className="text-xs text-ink-600">{t.role}</p></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
