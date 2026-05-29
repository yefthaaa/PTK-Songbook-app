import Link from "next/link";
import { requireAdminAccess } from "@/lib/auth/helpers";
import {
  canCreateSong,
  canEditSong,
  canDeleteSong,
} from "@/lib/auth/permissions";
import { adminGetSongs } from "@/services/admin-songs-service";
import { DeleteSongButton } from "./_components/delete-song-button";
import type { SongCategory } from "@/types/song";
import { SONG_CATEGORIES } from "@/types/song";

type SongsPageProps = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

const CATEGORY_OPTIONS = SONG_CATEGORIES.filter((c) => c !== "Semua");

export default async function AdminSongsPage({ searchParams }: SongsPageProps) {
  const { profile } = await requireAdminAccess();
  const showCreate = canCreateSong(profile);
  const showEdit = canEditSong(profile);
  const showDelete = canDeleteSong(profile);

  const { q = "", category = "Semua" } = await searchParams;

  const allSongs = await adminGetSongs();

  const filtered = allSongs.filter((song) => {
    const matchesCategory =
      category === "Semua" || song.category === (category as SongCategory);
    const normalizedQ = q.toLowerCase().trim();
    const matchesQuery =
      !normalizedQ ||
      song.title.toLowerCase().includes(normalizedQ) ||
      song.number.toLowerCase().includes(normalizedQ) ||
      song.key.toLowerCase().includes(normalizedQ);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6 motion-safe:animate-[fade-slide_.35s_ease-out]">
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700/70 dark:text-teal-400/70">
            Manajemen Konten
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Lagu
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {allSongs.length} total lagu dalam database
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/songs/import-export"
            className="inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-2.5 text-sm font-semibold text-teal-700 dark:border-teal-800/50 dark:bg-slate-900 dark:text-teal-300"
          >
            Import / Export
          </Link>
          {showCreate ? (
            <Link
              href="/admin/songs/new"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_-14px_rgba(13,148,136,0.9)] transition-all hover:from-teal-400 hover:to-emerald-400 active:scale-[0.98]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Tambah Lagu
            </Link>
          ) : null}
        </div>
      </div>

      {/* ── Search + filter ───────────────────────────────────────────────── */}
      <form
        method="get"
        className="flex flex-wrap gap-3 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-[0_8px_24px_-16px_rgba(13,148,136,0.3)] backdrop-blur-sm dark:border-teal-900/30 dark:bg-slate-900/70"
      >
        {/* Search input */}
        <label className="flex min-w-[200px] flex-1 items-center gap-2 rounded-xl border border-teal-100 bg-white/80 px-3 py-2.5 dark:border-teal-900/40 dark:bg-slate-800/60">
          <svg className="h-4 w-4 shrink-0 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Cari judul, nomor, nada..."
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
          />
        </label>

        {/* Category filter */}
        <select
          name="category"
          defaultValue={category}
          className="rounded-xl border border-teal-100 bg-white px-3 py-2.5 text-sm font-semibold text-teal-700 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 dark:border-teal-900/40 dark:bg-slate-800 dark:text-teal-300"
        >
          <option value="Semua">Semua Kategori</option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <button
          type="submit"
          className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-100 dark:border-teal-800/50 dark:bg-teal-900/30 dark:text-teal-300 dark:hover:bg-teal-900/50"
        >
          Filter
        </button>

        {(q || category !== "Semua") && (
          <a
            href="/admin/songs"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            Reset
          </a>
        )}
      </form>

      {/* ── Results count ─────────────────────────────────────────────────── */}
      {(q || category !== "Semua") && (
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Menampilkan {filtered.length} dari {allSongs.length} lagu
        </p>
      )}

      {/* ── Song table / cards ────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-teal-200/70 bg-white/60 p-10 text-center dark:border-teal-900/30 dark:bg-slate-900/50">
          <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">
            {allSongs.length === 0
              ? "Belum ada lagu. Klik \"Tambah Lagu\" untuk mulai."
              : "Tidak ada lagu yang cocok dengan filter."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-white/80 bg-white/80 shadow-[0_10px_30px_-20px_rgba(13,148,136,0.35)] backdrop-blur-sm dark:border-teal-900/30 dark:bg-slate-900/70 md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-teal-100/70 dark:border-teal-900/40">
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">No.</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Judul</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Kategori</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Key</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Bagian</th>
                  <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-50 dark:divide-teal-900/20">
                {filtered.map((song) => (
                  <tr
                    key={song.id}
                    className="group transition-colors hover:bg-teal-50/40 dark:hover:bg-teal-900/10"
                  >
                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {song.number}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {song.title}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                        /song/{song.slug}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                        {song.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        {song.key}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
                      {song.sections.length} bagian
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/song/${song.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-teal-100 bg-white px-3 py-1.5 text-xs font-semibold text-teal-600 transition-colors hover:border-teal-200 hover:bg-teal-50 dark:border-teal-900/40 dark:bg-slate-900 dark:text-teal-400 dark:hover:bg-teal-900/20"
                        >
                          Lihat
                        </a>
                        {showEdit ? (
                          <Link
                            href={`/admin/songs/${song.id}/edit`}
                            className="rounded-lg border border-teal-100 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-teal-200 hover:bg-teal-50 dark:border-teal-900/40 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-teal-900/20"
                          >
                            Edit
                          </Link>
                        ) : null}
                        {showDelete ? (
                          <DeleteSongButton id={song.id} title={song.title} />
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {filtered.map((song) => (
              <div
                key={song.id}
                className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-[0_8px_24px_-16px_rgba(13,148,136,0.4)] backdrop-blur-sm dark:border-teal-900/30 dark:bg-slate-900/70"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {song.number}
                      </span>
                      <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                        {song.category}
                      </span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        {song.key}
                      </span>
                    </div>
                    <p className="mt-2 font-bold text-slate-900 dark:text-slate-100">
                      {song.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                      {song.sections.length} bagian • /song/{song.slug}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-teal-50 pt-3 dark:border-teal-900/20">
                  <a
                    href={`/song/${song.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-teal-100 bg-white px-3 py-1.5 text-xs font-semibold text-teal-600 transition-colors hover:bg-teal-50 dark:border-teal-900/40 dark:bg-slate-900 dark:text-teal-400"
                  >
                    Lihat
                  </a>
                  {showEdit ? (
                    <Link
                      href={`/admin/songs/${song.id}/edit`}
                      className="rounded-lg border border-teal-100 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-teal-50 dark:border-teal-900/40 dark:bg-slate-900 dark:text-slate-300"
                    >
                      Edit
                    </Link>
                  ) : null}
                  {showDelete ? (
                    <DeleteSongButton id={song.id} title={song.title} />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}