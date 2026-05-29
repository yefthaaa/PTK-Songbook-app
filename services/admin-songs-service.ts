/**
 * Admin Songs Service
 * Uses the server-side Supabase client (cookie session).
 * Import only in Server Components, Server Actions, or Route Handlers.
 * NEVER import in "use client" files.
 */
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Song, SongDbRow, SongInsertInput, SongUpdateInput } from "@/types/song";

const SONGS_TABLE = "songs";

const SELECT_FIELDS =
  "id,title,slug,number,category,key,lyrics_sections,youtube_url,audio_url,created_at";

// ─── Shared mapper (same logic as public service) ─────────────────────────────

function mapRow(row: Partial<SongDbRow>): Song {
  const sections = Array.isArray(row.lyrics_sections)
    ? (row.lyrics_sections as Song["sections"])
    : [];
  return {
    id: row.id ?? "",
    title: row.title ?? "Tanpa Judul",
    slug: row.slug ?? "",
    number: row.number ?? "-",
    category: row.category ?? "Pujian",
    key: row.key ?? "-",
    sections,
    youtubeUrl: row.youtube_url ?? null,
    audioUrl: row.audio_url ?? null,
    createdAt: row.created_at ?? undefined,
  };
}

export async function adminGetSongsForExport() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from(SONGS_TABLE)
    .select(
      "title,slug,number,category,key,lyrics_sections,youtube_url,audio_url",
    )
    .order("number", { ascending: true });

  if (error) throw new Error(`Failed to export songs: ${error.message}`);
  return data ?? [];
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function adminGetSongs(): Promise<Song[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from(SONGS_TABLE)
    .select(SELECT_FIELDS)
    .order("number", { ascending: true });

  if (error) throw new Error(`Failed to fetch songs: ${error.message}`);
  return ((data ?? []) as Partial<SongDbRow>[]).map(mapRow);
}

export async function adminGetSongById(id: string): Promise<Song | null> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from(SONGS_TABLE)
    .select(SELECT_FIELDS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Failed to fetch song: ${error.message}`);
  if (!data) return null;
  return mapRow(data as Partial<SongDbRow>);
}

// ─── Write ────────────────────────────────────────────────────────────────────

export async function adminCreateSong(payload: SongInsertInput): Promise<Song> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from(SONGS_TABLE)
    .insert(payload)
    .select(SELECT_FIELDS)
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error(
        "Slug sudah digunakan oleh lagu lain. Ubah judul atau slug secara manual.",
      );
    }
    throw new Error(`Failed to create song: ${error.message}`);
  }
  return mapRow(data as Partial<SongDbRow>);
}

export async function adminUpdateSong(
  id: string,
  payload: SongUpdateInput,
): Promise<Song> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from(SONGS_TABLE)
    .update(payload)
    .eq("id", id)
    .select(SELECT_FIELDS)
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error(
        "Slug sudah digunakan oleh lagu lain. Ubah judul atau slug secara manual.",
      );
    }
    throw new Error(`Failed to update song: ${error.message}`);
  }
  return mapRow(data as Partial<SongDbRow>);
}

export async function adminDeleteSong(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from(SONGS_TABLE)
    .delete()
    .eq("id", id);

  if (error) throw new Error(`Failed to delete song: ${error.message}`);
}