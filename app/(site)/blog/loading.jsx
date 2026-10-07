export default function BlogLoading() {
  return (
    <>
      <div className="max-shell container-px pt-14 pb-8">
        <div className="max-w-3xl">
          <div className="animate-pulse rounded-full bg-ink-900/[0.07] h-5 w-20" />
          <div className="animate-pulse rounded-xl bg-ink-900/[0.07] mt-4 h-11 w-3/5" />
          <div className="animate-pulse rounded-xl bg-ink-900/[0.07] mt-3 h-5 w-4/5" />
        </div>
      </div>
      <section className="py-16 sm:py-20">
        <div className="max-shell container-px">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="overflow-hidden rounded-2xl border-2 border-ink-900/5 bg-white">
                <div className="animate-pulse bg-ink-900/[0.07] aspect-[16/9]" />
                <div className="p-6">
                  <div className="animate-pulse rounded-full bg-ink-900/[0.07] h-5 w-24" />
                  <div className="animate-pulse rounded-xl bg-ink-900/[0.07] mt-3 h-6 w-full" />
                  <div className="animate-pulse rounded-xl bg-ink-900/[0.07] mt-2 h-4 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
