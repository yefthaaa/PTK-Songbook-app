"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartIcon, HomeIcon, SearchIcon, SetlistIcon } from "@/components/icons";

const navItems = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/search", label: "Search", icon: SearchIcon },
  { href: "/favorites", label: "Favorites", icon: HeartIcon },
  { href: "/setlist", label: "Setlist", icon: SetlistIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-3 z-20 mx-auto w-[calc(100%-1.5rem)] max-w-md rounded-2xl border border-white/70 bg-white/80 p-2 shadow-[0_20px_40px_-24px_rgba(18,50,95,0.35)] backdrop-blur-xl app-gold-ring sm:bottom-5">
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
                  isActive ? "app-nav-active" : "app-nav-inactive"
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
