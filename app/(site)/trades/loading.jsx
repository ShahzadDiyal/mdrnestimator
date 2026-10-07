export default function TradesLoading() {
  return (
    <>
      <div className="max-shell container-px pt-14 pb-8">
        <div className="max-w-3xl">
          <div className="animate-pulse rounded-full bg-ink-900/[0.07] h-5 w-28" />
          <div className="animate-pulse rounded-xl bg-ink-900/[0.07] mt-4 h-11 w-4/5" />
          <div className="animate-pulse rounded-xl bg-ink-900/[0.07] mt-3 h-5 w-3/5" />
        </div>
      </div>
      <section className="py-14 sm:py-16">
        <div className="max-shell container-px grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-3">
            <div className="animate-pulse rounded-xl bg-ink-900/[0.07] h-5 w-full" />
            <div className="animate-pulse rounded-xl bg-ink-900/[0.07] h-5 w-full" />
            <div className="animate-pulse rounded-xl bg-ink-900/[0.07] h-5 w-2/3" />
          </div>
          <div className="lg:col-span-5 grid gap-3 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-ink-900/[0.07] h-24" />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-brand-50/40 py-16 sm:py-20">
        <div className="max-shell container-px">
          <div className="animate-pulse rounded-xl bg-ink-900/[0.07] h-10 w-72" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="rounded-2xl border-2 border-ink-900/5 bg-white p-6">
                <div className="animate-pulse rounded-xl bg-ink-900/[0.07] h-6 w-2/3" />
                <div className="animate-pulse rounded-xl bg-ink-900/[0.07] mt-3 h-4 w-full" />
                <div className="animate-pulse rounded-xl bg-ink-900/[0.07] mt-2 h-4 w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
