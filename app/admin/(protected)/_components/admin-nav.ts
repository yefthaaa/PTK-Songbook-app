import type { UserRole } from "@/types/auth";
import { canManageUsers } from "@/lib/auth/permissions";

export type AdminNavItem = {
  href: string;
  label: string;
  roles?: UserRole[];
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/setlists", label: "Setlist" },
  { href: "/admin/songs", label: "Lagu" },
  { href: "/admin/users", label: "Manajemen User", roles: ["super_admin"] },
];

export function getVisibleAdminNavItems(role: UserRole): AdminNavItem[] {
  return ADMIN_NAV_ITEMS.filter(
    (item) =>
      !item.roles ||
      item.roles.includes(role) ||
      (item.href === "/admin/users" && canManageUsers({ role })),
  );
}

export function isAdminNavActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}
