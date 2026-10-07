import Link from 'next/link';

export default function ServiceCard({ service, index }) {
  const num = String((index ?? 0) + 1).padStart(2, '0');
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-brand-100 bg-white transition duration-300 hover:-translate-y-1 hover:border-brand-500 hover:shadow-soft reveal"
    >
      {/* Navy header band */}
      <div className="relative flex items-center justify-between bg-brand-700 px-6 py-5 text-white">
        <span aria-hidden className="absolute inset-0 grid-bg opacity-[0.07]"></span>
        <span className="relative grid place-items-center h-12 w-12 rounded-xl bg-white/10 ring-1 ring-white/15 transition duration-300 group-hover:bg-accent-500 group-hover:ring-accent-500">{service.icon}</span>
        <span className="relative text-4xl font-extrabold leading-none text-white/10 transition duration-300 group-hover:text-accent-500/70">{num}</span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold text-ink-900">{service.title}</h3>
        <span className="mt-2 h-1 w-10 rounded-full bg-accent-500"></span>
        <p className="mt-3 text-sm text-ink-600">{service.short}</p>
        <ul className="mt-4 space-y-2 text-xs font-medium text-ink-700">
          {service.points.map((p) => (
            <li key={p} className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 rotate-45 bg-accent-500"></span>{p}</li>
          ))}
        </ul>
        <span className="mt-auto pt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition group-hover:gap-2.5">View details
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
        </span>
      </div>
    </Link>
  );
}
