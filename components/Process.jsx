const STEPS = [
  {
    num: '01',
    title: 'Send Your Plans',
    desc: 'Upload drawings, specs and scope. We respond in under 2 hours with timeline & price.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
    ),
  },
  {
    num: '02',
    title: 'Detailed Review',
    desc: 'Senior estimator reviews plans, requests RFIs and confirms the scope of work.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
    ),
  },
  {
    num: '03',
    title: 'Takeoff & Pricing',
    desc: 'We perform the takeoff and price every line with current regional cost data.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
    ),
  },
  {
    num: '04',
    title: 'Bid-Ready Delivery',
    desc: 'Receive a polished, CSI-coded estimate in Excel + PDF — ready to submit.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/></svg>
    ),
  },
];

export default function Process() {
  return (
    <section className="py-20 sm:py-24">
      <div className="max-shell container-px">
        <div className="max-w-3xl mx-auto text-center reveal">
          <span className="eyebrow">How We Work</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">A simple, transparent 4-step process</h2>
          <p className="mt-4 text-base sm:text-lg text-ink-600 leading-relaxed">From plans in to bid out — we make estimating effortless.</p>
        </div>
        <div className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connector line through the node centers (desktop) */}
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-brand-200 via-brand-300 to-accent-400"></div>

          {STEPS.map((s) => (
            <div key={s.num} className="group relative flex flex-col items-center text-center reveal">
              {/* Numbered node */}
              <div className="relative z-10 grid place-items-center h-16 w-16 rounded-2xl bg-brand-700 text-white shadow-soft ring-4 ring-white transition duration-300 group-hover:bg-brand-600">
                {s.icon}
                <span className="absolute -top-2 -right-2 grid place-items-center h-7 w-7 rounded-full bg-accent-500 text-[11px] font-extrabold text-white ring-2 ring-white">{s.num}</span>
              </div>

              {/* Card */}
              <div className="mt-5 w-full rounded-2xl border-2 border-brand-100 bg-white p-6 transition duration-300 group-hover:-translate-y-1 group-hover:border-brand-500 group-hover:shadow-soft">
                <h3 className="text-lg font-bold text-ink-900">{s.title}</h3>
                <span className="mx-auto mt-2 block h-1 w-10 rounded-full bg-accent-500"></span>
                <p className="mt-3 text-sm text-ink-600 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
