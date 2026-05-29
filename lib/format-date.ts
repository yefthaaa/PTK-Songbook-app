const LOCALE = "id-ID";

function parseDate(iso: string): Date | null {
  const normalized = iso.includes("T") ? iso : `${iso}T12:00:00`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatServiceDate(
  iso: string | null,
  emptyLabel = "Tanggal belum diatur",
): string {
  if (!iso) return emptyLabel;
  const date = parseDate(iso);
  if (!date) return emptyLabel;
  return new Intl.DateTimeFormat(LOCALE, { dateStyle: "full" }).format(date);
}

export function formatServiceDateMedium(iso: string | null, emptyLabel = "—"): string {
  if (!iso) return emptyLabel;
  const date = parseDate(iso);
  if (!date) return emptyLabel;
  return new Intl.DateTimeFormat(LOCALE, { dateStyle: "medium" }).format(date);
}

export function formatDateTime(iso: string | null, emptyLabel = "—"): string {
  if (!iso) return emptyLabel;
  const date = parseDate(iso);
  if (!date) return emptyLabel;
  return new Intl.DateTimeFormat(LOCALE, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
