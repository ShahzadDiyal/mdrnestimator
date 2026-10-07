'use client';

import Link from 'next/link';
import { SERVICES } from '@/data/services';
import ServiceCard from '@/components/ServiceCard';
import { useSiteContent, toArray } from '@/lib/useSiteContent';

const iconFor = (slug) => {
  const s = SERVICES.find((x) => x.slug === slug);
  return s ? s.icon : null;
};

export default function Services() {
  const content = useSiteContent();

  // Admin can hide this section from Website Content → Visibility.
  if (content && content.loaded && content.sections?.services === false) return null;

  const live = !!(content && content.loaded && content.services && content.services.length);
  const list = live
    ? content.services.map((s) => ({
        slug: s.slug,
        title: s.title,
        short: s.short || s.tagline || '',
        points: toArray(s.points).slice(0, 4),
        icon: iconFor(s.slug),
      }))
    : SERVICES;

  const h = content?.headings?.services || {};
  const eyebrow = h.eyebrow ?? 'What We Do';
  const heading = h.heading ?? 'Estimation services built to win you work';
  const subtitle = h.subtitle ?? 'From quantity takeoffs to full bid packages — we cover every scope contractors need to estimate accurately and win profitably.';

  return (
    <section id="services" className="py-20 sm:py-24">
      <div className="max-shell container-px">
        <div className="max-w-3xl mx-auto text-center reveal">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">{heading}</h2>
          {subtitle && <p className="mt-4 text-base sm:text-lg text-ink-600 leading-relaxed">{subtitle}</p>}
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s, i) => (
            <ServiceCard key={s.slug} service={s} index={i} />
          ))}
        </div>

        <div className="mt-12 text-center reveal">
          <Link href="/services" className="btn-primary">View all services
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
