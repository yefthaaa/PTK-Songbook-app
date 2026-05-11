"use client";

import { useMemo, useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { SearchIcon } from "@/components/icons";
import { SongCard } from "@/components/song-card";
import { useFavorites } from "@/components/use-favorites";
import { useSongs } from "@/components/use-songs";
import { SONG_CATEGORIES } from "@/types/song";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<(typeof SONG_CATEGORIES)[number]>("Semua");
  const { favoriteSet, toggleFavorite } = useFavorites();
  const { songs: allSongs, isLoading, errorMessage, refreshSongs } = useSongs();

  const songs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return allSongs.filter((song) => {
      const categoryMatch = activeCategory === "Semua" || song.category === activeCategory;
      if (!categoryMatch) {
        return false;
      }
      if (!normalizedQuery) {
        return true;
      }
      return (
        song.title.toLowerCase().includes(normalizedQuery) ||
        song.category.toLowerCase().includes(normalizedQuery) ||
        song.number.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [activeCategory, allSongs, query]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50/70 to-white text-slate-800 motion-safe:animate-[fade-slide_.35s_ease-out] dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 dark:text-slate-100">
      <div className="mx-auto w-full max-w-3xl px-4 pb-28 pt-6 sm:px-6 sm:pt-8">
        <header className="rounded-3xl border border-white/70 bg-white/70 px-5 py-6 shadow-[0_10px_40px_-25px_rgba(13,148,136,0.65)] backdrop-blur-xl dark:border-teal-900/30 dark:bg-slate-900/70 sm:px-7 sm:py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700/70">Discover</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Cari Lagu
          </h1>
          <p className="mt-2 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
            Temukan lagu berdasarkan judul, kategori, atau nomor.
          </p>
        </header>

        <main className="mt-6 space-y-5 sm:mt-8">
          <label className="flex items-center gap-3 rounded-2xl border border-teal-100 bg-white/80 px-4 py-3 shadow-[0_12px_30px_-24px_rgba(13,148,136,0.7)] backdrop-blur-md dark:border-teal-900/30 dark:bg-slate-900/70">
            <SearchIcon className="h-5 w-5 text-teal-600" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Contoh: haleluya, penyembahan, KJ 005..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500 sm:text-base"
            />
          </label>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {SONG_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  activeCategory === category
                    ? "border-teal-200 bg-teal-600 text-white"
                    : "border-teal-100 bg-white/75 text-teal-700 hover:bg-white dark:border-teal-900/40 dark:bg-slate-900/70 dark:text-teal-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-teal-100 bg-white/80 p-5 text-sm text-slate-600 dark:border-teal-900/30 dark:bg-slate-900/70 dark:text-slate-300">
              Memuat lagu...
            </div>
          ) : errorMessage ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-5 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200">
              <p>Gagal memuat lagu dari Supabase.</p>
              <button
                type="button"
                onClick={() => void refreshSongs()}
                className="mt-2 rounded-full border border-rose-300 px-3 py-1 text-xs font-semibold hover:bg-rose-100/70 dark:border-rose-700 dark:hover:bg-rose-900/40"
              >
                Coba Lagi
              </button>
            </div>
          ) : songs.length === 0 ? (
            <div className="rounded-2xl border border-teal-100 bg-white/80 p-5 text-sm text-slate-600 dark:border-teal-900/30 dark:bg-slate-900/70 dark:text-slate-300">
              Lagu tidak ditemukan. Ubah kata kunci atau pilih kategori lain.
            </div>
          ) : (
            <div className="space-y-3">
              {songs.map((song) => (
                <SongCard
                  key={song.slug}
                  song={song}
                  isFavorite={favoriteSet.has(song.slug)}
                  onToggleFavorite={toggleFavorite}
                  highlightQuery={query}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}

