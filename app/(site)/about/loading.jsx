export default function AboutLoading() {
  return (
    <>
      <div className="max-shell container-px pt-14 pb-8">
        <div className="max-w-3xl">
          <div className="animate-pulse rounded-full bg-ink-900/[0.07] h-5 w-24" />
          <div className="animate-pulse rounded-xl bg-ink-900/[0.07] mt-4 h-11 w-3/5" />
          <div className="animate-pulse rounded-xl bg-ink-900/[0.07] mt-3 h-5 w-4/5" />
        </div>
      </div>
      <section className="py-20 sm:py-24">
        <div className="max-shell container-px grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-3">
            <div className="animate-pulse rounded-xl bg-ink-900/[0.07] h-8 w-2/3" />
            <div className="animate-pulse rounded-xl bg-ink-900/[0.07] h-5 w-full" />
            <div className="animate-pulse rounded-xl bg-ink-900/[0.07] h-5 w-full" />
            <div className="animate-pulse rounded-xl bg-ink-900/[0.07] h-5 w-3/5" />
          </div>
          <div className="lg:col-span-5">
            <div className="animate-pulse rounded-2xl bg-ink-900/[0.07] h-80" />
          </div>
        </div>
      </section>
    </>
  );
}
