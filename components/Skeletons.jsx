// Skeleton loaders shown while homepage API data is loading.
// Same section shells/spacing as the real content — no layout shift.

export function Sk({ className = '' }) {
  return <div aria-hidden className={`animate-pulse rounded-xl bg-ink-900/[0.07] ${className}`} />;
}

export function HeroSkeleton() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient text-white">
      <div className="relative max-shell container-px pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7">
            <Sk className="h-6 w-56 rounded-full !bg-white/10" />
            <Sk className="mt-5 h-12 w-full !bg-white/10" />
            <Sk className="mt-3 h-12 w-4/5 !bg-white/10" />
            <Sk className="mt-5 h-5 w-full !bg-white/10" />
            <Sk className="mt-2 h-5 w-3/5 !bg-white/10" />
            <div className="mt-8 flex gap-3">
              <Sk className="h-12 w-44 !bg-white/10" />
              <Sk className="h-12 w-44 !bg-white/10" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <Sk className="h-80 w-full !bg-white/10 rounded-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function StatsSkeleton() {
  return (
    <section className="relative -mt-16 z-10">
      <div className="max-shell container-px">
        <div className="card p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Sk className="h-12 w-12 shrink-0" />
              <div className="flex-1">
                <Sk className="h-7 w-20" />
                <Sk className="mt-2 h-4 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeadSkeleton() {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <Sk className="mx-auto h-5 w-28 rounded-full" />
      <Sk className="mx-auto mt-4 h-10 w-3/4" />
      <Sk className="mx-auto mt-4 h-5 w-2/3" />
    </div>
  );
}

export function ServicesSkeleton() {
  return (
    <section className="py-20 sm:py-24">
      <div className="max-shell container-px">
        <SectionHeadSkeleton />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-2xl border-2 border-ink-900/5 p-6">
              <Sk className="h-12 w-12" />
              <Sk className="mt-5 h-6 w-2/3" />
              <Sk className="mt-3 h-4 w-full" />
              <Sk className="mt-2 h-4 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TradesSkeleton() {
  return (
    <section className="bg-brand-50/40 py-20 sm:py-24">
      <div className="max-shell container-px">
        <SectionHeadSkeleton />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <Sk key={i} className="h-32 !rounded-2xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhySkeleton() {
  return (
    <section className="py-20 sm:py-24 bg-ink-900">
      <div className="max-shell container-px">
        <div className="max-w-3xl mx-auto text-center">
          <Sk className="mx-auto h-5 w-28 rounded-full !bg-white/10" />
          <Sk className="mx-auto mt-4 h-10 w-3/4 !bg-white/10" />
          <Sk className="mx-auto mt-4 h-5 w-2/3 !bg-white/10" />
        </div>
        <div className="mt-14 grid gap-px rounded-2xl overflow-hidden bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-ink-900 p-7">
              <Sk className="h-12 w-12 !bg-white/10" />
              <Sk className="mt-5 h-6 w-1/2 !bg-white/10" />
              <Sk className="mt-3 h-4 w-full !bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProcessSkeleton() {
  return (
    <section className="py-20 sm:py-24">
      <div className="max-shell container-px">
        <SectionHeadSkeleton />
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <Sk className="h-16 w-16 !rounded-2xl" />
              <Sk className="mt-5 h-24 w-full !rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PortfolioSkeleton() {
  return (
    <section className="py-20 sm:py-24 bg-brand-50/30">
      <div className="max-shell container-px">
        <SectionHeadSkeleton />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <Sk className="h-52 !rounded-2xl" />
              <Sk className="mt-4 h-6 w-2/3" />
              <Sk className="mt-2 h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSkeleton() {
  return (
    <section className="py-20 sm:py-24">
      <div className="max-shell container-px">
        <SectionHeadSkeleton />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-ink-900/5 p-7">
              <Sk className="h-5 w-28" />
              <Sk className="mt-4 h-4 w-full" />
              <Sk className="mt-2 h-4 w-full" />
              <Sk className="mt-2 h-4 w-2/3" />
              <div className="mt-6 flex items-center gap-3">
                <Sk className="h-11 w-11 !rounded-full" />
                <div className="flex-1">
                  <Sk className="h-4 w-24" />
                  <Sk className="mt-2 h-3 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSkeleton() {
  return (
    <section className="py-20 sm:py-24 bg-brand-50/30">
      <div className="max-shell container-px">
        <SectionHeadSkeleton />
        <div className="mt-12 mx-auto max-w-3xl space-y-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Sk key={i} className="h-16 !rounded-xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaSkeleton() {
  return (
    <section className="py-20 sm:py-24">
      <div className="max-shell container-px">
        <Sk className="h-64 !rounded-3xl" />
      </div>
    </section>
  );
}
