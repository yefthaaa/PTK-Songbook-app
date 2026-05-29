"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteSetlistAction } from "../action";

export function DeleteSetlistButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    start(async () => {
      const result = await deleteSetlistAction(id);
      if (result?.error) {
        setError(result.error);
        setConfirm(false);
        return;
      }
      router.refresh();
    });
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        {error ? <span className="text-xs text-rose-600">{error}</span> : null}
        <span className="text-xs text-slate-500">Hapus &ldquo;{title}&rdquo;?</span>
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          className="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-bold text-white"
        >
          Ya
        </button>
        <button type="button" onClick={() => setConfirm(false)} className="rounded-lg border px-3 py-1.5 text-xs">
          Batal
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirm(true)}
      className="rounded-lg border border-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-600"
    >
      Hapus
    </button>
  );
}
