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
    <article className="group relative app-surface-muted p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-aion-sky-300 sm:p-5">
      <Link href={`/song/${song.slug}`} className="block transition-transform active:scale-[0.99]">
        <div className="flex items-start justify-between gap-4 pr-10">
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-aion-navy sm:text-lg">
              <HighlightText text={song.title} query={highlightQuery} />
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <p className="inline-flex rounded-full bg-aion-sky-100 px-3 py-1 text-xs font-semibold text-aion-navy">
                <HighlightText text={song.category} query={highlightQuery} />
              </p>
              <p className="inline-flex rounded-full border border-aion-gold/35 bg-aion-gold/10 px-3 py-1 text-xs font-semibold text-aion-navy">
                Key {song.key}
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-xl bg-aion-sky-50 px-3 py-1.5 text-xs font-bold text-aion-navy sm:text-sm">
            <HighlightText text={song.number} query={highlightQuery} />
          </span>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => onToggleFavorite(song.slug)}
        aria-label={isFavorite ? "Hapus dari favorit" : "Tambah ke favorit"}
        className={`absolute right-4 top-4 rounded-full border p-2 transition-all active:scale-90 ${
          isFavorite
            ? "border-aion-gold/50 bg-aion-navy text-white"
            : "border-aion-sky-200 bg-white text-aion-navy/60 hover:border-aion-sky-300 hover:text-aion-navy"
        }`}
      >
        <HeartIcon className="h-4 w-4" />
      </button>
    </article>
  );
}
