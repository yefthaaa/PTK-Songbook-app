"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { SearchIcon } from "@/components/icons";
import { SongCard } from "@/components/song-card";
import { useFavorites } from "@/components/use-favorites";
import { useSongs } from "@/components/use-songs";

export default function FavoritesPage() {
  const [query, setQuery] = useState("");
  const { favoriteSet, isReady, toggleFavorite } = useFavorites();
  const { songs, isLoading, errorMessage, refreshSongs } = useSongs();
  const favoriteSongs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return songs.filter((song) => {
      if (!favoriteSet.has(song.slug)) {
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
  }, [favoriteSet, query, songs]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50/70 to-white text-slate-800 motion-safe:animate-[fade-slide_.35s_ease-out] dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 dark:text-slate-100">
      <div className="mx-auto w-full max-w-3xl px-4 pb-28 pt-6 sm:px-6 sm:pt-8">
        <header className="rounded-3xl border border-white/70 bg-white/70 px-5 py-6 shadow-[0_10px_40px_-25px_rgba(13,148,136,0.65)] backdrop-blur-xl dark:border-teal-900/30 dark:bg-slate-900/70 sm:px-7 sm:py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700/70">
            Your Collection
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Lagu Favorit
          </h1>
          <p className="mt-2 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
            Kumpulan lagu yang kamu simpan untuk ibadah dan saat teduh.
          </p>
        </header>

        <main className="mt-6 space-y-4 sm:mt-8">
          <label className="flex items-center gap-3 rounded-2xl border border-teal-100 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-teal-900/30 dark:bg-slate-900/70">
            <SearchIcon className="h-4 w-4 text-teal-600" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari dalam favorit..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
            />
          </label>

          {!isReady || isLoading ? (
            <p className="rounded-2xl border border-teal-100 bg-white/80 p-5 text-sm text-slate-500">
              Menyiapkan favorit...
            </p>
          ) : errorMessage ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-5 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200">
              <p>Gagal memuat lagu favorit dari Supabase.</p>
              <button
                type="button"
                onClick={() => void refreshSongs()}
                className="mt-2 rounded-full border border-rose-300 px-3 py-1 text-xs font-semibold hover:bg-rose-100/70 dark:border-rose-700 dark:hover:bg-rose-900/40"
              >
                Coba Lagi
              </button>
            </div>
          ) : favoriteSongs.length === 0 ? (
            <div className="rounded-2xl border border-teal-100 bg-white/80 p-5 text-sm text-slate-600">
              <p className="font-semibold">Belum ada lagu favorit.</p>
              <p className="mt-2">
                Tambahkan lagu dari halaman utama atau detail lagu, lalu kembali ke sini.
              </p>
              <Link
                href="/"
                className="mt-4 inline-flex rounded-full border border-teal-200 bg-teal-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-600"
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
    </div>
  );
}

