import PageHeader from '@/components/PageHeader';
import ServiceCard from '@/components/ServiceCard';
import CtaBanner from '@/components/CtaBanner';
import { SERVICES } from '@/data/services';

export const metadata = {
  title: 'Construction Estimating Services — Modern Estimator',
  description:
    'Quantity takeoff, material estimation, residential and commercial estimating, bid preparation and trade-specific estimates for US contractors. 8–24 hour turnaround.',
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
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
            {SERVICES.map((s, i) => (
              <ServiceCard key={s.slug} service={s} index={i} />
            ))}
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
