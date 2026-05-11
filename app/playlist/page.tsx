"use client";

import Link from "next/link";
import { useMemo } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { useRecentlyViewed } from "@/components/use-recently-viewed";
import { useSongs } from "@/components/use-songs";

export default function PlaylistPage() {
  const { recentSlugs, isReady } = useRecentlyViewed();
  const { songs, isLoading, errorMessage, refreshSongs } = useSongs();
  const recentSongs = useMemo(
    () => songs.filter((song) => recentSlugs.includes(song.slug)),
    [recentSlugs, songs],
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50/70 to-white text-slate-800 motion-safe:animate-[fade-slide_.35s_ease-out] dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 dark:text-slate-100">
      <div className="mx-auto w-full max-w-3xl px-4 pb-28 pt-6 sm:px-6 sm:pt-8">
        <header className="rounded-3xl border border-white/70 bg-white/70 px-5 py-6 shadow-[0_10px_40px_-25px_rgba(13,148,136,0.65)] backdrop-blur-xl dark:border-teal-900/30 dark:bg-slate-900/70 sm:px-7 sm:py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700/70">Worship Flow</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Recently Viewed
          </h1>
          <p className="mt-2 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
            Akses cepat lagu yang baru kamu baca.
          </p>
        </header>

        <main className="mt-6 sm:mt-8">
          {!isReady || isLoading ? (
            <p className="rounded-2xl border border-teal-100 bg-white/80 p-5 text-sm text-slate-500 dark:border-teal-900/30 dark:bg-slate-900/70 dark:text-slate-300">
              Menyiapkan playlist...
            </p>
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
          ) : recentSongs.length === 0 ? (
            <div className="rounded-2xl border border-teal-100 bg-white/80 p-5 text-sm text-slate-600 dark:border-teal-900/30 dark:bg-slate-900/70 dark:text-slate-300">
              <p className="font-semibold">Belum ada lagu yang dibuka.</p>
              <p className="mt-2">Buka halaman detail lagu untuk membangun recent playlist.</p>
              <Link
                href="/"
                className="mt-4 inline-flex rounded-full border border-teal-200 bg-teal-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-600"
              >
                Jelajahi Lagu
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {recentSongs.map((song) => (
                <li key={song.slug}>
                  <Link
                    href={`/song/${song.slug}`}
                    className="flex items-center justify-between rounded-2xl border border-white/80 bg-white/85 px-4 py-3 shadow-[0_16px_35px_-30px_rgba(13,148,136,0.85)] transition hover:border-teal-200 dark:border-teal-900/30 dark:bg-slate-900/70"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{song.title}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {song.number} - {song.category}
                      </p>
                    </div>
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-200">
                      Key {song.key}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}

