import PageHeader from '@/components/PageHeader';
import Portfolio from '@/components/Portfolio';
import CtaBanner from '@/components/CtaBanner';
import { getSeoPage } from '@/lib/site';

export const revalidate = 60;

export async function generateMetadata() {
  const seo = await getSeoPage('/portfolio');
  return {
    title: seo?.title || 'Portfolio — Modern Estimator',
    description:
      seo?.description ||
      'A selection of construction estimates delivered across residential, commercial and industrial projects nationwide.',
    alternates: { canonical: '/portfolio' },
  };
}

export default function PortfolioPage() {
  return (
    <>
      <PageHeader
        eyebrow="Recent Work"
        title="Projects we've helped contractors win"
        subtitle="A selection of estimates delivered across residential, commercial and industrial scopes across the United States."
        crumbs={[{ label: 'Portfolio' }]}
      />
      <Portfolio showHeader={false} />
      <CtaBanner />
    </>
  );
}
