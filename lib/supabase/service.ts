import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedServiceClient: SupabaseClient | null = null;

function normalizeSupabaseUrl(url: string): string {
  return url.replace(/\/rest\/v1\/?$/, "");
}

/**
 * Supabase client with service role — bypasses RLS.
 * Use ONLY on the server for user management (never in client code).
 */
export function getSupabaseServiceClient(): SupabaseClient {
  if (cachedServiceClient) {
    return cachedServiceClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL for admin user operations.",
    );
  }

  cachedServiceClient = createClient(normalizeSupabaseUrl(url), serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cachedServiceClient;
}
