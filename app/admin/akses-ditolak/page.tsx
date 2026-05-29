import Link from "next/link";
import { getSession } from "@/lib/auth/helpers";
import { FORBIDDEN_MESSAGE } from "@/lib/auth/errors";
import { canAccessAdmin, ROLE_LABELS } from "@/lib/auth/permissions";

type AccessDeniedPageProps = {
  searchParams: Promise<{ reason?: string }>;
};

export default async function AccessDeniedPage({ searchParams }: AccessDeniedPageProps) {
  const { reason } = await searchParams;
  const session = await getSession();
  const isLoggedIn = Boolean(session.user && session.profile);
  const canAdmin = session.profile ? canAccessAdmin(session.profile) : false;
  const roleLabel = session.profile ? ROLE_LABELS[session.profile.role] : null;

  const detailMessage =
    reason === "profile_missing"
      ? "Profil akun belum ada di database. Jalankan migration SQL di Supabase, lalu hubungi Super Admin."
      : isLoggedIn && roleLabel
        ? `Akun Anda login sebagai "${roleLabel}". Role ini hanya boleh melihat songbook publik, bukan panel admin.`
        : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50/60 via-teal-50/40 to-slate-100 px-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white/90 p-8 text-center shadow-[0_20px_50px_-30px_rgba(13,148,136,0.5)] backdrop-blur-xl dark:border-teal-900/40 dark:bg-slate-900/80">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950/50">
          <svg
            className="h-7 w-7 text-rose-600 dark:text-rose-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Akses Ditolak
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {FORBIDDEN_MESSAGE}
        </p>
        {detailMessage ? (
          <p className="mt-2 text-sm leading-relaxed text-amber-700 dark:text-amber-300">
            {detailMessage}
          </p>
        ) : null}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_-14px_rgba(13,148,136,0.9)] transition-all hover:from-teal-400 hover:to-emerald-400"
          >
            Ke Songbook
          </Link>
          {isLoggedIn && !canAdmin ? (
            <form method="post" action="/admin/logout">
              <button
                type="submit"
                className="w-full rounded-xl border border-teal-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-teal-50 dark:border-teal-800/50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-teal-900/30 sm:w-auto"
              >
                Keluar
              </button>
            </form>
          ) : canAdmin ? (
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-xl border border-teal-200 bg-white px-5 py-2.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50 dark:border-teal-800/50 dark:bg-slate-800 dark:text-teal-300"
            >
              Ke Dashboard
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
