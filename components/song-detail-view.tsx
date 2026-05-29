"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { TouchEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { buildSongPath } from "@/lib/setlist/song-navigation";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ExpandIcon,
  HeartIcon,
  TextSizeIcon,
} from "@/components/icons";
import { useFavorites } from "@/components/use-favorites";
import { useRecentlyViewed } from "@/components/use-recently-viewed";
import { SongMediaPanel } from "@/components/song-media-panel";
import type { Song } from "@/types/song";

type SongDetailViewProps = {
  song: Song;
  prevSongSlug?: string;
  nextSongSlug?: string;
  setlistSlug?: string;
  setlistTitle?: string;
};

const fontSizeScale = [1, 1.15, 1.3, 1.5] as const;

export function SongDetailView({
  song,
  prevSongSlug,
  nextSongSlug,
  setlistSlug,
  setlistTitle,
}: SongDetailViewProps) {
  const router = useRouter();
  const touchStartX = useRef<number | null>(null);
  const [fontScaleIndex, setFontScaleIndex] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const { favoriteSet, toggleFavorite, isReady } = useFavorites();
  const { addRecent } = useRecentlyViewed();

  const safeSlug = song?.slug ?? "";
  const safeTitle = song?.title ?? "Tanpa Judul";
  const safeNumber = song?.number ?? "-";
  const safeCategory = song?.category ?? "Pujian";
  const safeKey = song?.key ?? "-";
  const safeSections = Array.isArray(song?.sections) ? song.sections : [];
  const isFavorite = favoriteSet.has(safeSlug);

  useEffect(() => {
    if (safeSlug) {
      addRecent(safeSlug);
    }
  }, [addRecent, safeSlug]);

  const lyricStyle = useMemo(
    () => ({
      fontSize: `${fontSizeScale[fontScaleIndex] * (isPresentationMode ? 1.15 : 1)}rem`,
      lineHeight: isPresentationMode ? 2.08 : 1.95,
      transition: "font-size 220ms ease, line-height 220ms ease",
    }),
    [fontScaleIndex, isPresentationMode],
  );

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  }

  function goToPrevSong() {
    if (prevSongSlug) {
      router.push(buildSongPath(prevSongSlug, setlistSlug));
    }
  }

  function goToNextSong() {
    if (nextSongSlug) {
      router.push(buildSongPath(nextSongSlug, setlistSlug));
    }
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) {
      return;
    }

    const diffX = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    touchStartX.current = null;

    if (diffX > 70) {
      goToPrevSong();
    } else if (diffX < -70) {
      goToNextSong();
    }
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`app-sky-page transition-all duration-300 motion-safe:animate-[fade-slide_.35s_ease-out] ${
        isFullscreen ? "fixed inset-0 z-50 overflow-y-auto" : ""
      }`}
    >
      <div className="mx-auto w-full max-w-3xl px-4 pb-10 pt-4 sm:px-6">
        <header className="app-surface app-gold-ring sticky top-3 z-10 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 flex-col gap-1">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex w-fit items-center gap-1 rounded-full border border-aion-sky-200 bg-white px-3 py-1.5 text-xs font-semibold text-aion-navy transition-colors hover:border-aion-sky-300 hover:bg-aion-sky-50"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Kembali
              </button>
              {setlistSlug ? (
                <Link
                  href={`/setlist/${setlistSlug}`}
                  className="truncate text-[11px] font-semibold text-aion-sky-500 underline-offset-2 hover:underline"
                >
                  ← Setlist{setlistTitle ? `: ${setlistTitle}` : ""}
                </Link>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => {
                if (safeSlug) {
                  toggleFavorite(safeSlug);
                }
              }}
              disabled={!isReady}
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-60 ${
                isFavorite
                  ? "border-aion-gold/50 bg-aion-navy text-white"
                  : "border-aion-sky-200 bg-white text-aion-navy hover:bg-aion-sky-50"
              }`}
            >
              <HeartIcon className="h-4 w-4" />
              {isFavorite ? "Favorit" : "Tambah Favorit"}
            </button>
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            {safeTitle}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold sm:text-sm">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {safeNumber}
            </span>
            <span className="rounded-full bg-aion-sky-100 px-3 py-1 text-aion-navy">
              {safeCategory}
            </span>
            <span className="rounded-full border border-aion-gold/35 bg-aion-gold/10 px-3 py-1 text-aion-navy">
              Key {safeKey}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-2 py-1 dark:bg-slate-900/80">
              <button
                type="button"
                onClick={() => setFontScaleIndex((prev) => Math.max(0, prev - 1))}
                className="rounded-full border border-aion-sky-200 bg-white px-3 py-1.5 text-xs font-bold text-aion-navy hover:bg-aion-sky-50"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontScaleIndex((prev) => Math.min(fontSizeScale.length - 1, prev + 1))}
                className="rounded-full border border-aion-sky-200 bg-white px-3 py-1.5 text-xs font-bold text-aion-navy hover:bg-aion-sky-50"
              >
                <TextSizeIcon className="mr-1 inline h-4 w-4" />
                A+
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsPresentationMode((prev) => !prev)}
              className="rounded-full border border-teal-100 bg-white px-3 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-50 dark:border-teal-900/40 dark:bg-slate-900 dark:text-teal-200"
            >
              {isPresentationMode ? "Mode Normal" : "Presentation Mode"}
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen((prev) => !prev)}
              className="rounded-full border border-teal-100 bg-white px-3 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-50 dark:border-teal-900/40 dark:bg-slate-900 dark:text-teal-200"
            >
              <ExpandIcon className="mr-1 inline h-4 w-4" />
              {isFullscreen ? "Keluar Fullscreen" : "Fullscreen"}
            </button>
          </div>
        </header>

        <section className="app-surface relative mt-5 p-4 sm:p-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-12 rounded-t-3xl bg-gradient-to-b from-white/95 via-white/45 to-transparent dark:from-slate-900/95 dark:via-slate-900/50" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 rounded-b-3xl bg-gradient-to-t from-white/95 via-white/45 to-transparent dark:from-slate-900/95 dark:via-slate-900/50" />

          <div className="relative z-[1] mb-5 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Worship Reading</p>
            <p className="text-[11px] font-semibold text-slate-400">Swipe kiri/kanan untuk lagu berikutnya</p>
          </div>

          <div className="relative z-[1] space-y-8 text-slate-700 dark:text-slate-200" style={lyricStyle}>
            {safeSections.length > 0 ? (
              safeSections.map((section, index) => (
              <article key={`${safeSlug || "song"}-${section.type}-${section.title}-${index}`} className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-aion-sky-500">
                  {section?.title ?? `Verse ${index + 1}`}
                </h2>
                <div className="space-y-2.5">
                  {(Array.isArray(section?.lines) ? section.lines : []).map((line, lineIndex) => (
                    <p key={`${safeSlug || "song"}-${section.type}-${index}-${line}-${lineIndex}`}>{line}</p>
                  ))}
                </div>
              </article>
              ))
            ) : (
              <article className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-aion-sky-500">
                  Verse
                </h2>
                <div className="space-y-2.5">
                  <p>Lirik belum tersedia untuk lagu ini.</p>
                </div>
              </article>
            )}
          </div>
        </section>

        {!isPresentationMode ? (
          <SongMediaPanel youtubeUrl={song.youtubeUrl} audioUrl={song.audioUrl} />
        ) : null}

        <footer className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={goToPrevSong}
            disabled={!prevSongSlug}
            className="app-surface-muted inline-flex items-center justify-center gap-1 px-4 py-3 text-sm font-semibold text-aion-navy transition-colors enabled:hover:border-aion-sky-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Lagu Sebelumnya
          </button>
          <button
            type="button"
            onClick={goToNextSong}
            disabled={!nextSongSlug}
            className="app-surface-muted inline-flex items-center justify-center gap-1 px-4 py-3 text-sm font-semibold text-aion-navy transition-colors enabled:hover:border-aion-sky-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Lagu Berikutnya
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </footer>
      </div>
    </div>
  );
}

