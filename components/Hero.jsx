'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSiteContent } from '@/lib/useSiteContent';
import { HeroSkeleton } from '@/components/Skeletons';

const STARS = '★★★★★';

const FALLBACK_BADGES = [
  { label: 'Google Reviews', value: '5.0' },
  { label: 'Certified', value: 'Estimators' },
  { label: 'Top Rated', value: 'Estimating Service 2025' },
];

export default function Hero() {
  const content = useSiteContent();

  // While the live data loads, show a skeleton — never a half-painted section.
  if (!content) return <HeroSkeleton />;

  // Admin can hide this section from Website Content → Visibility.
  if (content.loaded && content.sections?.hero === false) return null;

  const hero = content?.hero || {};
  const live = !!(content && content.loaded);

  const badge = hero.badge ?? 'Trusted by 500+ US Contractors';
  const title = hero.title ?? 'Win More Bids With';
  const titleAccent = hero.titleAccent ?? 'Accurate Construction Estimating';
  const titleSuffix = hero.titleSuffix ?? 'Services';
  const intro = hero.intro ?? 'Every bid you lose to a rough guess is money left on the table. Modern Estimator delivers precise, bid-ready construction estimating and quantity takeoff services in 8 to 24 hours, giving you the accurate numbers to quote fast and win more work.';
  const ctaPrimary = hero.ctaPrimary ?? 'Get a Free Quote';
  const ctaPrimaryHref = hero.ctaPrimaryHref || '/contact';
  const ctaSecondary = hero.ctaSecondary ?? 'Upload Your Plans';
  const ctaSecondaryHref = hero.ctaSecondaryHref || '/contact';
  const image = hero.image || '/hero.jpg';
  const imageAlt = hero.imageAlt || 'Modern Estimator team preparing construction estimates from blueprints on site';
  const isRemoteImage = /^https?:\/\//i.test(image);

  const badges = live ? (hero.trustBadges || []) : FALLBACK_BADGES;
  const b0 = badges[0] || {};
  const b1 = badges[1] || {};
  const b2 = badges[2] || {};
  const b2Year = ((b2.value || '').match(/\d{4}/) || [])[0] || '';
  const b2Text = (b2.value || '').replace(b2Year, '').trim();

  return (
    <section className="relative overflow-hidden bg-hero-gradient text-white">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top right,rgba(255,255,255,.18),transparent 60%)' }}></div>
      <div aria-hidden className="absolute inset-0 grid-bg"></div>
      <div className="relative max-shell container-px pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* ===== Left: copy ===== */}
          <div className="lg:col-span-7 reveal">
            {badge && (
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 ring-1 ring-accent-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-400"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
                {badge}
              </span>
            )}

            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.4rem] font-bold tracking-tight leading-[1.08]">
              {title} <span className="text-accent-400">{titleAccent}</span> {titleSuffix}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-white/80 leading-relaxed max-w-xl">
              {intro}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {ctaPrimary && (
                <Link href={ctaPrimaryHref} className="btn-primary" style={{ background: '#fff', color: '#14284A' }}>{ctaPrimary}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
              )}
              {ctaSecondary && (
                <Link href={ctaSecondaryHref} className="btn-outline-light">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                  {ctaSecondary}
                </Link>
              )}
            </div>

            {/* ===== Trust badges ===== */}
            {badges.length > 0 && (
              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
                {b0.label && (
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center h-10 w-10 rounded-full bg-white shadow-soft">
                      <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden><path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-2.8-.4-4H24v7.3h12.1c-.2 2-1.6 5-4.5 7l7 5.4c4.1-3.8 6.5-9.4 6.5-15.7z"/><path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.6-5.3l-7-5.4c-1.9 1.3-4.4 2.2-7.6 2.2-5.8 0-10.7-3.9-12.5-9.3l-7.3 5.6C7.8 41 15.3 46 24 46z"/><path fill="#FBBC05" d="M11.5 28.2c-.5-1.3-.7-2.7-.7-4.2s.3-2.9.7-4.2L4.2 14.2C2.8 17.1 2 20.4 2 24s.8 6.9 2.2 9.8l7.3-5.6z"/><path fill="#EA4335" d="M24 10.6c3.3 0 5.5 1.4 6.8 2.6l5-4.9C32.7 5.4 28.9 3.9 24 3.9c-8.7 0-16.2 5-19.8 12.3l7.3 5.6c1.8-5.4 6.7-9.2 12.5-9.2z"/></svg>
                    </span>
                    <div className="leading-tight">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">{b0.label}</p>
                      <p className="flex items-center gap-1.5 text-sm font-bold"><span className="text-yellow-400 tracking-tight">{STARS}</span><span>{b0.value}</span></p>
                    </div>
                  </div>
                )}

                {b0.label && b1.label && <span className="hidden sm:block h-8 w-px bg-white/15"></span>}

                {b1.label && (
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center h-10 w-10 rounded-full bg-accent-500 text-white shadow-soft">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
                    </span>
                    <div className="leading-tight">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">{b1.label}</p>
                      <p className="text-sm font-bold">{b1.value}</p>
                    </div>
                  </div>
                )}

                {b1.label && b2.label && <span className="hidden sm:block h-8 w-px bg-white/15"></span>}

                {b2.label && (
                  <div className="flex items-center gap-3">
                    <span className="relative grid place-items-center h-12 w-12 rounded-full bg-white text-brand-800 ring-[3px] ring-accent-500 shadow-soft">
                      <span className="flex flex-col items-center leading-none">
                        <span className="text-[6px] text-yellow-500 tracking-tighter">{STARS}</span>
                        <span className="mt-0.5 text-[9px] font-extrabold tracking-wide">TOP</span>
                        <span className="text-[9px] font-extrabold tracking-wide">RATED</span>
                      </span>
                    </span>
                    <div className="leading-tight">
                      <p className="text-sm font-bold">{b2.label}</p>
                      <p className="text-[11px] font-semibold text-white/70">{b2Text} {b2Year && <span className="ml-1 rounded-full bg-accent-500 px-1.5 py-px text-[10px] font-bold text-white">{b2Year}</span>}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ===== Right: image ===== */}
          <div className="lg:col-span-5 reveal">
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="absolute -inset-4 rounded-[2rem] bg-accent-500/20 blur-2xl"></div>
              <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
                {isRemoteImage ? (
                  <img src={image} alt={imageAlt} className="h-auto w-full object-cover" />
                ) : (
                  <Image
                    src={image}
                    alt={imageAlt}
                    width={1400}
                    height={1400}
                    priority
                    sizes="(max-width: 1024px) 90vw, 40vw"
                    className="h-auto w-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
