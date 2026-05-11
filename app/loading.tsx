export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50/70 to-white px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <div className="h-28 animate-pulse rounded-3xl bg-white/70 dark:bg-slate-800/70" />
        <div className="h-14 animate-pulse rounded-2xl bg-white/70 dark:bg-slate-800/70" />
        <div className="h-24 animate-pulse rounded-2xl bg-white/70 dark:bg-slate-800/70" />
        <div className="h-24 animate-pulse rounded-2xl bg-white/70 dark:bg-slate-800/70" />
      </div>
    </div>
  );
}

