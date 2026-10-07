export default function ContactLoading() {
  return (
    <>
      <div className="max-shell container-px pt-14 pb-8">
        <div className="max-w-3xl">
          <div className="animate-pulse rounded-full bg-ink-900/[0.07] h-5 w-28" />
          <div className="animate-pulse rounded-xl bg-ink-900/[0.07] mt-4 h-11 w-2/3" />
          <div className="animate-pulse rounded-xl bg-ink-900/[0.07] mt-3 h-5 w-4/5" />
        </div>
      </div>
      <section className="py-14 sm:py-16">
        <div className="max-shell container-px grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border-2 border-ink-900/5 bg-white p-6">
              <div className="animate-pulse rounded-xl bg-ink-900/[0.07] h-12 w-12" />
              <div className="animate-pulse rounded-xl bg-ink-900/[0.07] mt-4 h-4 w-20" />
              <div className="animate-pulse rounded-xl bg-ink-900/[0.07] mt-2 h-4 w-full" />
            </div>
          ))}
        </div>
      </section>
      <div className="max-shell container-px pb-20">
        <div className="animate-pulse rounded-2xl bg-ink-900/[0.07] h-96" />
      </div>
    </>
  );
}
