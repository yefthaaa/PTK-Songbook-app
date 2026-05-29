import { getSupabaseClient } from "@/lib/supabase/client";
import { mapSetlistRow } from "@/lib/setlist/map-setlist";
import type { SetlistDbRow, ServiceSetlist } from "@/types/setlist";

const TABLE = "service_setlists";

export async function getSetlists(): Promise<ServiceSetlist[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("id,slug,title,service_date,notes,items,created_at,updated_at")
    .order("service_date", { ascending: false, nullsFirst: false });

  if (error) {
    throw new Error(`Gagal memuat setlist: ${error.message}`);
  }

  return ((data ?? []) as Partial<SetlistDbRow>[]).map(mapSetlistRow);
}

export async function getSetlistBySlug(slug: string): Promise<ServiceSetlist | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("id,slug,title,service_date,notes,items,created_at,updated_at")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Gagal memuat setlist: ${error.message}`);
  }

  if (!data) return null;
  return mapSetlistRow(data as Partial<SetlistDbRow>);
}
