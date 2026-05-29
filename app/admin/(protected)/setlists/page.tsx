import Link from "next/link";
import { requireAdminAccess } from "@/lib/auth/helpers";
import { canManageSetlists, canDeleteSetlist } from "@/lib/auth/permissions";
import { adminGetSetlists } from "@/services/admin-setlists-service";
import { formatServiceDateMedium } from "@/lib/format-date";
import { DeleteSetlistButton } from "./_components/delete-setlist-button";

export default async function AdminSetlistsPage() {
  const { profile } = await requireAdminAccess();
  const setlists = await adminGetSetlists();
  const canCreate = canManageSetlists(profile);
  const canDelete = canDeleteSetlist(profile);

  return (
    <div className="space-y-6 motion-safe:animate-[fade-slide_.35s_ease-out]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700/70 dark:text-teal-400/70">
            Worship Flow
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">Setlist Ibadah</h1>
          <p className="mt-1 text-sm text-slate-500">{setlists.length} setlist</p>
        </div>
        {canCreate ? (
          <Link
            href="/admin/setlists/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-2.5 text-sm font-bold text-white"
          >
            + Setlist Baru
          </Link>
        ) : null}
      </div>

      {setlists.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-teal-200/70 p-8 text-center text-sm text-slate-500">
          Belum ada setlist. Buat setlist untuk rundown ibadah Minggu ini.
        </div>
      ) : (
        <div className="space-y-3">
          {setlists.map((setlist) => (
            <div
              key={setlist.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/80 bg-white/80 p-4 dark:border-teal-900/30 dark:bg-slate-900/70"
            >
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">{setlist.title}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {setlist.items.length} lagu • {formatServiceDateMedium(setlist.serviceDate)} • /setlist/{setlist.slug}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`/setlist/${setlist.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-teal-100 px-3 py-1.5 text-xs font-semibold text-teal-700"
                >
                  Lihat
                </a>
                {canCreate ? (
                  <Link
                    href={`/admin/setlists/${setlist.id}/edit`}
                    className="rounded-lg border border-teal-100 px-3 py-1.5 text-xs font-semibold text-slate-700"
                  >
                    Edit
                  </Link>
                ) : null}
                {canDelete ? (
                  <DeleteSetlistButton id={setlist.id} title={setlist.title} />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
