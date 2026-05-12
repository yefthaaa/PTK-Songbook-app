"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: "/admin/songs",
    label: "Lagu",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
  },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-teal-100/70 bg-white/80 backdrop-blur-xl dark:border-teal-900/30 dark:bg-slate-900/80">
      {/* Branding */}
      <div className="border-b border-teal-100/70 px-6 py-5 dark:border-teal-900/30">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 shadow-[0_8px_20px_-10px_rgba(13,148,136,0.8)]">
            <svg className="h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">SongBook Admin</p>
            <p className="text-[11px] font-medium text-teal-600 dark:text-teal-400">Panel Manajemen</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-teal-500/10 to-emerald-500/10 text-teal-700 dark:from-teal-500/20 dark:to-emerald-500/20 dark:text-teal-300"
                      : "text-slate-600 hover:bg-teal-50/70 hover:text-teal-700 dark:text-slate-400 dark:hover:bg-teal-900/20 dark:hover:text-teal-300"
                  }`}
                >
                  <span
                    className={
                      isActive ? "text-teal-600 dark:text-teal-400" : "text-slate-400 dark:text-slate-500"
                    }
                  >
                    {item.icon}
                  </span>
                  {item.label}
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-teal-500" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User + logout */}
      <div className="border-t border-teal-100/70 px-4 py-4 dark:border-teal-900/30">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-teal-50/60 px-3 py-2.5 dark:bg-teal-900/20">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 text-xs font-bold uppercase text-white shadow-sm">
            {email.charAt(0)}
          </div>
          <p className="min-w-0 truncate text-xs font-semibold text-slate-700 dark:text-slate-300">
            {email}
          </p>
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
