import { requireAuth } from "@/lib/auth/helpers";
import { toAdminUser } from "@/types/auth";
import { AdminSidebar } from "./_components/admin-sidebar";
import { AdminMobileHeader } from "./_components/admin-mobile-header";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // requireAuth() redirects to /admin/login if unauthenticated.
  // This is the server-side auth gate — middleware is the first line of
  // defence; this is the second, ensuring no server render happens without auth.
  const { user } = await requireAuth();
  const adminUser = toAdminUser(user);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-emerald-50/60 via-teal-50/40 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Sidebar — hidden on mobile */}
      <div className="hidden lg:flex lg:shrink-0">
        <AdminSidebar email={adminUser.email} />
      </div>

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile header — visible only on mobile */}
        <AdminMobileHeader email={adminUser.email} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
