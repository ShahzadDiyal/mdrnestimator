export default function Stats() {
  return (
    <section className="relative -mt-16 z-10">
      <div className="max-shell container-px">
        <div className="card p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 reveal">
            <span className="grid place-items-center h-12 w-12 rounded-xl bg-brand-50 text-brand-600"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/></svg></span>
            <div><p className="text-2xl sm:text-3xl font-extrabold tracking-tight"><span className="counter" data-target="2400">0</span>+</p><p className="text-xs sm:text-sm text-ink-600 font-medium">Estimates Delivered</p></div>
          </div>
          <div className="flex items-center gap-4 reveal">
            <span className="grid place-items-center h-12 w-12 rounded-xl bg-brand-50 text-brand-600"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg></span>
            <div><p className="text-2xl sm:text-3xl font-extrabold tracking-tight"><span className="counter" data-target="580">0</span>+</p><p className="text-xs sm:text-sm text-ink-600 font-medium">Projects Completed</p></div>
          </div>
          <div className="flex items-center gap-4 reveal">
            <span className="grid place-items-center h-12 w-12 rounded-xl bg-brand-50 text-brand-600"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
            <div><p className="text-2xl sm:text-3xl font-extrabold tracking-tight"><span className="counter" data-target="320">0</span>+</p><p className="text-xs sm:text-sm text-ink-600 font-medium">Happy Contractors</p></div>
          </div>
          <div className="flex items-center gap-4 reveal">
            <span className="grid place-items-center h-12 w-12 rounded-xl bg-brand-50 text-brand-600"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg></span>
            <div><p className="text-2xl sm:text-3xl font-extrabold tracking-tight"><span className="counter" data-target="12">0</span>+</p><p className="text-xs sm:text-sm text-ink-600 font-medium">Years of Experience</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}
