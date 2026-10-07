import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import CtaBanner from '@/components/CtaBanner';
import { getPosts, getPostBySlug } from '@/lib/site';

const BASE_URL = 'https://modernestimator.com';

// Fresh data at most a minute old — admin edits go live quickly,
// pages stay fast and fully server-rendered for SEO.
export const revalidate = 60;
// New post slugs added in admin resolve on demand even if not pre-rendered.
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const posts = await getPosts();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  const title = post.metaTitle || `${post.title} | Modern Estimator`;
  const description = post.metaDescription || post.excerpt || '';
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/blog/${post.slug}`,
      type: 'article',
      ...(post.featuredImage ? { images: [post.featuredImage] } : {}),
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

/* ---------- tiny markdown renderer (headings, bold, lists, paragraphs) ---------- */
function inline(text) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') && part.length > 4 ? (
      <strong key={i} className="font-bold text-ink-900">{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function renderBody(md) {
  if (!md || !String(md).trim()) return null;
  return String(md)
    .split(/\r?\n\s*\r?\n/)
    .map((block, bi) => {
      const trimmed = block.trim();
      if (!trimmed) return null;
      const h = trimmed.match(/^(#{2,4})\s+(.*)$/s);
      if (h) {
        const level = h[1].length;
        const text = inline(h[2].trim());
        if (level === 2)
          return <h2 key={bi} className="pt-6 text-2xl font-bold tracking-tight text-ink-900">{text}</h2>;
        return <h3 key={bi} className="pt-4 text-xl font-bold text-ink-900">{text}</h3>;
      }
      const lines = trimmed.split(/\r?\n/);
      if (lines.length > 1 && lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
        return (
          <ol key={bi} className="list-decimal space-y-2.5 pl-6 text-ink-700 leading-relaxed">
            {lines.map((l, li) => (
              <li key={li}>{inline(l.replace(/^\s*\d+[.)]\s+/, ''))}</li>
            ))}
          </ol>
        );
      }
      if (lines.length > 1 && lines.every((l) => /^\s*[-*]\s+/.test(l))) {
        return (
          <ul className="list-disc space-y-2.5 pl-6 text-ink-700 leading-relaxed" key={bi}>
            {lines.map((l, li) => (
              <li key={li}>{inline(l.replace(/^\s*[-*]\s+/, ''))}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={bi} className="text-base sm:text-lg text-ink-700 leading-relaxed">{inline(trimmed)}</p>
      );
    });
}

function formatDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function BlogPostPage({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const all = await getPosts();
  const related = all
    .filter((p) => p.slug !== post.slug && (post.category ? p.category === post.category : true))
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription || post.excerpt || '',
    image: post.featuredImage || undefined,
    author: { '@type': 'Person', name: post.author || 'Modern Estimator' },
    datePublished: post.date || post.createdAt,
    dateModified: post.updatedAt || post.date || post.createdAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/blog/${post.slug}` },
    publisher: { '@type': 'Organization', name: 'Modern Estimator', url: BASE_URL },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHeader
        eyebrow={post.category || 'Blog'}
        title={post.title}
        subtitle={post.excerpt}
        crumbs={[{ label: 'Blog', href: '/blog' }, { label: post.title }]}
      />

      <article className="py-14 sm:py-16">
        <div className="max-shell container-px">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-500 reveal">
              {post.author && <span className="font-semibold text-ink-800">{post.author}</span>}
              {post.date && <span>{formatDate(post.date)}</span>}
              {post.readTime && <span>{post.readTime}</span>}
            </div>

            {post.featuredImage && (
              <div className="mt-6 overflow-hidden rounded-2xl border-2 border-brand-100 reveal">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.featuredImage} alt={post.title} className="aspect-[16/8] w-full object-cover" />
              </div>
            )}

            <div className="mt-8 space-y-5 reveal">{renderBody(post.content)}</div>

            {post.tags && (
              <div className="mt-10 flex flex-wrap gap-2 reveal">
                {String(post.tags)
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((t) => (
                    <span key={t} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                      {t}
                    </span>
                  ))}
              </div>
            )}
          </div>

          {related.length > 0 && (
            <div className="mx-auto mt-16 max-w-5xl">
              <div className="max-w-3xl reveal">
                <span className="eyebrow">Keep Reading</span>
                <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">Related articles</h2>
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border-2 border-brand-100 bg-white transition duration-300 hover:-translate-y-1 hover:border-brand-500 hover:shadow-soft reveal"
                  >
                    {r.featuredImage && (
                      <span className="relative block aspect-[16/9] overflow-hidden bg-brand-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={r.featuredImage}
                          alt={r.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </span>
                    )}
                    <span className="flex flex-1 flex-col p-5">
                      <span className="text-lg font-bold leading-snug text-ink-900 group-hover:text-brand-700 transition">
                        {r.title}
                      </span>
                      {r.excerpt && (
                        <span className="mt-2 text-sm text-ink-600 line-clamp-2">{r.excerpt}</span>
                      )}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <CtaBanner />
    </>
  );
}
