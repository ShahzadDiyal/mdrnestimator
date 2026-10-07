import PageHeader from '@/components/PageHeader';
import QuoteForm from '@/components/QuoteForm';
import { getContactInfo, getSeoPage } from '@/lib/site';

// Fresh data at most a minute old — admin edits go live quickly,
// pages stay fast and fully server-rendered for SEO.
export const revalidate = 60;

export async function generateMetadata() {
  const seo = await getSeoPage('/contact');
  return {
    title: seo?.title || 'Contact Us & Get a Free Quote — Modern Estimator',
    description:
      seo?.description ||
      'Send us your plans for a free, no-obligation construction estimate. We respond within 2 business hours — complete estimate in 8–24 hours.',
    alternates: { canonical: '/contact' },
  };
}

const FALLBACK = {
  phone: '+1 (555) 123-4567',
  email: 'hello@modernestimator.com',
  address: '1100 Estimator Ave, Suite 210, Austin, TX 78701',
  hours: 'Mon–Fri, 8am–6pm CT · Rush support available',
};

const ICONS = {
  phone: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  ),
  email: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  ),
  address: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  hours: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
};

export default async function ContactPage() {
  const info = (await getContactInfo()) || {};
  const tel = (info.phone || FALLBACK.phone).replace(/[^+\d]/g, '');

  const CONTACT = [
    { title: 'Call us', value: info.phone || FALLBACK.phone, href: `tel:${tel}`, icon: ICONS.phone },
    { title: 'Email us', value: info.email || FALLBACK.email, href: `mailto:${info.email || FALLBACK.email}`, icon: ICONS.email },
    { title: 'Visit us', value: info.address || FALLBACK.address, icon: ICONS.address },
    { title: 'Business hours', value: info.hours || FALLBACK.hours, icon: ICONS.hours },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Contact Us"
        title="Get your free estimate"
        subtitle="Tell us about your project or just send your plans. We respond within 2 business hours with a clear timeline and price."
        crumbs={[{ label: 'Contact' }]}
      />

      {/* Contact info */}
      <section className="py-14 sm:py-16">
        <div className="max-shell container-px grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT.map((c) => (
            <div key={c.title} className="reveal rounded-2xl border-2 border-brand-100 bg-white p-6">
              <span className="grid place-items-center h-12 w-12 rounded-xl bg-brand-700 text-white">{c.icon}</span>
              <h3 className="mt-4 text-sm font-bold uppercase tracking-wider text-ink-500">{c.title}</h3>
              {c.href ? (
                <a href={c.href} className="mt-1 block text-sm font-semibold text-ink-800 hover:text-brand-600 transition">{c.value}</a>
              ) : (
                <p className="mt-1 text-sm font-semibold text-ink-800">{c.value}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Estimate form */}
      <QuoteForm />
    </>
  );
}
