export type SongCategory = "Pujian" | "Penyembahan" | "Syukur" | "Doa" | "Natal";

export const SONG_CATEGORIES = [
  "Semua",
  "Pujian",
  "Penyembahan",
  "Syukur",
  "Doa",
  "Natal",
] as const;

export type LyricSectionType =
  | "verse-1"
  | "verse-2"
  | "chorus"
  | "reff"
  | "bridge"
  | "ending";

export type LyricSection = {
  type: LyricSectionType;
  title: string;
  lines: string[];
};

export type Song = {
  id: string;
  slug: string;
  title: string;
  category: SongCategory;
  number: string;
  key: string;
  sections: LyricSection[];
  createdAt?: string;
};

export type SongFilters = {
  query?: string;
  category?: SongCategory | "Semua";
};

export type SongDbRow = {
  id: string;
  title: string;
  slug: string;
  number: string;
  category: SongCategory;
  key: string;
  lyrics_sections: unknown;
  created_at: string | null;
};

export type SongInsertInput = {
  title: string;
  slug: string;
  number: string;
  category: SongCategory;
  key: string;
  lyrics_sections: LyricSection[];
};

export type SongUpdateInput = Partial<SongInsertInput>;

