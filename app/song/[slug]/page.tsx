import { notFound } from "next/navigation";
import { SongDetailView } from "@/components/song-detail-view";
import { resolveSongNavigation } from "@/lib/setlist/song-navigation";
import { getSetlistBySlug } from "@/services/setlists-service";
import { getSongBySlug } from "@/services/songs-service";

type SongDetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ setlist?: string }>;
};

export default async function SongDetailPage({ params, searchParams }: SongDetailPageProps) {
  const { slug } = await params;
  const { setlist: setlistSlug } = await searchParams;
  const song = await getSongBySlug(slug);

  if (!song) {
    notFound();
  }

  const [{ prevSongSlug, nextSongSlug }, setlist] = await Promise.all([
    resolveSongNavigation(slug, setlistSlug),
    setlistSlug ? getSetlistBySlug(setlistSlug) : Promise.resolve(null),
  ]);

  return (
    <SongDetailView
      song={song}
      prevSongSlug={prevSongSlug}
      nextSongSlug={nextSongSlug}
      setlistSlug={setlist?.slug}
      setlistTitle={setlist?.title}
    />
  );
}
