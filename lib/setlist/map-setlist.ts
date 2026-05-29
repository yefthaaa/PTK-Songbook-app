import type { SetlistDbRow, SetlistItem, ServiceSetlist } from "@/types/setlist";

export function normalizeSetlistItems(value: unknown): SetlistItem[] {
  if (!Array.isArray(value)) return [];

  const items: SetlistItem[] = [];
  value.forEach((raw, index) => {
    if (!raw || typeof raw !== "object") return;
    const item = raw as Record<string, unknown>;
    const songSlug = typeof item.songSlug === "string" ? item.songSlug : "";
    const songTitle = typeof item.songTitle === "string" ? item.songTitle : "";
    if (!songSlug && !songTitle) return;

    items.push({
      songId: typeof item.songId === "string" ? item.songId : "",
      songSlug,
      songTitle,
      songNumber: typeof item.songNumber === "string" ? item.songNumber : "-",
      songKey: typeof item.songKey === "string" ? item.songKey : "-",
      order: typeof item.order === "number" ? item.order : index,
      notes: typeof item.notes === "string" ? item.notes : undefined,
    });
  });

  return items.sort((a, b) => a.order - b.order);
}

export function mapSetlistRow(row: Partial<SetlistDbRow>): ServiceSetlist {
  return {
    id: row.id ?? "",
    slug: row.slug ?? "",
    title: row.title ?? "Setlist",
    serviceDate: row.service_date ?? null,
    notes: row.notes ?? null,
    items: normalizeSetlistItems(row.items),
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
  };
}
