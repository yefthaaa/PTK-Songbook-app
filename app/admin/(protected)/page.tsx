import { requireAdminAccess } from "@/lib/auth/helpers";
import { toAdminUser } from "@/types/auth";
import { ROLE_LABELS, canManageUsers } from "@/lib/auth/permissions";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const { profile } = await requireAdminAccess();
  const adminUser = toAdminUser(profile);
  const roleLabel = ROLE_LABELS[profile.role];

  return (
    <div className="space-y-8 motion-safe:animate-[fade-slide_.35s_ease-out]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700/70 dark:text-teal-400/70">
          Admin Panel
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Dashboard
        </h1>
        <p className="mt-1.5 text-slate-500 dark:text-slate-400">
          Selamat datang kembali,{" "}
          <span className="font-semibold text-teal-700 dark:text-teal-400">
            {adminUser.email}
          </span>
        </p>
        <p className="mt-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
          Role: {roleLabel}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/songs"
          className="group rounded-2xl border border-white/80 bg-white/80 p-6 shadow-[0_12px_30px_-20px_rgba(13,148,136,0.5)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-[0_18px_36px_-18px_rgba(13,148,136,0.7)] dark:border-teal-900/40 dark:bg-slate-900/70"
        >
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/10 to-emerald-500/10 dark:from-teal-500/20 dark:to-emerald-500/20">
            <svg
              className="h-6 w-6 text-teal-600 dark:text-teal-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Kelola Lagu
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Tambah, edit, dan hapus lagu dari songbook
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-teal-600 transition-all group-hover:gap-2 dark:text-teal-400">
            Buka
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>

        {canManageUsers(profile) ? (
          <Link
            href="/admin/users"
            className="group rounded-2xl border border-white/80 bg-white/80 p-6 shadow-[0_12px_30px_-20px_rgba(13,148,136,0.5)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-200 dark:border-teal-900/40 dark:bg-slate-900/70"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/10 to-emerald-500/10 dark:from-teal-500/20 dark:to-emerald-500/20">
              <svg
                className="h-6 w-6 text-teal-600 dark:text-teal-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Manajemen User
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Kelola pengguna dan peran akses
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-teal-600 transition-all group-hover:gap-2 dark:text-teal-400">
              Buka
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        ) : (
          <div className="rounded-2xl border border-dashed border-teal-200/70 bg-white/50 p-6 dark:border-teal-900/30 dark:bg-slate-900/40">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100/80 dark:bg-slate-800/60">
              <svg
                className="h-6 w-6 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-slate-400 dark:text-slate-600">
              Modul Baru
            </h2>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-600">
              Fitur tambahan akan tersedia di sini
            </p>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-teal-100/70 bg-white/60 px-5 py-4 dark:border-teal-900/30 dark:bg-slate-900/50">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Lihat Songbook Publik
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Buka tampilan yang dilihat jemaat
            </p>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-semibold text-teal-700 transition-colors hover:bg-teal-100 dark:border-teal-800/50 dark:bg-teal-900/30 dark:text-teal-300 dark:hover:bg-teal-900/50"
          >
            Buka
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
