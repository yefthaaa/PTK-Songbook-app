"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { LyricSection } from "@/types/song";
import { SONG_CATEGORIES } from "@/types/song";
import {
  generateSlug,
  MUSICAL_KEYS,
  type SongFormValues,
} from "@/lib/validation/song-validation";
import { LyricsSectionEditor } from "./lyrics-section-editor";
import type { SongActionState } from "../action";

// ─── Props ────────────────────────────────────────────────────────────────────

type SongFormProps = {
  mode: "create" | "edit";
  initialValues?: Partial<SongFormValues>;
  action: (prev: SongActionState, formData: FormData) => Promise<SongActionState>;
};

// ─── Filtered category options (exclude "Semua") ─────────────────────────────
const CATEGORY_OPTIONS = SONG_CATEGORIES.filter((c) => c !== "Semua");

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400"
      >
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p className="text-xs text-slate-400 dark:text-slate-500">{hint}</p>
      ) : null}
      {error ? (
        <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{error}</p>
      ) : null}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-teal-100 bg-white/80 px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 disabled:opacity-60 dark:border-teal-900/40 dark:bg-slate-800/70 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-500";

const inputErrorClass =
  "border-rose-300 focus:border-rose-400 focus:ring-rose-400/20 dark:border-rose-700";

// ─── Component ────────────────────────────────────────────────────────────────

export function SongForm({ mode, initialValues = {}, action }: SongFormProps) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState<SongActionState, FormData>(
    action,
    null,
  );

  // Local state for controlled fields
  const [title, setTitle] = useState(
    state?.values.title ?? initialValues.title ?? "",
  );
  const [slug, setSlug] = useState(
    state?.values.slug ?? initialValues.slug ?? "",
  );
  const [number, setNumber] = useState(
    state?.values.number ?? initialValues.number ?? "",
  );
  const [category, setCategory] = useState(
    state?.values.category ?? initialValues.category ?? "Pujian",
  );
  const [key, setKey] = useState(
    state?.values.key ?? initialValues.key ?? "",
  );
  const [youtubeUrl, setYoutubeUrl] = useState(
    state?.values.youtube_url ?? initialValues.youtubeUrl ?? "",
  );
  const [audioUrl, setAudioUrl] = useState(
    state?.values.audio_url ?? initialValues.audioUrl ?? "",
  );
  const [sections, setSections] = useState<LyricSection[]>(() => {
    if (state?.values.sections_json) {
      try {
        return JSON.parse(state.values.sections_json) as LyricSection[];
      } catch {
        return initialValues.sections ?? [];
      }
    }
    return initialValues.sections ?? [];
  });

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(
    mode === "edit" || !!initialValues.slug,
  );

  // Auto-generate slug from title in create mode
  const prevTitle = useRef(title);
  useEffect(() => {
    if (!slugManuallyEdited && mode === "create" && title !== prevTitle.current) {
      setSlug(generateSlug(title));
    }
    prevTitle.current = title;
  }, [title, slugManuallyEdited, mode]);

  const errors = state?.errors ?? {};

  return (
    <form action={formAction} className="space-y-8" noValidate>
      {/* Hidden sections JSON */}
      <input type="hidden" name="sections_json" value={JSON.stringify(sections)} />

      {/* Form-level error */}
      {errors.form ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-rose-200/80 bg-rose-50/80 px-4 py-3.5 text-sm text-rose-700 backdrop-blur-sm dark:border-rose-800/50 dark:bg-rose-950/50 dark:text-rose-300"
        >
          <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {errors.form}
        </div>
      ) : null}

      {/* ── Section 1: Basic info ─────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-[0_10px_30px_-20px_rgba(13,148,136,0.4)] backdrop-blur-sm dark:border-teal-900/30 dark:bg-slate-900/70 sm:p-6">
        <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-teal-700/80 dark:text-teal-400/80">
          Informasi Dasar
        </h2>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Title */}
          <div className="sm:col-span-2">
            <Field label="Judul Lagu" htmlFor="title" error={errors.title}>
              <input
                id="title"
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Hai Pujilah Tuhan"
                disabled={isPending}
                className={`${inputClass} ${errors.title ? inputErrorClass : ""}`}
              />
            </Field>
          </div>

          {/* Slug */}
          <div className="sm:col-span-2">
            <Field
              label="Slug (URL)"
              htmlFor="slug"
              error={errors.slug}
              hint={mode === "create" ? "Otomatis dari judul. Edit manual jika perlu." : "Hati-hati mengubah slug — link lama akan rusak."}
            >
              <div className="flex items-center gap-2">
                <span className="shrink-0 rounded-l-xl border border-r-0 border-teal-100 bg-teal-50/80 px-3 py-3 text-xs text-teal-600 dark:border-teal-900/40 dark:bg-teal-900/20 dark:text-teal-400">
                  /song/
                </span>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugManuallyEdited(true);
                  }}
                  placeholder="hai-pujilah-tuhan"
                  disabled={isPending}
                  className={`${inputClass} rounded-l-none ${errors.slug ? inputErrorClass : ""}`}
                />
              </div>
            </Field>
          </div>

          {/* Number */}
          <Field label="Nomor Lagu" htmlFor="number" error={errors.number}>
            <input
              id="number"
              name="number"
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="KJ 001"
              disabled={isPending}
              className={`${inputClass} ${errors.number ? inputErrorClass : ""}`}
            />
          </Field>

          {/* Category */}
          <Field label="Kategori" htmlFor="category" error={errors.category}>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isPending}
              className={`${inputClass} ${errors.category ? inputErrorClass : ""}`}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          {/* Key */}
          <Field label="Nada Dasar (Key)" htmlFor="key" error={errors.key} hint="Contoh: C, G, Am">
            <input
              id="key"
              name="key"
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="C"
              disabled={isPending}
              list="key-options"
              className={`${inputClass} ${errors.key ? inputErrorClass : ""}`}
            />
            <datalist id="key-options">
              {MUSICAL_KEYS.map((k) => (
                <option key={k} value={k} />
              ))}
            </datalist>
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-[0_10px_30px_-20px_rgba(13,148,136,0.4)] backdrop-blur-sm dark:border-teal-900/30 dark:bg-slate-900/70 sm:p-6">
        <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-teal-700/80 dark:text-teal-400/80">
          Referensi Audio
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field
              label="Link YouTube"
              htmlFor="youtube_url"
              error={errors.youtubeUrl}
              hint="Contoh: https://www.youtube.com/watch?v=..."
            >
              <input
                id="youtube_url"
                name="youtube_url"
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                disabled={isPending}
                className={`${inputClass} ${errors.youtubeUrl ? inputErrorClass : ""}`}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field
              label="Link Audio (MP3/stream)"
              htmlFor="audio_url"
              error={errors.audioUrl}
              hint="URL file audio atau streaming (opsional)"
            >
              <input
                id="audio_url"
                name="audio_url"
                type="url"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="https://..."
                disabled={isPending}
                className={`${inputClass} ${errors.audioUrl ? inputErrorClass : ""}`}
              />
            </Field>
          </div>
        </div>
      </div>

      {/* ── Section 2: Lyrics ─────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-[0_10px_30px_-20px_rgba(13,148,136,0.4)] backdrop-blur-sm dark:border-teal-900/30 dark:bg-slate-900/70 sm:p-6">
        <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-teal-700/80 dark:text-teal-400/80">
          Bagian Lirik
        </h2>
        <LyricsSectionEditor
          sections={sections}
          onChange={setSections}
          error={errors.sections}
        />
      </div>

      {/* ── Action bar ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/songs")}
          disabled={isPending}
          className="rounded-xl border border-teal-100 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition-all hover:border-teal-200 hover:bg-teal-50 disabled:opacity-60 dark:border-teal-900/40 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:bg-teal-900/20"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-[0_10px_24px_-14px_rgba(13,148,136,0.9)] transition-all hover:from-teal-400 hover:to-emerald-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Menyimpan...
            </>
          ) : mode === "create" ? (
            "Simpan Lagu"
          ) : (
            "Perbarui Lagu"
          )}
        </button>
      </div>
    </form>
  );
}