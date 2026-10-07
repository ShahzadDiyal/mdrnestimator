// Shimmer skeleton placeholders for the admin panel.
// Pages render their shell instantly and show these while /api data loads.

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`} />;
}

// Mimics the standard admin form layout (cards with labeled fields).
export function FormSkeleton({ rows = 5 }) {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 !rounded-xl" />
          <Skeleton className="h-5 w-40" />
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full !rounded-xl" />
          </div>
        ))}
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-10 w-28 !rounded-xl" />
          <Skeleton className="h-10 w-28 !rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// Mimics admin tables / list rows.
export function TableSkeleton({ rows = 6 }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 !rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-8 w-20 !rounded-lg" />
        </div>
      ))}
    </div>
  );
}

// Mimics card grids (portfolio, testimonials, etc.).
export function GridSkeleton({ cards = 6 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
          <Skeleton className="h-32 w-full !rounded-xl" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ))}
    </div>
  );
}

// Full admin shell shown while the session is being verified —
// sidebar + topbar + content placeholders so the panel feels instant.
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-slate-200 p-4 space-y-2">
          <Skeleton className="h-10 w-40 mb-4" />
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full !rounded-lg" />
          ))}
        </div>
      </div>
      <div className="lg:pl-72">
        <div className="bg-white border-b border-slate-200 px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-9 w-9 !rounded-full" />
          </div>
        </div>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-10 w-full !rounded-xl" />
            <Skeleton className="h-10 w-full !rounded-xl" />
            <Skeleton className="h-24 w-full !rounded-xl" />
          </div>
        </main>
      </div>
    </div>
  );
}
