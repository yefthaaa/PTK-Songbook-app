"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { BottomNav } from "@/components/bottom-nav";
import { useSetlists } from "@/components/use-setlists";
import { formatServiceDate } from "@/lib/format-date";

export default function SetlistIndexPage() {
  const { setlists, isLoading, errorMessage, refreshSetlists } = useSetlists();

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl px-4 pb-28 pt-6 sm:px-6 sm:pt-8">
        <header className="app-surface app-gold-ring px-5 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-aion-sky-500">Worship Flow</p>
          <h1 className="mt-2 text-3xl font-bold text-aion-navy">Setlist Ibadah</h1>
          <p className="mt-2 text-aion-navy/75">
            Rundown lagu untuk ibadah — buka dan ikuti urutannya.
          </p>
        </header>

        <main className="mt-6 space-y-3">
          {isLoading ? (
            <p className="app-surface-muted p-4 text-sm text-aion-navy/60">Memuat setlist...</p>
          ) : errorMessage ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              <p>{errorMessage}</p>
              <button type="button" onClick={() => void refreshSetlists()} className="mt-2 text-xs font-semibold underline">
                Coba lagi
              </button>
            </div>
          ) : setlists.length === 0 ? (
            <p className="app-surface-muted border-dashed p-6 text-center text-sm text-aion-navy/60">
              Belum ada setlist ibadah yang dipublikasikan.
            </p>
          ) : (
            setlists.map((setlist) => (
              <Link
                key={setlist.id}
                href={`/setlist/${setlist.slug}`}
                className="app-surface-muted block p-4 transition hover:border-aion-sky-300"
              >
                <p className="font-bold text-aion-navy">{setlist.title}</p>
                <p className="mt-1 text-xs text-aion-navy/55">{formatServiceDate(setlist.serviceDate)}</p>
                <p className="mt-2 text-xs font-semibold text-aion-sky-500">{setlist.items.length} lagu</p>
              </Link>
            ))
          )}
        </main>
      </div>
      <BottomNav />
    </AppShell>
  );
}
