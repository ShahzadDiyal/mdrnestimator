import Image from 'next/image';

const TESTIMONIALS = [
  {
    quote: 'Modern Estimator turned my bid prep from a 3-day grind into a 24-hour deliverable. Our win-rate jumped 18% in the first quarter.',
    img: '/review-1.png',
    name: 'Michael Reynolds',
    role: 'Owner, Reynolds Construction • Austin, TX',
  },
  {
    quote: "Accurate, fast and bid-ready. Their CSI breakdowns make sub-leveling effortless. They've become an extension of our pre-con team.",
    img: '/review-2.png',
    name: 'Steve Parker',
    role: 'Pre-Construction Manager • Denver, CO',
  },
  {
    quote: "We used to outsource estimates to three firms. Now it's just Modern Estimator. Numbers I can defend, deadlines they always hit.",
    img: '/review-3.png',
    name: 'David Chen',
    role: 'GC, Chen Builders • Seattle, WA',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 sm:py-24">
      <div className="max-shell container-px">
        <div className="max-w-3xl mx-auto text-center reveal">
          <span className="eyebrow">Client Stories</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">What contractors say about us</h2>
          <p className="mt-4 text-base sm:text-lg text-ink-600 leading-relaxed">Trusted by general contractors and builders across the United States.</p>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card p-7 relative overflow-hidden reveal">
              <span className="absolute -right-2 -top-2 text-brand-50 text-[120px] leading-none font-serif">&rdquo;</span>
              <div className="relative">
                <div className="text-yellow-400 text-lg">★★★★★</div>
                <p className="mt-4 text-ink-800 leading-relaxed">&quot;{t.quote}&quot;</p>
                <div className="mt-6 pt-6 border-t border-ink-900/5 flex items-center gap-3">
                  <Image
                    src={t.img}
                    alt={t.name}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full object-cover object-top ring-2 ring-brand-100"
                  />
                  <div><p className="text-sm font-bold">{t.name}</p><p className="text-xs text-ink-600">{t.role}</p></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
