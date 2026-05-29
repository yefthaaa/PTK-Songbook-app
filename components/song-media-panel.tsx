"use client";

import { useState } from "react";
import { extractYouTubeId } from "@/lib/youtube";

type SongMediaPanelProps = {
  youtubeUrl?: string | null;
  audioUrl?: string | null;
};

export function SongMediaPanel({ youtubeUrl, audioUrl }: SongMediaPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const youtubeId = youtubeUrl ? extractYouTubeId(youtubeUrl) : null;
  const hasAudio = Boolean(audioUrl?.trim());

  if (!youtubeId && !hasAudio) {
    return null;
  }

  return (
    <section className="app-surface-muted mt-5 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-aion-sky-50 sm:px-5"
        aria-expanded={expanded}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-aion-navy/80">
            Referensi Audio
          </p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {youtubeId && hasAudio
              ? "YouTube & audio streaming"
              : youtubeId
                ? "Video YouTube"
                : "Pemutar audio"}
          </p>
        </div>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-aion-sky-200 bg-white text-aion-navy transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
          </svg>
        </span>
      </button>

      {expanded ? (
        <div className="space-y-4 border-t border-aion-sky-200/80 px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
          {youtubeId ? (
            <div className="space-y-2">
              <div className="aspect-video overflow-hidden rounded-2xl border border-teal-100 bg-black/5 dark:border-teal-900/40">
                <iframe
                  title="YouTube referensi lagu"
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <a
                href={youtubeUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-teal-600 underline-offset-2 hover:underline dark:text-teal-400"
              >
                Buka di YouTube
              </a>
            </div>
          ) : null}

          {hasAudio ? (
            <div className="space-y-2">
              <audio controls className="w-full" src={audioUrl!} preload="none">
                Browser Anda tidak mendukung pemutar audio.
              </audio>
              <a
                href={audioUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-teal-600 underline-offset-2 hover:underline dark:text-teal-400"
              >
                Buka link audio
              </a>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
