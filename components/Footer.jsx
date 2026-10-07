'use client';

import Link from 'next/link';
import { SERVICES } from '@/data/services';
import { useSiteContent } from '@/lib/useSiteContent';

const SOCIAL_DEFS = [
  { key: 'facebook', label: 'Facebook', path: 'M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z' },
  { key: 'linkedin', label: 'LinkedIn', path: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' },
  { key: 'twitter', label: 'Twitter', path: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' },
  { key: 'instagram', label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
];

// Fallback columns — today's hardcoded footer, used until live data arrives.
const FALLBACK_COMPANY = [
  { id: 'fb-c-home', label: 'Home', href: '/' },
  { id: 'fb-c-services', label: 'Services', href: '/services' },
  { id: 'fb-c-trades', label: 'Our Trades', href: '/trades' },
  { id: 'fb-c-portfolio', label: 'Portfolio', href: '/portfolio' },
  { id: 'fb-c-about', label: 'About Us', href: '/about' },
  { id: 'fb-c-contact', label: 'Contact', href: '/contact' },
];

export default function Footer() {
  const content = useSiteContent();
  const year = new Date().getFullYear();

  // Admin can hide the whole footer from Website Content → Visibility.
  if (content && content.loaded && content.visibility?.footer === false) return null;

  const ft = content?.footer || {};
  const ss = content?.siteSettings || {};
  const ci = content?.contactInfo || {};
  const groups = content?.footerGroups || {};

  const brandName = ft.copyrightName || ss.siteName || 'Modern Estimator';
  const brandFirst = brandName.split(' ')[0] || 'Modern';
  const brandRest = brandName.split(' ').slice(1).join(' ') || 'Estimator';
  const about = ft.aboutBlurb || 'Trusted construction estimation partner for US contractors and builders. Fast, accurate quantity takeoffs, material estimates and winning bid packages.';
  const address = ft.address || ci.address || '1100 Estimator Ave, Suite 210, Austin, TX 78701, USA';
  const phone = ft.phone || ci.phone || ss.phone || '+1 (555) 123-4567';
  const phoneHref = '+' + String(phone).replace(/\D/g, '');
  const email = ft.email || ci.email || ss.email || 'hello@modernestimator.com';

  const companyLinks = groups.company && groups.company.length ? groups.company : FALLBACK_COMPANY;
  const serviceLinks = groups.services && groups.services.length
    ? groups.services
    : SERVICES.map((s) => ({ id: `fb-s-${s.slug}`, label: s.title, href: `/services/${s.slug}` }));
  const legalLinks = groups.legal && groups.legal.length
    ? groups.legal
    : [
        { id: 'fb-l-privacy', label: 'Privacy Policy', href: ft.privacyHref || '#' },
        { id: 'fb-l-terms', label: 'Terms of Service', href: ft.termsHref || '#' },
      ];
  const socials = SOCIAL_DEFS.filter((d) => ft[d.key]);

  return (
    <footer id="contact" className="bg-ink-900 text-white/80">
      <div className="max-shell container-px pt-16 pb-10">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex items-center text-2xl font-extrabold tracking-tight text-white">
              {brandFirst} <span className="text-accent-500">&nbsp;{brandRest}</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed">{about}</p>
            {socials.length > 0 && (
              <div className="mt-5 flex items-center gap-3">
                {socials.map((s) => (
                  <a key={s.key} href={ft[s.key]} target="_blank" rel="noopener noreferrer" className="grid place-items-center h-9 w-9 rounded-full bg-white/10 hover:bg-brand-500 transition" aria-label={s.label}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="md:col-span-2">
            <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              {companyLinks.map((l) => (
                <li key={l.id}><Link href={l.href || '#'} target={l.target || undefined} className="hover:text-white">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3">
            <h4 className="text-white font-semibold mb-4 text-sm">Services</h4>
            <ul className="space-y-2 text-sm">
              {serviceLinks.map((l) => (
                <li key={l.id}><Link href={l.href || '#'} target={l.target || undefined} className="hover:text-white">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3">
            <h4 className="text-white font-semibold mb-4 text-sm">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-400 mt-0.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg><span>{address}</span></li>
              <li className="flex items-center gap-3"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg><a href={`tel:${phoneHref}`} className="hover:text-white">{phone}</a></li>
              <li className="flex items-center gap-3"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-400"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg><a href={`mailto:${email}`} className="hover:text-white">{email}</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <p>© {year} {brandName}. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {legalLinks.map((l) => (
              <Link key={l.id} href={l.href || '#'} target={l.target || undefined} className="hover:text-white">{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
