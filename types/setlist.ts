export type SetlistItem = {
  songId: string;
  songSlug: string;
  songTitle: string;
  songNumber: string;
  songKey: string;
  order: number;
  notes?: string;
};

export type ServiceSetlist = {
  id: string;
  slug: string;
  title: string;
  serviceDate: string | null;
  notes: string | null;
  items: SetlistItem[];
  createdAt: string | null;
  updatedAt: string | null;
};

export type SetlistDbRow = {
  id: string;
  slug: string;
  title: string;
  service_date: string | null;
  notes: string | null;
  items: unknown;
  created_at: string | null;
  updated_at: string | null;
};

export type SetlistInsertInput = {
  title: string;
  slug: string;
  service_date?: string | null;
  notes?: string | null;
  items: SetlistItem[];
};

export type SetlistUpdateInput = Partial<SetlistInsertInput>;
