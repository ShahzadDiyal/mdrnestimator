import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import CustomPageBlocks from '@/components/CustomPageBlocks';
import { getCustomPageBySlug, socialMeta, pageRobots } from '@/lib/site';

// Dynamic custom pages (Website Content → Custom Pages).
// Static routes (/about, /services, …) always win over this dynamic route,
// so this only renders admin-created slugs like /team or /pricing.
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const page = await getCustomPageBySlug(params.slug);
  if (!page) return {};
  const title = page.metaTitle || `${page.title} — Modern Estimator`;
  const description = page.metaDescription || '';
  return {
    title,
    description,
    alternates: { canonical: `/${page.slug}` },
    robots: page.noindex ? { index: false, follow: false } : await pageRobots(`/${page.slug}`),
    ...socialMeta({ title, description, path: `/${page.slug}` }),
  };
}

export default async function CustomPage({ params }) {
  const page = await getCustomPageBySlug(params.slug);
  if (!page) notFound();

  const url = `https://modernestimator.com/${page.slug}`;
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.title,
      description: page.metaDescription || '',
      url,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://modernestimator.com' },
        { '@type': 'ListItem', position: 2, name: page.title, item: url },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader
        title={page.title}
        subtitle={page.metaDescription || ''}
        crumbs={[{ label: 'Home', href: '/' }, { label: page.title }]}
      />
      <section className="py-14 sm:py-20">
        <div className="max-shell container-px">
          <div className="mx-auto max-w-3xl">
            <CustomPageBlocks blocks={page.blocks} />
          </div>
        </div>
      </section>
    </>
  );
}
