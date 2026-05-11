"use client";

import { useMemo, useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { SearchIcon } from "@/components/icons";
import { SongCard } from "@/components/song-card";
import { useFavorites } from "@/components/use-favorites";
import { useSongs } from "@/components/use-songs";
import { useRecentlyViewed } from "@/components/use-recently-viewed";
import { SONG_CATEGORIES } from "@/types/song";

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<(typeof SONG_CATEGORIES)[number]>("Semua");
  const { favoriteSet, toggleFavorite } = useFavorites();
  const { recentSlugs, isReady } = useRecentlyViewed();
  const { songs, isLoading, errorMessage, refreshSongs } = useSongs();

  const filteredSongs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return songs.filter((song) => {
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
  }, [activeCategory, query, songs]);

  const recentSongs = useMemo(
    () => filteredSongs.filter((song) => recentSlugs.includes(song.slug)).slice(0, 3),
    [filteredSongs, recentSlugs],
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50/70 to-white text-slate-800 motion-safe:animate-[fade-slide_.35s_ease-out] dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 dark:text-slate-100">
      <div className="mx-auto w-full max-w-3xl px-4 pb-28 pt-6 sm:px-6 sm:pt-8">
        <header className="rounded-3xl border border-white/70 bg-white/70 px-5 py-6 shadow-[0_10px_40px_-25px_rgba(13,148,136,0.65)] backdrop-blur-xl dark:border-teal-900/30 dark:bg-slate-900/70 sm:px-7 sm:py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700/70">
            Songbook App
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            SongBook Gereja
          </h1>
          <p className="mt-2 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
            Cari lagu pujian dan penyembahan
          </p>
        </header>

        <main className="mt-6 space-y-6 sm:mt-8 sm:space-y-8">
          <section className="rounded-2xl border border-teal-100/70 bg-white/80 p-2.5 shadow-[0_15px_35px_-30px_rgba(15,118,110,0.7)] backdrop-blur-md transition-shadow hover:shadow-[0_20px_45px_-28px_rgba(13,148,136,0.7)] dark:border-teal-900/30 dark:bg-slate-900/70">
            <label
              htmlFor="search-song"
              className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-white to-teal-50/70 px-4 py-3.5"
            >
              <SearchIcon className="h-5 w-5 text-teal-600" aria-hidden="true" />
              <input
                id="search-song"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari judul lagu, kategori, atau nomor..."
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500 sm:text-base"
              />
            </label>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Kategori</h2>
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {SONG_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-95 ${
                    activeCategory === category
                      ? "border-teal-200 bg-teal-600 text-white shadow-[0_10px_24px_-16px_rgba(13,148,136,1)] hover:bg-teal-500"
                      : "border-teal-100 bg-white/75 text-teal-700 hover:border-teal-300 hover:bg-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </section>

          {isReady && recentSongs.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Terakhir Dibuka</h2>
              <div className="space-y-3">
                {recentSongs.map((song) => (
                  <SongCard
                    key={`recent-${song.slug}`}
                    song={song}
                    isFavorite={favoriteSet.has(song.slug)}
                    onToggleFavorite={toggleFavorite}
                    highlightQuery={query}
                  />
                ))}
              </div>
            </section>
          ) : null}

          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Lagu Pilihan
              </h2>
              <p className="text-xs font-semibold text-slate-400">{filteredSongs.length} lagu</p>
            </div>

            {isLoading ? (
              <div className="rounded-2xl border border-teal-100 bg-white/80 p-4 text-sm text-slate-600 dark:border-teal-900/30 dark:bg-slate-900/70 dark:text-slate-300">
                Memuat lagu...
              </div>
            ) : errorMessage ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200">
                <p>Gagal memuat lagu dari Supabase.</p>
                <button
                  type="button"
                  onClick={() => void refreshSongs()}
                  className="mt-2 rounded-full border border-rose-300 px-3 py-1 text-xs font-semibold hover:bg-rose-100/70 dark:border-rose-700 dark:hover:bg-rose-900/40"
                >
                  Coba Lagi
                </button>
              </div>
            ) : filteredSongs.length === 0 ? (
              <div className="rounded-2xl border border-teal-100 bg-white/80 p-4 text-sm text-slate-600 dark:border-teal-900/30 dark:bg-slate-900/70 dark:text-slate-300">
                Tidak ada lagu yang cocok. Coba kata kunci atau kategori lain.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSongs.map((song) => (
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
          </section>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
