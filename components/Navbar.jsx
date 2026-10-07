'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SERVICES } from '@/data/services';
import { TRADES } from '@/data/trades';

// Contact details — keep in sync with Footer.jsx / JsonLd.jsx
const PHONE_DISPLAY = '+1 (555) 123-4567';
const PHONE_HREF = '+15551234567';
const EMAIL = 'hello@modernestimator.com';

const Chevron = ({ open, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={'transition ' + (open ? 'rotate-180' : '')}><path d="m6 9 6 6 6-6"/></svg>
);
const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [tradesOpen, setTradesOpen] = useState(false);
  const [activeTrade, setActiveTrade] = useState(null); // hovered parent slug (desktop)
  const [mobileServices, setMobileServices] = useState(false);
  const [mobileTrades, setMobileTrades] = useState(false);
  const [mobileTradeOpen, setMobileTradeOpen] = useState(null); // expanded parent (mobile)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
    setTradesOpen(false);
    setActiveTrade(null);
    setMobileServices(false);
    setMobileTrades(false);
    setMobileTradeOpen(null);
  }, [pathname]);

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const navLink = (href) =>
    'px-3.5 py-2 text-sm font-medium rounded-full transition ' +
    (isActive(href) ? 'text-brand-700 bg-brand-50' : 'text-ink-700 hover:text-brand-600');
  const mobileLink = (href) =>
    'px-3 py-3 rounded-xl text-sm font-medium ' +
    (isActive(href) ? 'bg-brand-50 text-brand-700' : 'text-ink-800 hover:bg-ink-900/5');

  const hoveredTrade = TRADES.find((t) => t.slug === activeTrade);

  return (
    <header
      id="navbar"
      className={
        'sticky top-0 z-50 w-full transition-all' +
        (scrolled ? ' bg-white/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(11,27,51,0.06)]' : ' bg-white')
      }
    >
      {/* ===== Announcement bar ===== */}
      <div className={'overflow-hidden bg-ink-900 text-white/90 transition-all duration-300 ' + (scrolled ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100')}>
        <div className="max-shell container-px flex h-9 items-center justify-center sm:justify-end gap-5 text-[11px] sm:text-xs">
          <a href={`tel:${PHONE_HREF}`} className="flex items-center gap-1.5 hover:text-white transition">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-500"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span className="font-medium">{PHONE_DISPLAY}</span>
          </a>
          <a href={`mailto:${EMAIL}`} className="flex items-center gap-1.5 hover:text-white transition">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-500"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <span className="font-medium">{EMAIL}</span>
          </a>
        </div>
      </div>

      {/* ===== Logo bar ===== */}
      <div className={'max-shell container-px flex items-center justify-between transition-all duration-300 ' + (scrolled ? 'h-16' : 'h-20')}>
        <Link href="/" className="flex items-center shrink-0" aria-label="Modern Estimator — home">
          <Image src="/logo.png" alt="Modern Estimator" width={1422} height={388} priority className={'w-auto transition-all duration-300 ' + (scrolled ? 'h-8' : 'h-11')} />
        </Link>

        <div className="flex items-center gap-3">
          {/* ---- Desktop nav ---- */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className={navLink('/')}>Home</Link>

            {/* Services dropdown */}
            <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
              <Link href="/services" className={'flex items-center gap-1 ' + navLink('/services')}>Services <Chevron open={servicesOpen} /></Link>
              {servicesOpen && (
                <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2">
                  <div className="w-72 overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-card">
                    {SERVICES.map((s) => (
                      <Link key={s.slug} href={`/services/${s.slug}`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-700 hover:bg-brand-50 hover:text-brand-700 transition">
                        <span className="grid place-items-center h-8 w-8 rounded-lg bg-brand-50 text-brand-600 shrink-0">{s.icon}</span>
                        <span className="font-medium">{s.title}</span>
                      </Link>
                    ))}
                    <Link href="/services" className="block border-t border-ink-900/5 px-4 py-2.5 text-sm font-semibold text-brand-600 hover:bg-brand-50">View all services →</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Our Trades — two-level flyout */}
            <div
              className="relative"
              onMouseEnter={() => setTradesOpen(true)}
              onMouseLeave={() => { setTradesOpen(false); setActiveTrade(null); }}
            >
              <Link href="/trades" className={'flex items-center gap-1 ' + navLink('/trades')}>Our Trades <Chevron open={tradesOpen} /></Link>
              {tradesOpen && (
                <div className="absolute left-0 top-full pt-2">
                  <div className="relative flex">
                    {/* Level 1: parent trades */}
                    <div className="w-72 overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-card">
                      {TRADES.map((t) => (
                        <Link
                          key={t.slug}
                          href={`/trades/${t.slug}`}
                          onMouseEnter={() => setActiveTrade(t.slug)}
                          className={
                            'flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium transition ' +
                            (activeTrade === t.slug ? 'bg-brand-700 text-white' : 'text-ink-700 hover:bg-brand-50 hover:text-brand-700')
                          }
                        >
                          {t.title}
                          {t.children.length > 0 && <span className={activeTrade === t.slug ? 'text-accent-300' : 'text-ink-400'}><ChevronRight /></span>}
                        </Link>
                      ))}
                      <Link href="/trades" className="block border-t border-ink-900/5 px-4 py-2.5 text-sm font-semibold text-brand-600 hover:bg-brand-50">View all trades →</Link>
                    </div>

                    {/* Level 2: sub-trades flyout */}
                    {hoveredTrade && hoveredTrade.children.length > 0 && (
                      <div className="ml-1 w-72 self-start overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-card">
                        <p className="border-b border-ink-900/5 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-ink-500">{hoveredTrade.title}</p>
                        {hoveredTrade.children.map((c) => (
                          <Link key={c.slug} href={`/trades/${c.slug}`} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-700 transition">
                            <span className="h-1.5 w-1.5 rotate-45 bg-accent-500 shrink-0"></span>{c.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link href="/portfolio" className={navLink('/portfolio')}>Portfolio</Link>
            <Link href="/about" className={navLink('/about')}>About Us</Link>
            <Link href="/contact" className={navLink('/contact')}>Contact</Link>
          </nav>

          <Link href="/contact" className="hidden md:inline-flex btn-primary">Get a Free Quote
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>

          <button aria-label="Toggle menu" onClick={() => setMenuOpen((o) => !o)} className="md:hidden grid place-items-center h-10 w-10 rounded-xl border border-ink-900/10">
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* ===== Service bar ===== */}
      <div className={'overflow-hidden border-t border-ink-900/5 bg-brand-50 transition-all duration-300 ' + (scrolled ? 'max-h-0 opacity-0' : 'max-h-20 opacity-100')}>
        <div className="max-shell container-px flex flex-wrap items-center justify-center gap-x-4 gap-y-1 py-2 text-center">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-ink-800">Turnaround Time: 8–24 Hours</span>
          <span className="hidden sm:inline h-3 w-px bg-ink-900/15"></span>
          <Link href="/contact" className="inline-flex items-center gap-1.5 rounded-full bg-accent-500 px-3.5 py-1 text-xs font-semibold text-white shadow-soft transition hover:bg-accent-600">
            Affordable Estimate — 30% Off
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>
      </div>

      {/* ===== Mobile menu ===== */}
      <div className={'mobile-menu md:hidden bg-white border-t border-ink-900/5' + (menuOpen ? ' open' : '')}>
        <div className="max-shell container-px py-4 flex flex-col gap-1">
          <Link href="/" className={mobileLink('/')}>Home</Link>

          {/* Services accordion */}
          <button onClick={() => setMobileServices((o) => !o)} className={'flex items-center justify-between text-left ' + mobileLink('/services')}>
            Services <Chevron open={mobileServices} size={16} />
          </button>
          {mobileServices && (
            <div className="ml-3 flex flex-col border-l border-ink-900/10 pl-3">
              {SERVICES.map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`} className="px-3 py-2 rounded-lg text-sm text-ink-600 hover:bg-brand-50 hover:text-brand-700">{s.title}</Link>
              ))}
              <Link href="/services" className="px-3 py-2 rounded-lg text-sm font-semibold text-brand-600 hover:bg-brand-50">View all services →</Link>
            </div>
          )}

          {/* Our Trades accordion (nested) */}
          <button onClick={() => setMobileTrades((o) => !o)} className={'flex items-center justify-between text-left ' + mobileLink('/trades')}>
            Our Trades <Chevron open={mobileTrades} size={16} />
          </button>
          {mobileTrades && (
            <div className="ml-3 flex flex-col border-l border-ink-900/10 pl-3">
              {TRADES.map((t) => (
                <div key={t.slug}>
                  <div className="flex items-center">
                    <Link href={`/trades/${t.slug}`} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-700">{t.title}</Link>
                    {t.children.length > 0 && (
                      <button aria-label={`Expand ${t.title}`} onClick={() => setMobileTradeOpen((o) => (o === t.slug ? null : t.slug))} className="grid place-items-center h-8 w-8 rounded-lg text-ink-500 hover:bg-brand-50">
                        <Chevron open={mobileTradeOpen === t.slug} size={14} />
                      </button>
                    )}
                  </div>
                  {mobileTradeOpen === t.slug && (
                    <div className="ml-3 mb-1 flex flex-col border-l border-ink-900/10 pl-3">
                      {t.children.map((c) => (
                        <Link key={c.slug} href={`/trades/${c.slug}`} className="px-3 py-1.5 rounded-lg text-sm text-ink-600 hover:bg-brand-50 hover:text-brand-700">{c.title}</Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link href="/trades" className="px-3 py-2 rounded-lg text-sm font-semibold text-brand-600 hover:bg-brand-50">View all trades →</Link>
            </div>
          )}

          <Link href="/portfolio" className={mobileLink('/portfolio')}>Portfolio</Link>
          <Link href="/about" className={mobileLink('/about')}>About Us</Link>
          <Link href="/contact" className={mobileLink('/contact')}>Contact</Link>
          <Link href="/contact" className="btn-primary mt-2 w-full">Get a Free Quote</Link>
        </div>
      </div>
    </header>
  );
}
