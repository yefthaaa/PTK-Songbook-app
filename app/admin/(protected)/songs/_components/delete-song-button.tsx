"use client";

import { useTransition, useState } from "react";
import { deleteSongAction } from "../action";

type DeleteSongButtonProps = {
  id: string;
  title: string;
};

export function DeleteSongButton({ id, title }: DeleteSongButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteSongAction(id);
      if (result?.error) {
        setError(result.error);
        setShowConfirm(false);
      }
    });
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        {error ? (
          <span className="text-xs text-rose-600 dark:text-rose-400">{error}</span>
        ) : (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Hapus &ldquo;{title}&rdquo;?
          </span>
        )}
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="rounded-lg border border-rose-300 bg-rose-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-rose-600 disabled:opacity-60 dark:border-rose-700"
        >
          {isPending ? "Menghapus..." : "Ya, Hapus"}
        </button>
        <button
          type="button"
          onClick={() => setShowConfirm(false)}
          disabled={isPending}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
        >
          Batal
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShowConfirm(true)}
      className="rounded-lg border border-rose-100 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:border-rose-300 hover:bg-rose-50 dark:border-rose-900/40 dark:bg-slate-900 dark:text-rose-400 dark:hover:bg-rose-950/30"
    >
      Hapus
    </button>
  );
}