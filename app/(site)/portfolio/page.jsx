import PageHeader from '@/components/PageHeader';
import Portfolio from '@/components/Portfolio';
import CtaBanner from '@/components/CtaBanner';
import { getSeoPage, socialMeta } from '@/lib/site';

export const revalidate = 60;

export async function generateMetadata() {
  const seo = await getSeoPage('/portfolio');
  const title = seo?.title || 'Portfolio — Modern Estimator';
  const description =
    seo?.description ||
    'A selection of construction estimates delivered across residential, commercial and industrial projects nationwide.';
  return {
    title,
    description,
    alternates: { canonical: '/portfolio' },
    ...socialMeta({ title, description, path: '/portfolio' }),
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
