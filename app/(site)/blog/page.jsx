import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import CtaBanner from '@/components/CtaBanner';
import { getPosts, getSeoPage, pageRobots } from '@/lib/site';

// Fresh data at most a minute old — admin edits go live quickly,
// pages stay fast and fully server-rendered for SEO.
export const revalidate = 60;

export async function generateMetadata() {
  const seo = await getSeoPage('/blog');
  return {
    robots: await pageRobots('/blog'),
    title: seo?.title || 'Blog — Estimating Guides & Tips | Modern Estimator',
    description:
      seo?.description ||
      'Practical construction estimating guides, bid-day tips and trade insights from the Modern Estimator team.',
    alternates: { canonical: '/blog' },
  };
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Estimating guides, bid tips & industry insights"
        subtitle="Practical walkthroughs from our senior estimators — CSI takeoffs, bid-day strategy and pricing know-how."
        crumbs={[{ label: 'Blog' }]}
      />

      <section className="py-16 sm:py-20">
        <div className="max-shell container-px">
          {posts.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-2xl border-2 border-brand-100 bg-white p-10 text-center">
              <p className="text-lg font-bold text-ink-900">No posts yet</p>
              <p className="mt-2 text-sm text-ink-600">New estimating guides are on the way — check back soon.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, i) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border-2 border-brand-100 bg-white transition duration-300 hover:-translate-y-1 hover:border-brand-500 hover:shadow-soft reveal"
                >
                  {p.featuredImage && (
                    <span className="relative block aspect-[16/9] overflow-hidden bg-brand-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.featuredImage}
                        alt={p.title}
                        loading={i > 2 ? 'lazy' : 'eager'}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </span>
                  )}
                  <span className="flex flex-1 flex-col p-6">
                    <span className="flex items-center gap-2 text-xs font-semibold">
                      {p.category && (
                        <span className="rounded-full bg-brand-50 px-3 py-1 text-brand-700">{p.category}</span>
                      )}
                      {p.readTime && <span className="text-ink-500">{p.readTime}</span>}
                    </span>
                    <span className="mt-3 text-lg font-bold leading-snug text-ink-900 group-hover:text-brand-700 transition">
                      {p.title}
                    </span>
                    {p.excerpt && (
                      <span className="mt-2 text-sm text-ink-600 leading-relaxed line-clamp-3">{p.excerpt}</span>
                    )}
                    <span className="mt-4 flex items-center gap-2 text-xs text-ink-500 mt-auto pt-4">
                      {p.author && <span className="font-semibold text-ink-700">{p.author}</span>}
                      {p.date && <span>· {p.date}</span>}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
