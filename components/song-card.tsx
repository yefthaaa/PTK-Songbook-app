"use client";

import Link from "next/link";
import { HeartIcon } from "@/components/icons";
import { HighlightText } from "@/components/highlight-text";
import type { Song } from "@/types/song";

type SongCardProps = {
  song: Song;
  isFavorite: boolean;
  onToggleFavorite: (slug: string) => void;
  highlightQuery?: string;
};

export function SongCard({ song, isFavorite, onToggleFavorite, highlightQuery }: SongCardProps) {
  return (
    <article className="group relative rounded-2xl border border-white/80 bg-white/85 p-4 shadow-[0_18px_40px_-32px_rgba(15,118,110,0.9)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-[0_20px_40px_-28px_rgba(13,148,136,0.85)] dark:border-teal-900/40 dark:bg-slate-900/80 dark:shadow-[0_20px_45px_-35px_rgba(0,0,0,0.85)] sm:p-5">
      <Link href={`/song/${song.slug}`} className="block transition-transform active:scale-[0.99]">
        <div className="flex items-start justify-between gap-4 pr-10">
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg">
              <HighlightText text={song.title} query={highlightQuery} />
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <p className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-200">
                <HighlightText text={song.category} query={highlightQuery} />
              </p>
              <p className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                Key {song.key}
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200 sm:text-sm">
            <HighlightText text={song.number} query={highlightQuery} />
          </span>
        </div>
      </Link>

      <button
        type="button"
        aria-label={isFavorite ? "Hapus dari favorit" : "Tambah ke favorit"}
        onClick={() => onToggleFavorite(song.slug)}
        className={`absolute right-3 top-3 rounded-full border p-2 transition-all duration-200 active:scale-95 ${
          isFavorite
            ? "border-emerald-200 bg-emerald-500 text-white shadow-[0_8px_20px_-14px_rgba(16,185,129,1)]"
            : "border-teal-100 bg-white text-teal-600 hover:border-teal-300 hover:bg-teal-50"
        }`}
      >
        <HeartIcon className="h-4 w-4" />
      </button>
    </article>
  );
}

