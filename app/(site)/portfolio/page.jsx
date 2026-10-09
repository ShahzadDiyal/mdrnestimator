import PageHeader from '@/components/PageHeader';
import { notFound } from 'next/navigation';
import Portfolio from '@/components/Portfolio';
import CtaBanner from '@/components/CtaBanner';
import { getSeoPage, socialMeta, pageRobots, getVisibility } from '@/lib/site';

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
    robots: await pageRobots('/portfolio'),
    alternates: { canonical: '/portfolio' },
    ...socialMeta({ title, description, path: '/portfolio' }),
  };
}

export default async function PortfolioPage() {
  // Visibility toggle — hidden pages 404 (Website Content → Visibility).
  const __vis = await getVisibility();
  if (__vis?.pages?.['portfolio'] === false) notFound();
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
