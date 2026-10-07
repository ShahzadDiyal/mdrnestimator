import Link from 'next/link';

// Reusable navy hero band for sub-pages, with breadcrumb + title + subtitle.
export default function PageHeader({ eyebrow, title, subtitle, crumbs = [] }) {
  return (
    <section className="relative overflow-hidden bg-hero-gradient text-white">
      <div aria-hidden className="absolute inset-0 grid-bg"></div>
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-500/15 blur-3xl"></div>
      <div className="relative max-shell container-px py-16 sm:py-20 lg:py-24">
        <nav className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-white/70">
          <Link href="/" className="hover:text-white">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1.5">
              <span className="text-white/40">/</span>
              {c.href ? <Link href={c.href} className="hover:text-white">{c.label}</Link> : <span className="text-white">{c.label}</span>}
            </span>
          ))}
        </nav>
        {eyebrow && (
          <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 ring-1 ring-white/20">{eyebrow}</span>
        )}
        <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight max-w-3xl">{title}</h1>
        {subtitle && <p className="mt-4 text-base sm:text-lg text-white/75 leading-relaxed max-w-2xl">{subtitle}</p>}
      </div>
    </section>
  );
}
