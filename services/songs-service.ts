import { getSupabaseClient } from "@/lib/supabase/client";
import type { Song, SongDbRow, SongInsertInput, SongUpdateInput } from "@/types/song";

const SONGS_TABLE = "songs";
const SECTION_TYPES: Song["sections"][number]["type"][] = [
  "verse-1",
  "verse-2",
  "chorus",
  "reff",
  "bridge",
  "ending",
];

function inferSectionTypeFromTitle(value: unknown): Song["sections"][number]["type"] {
  if (typeof value !== "string") {
    return "verse-1";
  }

  const normalized = value.trim().toLowerCase();
  if (normalized.includes("verse 2") || normalized.includes("bait 2")) {
    return "verse-2";
  }
  if (normalized.includes("chorus")) {
    return "chorus";
  }
  if (normalized.includes("reff") || normalized.includes("refrain")) {
    return "reff";
  }
  if (normalized.includes("bridge")) {
    return "bridge";
  }
  if (normalized.includes("ending") || normalized.includes("penutup")) {
    return "ending";
  }
  return "verse-1";
}

function normalizeSectionType(value: unknown): Song["sections"][number]["type"] {
  if (typeof value === "string" && SECTION_TYPES.includes(value as Song["sections"][number]["type"])) {
    return value as Song["sections"][number]["type"];
  }
  return "verse-1";
}

function normalizeSections(value: unknown): Song["sections"] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((section) => {
      if (!section || typeof section !== "object") {
        return null;
      }

      const rawSection = section as {
        type?: unknown;
        title?: unknown;
        lines?: unknown;
        content?: unknown;
      };

      const linesFromArray = Array.isArray(rawSection.lines)
        ? rawSection.lines.filter((line): line is string => typeof line === "string")
        : [];

      const linesFromContent =
        typeof rawSection.content === "string"
          ? rawSection.content
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean)
          : [];

      const lines = linesFromArray.length > 0 ? linesFromArray : linesFromContent;
      const title = typeof rawSection.title === "string" ? rawSection.title : "Verse";

      return {
        type:
          typeof rawSection.type === "string"
            ? normalizeSectionType(rawSection.type)
            : inferSectionTypeFromTitle(rawSection.title),
        title,
        lines,
      };
    })
    .filter((section): section is Song["sections"][number] => section !== null);
}

function mapSongDbRow(row: Partial<SongDbRow>): Song {
  return {
    id: row.id ?? "",
    title: row.title ?? "Tanpa Judul",
    slug: row.slug ?? "",
    number: row.number ?? "-",
    category: row.category ?? "Pujian",
    key: row.key ?? "-",
    sections: normalizeSections(row.lyrics_sections),
    createdAt: row.created_at,
  };
}

export async function getSongs(): Promise<Song[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(SONGS_TABLE)
    .select("id,title,slug,number,category,key,lyrics_sections,created_at")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch songs: ${error.message}`);
  }

  return ((data ?? []) as Partial<SongDbRow>[]).map(mapSongDbRow);
}

export async function getSongBySlug(slug: string): Promise<Song | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(SONGS_TABLE)
    .select("id,title,slug,number,category,key,lyrics_sections,created_at")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch song by slug: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return mapSongDbRow(data as Partial<SongDbRow>);
}

export async function addSong(payload: SongInsertInput): Promise<Song> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(SONGS_TABLE)
    .insert(payload)
    .select("id,title,slug,number,category,key,lyrics_sections,created_at")
    .single();

  if (error) {
    throw new Error(`Failed to add song: ${error.message}`);
  }

  return mapSongDbRow(data as Partial<SongDbRow>);
}

export async function updateSong(id: string, payload: SongUpdateInput): Promise<Song> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(SONGS_TABLE)
    .update(payload)
    .eq("id", id)
    .select("id,title,slug,number,category,key,lyrics_sections,created_at")
    .single();

  if (error) {
    throw new Error(`Failed to update song: ${error.message}`);
  }

  return mapSongDbRow(data as Partial<SongDbRow>);
}

export async function deleteSong(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from(SONGS_TABLE).delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete song: ${error.message}`);
  }
}

