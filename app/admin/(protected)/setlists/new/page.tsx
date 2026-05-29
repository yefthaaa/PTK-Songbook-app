import { redirect } from "next/navigation";
import { requireAdminAccess } from "@/lib/auth/helpers";
import { canManageSetlists } from "@/lib/auth/permissions";
import { adminGetSongs } from "@/services/admin-songs-service";
import { SetlistForm } from "../_components/setlist-form";
import { createSetlistAction } from "../action";

export default async function NewSetlistPage() {
  const { profile } = await requireAdminAccess();
  if (!canManageSetlists(profile)) redirect("/admin/akses-ditolak");

  const songs = await adminGetSongs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Setlist Baru</h1>
        <p className="text-sm text-slate-500">Susun urutan lagu untuk ibadah</p>
      </div>
      <SetlistForm mode="create" songs={songs} action={createSetlistAction} />
    </div>
  );
}
