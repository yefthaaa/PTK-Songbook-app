"use client";

import { useCallback, useId } from "react";
import type { LyricSection, LyricSectionType } from "@/types/song";
import { VALID_SECTION_TYPES } from "@/lib/validation/song-validation";

// ─── Section type display labels ──────────────────────────────────────────────

const SECTION_TYPE_LABELS: Record<LyricSectionType, string> = {
  "verse-1": "Verse 1",
  "verse-2": "Verse 2",
  chorus:   "Chorus",
  reff:     "Reff",
  bridge:   "Bridge",
  ending:   "Ending",
};

const DEFAULT_SECTION_TITLES: Record<LyricSectionType, string> = {
  "verse-1": "Verse 1",
  "verse-2": "Verse 2",
  chorus:   "Chorus",
  reff:     "Reff",
  bridge:   "Bridge",
  ending:   "Ending",
};

// ─── Props ────────────────────────────────────────────────────────────────────

type LyricsSectionEditorProps = {
  sections: LyricSection[];
  onChange: (sections: LyricSection[]) => void;
  error?: string;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function LyricsSectionEditor({ sections, onChange, error }: LyricsSectionEditorProps) {
  const uid = useId();

  // ── Helpers ──

  const updateSection = useCallback(
    (index: number, patch: Partial<LyricSection>) => {
      onChange(sections.map((s, i) => (i === index ? { ...s, ...patch } : s)));
    },
    [sections, onChange],
  );

  const addSection = useCallback(() => {
    const newSection: LyricSection = {
      type: "verse-1",
      title: "Verse 1",
      lines: [""],
    };
    onChange([...sections, newSection]);
  }, [sections, onChange]);

  const removeSection = useCallback(
    (index: number) => {
      onChange(sections.filter((_, i) => i !== index));
    },
    [sections, onChange],
  );

  const moveSection = useCallback(
    (index: number, direction: "up" | "down") => {
      const next = [...sections];
      const swapIdx = direction === "up" ? index - 1 : index + 1;
      if (swapIdx < 0 || swapIdx >= next.length) return;
      [next[index], next[swapIdx]] = [next[swapIdx]!, next[index]!];
      onChange(next);
    },
    [sections, onChange],
  );

  const updateLines = useCallback(
    (index: number, raw: string) => {
      // Preserve newlines as separate lines; filter completely blank trailing lines
      const lines = raw.split("\n");
      updateSection(index, { lines });
    },
    [updateSection],
  );

  const handleTypeChange = useCallback(
    (index: number, type: LyricSectionType) => {
      const section = sections[index];
      if (!section) return;
      // Auto-update title only if title still matches the old default
      const oldDefault = DEFAULT_SECTION_TITLES[section.type];
      const newDefault = DEFAULT_SECTION_TITLES[type];
      const title = section.title === oldDefault ? newDefault : section.title;
      updateSection(index, { type, title });
    },
    [sections, updateSection],
  );

  // ── Render ──

  return (
    <div className="space-y-4">
      {/* Error */}
      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-2.5 text-sm text-rose-700 dark:border-rose-800/50 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </p>
      ) : null}

      {/* Section list */}
      {sections.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-teal-200/70 bg-white/50 px-4 py-10 text-center dark:border-teal-900/30 dark:bg-slate-900/30">
          <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">
            Belum ada bagian lirik
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-600">
            Klik &ldquo;+ Tambah Bagian&rdquo; untuk mulai
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={`${uid}-section-${index}`}
              className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-[0_8px_24px_-16px_rgba(13,148,136,0.4)] backdrop-blur-sm dark:border-teal-900/30 dark:bg-slate-900/70 sm:p-5"
            >
              {/* Section header row */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {/* Section number badge */}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">
                  {index + 1}
                </span>

                {/* Type selector */}
                <select
                  value={section.type}
                  onChange={(e) =>
                    handleTypeChange(index, e.target.value as LyricSectionType)
                  }
                  className="rounded-lg border border-teal-100 bg-white px-3 py-1.5 text-xs font-semibold text-teal-700 outline-none transition-all focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 dark:border-teal-900/40 dark:bg-slate-800 dark:text-teal-300"
                >
                  {VALID_SECTION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {SECTION_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>

                {/* Title input */}
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSection(index, { title: e.target.value })}
                  placeholder="Judul bagian..."
                  className="min-w-0 flex-1 rounded-lg border border-teal-100 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 dark:border-teal-900/40 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500"
                />

                {/* Reorder + Delete */}
                <div className="ml-auto flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveSection(index, "up")}
                    disabled={index === 0}
                    aria-label="Pindah ke atas"
                    className="rounded-lg border border-teal-100 bg-white p-1.5 text-slate-500 transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-30 dark:border-teal-900/40 dark:bg-slate-800 dark:hover:bg-teal-900/30"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(index, "down")}
                    disabled={index === sections.length - 1}
                    aria-label="Pindah ke bawah"
                    className="rounded-lg border border-teal-100 bg-white p-1.5 text-slate-500 transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-30 dark:border-teal-900/40 dark:bg-slate-800 dark:hover:bg-teal-900/30"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    aria-label="Hapus bagian"
                    className="rounded-lg border border-rose-100 bg-white p-1.5 text-rose-400 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 dark:border-rose-900/40 dark:bg-slate-800 dark:hover:bg-rose-950/30"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Lyrics textarea */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                  Lirik — satu baris per baris
                </label>
                <textarea
                  value={section.lines.join("\n")}
                  onChange={(e) => updateLines(index, e.target.value)}
                  rows={Math.max(4, section.lines.length + 1)}
                  placeholder={"Hai pujilah Tuhan\nYang Maha Mulia\n..."}
                  className="w-full resize-y rounded-xl border border-teal-100 bg-white/90 px-4 py-3 font-mono text-sm leading-relaxed text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 dark:border-teal-900/40 dark:bg-slate-800/80 dark:text-slate-200 dark:placeholder:text-slate-600"
                />
                <p className="text-right text-xs text-slate-400">
                  {section.lines.filter((l) => l.trim()).length} baris
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add section button */}
      <button
        type="button"
        onClick={addSection}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-teal-300 bg-teal-50/60 py-3.5 text-sm font-semibold text-teal-700 transition-all hover:border-teal-400 hover:bg-teal-50 dark:border-teal-700/50 dark:bg-teal-900/10 dark:text-teal-400 dark:hover:bg-teal-900/20"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Tambah Bagian
      </button>
    </div>
  );
}