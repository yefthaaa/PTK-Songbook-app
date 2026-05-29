import { getSupabaseServerClient } from "@/lib/supabase/server";
import { mapSetlistRow } from "@/lib/setlist/map-setlist";
import type {
  SetlistDbRow,
  SetlistInsertInput,
  SetlistUpdateInput,
  ServiceSetlist,
} from "@/types/setlist";

const TABLE = "service_setlists";
const SELECT =
  "id,slug,title,service_date,notes,items,created_at,updated_at";

export async function adminGetSetlists(): Promise<ServiceSetlist[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select(SELECT)
    .order("service_date", { ascending: false, nullsFirst: false });

  if (error) throw new Error(`Gagal memuat setlist: ${error.message}`);
  return ((data ?? []) as Partial<SetlistDbRow>[]).map(mapSetlistRow);
}

export async function adminGetSetlistById(id: string): Promise<ServiceSetlist | null> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select(SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Gagal memuat setlist: ${error.message}`);
  if (!data) return null;
  return mapSetlistRow(data as Partial<SetlistDbRow>);
}

export async function adminCreateSetlist(
  payload: SetlistInsertInput,
): Promise<ServiceSetlist> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .select(SELECT)
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Slug setlist sudah digunakan.");
    }
    throw new Error(`Gagal membuat setlist: ${error.message}`);
  }
  return mapSetlistRow(data as Partial<SetlistDbRow>);
}

export async function adminUpdateSetlist(
  id: string,
  payload: SetlistUpdateInput,
): Promise<ServiceSetlist> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select(SELECT)
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Slug setlist sudah digunakan.");
    }
    throw new Error(`Gagal memperbarui setlist: ${error.message}`);
  }
  return mapSetlistRow(data as Partial<SetlistDbRow>);
}

export async function adminDeleteSetlist(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(`Gagal menghapus setlist: ${error.message}`);
}
