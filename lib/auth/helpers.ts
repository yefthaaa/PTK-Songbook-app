import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Session, User } from "@supabase/supabase-js";

export type AuthResult =
  | { user: User; session: Session; error: null }
  | { user: null; session: null; error: string };

/**
 * Returns the current session without redirecting.
 * Use in layouts/pages that need to check auth state conditionally.
 */
export async function getSession(): Promise<AuthResult> {
  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      return { user: null, session: null, error: error?.message ?? "No session" };
    }

    return { user: session.user, session, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Auth error";
    return { user: null, session: null, error: message };
  }
}

/**
 * Requires an authenticated session.
 * Redirects to /admin/login if unauthenticated.
 * Use at the top of protected Server Components / layouts.
 */
export async function requireAuth(): Promise<{ user: User; session: Session }> {
  const result = await getSession();

  if (result.error || !result.user) {
    redirect("/admin/login");
  }

  return { user: result.user, session: result.session };
}

/**
 * Server Action: sign in with email + password.
 * Returns an error message on failure, null on success.
 */
export async function signInWithEmail(
  email: string,
  password: string,
): Promise<string | null> {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Normalize Supabase error messages for the UI
    if (error.message.toLowerCase().includes("invalid login")) {
      return "Email atau password salah. Silakan coba lagi.";
    }
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return "Email belum dikonfirmasi. Periksa inbox email kamu.";
    }
    return error.message;
  }

  return null;
}

/**
 * Server Action: sign out the current user.
 */
export async function signOut(): Promise<void> {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
}
