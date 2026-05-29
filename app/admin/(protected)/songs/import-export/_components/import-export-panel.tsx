"use client";

import { useState, useTransition } from "react";
import { exportSongsAction, importSongsAction } from "../actions";

export function ImportExportPanel() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleExport() {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result = await exportSongsAction();
      if ("error" in result) {
        setError(result.error);
        return;
      }
      const blob = new Blob([result.json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      a.click();
      URL.revokeObjectURL(url);
      setMessage(`Berhasil mengekspor ke ${result.filename}`);
    });
  }

  function handleImport(mode: "merge" | "replace") {
    const input = document.getElementById("import-file") as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) {
      setError("Pilih file JSON terlebih dahulu.");
      return;
    }

    if (mode === "replace" && !confirm("Mode ganti semua akan MENGHAPUS semua lagu existing. Lanjutkan?")) {
      return;
    }

    setError(null);
    setMessage(null);
    startTransition(async () => {
      const text = await file.text();
      const result = await importSongsAction(text, mode);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setMessage(
        `Import selesai: ${result.created} baru, ${result.updated} diperbarui, ${result.skipped} dilewati.`,
      );
      if (input) input.value = "";
    });
  }

  return (
    <div className="space-y-6">
      {message ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <section className="rounded-2xl border border-white/80 bg-white/80 p-5 dark:border-teal-900/30 dark:bg-slate-900/70">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Export Lagu</h2>
        <p className="mt-1 text-xs text-slate-500">
          Unduh semua lagu sebagai file JSON untuk backup atau migrasi.
        </p>
        <button
          type="button"
          disabled={isPending}
          onClick={handleExport}
          className="mt-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-70"
        >
          Download JSON
        </button>
      </section>

      <section className="rounded-2xl border border-white/80 bg-white/80 p-5 dark:border-teal-900/30 dark:bg-slate-900/70">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Import Lagu</h2>
        <p className="mt-1 text-xs text-slate-500">
          Upload file JSON hasil export. Mode gabung memperbarui slug yang sama; mode ganti menghapus semua lagu dulu.
        </p>
        <input
          id="import-file"
          type="file"
          accept="application/json,.json"
          className="mt-4 block w-full text-sm"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleImport("merge")}
            className="rounded-xl border border-teal-200 bg-teal-50 px-5 py-2.5 text-sm font-semibold text-teal-700 disabled:opacity-70"
          >
            Import (Gabung)
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleImport("replace")}
            className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-700 disabled:opacity-70"
          >
            Import (Ganti Semua)
          </button>
        </div>
      </section>
    </div>
  );
}
