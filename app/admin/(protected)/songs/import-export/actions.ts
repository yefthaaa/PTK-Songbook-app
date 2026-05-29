"use server";

import { revalidatePath } from "next/cache";
import { requirePermission, isAuthError } from "@/lib/auth/helpers";
import { canImportSongs, canExportSongs } from "@/lib/auth/permissions";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { adminGetSongsForExport } from "@/services/admin-songs-service";
import type { SongsExportBundle, SongExportRecord, SongCategory } from "@/types/song";
import { SONG_CATEGORIES } from "@/types/song";

export type ImportSongsResult =
  | { error: string }
  | { success: true; created: number; updated: number; skipped: number };

const VALID_CATEGORIES = SONG_CATEGORIES.filter((c) => c !== "Semua") as SongCategory[];

function isValidRecord(raw: unknown): raw is SongExportRecord {
  if (!raw || typeof raw !== "object") return false;
  const r = raw as SongExportRecord;
  return (
    typeof r.title === "string" &&
    typeof r.slug === "string" &&
    typeof r.number === "string" &&
    typeof r.key === "string" &&
    VALID_CATEGORIES.includes(r.category) &&
    Array.isArray(r.lyrics_sections)
  );
}

export async function exportSongsAction(): Promise<
  { error: string } | { success: true; json: string; filename: string }
> {
  try {
    await requirePermission(canExportSongs);
  } catch (err) {
    return { error: isAuthError(err) ? err.message : "Akses ditolak." };
  }

  try {
    const rows = await adminGetSongsForExport();
    const bundle: SongsExportBundle = {
      version: 1,
      exported_at: new Date().toISOString(),
      songs: rows.map((row) => ({
        title: row.title,
        slug: row.slug,
        number: row.number,
        category: row.category as SongCategory,
        key: row.key,
        lyrics_sections: row.lyrics_sections as SongExportRecord["lyrics_sections"],
        youtube_url: row.youtube_url ?? null,
        audio_url: row.audio_url ?? null,
      })),
    };

    const date = new Date().toISOString().slice(0, 10);
    return {
      success: true,
      json: JSON.stringify(bundle, null, 2),
      filename: `songbook-export-${date}.json`,
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Gagal mengekspor lagu." };
  }
}

export async function importSongsAction(
  jsonText: string,
  mode: "merge" | "replace",
): Promise<ImportSongsResult> {
  try {
    await requirePermission(canImportSongs);
  } catch (err) {
    return { error: isAuthError(err) ? err.message : "Akses ditolak." };
  }

  let bundle: SongsExportBundle;
  try {
    bundle = JSON.parse(jsonText) as SongsExportBundle;
  } catch {
    return { error: "File JSON tidak valid." };
  }

  if (!bundle?.songs || !Array.isArray(bundle.songs)) {
    return { error: "Format bundle tidak dikenali. Harus berisi array 'songs'." };
  }

  const supabase = await getSupabaseServerClient();

  if (mode === "replace") {
    const service = getSupabaseServiceClient();
    const { error: delError } = await service
      .from("songs")
      .delete()
      .gte("created_at", "1970-01-01");
    if (delError) {
      return { error: `Gagal mengosongkan lagu: ${delError.message}` };
    }
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const raw of bundle.songs) {
    if (!isValidRecord(raw)) {
      skipped += 1;
      continue;
    }

    const payload = {
      title: raw.title.trim(),
      slug: raw.slug.trim(),
      number: raw.number.trim(),
      category: raw.category,
      key: raw.key.trim(),
      lyrics_sections: raw.lyrics_sections,
      youtube_url: raw.youtube_url?.trim() || null,
      audio_url: raw.audio_url?.trim() || null,
    };

    const { data: existing } = await supabase
      .from("songs")
      .select("id")
      .eq("slug", payload.slug)
      .maybeSingle();

    if (existing?.id) {
      const { error } = await supabase.from("songs").update(payload).eq("id", existing.id);
      if (error) {
        skipped += 1;
        continue;
      }
      updated += 1;
    } else {
      const { error } = await supabase.from("songs").insert(payload);
      if (error) {
        skipped += 1;
        continue;
      }
      created += 1;
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/songs");
  return { success: true, created, updated, skipped };
}
