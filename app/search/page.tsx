"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { BottomNav } from "@/components/bottom-nav";
import { SearchIcon } from "@/components/icons";
import { SongCard } from "@/components/song-card";
import { useFavorites } from "@/components/use-favorites";
import { useSongs } from "@/components/use-songs";
import { filterSongs } from "@/lib/songs/search";
import { SONG_CATEGORIES } from "@/types/song";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<(typeof SONG_CATEGORIES)[number]>("Semua");
  const { favoriteSet, toggleFavorite } = useFavorites();
  const { songs: allSongs, isLoading, errorMessage, refreshSongs } = useSongs();

  const songs = useMemo(
    () => filterSongs(allSongs, { query, category: activeCategory }),
    [activeCategory, allSongs, query],
  );

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl px-4 pb-28 pt-6 sm:px-6 sm:pt-8">
        <header className="app-surface app-gold-ring px-5 py-6 sm:px-7 sm:py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-aion-sky-500">Discover</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-aion-navy sm:text-4xl">Cari Lagu</h1>
          <p className="mt-2 text-base leading-relaxed text-aion-navy/75 sm:text-lg">
            Temukan lagu berdasarkan judul, lirik, kategori, atau nomor.
          </p>
        </header>

        <main className="mt-6 space-y-5 sm:mt-8">
          <label className="app-surface-muted flex items-center gap-3 px-4 py-3">
            <SearchIcon className="h-5 w-5 text-aion-sky-500" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Contoh: haleluya, kasih setia, KJ 005..."
              className="w-full bg-transparent text-sm text-aion-navy outline-none placeholder:text-slate-400 sm:text-base"
            />
          </label>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {SONG_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  activeCategory === category ? "app-chip-active" : "app-chip-inactive"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="app-surface-muted p-5 text-sm text-aion-navy/70">Memuat lagu...</div>
          ) : errorMessage ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/90 p-5 text-sm text-rose-700">
              <p>Gagal memuat lagu dari Supabase.</p>
              <button
                type="button"
                onClick={() => void refreshSongs()}
                className="mt-2 rounded-full border border-rose-300 px-3 py-1 text-xs font-semibold hover:bg-rose-100/70"
              >
                Coba Lagi
              </button>
            </div>
          ) : songs.length === 0 ? (
            <div className="app-surface-muted p-5 text-sm text-aion-navy/70">
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
    </AppShell>
  );
}
