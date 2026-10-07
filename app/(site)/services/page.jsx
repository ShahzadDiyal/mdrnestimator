import PageHeader from '@/components/PageHeader';
import ServiceCard from '@/components/ServiceCard';
import CtaBanner from '@/components/CtaBanner';
import { SERVICES } from '@/data/services';
import { getServices, getSeoPage, toArray } from '@/lib/site';

// Fresh data at most a minute old — admin edits go live quickly,
// pages stay fast and fully server-rendered for SEO.
export const revalidate = 60;

export async function generateMetadata() {
  const seo = await getSeoPage('/services');
  return {
    title: seo?.title || 'Construction Estimating Services — Modern Estimator',
    description:
      seo?.description ||
      'Quantity takeoff, material estimation, residential and commercial estimating, bid preparation and trade-specific estimates for US contractors. 8–24 hour turnaround.',
    alternates: { canonical: '/services' },
  };
}

const iconFor = (slug) => SERVICES.find((x) => x.slug === slug)?.icon || null;

export default async function ServicesPage() {
  const live = await getServices();
  const cards = live.length
    ? live.map((s) => ({
        slug: s.slug,
        title: s.title,
        short: s.short || s.tagline || '',
        points: toArray(s.points).slice(0, 4),
        icon: iconFor(s.slug),
      }))
    : SERVICES;

  return (
    <>
      <PageHeader
        eyebrow="Our Services"
        title="Construction estimating services built to win you work"
        subtitle="From quantity takeoffs to full bid packages — pick a service to see what's included and how we deliver it."
        crumbs={[{ label: 'Services' }]}
      />
      <section className="py-20 sm:py-24">
        <div className="max-shell container-px">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((s, i) => (
              <ServiceCard key={s.slug} service={s} index={i} />
            ))}
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
