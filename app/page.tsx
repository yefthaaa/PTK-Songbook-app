"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { BottomNav } from "@/components/bottom-nav";
import { ChurchBrand } from "@/components/church-brand";
import { SearchIcon } from "@/components/icons";
import { SongCard } from "@/components/song-card";
import { useFavorites } from "@/components/use-favorites";
import { useSongs } from "@/components/use-songs";
import { useRecentlyViewed } from "@/components/use-recently-viewed";
import { filterSongs } from "@/lib/songs/search";
import { SONG_CATEGORIES } from "@/types/song";

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<(typeof SONG_CATEGORIES)[number]>("Semua");
  const { favoriteSet, toggleFavorite } = useFavorites();
  const { recentSlugs, isReady } = useRecentlyViewed();
  const { songs, isLoading, errorMessage, refreshSongs } = useSongs();

  const filteredSongs = useMemo(
    () => filterSongs(songs, { query, category: activeCategory }),
    [activeCategory, query, songs],
  );

  const recentSongs = useMemo(
    () => filteredSongs.filter((song) => recentSlugs.includes(song.slug)).slice(0, 3),
    [filteredSongs, recentSlugs],
  );

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl px-4 pb-28 pt-6 sm:px-6 sm:pt-8">
        <header className="app-surface app-gold-ring px-5 py-6 sm:px-7 sm:py-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-aion-sky-500">
                Worship Songbook
              </p>
              <div className="mt-3">
                <ChurchBrand size="lg" />
              </div>
              <p className="mt-3 text-base leading-relaxed text-aion-navy/75 sm:text-lg">
                Cari lagu pujian dan penyembahan
              </p>
            </div>
            <Link
              href="/admin"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-aion-gold/50 bg-aion-navy px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-aion-navy-light active:scale-95"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Login
            </Link>
          </div>
        </header>

        <main className="mt-6 space-y-6 sm:mt-8 sm:space-y-8">
          <section className="app-surface-muted p-2.5">
            <label
              htmlFor="search-song"
              className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-white to-aion-sky-50 px-4 py-3.5"
            >
              <SearchIcon className="h-5 w-5 text-aion-sky-500" aria-hidden="true" />
              <input
                id="search-song"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari judul, lirik, kategori, atau nomor..."
                className="w-full bg-transparent text-sm text-aion-navy outline-none placeholder:text-slate-400 sm:text-base"
              />
            </label>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-aion-navy/60">Kategori</h2>
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {SONG_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-95 ${
                    activeCategory === category ? "app-chip-active" : "app-chip-inactive"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </section>

          {isReady && recentSongs.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-aion-navy/60">
                Terakhir Dibuka
              </h2>
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
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-aion-navy/60">
                Lagu Pilihan
              </h2>
              <p className="text-xs font-semibold text-aion-navy/45">{filteredSongs.length} lagu</p>
            </div>

            {isLoading ? (
              <div className="app-surface-muted p-4 text-sm text-aion-navy/70">Memuat lagu...</div>
            ) : errorMessage ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-sm text-rose-700">
                <p>Gagal memuat lagu dari Supabase.</p>
                <button
                  type="button"
                  onClick={() => void refreshSongs()}
                  className="mt-2 rounded-full border border-rose-300 px-3 py-1 text-xs font-semibold hover:bg-rose-100/70"
                >
                  Coba Lagi
                </button>
              </div>
            ) : filteredSongs.length === 0 ? (
              <div className="app-surface-muted p-4 text-sm text-aion-navy/70">
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
    </AppShell>
  );
}
