export type SongCategory = "Pujian" | "Penyembahan";

export const SONG_CATEGORIES = ["Semua", "Pujian", "Penyembahan"] as const;

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
  youtubeUrl?: string | null;
  audioUrl?: string | null;
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
  youtube_url?: string | null;
  audio_url?: string | null;
  created_at: string | null;
};

export type SongInsertInput = {
  title: string;
  slug: string;
  number: string;
  category: SongCategory;
  key: string;
  lyrics_sections: LyricSection[];
  youtube_url?: string | null;
  audio_url?: string | null;
};

/** JSON export/import bundle shape */
export type SongExportRecord = {
  title: string;
  slug: string;
  number: string;
  category: SongCategory;
  key: string;
  lyrics_sections: LyricSection[];
  youtube_url?: string | null;
  audio_url?: string | null;
};

export type SongsExportBundle = {
  version: 1;
  exported_at: string;
  songs: SongExportRecord[];
};

export type SongUpdateInput = Partial<SongInsertInput>;

