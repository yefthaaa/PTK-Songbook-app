import type { Song } from "@/types/song";

const CACHE_KEY = "ptk-songbook-songs-v1";

export function saveSongsCache(songs: Song[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ savedAt: new Date().toISOString(), songs }),
    );
  } catch {
    // quota exceeded — ignore
  }
}

export function loadSongsCache(): Song[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { songs?: Song[] };
    return Array.isArray(parsed.songs) ? parsed.songs : null;
  } catch {
    return null;
  }
}

export function isOffline(): boolean {
  return typeof navigator !== "undefined" && !navigator.onLine;
}
