import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/helpers";
import { canAccessAdmin, ROLE_LABELS } from "@/lib/auth/permissions";
import { ChurchBrand } from "@/components/church-brand";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login — PTK Songbook",
  description: "Login ke panel admin PTK Songbook",
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

function safeAdminNext(next: string): string {
  if (
    next.startsWith("/admin") &&
    !next.startsWith("/admin/login") &&
    !next.startsWith("/admin/logout")
  ) {
    return next;
  }
  return "/admin";
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { next = "/admin" } = await searchParams;
  const session = await getSession();
  const isLoggedIn = Boolean(session.user && session.profile);
  const canAdmin = session.profile ? canAccessAdmin(session.profile) : false;

  // Sudah login sebagai staff → langsung ke dashboard (bukan stuck di form login)
  if (canAdmin) {
    redirect(safeAdminNext(next));
  }

  return (
    <div className="app-sky-page flex min-h-screen items-center justify-center px-4">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-900/20" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-900/20" />
      </div>

      <div className="relative w-full max-w-md motion-safe:animate-[fade-slide_.35s_ease-out]">
        <div className="app-surface app-gold-ring px-8 py-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <ChurchBrand size="md" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-aion-sky-500">
              Admin Panel
            </p>
            <p className="mt-1.5 text-sm text-aion-navy/65">Masuk untuk mengelola lagu</p>
          </div>

          {isLoggedIn && session.profile && !canAdmin ? (
            <div className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3.5 text-sm dark:border-amber-900/40 dark:bg-amber-950/30">
              <p className="text-slate-700 dark:text-slate-300">
                Anda login sebagai{" "}
                <span className="font-semibold">{session.profile.email}</span> (
                {ROLE_LABELS[session.profile.role]}). Role ini tidak bisa mengakses
                dashboard admin.
              </p>
              <a
                href="/admin/logout"
                className="inline-flex w-full items-center justify-center rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-sm font-semibold text-amber-800 hover:bg-amber-50"
              >
                Keluar & ganti akun
              </a>
            </div>
          ) : (
            <LoginForm next={next} />
          )}
        </div>

        <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-600">
          Halaman ini hanya untuk administrator.{" "}
          <Link
            href="/"
            className="font-semibold text-teal-600 underline-offset-2 hover:underline dark:text-teal-400"
          >
            Kembali ke songbook
          </Link>
        </p>
      </div>
    </div>
  );
}
