import { getSetlistBySlug } from "@/services/setlists-service";
import { getSongs } from "@/services/songs-service";

export function buildSongPath(songSlug: string, setlistSlug?: string | null): string {
  if (!setlistSlug) return `/song/${songSlug}`;
  return `/song/${songSlug}?setlist=${encodeURIComponent(setlistSlug)}`;
}

export async function resolveSongNavigation(
  songSlug: string,
  setlistSlug?: string | null,
): Promise<{ prevSongSlug?: string; nextSongSlug?: string }> {
  if (setlistSlug) {
    const setlist = await getSetlistBySlug(setlistSlug);
    if (setlist) {
      const slugs = setlist.items
        .map((item) => item.songSlug)
        .filter((slug): slug is string => Boolean(slug));
      const index = slugs.indexOf(songSlug);
      if (index >= 0) {
        return {
          prevSongSlug: index > 0 ? slugs[index - 1] : undefined,
          nextSongSlug: index < slugs.length - 1 ? slugs[index + 1] : undefined,
        };
      }
    }
  }

  const songs = await getSongs();
  const currentIndex = songs.findIndex((item) => item.slug === songSlug);
  return {
    prevSongSlug: currentIndex > 0 ? songs[currentIndex - 1]?.slug : undefined,
    nextSongSlug:
      currentIndex >= 0 && currentIndex < songs.length - 1
        ? songs[currentIndex + 1]?.slug
        : undefined,
  };
}
