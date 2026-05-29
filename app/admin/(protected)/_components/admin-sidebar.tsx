"use client";

import Link from "next/link";
import { ChurchBrand } from "@/components/church-brand";
import { ADMIN_APP_NAME, ADMIN_APP_SUBTITLE } from "@/lib/branding";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { AdminNavItem } from "./admin-nav";
import { isAdminNavActive } from "./admin-nav";
import { ADMIN_NAV_ICONS } from "./admin-nav-icons";

type AdminSidebarProps = {
  email: string;
  roleLabel: string;
  navItems: AdminNavItem[];
};

export function AdminSidebar({ email, roleLabel, navItems }: AdminSidebarProps) {
  const pathname = usePathname();
  const [navReady, setNavReady] = useState(false);

  useEffect(() => {
    setNavReady(true);
  }, []);

  return (
    <aside className="flex h-full w-64 flex-col border-r border-aion-sky-200/80 bg-white/90 backdrop-blur-xl">
      <div className="border-b border-aion-sky-200/80 px-6 py-5">
        <ChurchBrand
          size="sm"
          title={ADMIN_APP_NAME}
          subtitle={ADMIN_APP_SUBTITLE}
          className="[&_p:last-child]:text-aion-sky-500"
        />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = navReady && isAdminNavActive(pathname, item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-aion-sky-100 text-aion-navy"
                      : "text-slate-600 hover:bg-aion-sky-50 hover:text-aion-navy"
                  }`}
                >
                  <span
                    className={
                      isActive ? "text-aion-sky-500" : "text-slate-400"
                    }
                  >
                    {ADMIN_NAV_ICONS[item.href]}
                  </span>
                  {item.label}
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-aion-gold" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-teal-100/70 px-4 py-4 dark:border-teal-900/30">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-teal-50/60 px-3 py-2.5 dark:bg-teal-900/20">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 text-xs font-bold uppercase text-white shadow-sm">
            {email.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-300">
              {email}
            </p>
            <p className="truncate text-[10px] font-medium text-teal-600 dark:text-teal-400">
              {roleLabel}
            </p>
          </div>
        </div>
        <form method="post" action="/admin/logout">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-teal-100 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-teal-900/40 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:border-rose-800/50 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Keluar
          </button>
        </form>
      </div>
    </aside>
  );
}
