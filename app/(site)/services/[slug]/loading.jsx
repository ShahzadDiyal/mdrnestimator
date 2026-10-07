export default function ServiceDetailLoading() {
  return (
    <>
      <div className="max-shell container-px pt-14 pb-8">
        <div className="max-w-3xl">
          <div className="animate-pulse rounded-full bg-ink-900/[0.07] h-5 w-24" />
          <div className="animate-pulse rounded-xl bg-ink-900/[0.07] mt-4 h-11 w-3/5" />
          <div className="animate-pulse rounded-xl bg-ink-900/[0.07] mt-3 h-5 w-4/5" />
        </div>
      </div>
      <section className="py-16 sm:py-20">
        <div className="max-shell container-px grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <div className="animate-pulse rounded-2xl bg-ink-900/[0.07] h-14 w-14" />
            <div className="animate-pulse rounded-xl bg-ink-900/[0.07] mt-6 h-5 w-full" />
            <div className="animate-pulse rounded-xl bg-ink-900/[0.07] mt-3 h-5 w-full" />
            <div className="animate-pulse rounded-xl bg-ink-900/[0.07] mt-3 h-5 w-2/3" />
            <div className="animate-pulse rounded-xl bg-ink-900/[0.07] mt-10 h-8 w-56" />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-xl bg-ink-900/[0.07] h-16" />
              ))}
            </div>
          </div>
          <aside className="lg:col-span-4 space-y-6">
            <div className="animate-pulse rounded-2xl bg-ink-900/[0.07] h-56" />
            <div className="animate-pulse rounded-2xl bg-ink-900/[0.07] h-64" />
          </aside>
        </div>
      </section>
    </>
  );
}
