"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartIcon, HomeIcon, PlaylistIcon, SearchIcon } from "@/components/icons";

const navItems = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/search", label: "Search", icon: SearchIcon },
  { href: "/favorites", label: "Favorites", icon: HeartIcon },
  { href: "/playlist", label: "Playlist", icon: PlaylistIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-3 z-20 mx-auto w-[calc(100%-1.5rem)] max-w-md rounded-2xl border border-white/60 bg-white/65 p-2 shadow-[0_20px_40px_-24px_rgba(15,23,42,0.4)] backdrop-blur-xl sm:bottom-5">
      <ul className="grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/" || pathname.startsWith("/song/")
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <li key={`${item.label}-${item.href}`}>
              <Link
                href={item.href}
                className={`flex w-full flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition-all duration-200 active:scale-95 ${
                  isActive
                    ? "bg-gradient-to-b from-teal-500 to-emerald-500 text-white shadow-[0_10px_20px_-12px_rgba(13,148,136,0.9)]"
                    : "text-slate-500 hover:bg-teal-50 hover:text-teal-700"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

