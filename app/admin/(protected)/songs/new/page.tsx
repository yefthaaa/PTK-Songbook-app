import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdminAccess } from "@/lib/auth/helpers";
import { canCreateSong } from "@/lib/auth/permissions";
import { SongForm } from "../_components/song-form";
import { createSongAction } from "../action";

export default async function NewSongPage() {
  const { profile } = await requireAdminAccess();

  if (!canCreateSong(profile)) {
    redirect("/admin/akses-ditolak");
  }

  return (
    <div className="space-y-6 motion-safe:animate-[fade-slide_.35s_ease-out]">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/songs"
          className="inline-flex items-center gap-1.5 rounded-xl border border-teal-100 bg-white px-3 py-2 text-xs font-semibold text-teal-700 transition-colors hover:border-teal-200 hover:bg-teal-50 dark:border-teal-900/40 dark:bg-slate-900 dark:text-teal-300 dark:hover:bg-teal-900/20"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700/70 dark:text-teal-400/70">
            Lagu Baru
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Tambah Lagu
          </h1>
        </div>
      </div>

      <SongForm mode="create" action={createSongAction} />
    </div>
  );
}
