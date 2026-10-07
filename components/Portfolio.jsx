import Image from 'next/image';

const PROJECTS = [
  {
    img: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=1200&q=80',
    alt: 'Maple Heights',
    category: 'Residential — Multi-family',
    price: '$3.4M',
    title: 'Maple Heights Residences',
    location: 'Austin, TX',
    tags: ['Concrete', 'Framing', 'MEP'],
  },
  {
    img: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80',
    alt: 'Northgate Medical Plaza — healthcare facility exterior',
    category: 'Commercial — Healthcare',
    price: '$12.8M',
    title: 'Northgate Medical Plaza',
    location: 'Denver, CO',
    tags: ['Structural', 'MEP', 'Finishes'],
  },
  {
    img: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1200&q=80',
    alt: 'Riverside',
    category: 'Industrial — Warehouse',
    price: '$22.5M',
    title: 'Riverside Logistics Hub',
    location: 'Dallas, TX',
    tags: ['Tilt-up Concrete', 'Roofing', 'Site Work'],
  },
  {
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    alt: 'Lakeside',
    category: 'Residential — Custom',
    price: '$1.9M',
    title: 'Lakeside Custom Home',
    location: 'Seattle, WA',
    tags: ['Framing', 'Finishes', 'Cabinetry'],
  },
  {
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    alt: 'Crestview',
    category: 'Commercial — Office',
    price: '$48.2M',
    title: 'Crestview Office Tower',
    location: 'Chicago, IL',
    tags: ['Structural Steel', 'Curtain Wall', 'MEP'],
  },
  {
    img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
    alt: 'Sunrise',
    category: 'Residential — Townhome',
    price: '$8.7M',
    title: 'Sunrise Townhomes',
    location: 'Phoenix, AZ',
    tags: ['Framing', 'Roofing', 'Site Work'],
  },
];

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  );
}

export default function Portfolio({ showHeader = true }) {
  return (
    <section id="portfolio" className="py-20 sm:py-24 bg-brand-50/30">
      <div className="max-shell container-px">
        {showHeader && (
          <div className="max-w-3xl mx-auto text-center reveal">
            <span className="eyebrow">Recent Work</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">Projects we&apos;ve helped contractors win</h2>
            <p className="mt-4 text-base sm:text-lg text-ink-600 leading-relaxed">A selection of estimates delivered across residential, commercial and industrial scopes.</p>
          </div>
        )}
        <div className={(showHeader ? 'mt-14 ' : '') + 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'}>
          {PROJECTS.map((p) => (
            <article key={p.title} className="card overflow-hidden group reveal">
              <div className="relative h-52 overflow-hidden">
                <Image src={p.img} alt={p.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 to-transparent"></div>
                <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-700">{p.category}</span>
                <span className="absolute bottom-3 right-3 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold text-white shadow-soft">{p.price}</span>
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold">{p.title}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-ink-600"><PinIcon />{p.location}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700">{t}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
