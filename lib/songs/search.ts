import type { Song, SongCategory } from "@/types/song";

export function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase();
}

function getSongLyricsText(song: Song): string {
  return song.sections
    .flatMap((section) => [section.title, ...section.lines])
    .join("\n")
    .toLowerCase();
}

export function songMatchesSearch(song: Song, normalizedQuery: string): boolean {
  if (!normalizedQuery) return true;

  return (
    song.title.toLowerCase().includes(normalizedQuery) ||
    song.category.toLowerCase().includes(normalizedQuery) ||
    song.number.toLowerCase().includes(normalizedQuery) ||
    song.key.toLowerCase().includes(normalizedQuery) ||
    getSongLyricsText(song).includes(normalizedQuery)
  );
}

export function filterSongs(
  songs: Song[],
  options: { query?: string; category?: SongCategory | "Semua" },
): Song[] {
  const normalizedQuery = normalizeSearchQuery(options.query ?? "");
  const category = options.category ?? "Semua";

  return songs.filter((song) => {
    const categoryMatch = category === "Semua" || song.category === category;
    if (!categoryMatch) return false;
    return songMatchesSearch(song, normalizedQuery);
  });
}
