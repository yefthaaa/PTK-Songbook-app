import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdminAccess } from "@/lib/auth/helpers";
import { canExportSongs } from "@/lib/auth/permissions";
import { ImportExportPanel } from "./_components/import-export-panel";

export default async function ImportExportPage() {
  const { profile } = await requireAdminAccess();
  if (!canExportSongs(profile)) redirect("/admin/akses-ditolak");

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/songs"
          className="text-xs font-semibold text-teal-600 hover:underline"
        >
          ← Kembali ke Lagu
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
          Import / Export
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Backup dan restore database lagu dalam format JSON.
        </p>
      </div>
      <ImportExportPanel />
    </div>
  );
}
