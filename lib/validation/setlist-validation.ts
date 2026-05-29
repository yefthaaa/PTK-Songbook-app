import { generateSlug } from "@/lib/validation/song-validation";
import type { SetlistItem } from "@/types/setlist";

export type SetlistFormValues = {
  title: string;
  slug: string;
  serviceDate: string;
  notes: string;
  items: SetlistItem[];
};

export type SetlistValidationErrors = Partial<
  Record<keyof SetlistFormValues | "form", string>
>;

export function validateSetlistForm(values: SetlistFormValues): SetlistValidationErrors {
  const errors: SetlistValidationErrors = {};

  if (!values.title.trim()) {
    errors.title = "Judul setlist wajib diisi.";
  }

  if (!values.slug.trim()) {
    errors.slug = "Slug wajib diisi.";
  } else if (!/^[a-z0-9-]+$/.test(values.slug.trim())) {
    errors.slug = "Slug hanya huruf kecil, angka, dan tanda hubung.";
  }

  if (values.items.length === 0) {
    errors.items = "Tambahkan minimal satu lagu ke setlist.";
  }

  return errors;
}

export function hasSetlistErrors(errors: SetlistValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function parseSetlistFormData(formData: FormData): SetlistFormValues {
  let items: SetlistItem[] = [];
  try {
    const raw = formData.get("items_json");
    const parsed = JSON.parse(typeof raw === "string" ? raw : "[]");
    items = Array.isArray(parsed) ? parsed : [];
  } catch {
    items = [];
  }

  return {
    title: ((formData.get("title") as string | null) ?? "").trim(),
    slug: ((formData.get("slug") as string | null) ?? "").trim(),
    serviceDate: ((formData.get("service_date") as string | null) ?? "").trim(),
    notes: ((formData.get("notes") as string | null) ?? "").trim(),
    items,
  };
}

export { generateSlug };
