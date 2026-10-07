import PageHeader from '@/components/PageHeader';
import Portfolio from '@/components/Portfolio';
import CtaBanner from '@/components/CtaBanner';

export const metadata = {
  title: 'Portfolio — Modern Estimator',
  description:
    'A selection of construction estimates delivered across residential, commercial and industrial projects nationwide.',
  alternates: { canonical: '/portfolio' },
};

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
