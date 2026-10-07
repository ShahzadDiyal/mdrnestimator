export default function TradeDetailLoading() {
  return (
    <>
      <div className="max-shell container-px pt-14 pb-8">
        <div className="max-w-3xl">
          <div className="animate-pulse rounded-full bg-ink-900/[0.07] h-5 w-32" />
          <div className="animate-pulse rounded-xl bg-ink-900/[0.07] mt-4 h-11 w-3/5" />
          <div className="animate-pulse rounded-xl bg-ink-900/[0.07] mt-3 h-5 w-4/5" />
        </div>
      </div>
      <section className="py-16 sm:py-20">
        <div className="max-shell container-px grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-3">
            <div className="animate-pulse rounded-xl bg-ink-900/[0.07] h-5 w-full" />
            <div className="animate-pulse rounded-xl bg-ink-900/[0.07] h-5 w-full" />
            <div className="animate-pulse rounded-xl bg-ink-900/[0.07] h-5 w-2/3" />
          </div>
          <aside className="lg:col-span-4">
            <div className="animate-pulse rounded-2xl bg-ink-900/[0.07] h-72" />
          </aside>
        </div>
      </section>
      <section className="bg-brand-50/40 py-16 sm:py-20">
        <div className="max-shell container-px">
          <div className="animate-pulse rounded-xl bg-ink-900/[0.07] h-10 w-72" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-ink-900/[0.07] h-48" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
