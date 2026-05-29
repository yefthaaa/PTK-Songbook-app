"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { BottomNav } from "@/components/bottom-nav";
import { SearchIcon } from "@/components/icons";
import { SongCard } from "@/components/song-card";
import { useFavorites } from "@/components/use-favorites";
import { useSongs } from "@/components/use-songs";
import { normalizeSearchQuery, songMatchesSearch } from "@/lib/songs/search";

export default function FavoritesPage() {
  const [query, setQuery] = useState("");
  const { favoriteSet, isReady, toggleFavorite } = useFavorites();
  const { songs, isLoading, errorMessage, refreshSongs } = useSongs();
  const favoriteSongs = useMemo(() => {
    const normalizedQuery = normalizeSearchQuery(query);
    return songs.filter((song) => {
      if (!favoriteSet.has(song.slug)) return false;
      return songMatchesSearch(song, normalizedQuery);
    });
  }, [favoriteSet, query, songs]);

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl px-4 pb-28 pt-6 sm:px-6 sm:pt-8">
        <header className="app-surface app-gold-ring px-5 py-6 sm:px-7 sm:py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-aion-sky-500">
            Your Collection
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-aion-navy sm:text-4xl">Lagu Favorit</h1>
          <p className="mt-2 text-base leading-relaxed text-aion-navy/75 sm:text-lg">
            Kumpulan lagu yang kamu simpan untuk ibadah dan saat teduh.
          </p>
        </header>

        <main className="mt-6 space-y-4 sm:mt-8">
          <label className="app-surface-muted flex items-center gap-3 px-4 py-3">
            <SearchIcon className="h-4 w-4 text-aion-sky-500" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari dalam favorit..."
              className="w-full bg-transparent text-sm text-aion-navy outline-none placeholder:text-slate-400"
            />
          </label>

          {!isReady || isLoading ? (
            <p className="app-surface-muted p-5 text-sm text-aion-navy/60">Menyiapkan favorit...</p>
          ) : errorMessage ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/90 p-5 text-sm text-rose-700">
              <p>Gagal memuat lagu favorit dari Supabase.</p>
              <button
                type="button"
                onClick={() => void refreshSongs()}
                className="mt-2 rounded-full border border-rose-300 px-3 py-1 text-xs font-semibold hover:bg-rose-100/70"
              >
                Coba Lagi
              </button>
            </div>
          ) : favoriteSongs.length === 0 ? (
            <div className="app-surface-muted p-5 text-sm text-aion-navy/75">
              <p className="font-semibold">Belum ada lagu favorit.</p>
              <p className="mt-2">
                Tambahkan lagu dari halaman utama atau detail lagu, lalu kembali ke sini.
              </p>
              <Link
                href="/"
                className="mt-4 inline-flex rounded-full border border-aion-gold/50 bg-aion-navy px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-aion-navy-light"
              >
                Jelajahi Lagu
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {favoriteSongs.map((song) => (
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
