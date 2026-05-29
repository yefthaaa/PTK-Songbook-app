import { notFound, redirect } from "next/navigation";
import { requireAdminAccess } from "@/lib/auth/helpers";
import { canManageSetlists } from "@/lib/auth/permissions";
import { adminGetSetlistById } from "@/services/admin-setlists-service";
import { adminGetSongs } from "@/services/admin-songs-service";
import { SetlistForm } from "../../_components/setlist-form";
import { updateSetlistAction } from "../../action";

type EditSetlistPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditSetlistPage({ params }: EditSetlistPageProps) {
  const { profile } = await requireAdminAccess();
  if (!canManageSetlists(profile)) redirect("/admin/akses-ditolak");

  const { id } = await params;
  const [setlist, songs] = await Promise.all([adminGetSetlistById(id), adminGetSongs()]);

  if (!setlist) notFound();

  const boundUpdate = updateSetlistAction.bind(null, id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Edit Setlist</h1>
        <p className="text-sm text-slate-500">{setlist.title}</p>
      </div>
      <SetlistForm
        mode="edit"
        songs={songs}
        initialValues={{
          title: setlist.title,
          slug: setlist.slug,
          serviceDate: setlist.serviceDate ?? "",
          notes: setlist.notes ?? "",
          items: setlist.items,
        }}
        action={boundUpdate}
      />
    </div>
  );
}
