import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login — SongBook Gereja",
  description: "Login ke panel admin SongBook Gereja",
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { next = "/admin" } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50/70 to-slate-100 px-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Decorative blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-900/20" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-900/20" />
      </div>

      <div className="relative w-full max-w-md motion-safe:animate-[fade-slide_.35s_ease-out]">
        {/* Card */}
        <div className="rounded-3xl border border-white/70 bg-white/75 px-8 py-10 shadow-[0_20px_60px_-30px_rgba(13,148,136,0.5)] backdrop-blur-xl dark:border-teal-900/30 dark:bg-slate-900/80">
          {/* Logo / Branding */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 shadow-[0_12px_28px_-10px_rgba(13,148,136,0.8)]">
              <svg
                className="h-7 w-7 text-white"
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
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700/70 dark:text-teal-400/70">
              Admin Panel
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              SongBook Gereja
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Masuk untuk mengelola lagu
            </p>
          </div>

          <LoginForm next={next} />
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-600">
          Halaman ini hanya untuk administrator.{" "}
          <a
            href="/"
            className="font-semibold text-teal-600 underline-offset-2 hover:underline dark:text-teal-400"
          >
            Kembali ke songbook
          </a>
        </p>
      </div>
    </div>
  );
}
