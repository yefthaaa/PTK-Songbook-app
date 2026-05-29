import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserProfile, ProfileDbRow } from "@/types/auth";
import { mapProfileRow } from "@/types/auth";

/**
 * Load user profile in middleware using the session-aware Supabase client.
 */
export async function getProfileFromSupabase(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,full_name,role,created_at")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapProfileRow(data as ProfileDbRow);
}
