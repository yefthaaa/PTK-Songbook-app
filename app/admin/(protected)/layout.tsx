import { requireAdminAccess } from "@/lib/auth/helpers";
import { toAdminUser } from "@/types/auth";
import { ROLE_LABELS } from "@/lib/auth/permissions";
import { getVisibleAdminNavItems } from "./_components/admin-nav";
import { AdminSidebar } from "./_components/admin-sidebar";
import { AdminMobileHeader } from "./_components/admin-mobile-header";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireAdminAccess();
  const adminUser = toAdminUser(profile);
  const roleLabel = ROLE_LABELS[profile.role];
  const navItems = getVisibleAdminNavItems(profile.role);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-aion-sky-50 via-aion-sky-100/80 to-white">
      <div className="hidden lg:flex lg:shrink-0">
        <AdminSidebar
          email={adminUser.email}
          roleLabel={roleLabel}
          navItems={navItems}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AdminMobileHeader
          email={adminUser.email}
          roleLabel={roleLabel}
          navItems={navItems}
        />

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
