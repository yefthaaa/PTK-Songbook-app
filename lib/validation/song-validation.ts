import type { LyricSection, LyricSectionType, SongCategory } from "@/types/song";
import { SONG_CATEGORIES } from "@/types/song";
import { isValidAudioUrl, isValidYouTubeUrl } from "@/lib/youtube";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SongFormValues = {
  title: string;
  slug: string;
  number: string;
  category: SongCategory;
  key: string;
  sections: LyricSection[];
  youtubeUrl: string;
  audioUrl: string;
};

export type SongValidationErrors = Partial<Record<keyof SongFormValues | "form", string>>;

// ─── Slug helpers ─────────────────────────────────────────────────────────────

/**
 * Converts a song title to a URL-safe slug.
 * e.g. "Hai Pujilah Tuhan" → "hai-pujilah-tuhan"
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── Validation ───────────────────────────────────────────────────────────────

const VALID_CATEGORIES = SONG_CATEGORIES.filter((c) => c !== "Semua") as SongCategory[];

const MUSICAL_KEYS = [
  "C", "C#", "Db", "D", "D#", "Eb", "E", "F",
  "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B",
  "Cm", "Dm", "Em", "Fm", "Gm", "Am", "Bm",
];

const VALID_SECTION_TYPES: LyricSectionType[] = [
  "verse-1", "verse-2", "chorus", "reff", "bridge", "ending",
];

export function validateSongForm(values: SongFormValues): SongValidationErrors {
  const errors: SongValidationErrors = {};

  // Title
  if (!values.title.trim()) {
    errors.title = "Judul lagu wajib diisi.";
  } else if (values.title.trim().length > 200) {
    errors.title = "Judul maksimal 200 karakter.";
  }

  // Slug
  if (!values.slug.trim()) {
    errors.slug = "Slug wajib diisi.";
  } else if (!/^[a-z0-9-]+$/.test(values.slug.trim())) {
    errors.slug = "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.";
  } else if (values.slug.trim().length > 200) {
    errors.slug = "Slug maksimal 200 karakter.";
  }

  // Number
  if (!values.number.trim()) {
    errors.number = "Nomor lagu wajib diisi.";
  }

  // Category
  if (!VALID_CATEGORIES.includes(values.category)) {
    errors.category = "Pilih kategori yang valid.";
  }

  // Key
  if (!values.key.trim()) {
    errors.key = "Nada dasar wajib diisi.";
  }

  if (values.youtubeUrl.trim() && !isValidYouTubeUrl(values.youtubeUrl)) {
    errors.youtubeUrl = "URL YouTube tidak valid.";
  }

  if (values.audioUrl.trim() && !isValidAudioUrl(values.audioUrl)) {
    errors.audioUrl = "URL audio harus berupa link http(s) yang valid.";
  }

  // Sections
  if (values.sections.length === 0) {
    errors.sections = "Minimal satu bagian lirik harus diisi.";
  } else {
    for (let i = 0; i < values.sections.length; i++) {
      const section = values.sections[i];
      if (!section) continue;

      if (!VALID_SECTION_TYPES.includes(section.type)) {
        errors.sections = `Bagian ke-${i + 1}: tipe tidak valid.`;
        break;
      }
      if (!section.title.trim()) {
        errors.sections = `Bagian ke-${i + 1}: judul bagian wajib diisi.`;
        break;
      }
      if (section.lines.length === 0 || section.lines.every((l) => !l.trim())) {
        errors.sections = `Bagian ke-${i + 1} "${section.title}": lirik tidak boleh kosong.`;
        break;
      }
    }
  }

  return errors;
}

export function hasErrors(errors: SongValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

// ─── FormData parser ──────────────────────────────────────────────────────────

/**
 * Parses raw FormData from the SongForm into typed SongFormValues.
 * Sections are encoded as JSON in a hidden field.
 */
export function parseSongFormData(formData: FormData): SongFormValues {
  const rawSections = formData.get("sections_json");
  let sections: LyricSection[] = [];
  try {
    const parsed = JSON.parse(typeof rawSections === "string" ? rawSections : "[]");
    sections = Array.isArray(parsed) ? parsed : [];
  } catch {
    sections = [];
  }

  return {
    title: ((formData.get("title") as string | null) ?? "").trim(),
    slug: ((formData.get("slug") as string | null) ?? "").trim(),
    number: ((formData.get("number") as string | null) ?? "").trim(),
    category: ((formData.get("category") as string | null) ?? "Pujian") as SongCategory,
    key: ((formData.get("key") as string | null) ?? "").trim(),
    sections,
    youtubeUrl: ((formData.get("youtube_url") as string | null) ?? "").trim(),
    audioUrl: ((formData.get("audio_url") as string | null) ?? "").trim(),
  };
}

export { MUSICAL_KEYS, VALID_SECTION_TYPES };