"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SetlistItem } from "@/types/setlist";
import type { Song } from "@/types/song";
import { generateSlug } from "@/lib/validation/setlist-validation";
import { SetlistItemsEditor } from "./setlist-items-editor";
import type { SetlistActionState } from "../action";

type SetlistFormProps = {
  mode: "create" | "edit";
  songs: Song[];
  initialValues?: {
    title?: string;
    slug?: string;
    serviceDate?: string;
    notes?: string;
    items?: SetlistItem[];
  };
  action: (prev: SetlistActionState, formData: FormData) => Promise<SetlistActionState>;
};

const inputClass =
  "w-full rounded-xl border border-teal-100 bg-white/80 px-4 py-3 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 dark:border-teal-900/40 dark:bg-slate-800/70 dark:text-slate-100";

export function SetlistForm({ mode, songs, initialValues = {}, action }: SetlistFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, null);

  const [title, setTitle] = useState(state?.values.title ?? initialValues.title ?? "");
  const [slug, setSlug] = useState(state?.values.slug ?? initialValues.slug ?? "");
  const [serviceDate, setServiceDate] = useState(
    state?.values.service_date ?? initialValues.serviceDate ?? "",
  );
  const [notes, setNotes] = useState(state?.values.notes ?? initialValues.notes ?? "");
  const [items, setItems] = useState<SetlistItem[]>(() => {
    if (state?.values.items_json) {
      try {
        return JSON.parse(state.values.items_json) as SetlistItem[];
      } catch {
        return initialValues.items ?? [];
      }
    }
    return initialValues.items ?? [];
  });

  const [slugManual, setSlugManual] = useState(mode === "edit");
  const prevTitle = useRef(title);

  useEffect(() => {
    if (!slugManual && mode === "create" && title !== prevTitle.current) {
      setSlug(generateSlug(title));
    }
    prevTitle.current = title;
  }, [title, slugManual, mode]);

  const errors = state?.errors ?? {};

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="items_json" value={JSON.stringify(items)} />

      {errors.form ? (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errors.form}
        </div>
      ) : null}

      <div className="grid gap-4 rounded-2xl border border-white/80 bg-white/80 p-5 dark:border-teal-900/30 dark:bg-slate-900/70 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            Judul ibadah
          </label>
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={inputClass}
            placeholder="Ibadah Minggu — 1 Juni 2026"
          />
          {errors.title ? <p className="mt-1 text-xs text-rose-600">{errors.title}</p> : null}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            Slug URL (/setlist/...)
          </label>
          <input
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugManual(true);
            }}
            required
            className={inputClass}
          />
          {errors.slug ? <p className="mt-1 text-xs text-rose-600">{errors.slug}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            Tanggal ibadah
          </label>
          <input
            name="service_date"
            type="date"
            value={serviceDate}
            onChange={(e) => setServiceDate(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            Catatan
          </label>
          <textarea
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className={inputClass}
            placeholder="Catatan untuk tim musik..."
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/80 bg-white/80 p-5 dark:border-teal-900/30 dark:bg-slate-900/70">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-teal-700/80">
          Urutan Lagu
        </h2>
        <SetlistItemsEditor songs={songs} items={items} onChange={setItems} error={errors.items} />
      </div>

      <div className="flex justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/setlists")}
          className="rounded-xl border px-5 py-3 text-sm font-semibold text-slate-600"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-3 text-sm font-bold text-white disabled:opacity-70"
        >
          {isPending ? "Menyimpan..." : mode === "create" ? "Simpan Setlist" : "Perbarui Setlist"}
        </button>
      </div>
    </form>
  );
}
