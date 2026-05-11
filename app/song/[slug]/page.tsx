import { notFound } from "next/navigation";
import { SongDetailView } from "@/components/song-detail-view";
import { getSongBySlug, getSongs } from "@/services/songs-service";

type SongDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SongDetailPage({ params }: SongDetailPageProps) {
  const { slug } = await params;
  const song = await getSongBySlug(slug);

  if (!song) {
    notFound();
  }

  const songs = await getSongs();
  const currentIndex = songs.findIndex((item) => item.slug === slug);
  const prev = currentIndex > 0 ? songs[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 ? songs[currentIndex + 1] : undefined;

  return <SongDetailView song={song} prevSongSlug={prev?.slug} nextSongSlug={next?.slug} />;
}

