"use server";

import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/helpers";
import { adminCreateSong, adminUpdateSong, adminDeleteSong } from "@/services/admin-songs-service";
import {
  parseSongFormData,
  validateSongForm,
  hasErrors,
  generateSlug,
  type SongValidationErrors,
} from "@/lib/validation/song-validation";

export type SongActionState = {
  errors: SongValidationErrors;
  values: Record<string, string>;
} | null;

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createSongAction(
  _prev: SongActionState,
  formData: FormData,
): Promise<SongActionState> {
  await requireAuth();

  const values = parseSongFormData(formData);
  const errors = validateSongForm(values);

  if (hasErrors(errors)) {
    return {
      errors,
      values: {
        title: values.title,
        slug: values.slug,
        number: values.number,
        category: values.category,
        key: values.key,
        sections_json: formData.get("sections_json") as string ?? "[]",
      },
    };
  }

  try {
    await adminCreateSong({
      title: values.title,
      slug: values.slug || generateSlug(values.title),
      number: values.number,
      category: values.category,
      key: values.key,
      lyrics_sections: values.sections,
    });
  } catch (err) {
    return {
      errors: { form: err instanceof Error ? err.message : "Gagal menyimpan lagu." },
      values: {
        title: values.title,
        slug: values.slug,
        number: values.number,
        category: values.category,
        key: values.key,
        sections_json: formData.get("sections_json") as string ?? "[]",
      },
    };
  }

  redirect("/admin/songs");
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateSongAction(
  id: string,
  _prev: SongActionState,
  formData: FormData,
): Promise<SongActionState> {
  await requireAuth();

  const values = parseSongFormData(formData);
  const errors = validateSongForm(values);

  if (hasErrors(errors)) {
    return {
      errors,
      values: {
        title: values.title,
        slug: values.slug,
        number: values.number,
        category: values.category,
        key: values.key,
        sections_json: formData.get("sections_json") as string ?? "[]",
      },
    };
  }

  try {
    await adminUpdateSong(id, {
      title: values.title,
      slug: values.slug,
      number: values.number,
      category: values.category,
      key: values.key,
      lyrics_sections: values.sections,
    });
  } catch (err) {
    return {
      errors: { form: err instanceof Error ? err.message : "Gagal memperbarui lagu." },
      values: {
        title: values.title,
        slug: values.slug,
        number: values.number,
        category: values.category,
        key: values.key,
        sections_json: formData.get("sections_json") as string ?? "[]",
      },
    };
  }

  redirect("/admin/songs");
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteSongAction(id: string): Promise<{ error: string } | null> {
  await requireAuth();

  try {
    await adminDeleteSong(id);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Gagal menghapus lagu." };
  }

  redirect("/admin/songs");
}