export default function BlogPostLoading() {
  return (
    <>
      <div className="max-shell container-px pt-14 pb-8">
        <div className="max-w-3xl">
          <div className="animate-pulse rounded-full bg-ink-900/[0.07] h-5 w-24" />
          <div className="animate-pulse rounded-xl bg-ink-900/[0.07] mt-4 h-11 w-4/5" />
          <div className="animate-pulse rounded-xl bg-ink-900/[0.07] mt-3 h-5 w-3/5" />
        </div>
      </div>
      <div className="max-shell container-px py-14">
        <div className="mx-auto max-w-3xl">
          <div className="animate-pulse rounded-2xl bg-ink-900/[0.07] aspect-[16/8]" />
          <div className="mt-8 space-y-3">
            <div className="animate-pulse rounded-xl bg-ink-900/[0.07] h-5 w-full" />
            <div className="animate-pulse rounded-xl bg-ink-900/[0.07] h-5 w-full" />
            <div className="animate-pulse rounded-xl bg-ink-900/[0.07] h-5 w-2/3" />
            <div className="animate-pulse rounded-xl bg-ink-900/[0.07] h-8 w-1/2 mt-6" />
            <div className="animate-pulse rounded-xl bg-ink-900/[0.07] h-5 w-full" />
            <div className="animate-pulse rounded-xl bg-ink-900/[0.07] h-5 w-5/6" />
          </div>
        </div>
      </div>
    </>
  );
}
