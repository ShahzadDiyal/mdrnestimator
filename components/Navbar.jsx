'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { SERVICES } from '@/data/services';
import { TRADES } from '@/data/trades';
import { useSiteContent } from '@/lib/useSiteContent';

const FALLBACK_PHONE = '+1 (555) 123-4567';
const FALLBACK_EMAIL = 'hello@modernestimator.com';

const Chevron = ({ open, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={'transition ' + (open ? 'rotate-180' : '')}><path d="m6 9 6 6 6-6"/></svg>
);
const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

// Today's hardcoded menu — used as the instant first paint and as the
// fallback if the live API is unreachable.
function fallbackItems() {
  return [
    { id: 'fb-home', label: 'Home', href: '/' },
    {
      id: 'fb-services', label: 'Services', href: '/services',
      children: [
        ...SERVICES.map((s) => ({ id: `fb-svc-${s.slug}`, label: s.title, href: `/services/${s.slug}`, icon: s.icon })),
        { id: 'fb-svc-all', label: 'View all services →', href: '/services', viewAll: true },
      ],
    },
    {
      id: 'fb-trades', label: 'Our Trades', href: '/trades',
      children: [
        ...TRADES.map((t) => ({
          id: `fb-trd-${t.slug}`, label: t.title, href: `/trades/${t.slug}`,
          children: (t.children || []).map((c) => ({ id: `fb-trd-${c.slug}`, label: c.title, href: `/trades/${c.slug}` })),
        })),
        { id: 'fb-trd-all', label: 'View all trades →', href: '/trades', viewAll: true },
      ],
    },
    { id: 'fb-portfolio', label: 'Portfolio', href: '/portfolio' },
    { id: 'fb-about', label: 'About Us', href: '/about' },
    { id: 'fb-contact', label: 'Contact', href: '/contact' },
  ];
}

// Match a live "/services/<slug>" link back to its icon from the catalog.
function serviceIconFor(href) {
  const m = /^\/services\/([^/?#]+)$/.exec(href || '');
  if (!m) return null;
  const s = SERVICES.find((x) => x.slug === m[1]);
  return s ? s.icon : null;
}

// Normalize live Firestore items: attach icons, flag "view all" rows.
function normalize(items, parentHref) {
  return (items || []).map((it) => ({
    ...it,
    icon: it.icon || serviceIconFor(it.href),
    viewAll: !!(parentHref && it.href === parentHref && !(it.children && it.children.length)),
    children: normalize(it.children, it.href),
  }));
}

export default function Navbar() {
  const pathname = usePathname();
  const content = useSiteContent();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null); // open desktop dropdown id
  const [activeChild, setActiveChild] = useState(null); // hovered child id (flyout)
  const [mobileExpanded, setMobileExpanded] = useState({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setMenuOpen(false);
    setOpenMenu(null);
    setActiveChild(null);
    setMobileExpanded({});
  }, [pathname]);

  const items = useMemo(() => {
    if (content && content.loaded && content.navTree && content.navTree.length) {
      return normalize(content.navTree);
    }
    return fallbackItems();
  }, [content]);

  const nb = content?.navbar || {};
  const ss = content?.siteSettings || {};
  const ci = content?.contactInfo || {};
  const vis = content?.visibility || {};

  // Admin can hide the whole navbar from Website Content → Visibility.
  if (content && content.loaded && vis.navbar === false) return null;

  const phoneDisplay = nb.phoneDisplay || ci.phone || ss.phone || FALLBACK_PHONE;
  const phoneHref = nb.phoneHref || ('+' + String(phoneDisplay).replace(/\D/g, ''));
  const email = nb.email || ci.email || ss.email || FALLBACK_EMAIL;
  const promoLeft = nb.promoLeft ?? 'Turnaround Time: 8–24 Hours';
  const promoText = nb.promoText ?? 'Affordable Estimate — 30% Off';
  const ctaLabel = nb.ctaLabel ?? 'Get a Free Quote';
  const ctaHref = nb.ctaHref || '/contact';
  const showPromo = vis.promoBar !== false && (!!promoLeft || !!promoText);
  const logoUrl = ss.logoUrl || '/logo.png';
  const logoAlt = ss.logoAlt || 'Modern Estimator';
  const isRemoteLogo = /^https?:\/\//i.test(logoUrl);

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname && href && pathname.startsWith(href));
  const navLink = (href) =>
    'px-3.5 py-2 text-sm font-medium rounded-full transition ' +
    (isActive(href) ? 'text-brand-700 bg-brand-50' : 'text-ink-700 hover:text-brand-600');
  const mobileLink = (href) =>
    'px-3 py-3 rounded-xl text-sm font-medium ' +
    (isActive(href) ? 'bg-brand-50 text-brand-700' : 'text-ink-800 hover:bg-ink-900/5');

  const toggleMobile = (id) => setMobileExpanded((s) => ({ ...s, [id]: !s[id] }));

  const renderDesktopItem = (item) => {
    const kids = item.children || [];
    if (!kids.length) {
      return (
        <Link key={item.id} href={item.href || '#'} target={item.target || undefined} className={navLink(item.href)}>
          {item.label}
        </Link>
      );
    }
    const hasNested = kids.some((c) => c.children && c.children.length);
    const isOpen = openMenu === item.id;
    const flyout = kids.find((c) => c.id === activeChild && c.children && c.children.length);
    return (
      <div
        key={item.id}
        className="relative"
        onMouseEnter={() => setOpenMenu(item.id)}
        onMouseLeave={() => { setOpenMenu(null); setActiveChild(null); }}
      >
        <Link href={item.href || '#'} target={item.target || undefined} className={'flex items-center gap-1 ' + navLink(item.href)}>
          {item.label} <Chevron open={isOpen} />
        </Link>
        {isOpen && (
          <div className={'absolute top-full pt-2 ' + (hasNested ? 'left-0' : 'left-1/2 -translate-x-1/2')}>
            <div className="relative flex">
              <div className="w-72 overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-card">
                {kids.map((child) => {
                  if (child.viewAll) {
                    return (
                      <Link key={child.id} href={child.href || '#'} target={child.target || undefined} className="block border-t border-ink-900/5 px-4 py-2.5 text-sm font-semibold text-brand-600 hover:bg-brand-50">
                        {child.label}
                      </Link>
                    );
                  }
                  if (child.children && child.children.length) {
                    const active = activeChild === child.id;
                    return (
                      <Link
                        key={child.id}
                        href={child.href || '#'}
                        target={child.target || undefined}
                        onMouseEnter={() => setActiveChild(child.id)}
                        className={
                          'flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium transition ' +
                          (active ? 'bg-brand-700 text-white' : 'text-ink-700 hover:bg-brand-50 hover:text-brand-700')
                        }
                      >
                        {child.label}
                        <span className={active ? 'text-accent-300' : 'text-ink-400'}><ChevronRight /></span>
                      </Link>
                    );
                  }
                  return (
                    <Link key={child.id} href={child.href || '#'} target={child.target || undefined} className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-700 hover:bg-brand-50 hover:text-brand-700 transition">
                      {child.icon ? (
                        <span className="grid place-items-center h-8 w-8 rounded-lg bg-brand-50 text-brand-600 shrink-0">{child.icon}</span>
                      ) : (
                        <span className="ml-3 h-1.5 w-1.5 rotate-45 bg-accent-500 shrink-0"></span>
                      )}
                      <span className="font-medium">{child.label}</span>
                    </Link>
                  );
                })}
              </div>
              {hasNested && flyout && (
                <div className="ml-1 w-72 self-start overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-card">
                  <p className="border-b border-ink-900/5 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-ink-500">{flyout.label}</p>
                  {flyout.children.map((g) => (
                    <Link key={g.id} href={g.href || '#'} target={g.target || undefined} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-700 transition">
                      <span className="h-1.5 w-1.5 rotate-45 bg-accent-500 shrink-0"></span>{g.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMobileItem = (item) => {
    const kids = (item.children || []).filter((c) => !c.viewAll);
    const viewAll = (item.children || []).find((c) => c.viewAll);
    if (!kids.length) {
      return (
        <Link key={item.id} href={item.href || '#'} target={item.target || undefined} className={mobileLink(item.href)}>
          {item.label}
        </Link>
      );
    }
    const expanded = !!mobileExpanded[item.id];
    return (
      <div key={item.id}>
        <button onClick={() => toggleMobile(item.id)} className={'flex w-full items-center justify-between text-left ' + mobileLink(item.href)}>
          {item.label} <Chevron open={expanded} size={16} />
        </button>
        {expanded && (
          <div className="ml-3 flex flex-col border-l border-ink-900/10 pl-3">
            {kids.map((child) => {
              const grandkids = child.children || [];
              if (!grandkids.length) {
                return (
                  <Link key={child.id} href={child.href || '#'} target={child.target || undefined} className="px-3 py-2 rounded-lg text-sm text-ink-600 hover:bg-brand-50 hover:text-brand-700">
                    {child.label}
                  </Link>
                );
              }
              const gexp = !!mobileExpanded[child.id];
              return (
                <div key={child.id}>
                  <div className="flex items-center">
                    <Link href={child.href || '#'} target={child.target || undefined} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-700">
                      {child.label}
                    </Link>
                    <button aria-label={`Expand ${child.label}`} onClick={() => toggleMobile(child.id)} className="grid place-items-center h-8 w-8 rounded-lg text-ink-500 hover:bg-brand-50">
                      <Chevron open={gexp} size={14} />
                    </button>
                  </div>
                  {gexp && (
                    <div className="ml-3 mb-1 flex flex-col border-l border-ink-900/10 pl-3">
                      {grandkids.map((g) => (
                        <Link key={g.id} href={g.href || '#'} target={g.target || undefined} className="px-3 py-1.5 rounded-lg text-sm text-ink-600 hover:bg-brand-50 hover:text-brand-700">
                          {g.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {viewAll && (
              <Link href={viewAll.href || '#'} target={viewAll.target || undefined} className="px-3 py-2 rounded-lg text-sm font-semibold text-brand-600 hover:bg-brand-50">
                {viewAll.label}
              </Link>
            )}
          </div>
        )}
      </div>
    );
  };

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
          <a href={`tel:${phoneHref}`} className="flex items-center gap-1.5 hover:text-white transition">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-500"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span className="font-medium">{phoneDisplay}</span>
          </a>
          <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-white transition">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-500"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <span className="font-medium">{email}</span>
          </a>
        </div>
      </div>

      {/* ===== Logo bar ===== */}
      <div className={'max-shell container-px flex items-center justify-between transition-all duration-300 ' + (scrolled ? 'h-16' : 'h-20')}>
        <Link href="/" className="flex items-center shrink-0" aria-label={`${logoAlt} — home`}>
          {isRemoteLogo ? (
            <img src={logoUrl} alt={logoAlt} className={'w-auto transition-all duration-300 ' + (scrolled ? 'h-8' : 'h-11')} />
          ) : (
            <Image src={logoUrl} alt={logoAlt} width={1422} height={388} priority className={'w-auto transition-all duration-300 ' + (scrolled ? 'h-8' : 'h-11')} />
          )}
        </Link>

        <div className="flex items-center gap-3">
          {/* ---- Desktop nav ---- */}
          <nav className="hidden md:flex items-center gap-1">
            {items.map(renderDesktopItem)}
          </nav>

          {ctaLabel && (
            <Link href={ctaHref} className="hidden md:inline-flex btn-primary">{ctaLabel}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          )}

          <button aria-label="Toggle menu" onClick={() => setMenuOpen((o) => !o)} className="md:hidden grid place-items-center h-10 w-10 rounded-xl border border-ink-900/10">
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* ===== Promo bar ===== */}
      {showPromo && (
        <div className={'overflow-hidden border-t border-ink-900/5 bg-brand-50 transition-all duration-300 ' + (scrolled ? 'max-h-0 opacity-0' : 'max-h-20 opacity-100')}>
          <div className="max-shell container-px flex flex-wrap items-center justify-center gap-x-4 gap-y-1 py-2 text-center">
            {promoLeft && (
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-ink-800">{promoLeft}</span>
            )}
            {promoLeft && promoText && <span className="hidden sm:inline h-3 w-px bg-ink-900/15"></span>}
            {promoText && (
              <Link href={ctaHref} className="inline-flex items-center gap-1.5 rounded-full bg-accent-500 px-3.5 py-1 text-xs font-semibold text-white shadow-soft transition hover:bg-accent-600">
                {promoText}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* ===== Mobile menu ===== */}
      <div className={'mobile-menu md:hidden bg-white border-t border-ink-900/5' + (menuOpen ? ' open' : '')}>
        <div className="max-shell container-px py-4 flex flex-col gap-1">
          {items.map(renderMobileItem)}
          {ctaLabel && <Link href={ctaHref} className="btn-primary mt-2 w-full">{ctaLabel}</Link>}
        </div>
      </div>
    </header>
  );
}
