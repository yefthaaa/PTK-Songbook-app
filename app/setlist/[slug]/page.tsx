import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { getSetlistBySlug } from "@/services/setlists-service";
import { BottomNav } from "@/components/bottom-nav";
import { formatServiceDate } from "@/lib/format-date";

type SetlistDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SetlistDetailPage({ params }: SetlistDetailPageProps) {
  const { slug } = await params;
  const setlist = await getSetlistBySlug(slug);

  if (!setlist) notFound();

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl px-4 pb-28 pt-6 sm:px-6">
        <header className="app-surface app-gold-ring px-5 py-6">
          <Link href="/setlist" className="text-xs font-semibold text-aion-sky-500">
            ← Semua setlist
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-aion-navy">{setlist.title}</h1>
          {setlist.serviceDate ? (
            <p className="mt-1 text-sm text-aion-navy/60">{formatServiceDate(setlist.serviceDate, "")}</p>
          ) : null}
          {setlist.notes ? (
            <p className="mt-3 rounded-xl border border-aion-gold/30 bg-aion-sky-50 px-3 py-2 text-sm text-aion-navy">
              {setlist.notes}
            </p>
          ) : null}
        </header>

        <ol className="mt-6 space-y-3">
          {setlist.items.map((item, index) => (
            <li key={`${item.songId}-${index}`}>
              <Link
                href={`/song/${item.songSlug}?setlist=${encodeURIComponent(setlist.slug)}`}
                className="app-surface-muted flex items-center justify-between gap-3 px-4 py-3 transition hover:border-aion-sky-300"
              >
                <div>
                  <p className="text-lg font-bold text-aion-navy">
                    {index + 1}. {item.songTitle}
                  </p>
                  <p className="text-xs text-aion-navy/55">
                    {item.songNumber} • Key {item.songKey}
                    {item.notes ? ` • ${item.notes}` : ""}
                  </p>
                </div>
                <span className="text-aion-sky-500">→</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
      <BottomNav />
    </AppShell>
  );
}
