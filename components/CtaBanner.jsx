'use client';

import Link from 'next/link';
import ChatButton from '@/components/ChatButton';
import { useSiteContent } from '@/lib/useSiteContent';
import { CtaSkeleton } from '@/components/Skeletons';

export default function CtaBanner() {
  const content = useSiteContent();

  // While the live data loads, show a skeleton — never a half-painted section.
  if (!content) return <CtaSkeleton />;

  // Admin can hide this section from Website Content → Visibility.
  if (content.loaded && content.sections?.ctaBanner === false) return null;

  const b = content?.ctaBanner || {};
  const badge = b.badge ?? 'Free Quote — No Obligation';
  const heading = b.heading ?? 'Ready to win your next bid?';
  const paragraph = b.paragraph ?? 'Send us your plans today. Get a free, no-obligation quote in under 2 hours and a complete estimate in 8–24 hours.';
  const ctaPrimary = b.ctaPrimary ?? 'Get a Free Quote';
  const ctaPrimaryHref = b.ctaPrimaryHref || '/contact';
  const ctaSecondary = b.ctaSecondary ?? 'Chat with us';
  const ctaSecondaryHref = b.ctaSecondaryHref || '#chat';
  const secondaryIsLink = ctaSecondaryHref && ctaSecondaryHref !== '#chat';

  const chatIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
  );

  return (
    <section className="py-20 sm:py-24">
      <div className="max-shell container-px">
        <div className="reveal relative overflow-hidden rounded-3xl bg-hero-gradient text-white p-10 sm:p-14 lg:p-20">
          <div aria-hidden className="absolute inset-0 grid-bg"></div>
          <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
          <div className="relative grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              {badge && <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 ring-1 ring-white/20">{badge}</span>}
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">{heading}</h2>
              {paragraph && <p className="mt-3 text-white/85 text-base sm:text-lg max-w-xl">{paragraph}</p>}
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3">
              {ctaPrimary && (
                <Link href={ctaPrimaryHref} className="btn-primary w-full" style={{ background: '#fff', color: '#14284A' }}>{ctaPrimary}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
              )}
              {ctaSecondary && (
                secondaryIsLink ? (
                  <Link href={ctaSecondaryHref} className="btn-outline-light w-full">
                    {chatIcon}
                    {ctaSecondary}
                  </Link>
                ) : (
                  <ChatButton className="btn-outline-light w-full">
                    {chatIcon}
                    {ctaSecondary}
                  </ChatButton>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
