const RECENT_STORAGE_KEY = "songbook-recently-viewed";
const MAX_RECENT = 6;

export function readRecentlyViewed(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(RECENT_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function pushRecentlyViewed(slug: string): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  const current = readRecentlyViewed();
  const next = [slug, ...current.filter((item) => item !== slug)].slice(0, MAX_RECENT);
  window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
  return next;
}

