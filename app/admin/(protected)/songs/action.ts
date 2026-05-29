"use server";

import { redirect } from "next/navigation";
import {
  requirePermission,
  isAuthError,
} from "@/lib/auth/helpers";
import { AuthError, FORBIDDEN_MESSAGE } from "@/lib/auth/errors";
import {
  canCreateSong,
  canEditSong,
  canDeleteSong,
} from "@/lib/auth/permissions";
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

function forbiddenState(values: Record<string, string>): SongActionState {
  return {
    errors: { form: FORBIDDEN_MESSAGE },
    values,
  };
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createSongAction(
  _prev: SongActionState,
  formData: FormData,
): Promise<SongActionState> {
  const values = parseSongFormData(formData);
  const formValues = {
    title: values.title,
    slug: values.slug,
    number: values.number,
    category: values.category,
    key: values.key,
    youtube_url: values.youtubeUrl,
    audio_url: values.audioUrl,
    sections_json: (formData.get("sections_json") as string) ?? "[]",
  };

  try {
    await requirePermission(canCreateSong);
  } catch (err) {
    if (isAuthError(err)) {
      return forbiddenState(formValues);
    }
    throw err;
  }

  const errors = validateSongForm(values);

  if (hasErrors(errors)) {
    return { errors, values: formValues };
  }

  try {
    await adminCreateSong({
      title: values.title,
      slug: values.slug || generateSlug(values.title),
      number: values.number,
      category: values.category,
      key: values.key,
      lyrics_sections: values.sections,
      youtube_url: values.youtubeUrl || null,
      audio_url: values.audioUrl || null,
    });
  } catch (err) {
    return {
      errors: { form: err instanceof Error ? err.message : "Gagal menyimpan lagu." },
      values: formValues,
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
  const values = parseSongFormData(formData);
  const formValues = {
    title: values.title,
    slug: values.slug,
    number: values.number,
    category: values.category,
    key: values.key,
    youtube_url: values.youtubeUrl,
    audio_url: values.audioUrl,
    sections_json: (formData.get("sections_json") as string) ?? "[]",
  };

  try {
    await requirePermission(canEditSong);
  } catch (err) {
    if (isAuthError(err)) {
      return forbiddenState(formValues);
    }
    throw err;
  }

  const errors = validateSongForm(values);

  if (hasErrors(errors)) {
    return { errors, values: formValues };
  }

  try {
    await adminUpdateSong(id, {
      title: values.title,
      slug: values.slug,
      number: values.number,
      category: values.category,
      key: values.key,
      lyrics_sections: values.sections,
      youtube_url: values.youtubeUrl || null,
      audio_url: values.audioUrl || null,
    });
  } catch (err) {
    return {
      errors: { form: err instanceof Error ? err.message : "Gagal memperbarui lagu." },
      values: formValues,
    };
  }

  redirect("/admin/songs");
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteSongAction(id: string): Promise<{ error: string } | null> {
  try {
    await requirePermission(canDeleteSong);
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: err.message };
    }
    throw err;
  }

  try {
    await adminDeleteSong(id);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Gagal menghapus lagu." };
  }

  redirect("/admin/songs");
}
