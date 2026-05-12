import { notFound } from "next/navigation";
import Link from "next/link";
import { adminGetSongById } from "@/services/admin-songs-service";
import { SongForm } from "../../_components/song-form";
import { updateSongAction } from "../../action";

type EditSongPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditSongPage({ params }: EditSongPageProps) {
  const { id } = await params;
  const song = await adminGetSongById(id);

  if (!song) {
    notFound();
  }

  // Bind the song ID into the action so the form doesn't need to carry it
  const boundUpdateAction = updateSongAction.bind(null, id);

  return (
    <div className="space-y-6 motion-safe:animate-[fade-slide_.35s_ease-out]">
      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start gap-3">
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
            Edit Lagu
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {song.title}
          </h1>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
            ID: {song.id} • /song/{song.slug}
          </p>
        </div>
      </div>

      {/* ── Form pre-filled with existing song data ── */}
      <SongForm
        mode="edit"
        initialValues={{
          title: song.title,
          slug: song.slug,
          number: song.number,
          category: song.category,
          key: song.key,
          sections: song.sections,
        }}
        action={boundUpdateAction}
      />
    </div>
  );
}