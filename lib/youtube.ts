/**
 * Extract YouTube video ID from common URL formats.
 */
export function extractYouTubeId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1).split("/")[0];
      return id || null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const v = parsed.searchParams.get("v");
      if (v) return v;
      const embedMatch = parsed.pathname.match(/\/embed\/([^/?]+)/);
      if (embedMatch?.[1]) return embedMatch[1];
      const shortMatch = parsed.pathname.match(/\/shorts\/([^/?]+)/);
      if (shortMatch?.[1]) return shortMatch[1];
    }
  } catch {
    return null;
  }

  return null;
}

export function isValidYouTubeUrl(url: string): boolean {
  if (!url.trim()) return true;
  return extractYouTubeId(url) !== null;
}

export function isValidAudioUrl(url: string): boolean {
  if (!url.trim()) return true;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
