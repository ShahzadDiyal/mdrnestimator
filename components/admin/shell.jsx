'use client';
// Admin shell: sidebar navigation, topbar, and the auth gate.
// Rendered by app/(admin)/layout.jsx around every /admin/* route.

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, isAdmin } from './auth';
import { useStore } from './store';
import { ToastHost } from './ui';
import {
  IconDashboard,
  IconInbox,
  IconLogout, IconSearch, IconBell, IconMenu,
  IconX, IconExternal, IconChevronDown, IconUsers, IconFileText, IconLayers,
  IconHelp, IconStar, IconPen, IconShield, IconClock, IconSend, IconBriefcase,
  IconChart, IconImage, IconPhone, IconGlobe, IconBot, IconMail, IconSettings,
} from './icons';

const NAV = [
  {
    section: 'Main',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: IconDashboard },
      { href: '/admin/leads', label: 'Leads & Quotes', icon: IconInbox, badge: (s) => s?.leads?.filter((l) => l.status === 'New').length || null },
    ],
  },
  {
    section: 'Catalog Content',
    items: [
      { href: '/admin/content/services', label: 'Core Services', icon: IconFileText },
      { href: '/admin/content/trades', label: 'Trade Estimating Pages', icon: IconLayers },
      { href: '/admin/content/blog', label: 'Blog & Articles', icon: IconPen },
      { href: '/admin/content/faqs', label: 'FAQs', icon: IconHelp },
      { href: '/admin/content/testimonials', label: 'Client Testimonials', icon: IconStar },
    ],
  },
  {
    section: 'Website Content',
    items: [
      { href: '/admin/content/hero', label: 'Hero Section', icon: IconStar },
      { href: '/admin/content/navbar', label: 'Navbar', icon: IconMenu },
      { href: '/admin/content/footer', label: 'Footer', icon: IconLayers },
      { href: '/admin/content/why-choose-us', label: 'Why Choose Us', icon: IconShield },
      { href: '/admin/content/process-steps', label: 'Process Steps', icon: IconClock },
      { href: '/admin/content/cta-banner', label: 'CTA Banner', icon: IconSend },
      { href: '/admin/content/section-headings', label: 'Section Headings', icon: IconPen },
      { href: '/admin/content/quote-options', label: 'Quote Form Options', icon: IconFileText },
      { href: '/admin/content/about', label: 'About Page', icon: IconBriefcase },
      { href: '/admin/content/stats', label: 'Stats & Counters', icon: IconChart },
      { href: '/admin/content/portfolio', label: 'Portfolio', icon: IconImage },
      { href: '/admin/content/contact', label: 'Contact Details', icon: IconPhone },
      { href: '/admin/content/seo', label: 'SEO Meta', icon: IconGlobe },
      { href: '/admin/content/site-seo', label: 'Site SEO', icon: IconGlobe },
      { href: '/admin/chatbot', label: 'Chatbot', icon: IconBot },
      { href: '/admin/email', label: 'Email & Notifications', icon: IconMail },
      { href: '/admin/settings', label: 'Site Settings', icon: IconSettings },
    ],
  },
  {
    section: 'System',
    items: [
      { href: '/admin/users', label: 'Users & Roles', icon: IconUsers },
    ],
  },
];

function Sidebar({ open, onClose, user }) {
  const pathname = usePathname();
  const { state } = useStore();
  const { logout } = useAuth();
  const router = useRouter();
  const [openSection, setOpenSection] = useState('Main');

  const sections = useMemo(
    () => NAV.filter((s) => !s.adminOnly || isAdmin(user)),
    [user]
  );

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-ink-900/50 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-gradient-to-b from-brand-800 via-brand-900 to-ink-900 text-white transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 pb-5 pt-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <Image src="/logo.png" alt="Modern Estimator" width={1422} height={388} priority className="h-8 w-auto brightness-0 invert" />
            <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider border-l border-white/20 pl-2.5">Admin</span>
          </Link>
          <button onClick={onClose} className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 lg:hidden" aria-label="Close menu">
            <IconX size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {sections.map((sec) => {
            const collapsed = openSection !== sec.section && sec.section !== 'Main';
            return (
              <div key={sec.section} className="mb-2">
                <button
                  onClick={() => setOpenSection(collapsed ? sec.section : 'Main')}
                  className="flex w-full items-center justify-between px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white/80"
                >
                  {sec.section}
                  <IconChevronDown size={14} className={`transition-transform ${collapsed ? '-rotate-90' : ''}`} />
                </button>
                {!collapsed && (
                  <ul className="space-y-0.5">
                    {sec.items.map((item) => {
                      const active = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                      const badge = item.badge && state ? item.badge(state) : null;
                      const Icon = item.icon;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                              active ? 'bg-white/15 text-white shadow-inner' : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <Icon size={18} className={active ? 'text-accent-300' : 'text-white/50'} />
                            <span className="flex-1">{item.label}</span>
                            {badge ? (
                              <span className="rounded-full bg-accent-500 px-2 py-0.5 text-[11px] font-bold text-white">{badge}</span>
                            ) : null}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link
            href="/"
            target="_blank"
            className="mb-3 flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white"
          >
            <IconExternal size={16} /> View website
          </Link>
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-white">
              {user?.name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user?.name || user?.email?.split('@')[0]}</p>
              <p className="text-xs text-white/50">{user?.role || 'Admin'}</p>
            </div>
            <button
              onClick={async () => {
                await logout();
                router.replace('/admin/login');
              }}
              className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white"
              title="Log out"
              aria-label="Log out"
            >
              <IconLogout size={17} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function Topbar({ onMenu, user }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const { state } = useStore();
  const newLeads = state?.leads?.filter((l) => l.status === 'New') || [];

  return (
    <header className="sticky top-0 z-20 border-b border-ink-900/5 bg-white/85 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <button onClick={onMenu} className="rounded-lg p-2 text-ink-600 hover:bg-slate-100 lg:hidden" aria-label="Open menu">
          <IconMenu size={20} />
        </button>
        <div className="relative hidden max-w-md flex-1 sm:block">
          <IconSearch size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 z-10" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search console… (Enter)"
            className="input !pl-11"
            style={{ paddingLeft: '2.75rem' }}
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            className="relative rounded-xl p-2.5 text-ink-500 hover:bg-slate-100"
            title={`${newLeads.length} new notifications`}
            aria-label="Notifications"
          >
            <IconBell size={19} />
            {newLeads.length > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white">
                {newLeads.length}
              </span>
            )}
          </button>
          <div className="relative">
            <button onClick={() => setMenuOpen((v) => !v)} className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {user?.name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="hidden text-left md:block">
                <p className="text-sm font-semibold leading-tight text-ink-900">{user?.name || user?.email?.split('@')[0]}</p>
                <p className="text-xs text-ink-400">{user?.role || 'Admin'}</p>
              </div>
              <IconChevronDown size={14} className="text-ink-400" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-ink-900/10">
                  <div className="border-b border-ink-900/5 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-ink-900">{user?.name || 'Administrator'}</p>
                    <p className="truncate text-xs text-ink-400">{user?.email}</p>
                  </div>
                  <button
                    onClick={async () => {
                      setMenuOpen(false);
                      await logout();
                      router.replace('/admin/login');
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50"
                  >
                    <IconLogout size={16} /> Log out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function ShellGate({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    if (!loading && !user && !isLogin) router.replace('/admin/login');
    if (!loading && user && isLogin) router.replace('/admin/dashboard');
  }, [loading, user, isLogin, router]);

  if (isLogin) return <>{children}</>;

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F6FB]">
        <div className="flex flex-col items-center gap-4">
          <Image src="/logo.png" alt="Modern Estimator" width={1422} height={388} priority className="h-10 w-auto" />
          <div className="h-1 w-40 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-brand-500" />
          </div>
          <p className="text-xs text-ink-400">Verifying session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} user={user} />
      <div className="lg:pl-72">
        <Topbar onMenu={() => setMenuOpen(true)} user={user} />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
      <ToastHost />
    </div>
  );
}

export default function AdminShell({ children }) {
  return <ShellGate>{children}</ShellGate>;
}
