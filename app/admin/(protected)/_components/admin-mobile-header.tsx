"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { AdminNavItem } from "./admin-nav";
import { isAdminNavActive } from "./admin-nav";

type AdminMobileHeaderProps = {
  email: string;
  roleLabel: string;
  navItems: AdminNavItem[];
};

export function AdminMobileHeader({ email, roleLabel, navItems }: AdminMobileHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [navReady, setNavReady] = useState(false);

  useEffect(() => {
    setNavReady(true);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-teal-100/70 bg-white/80 backdrop-blur-xl dark:border-teal-900/30 dark:bg-slate-900/80 lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Admin</span>
            <p className="text-[10px] font-medium text-teal-600 dark:text-teal-400">{roleLabel}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="rounded-lg border border-teal-100 p-2 text-slate-600 hover:bg-teal-50 dark:border-teal-900/40 dark:text-slate-400 dark:hover:bg-teal-900/20"
        >
          {open ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="border-t border-teal-100/70 bg-white/95 px-4 pb-4 pt-2 dark:border-teal-900/30 dark:bg-slate-900/95">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = navReady && isAdminNavActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
                      : "text-slate-600 hover:bg-teal-50 dark:text-slate-400 dark:hover:bg-teal-900/20"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-3 flex items-center justify-between rounded-xl bg-teal-50/60 px-3 py-2 dark:bg-teal-900/20">
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-300">{email}</p>
              <p className="text-[10px] text-teal-600 dark:text-teal-400">{roleLabel}</p>
            </div>
            <form method="post" action="/admin/logout">
              <button
                type="submit"
                className="ml-3 rounded-lg border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-800/50 dark:text-rose-400 dark:hover:bg-rose-950/30"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
