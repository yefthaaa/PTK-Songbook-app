import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  AuthError,
  FORBIDDEN_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from "@/lib/auth/errors";
import { canAccessAdmin } from "@/lib/auth/permissions";
import type { UserProfile, ProfileDbRow } from "@/types/auth";
import { mapProfileRow } from "@/types/auth";
import type { Session, User } from "@supabase/supabase-js";

export type AuthResult =
  | { user: User; session: Session; profile: UserProfile; error: null }
  | { user: null; session: null; profile: null; error: string };

export type SignInResult =
  | { error: string }
  | { userId: string };

async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await getSupabaseServerClient();
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

/**
 * Returns the current session and profile without redirecting.
 */
export async function getSession(): Promise<AuthResult> {
  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        user: null,
        session: null,
        profile: null,
        error: userError?.message ?? "No session",
      };
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const profile = await fetchProfile(user.id);
    if (!profile) {
      return {
        user: null,
        session: null,
        profile: null,
        error: "Profil pengguna tidak ditemukan. Pastikan migration database sudah dijalankan.",
      };
    }

    return {
      user,
      session: session ?? ({ user } as Session),
      profile,
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Auth error";
    return { user: null, session: null, profile: null, error: message };
  }
}

/**
 * Requires an authenticated session with a valid profile.
 */
export async function requireAuth(): Promise<{
  user: User;
  session: Session;
  profile: UserProfile;
}> {
  const result = await getSession();

  if (result.error || !result.user || !result.profile) {
    redirect("/admin/login");
  }

  return {
    user: result.user,
    session: result.session,
    profile: result.profile,
  };
}

/**
 * Requires admin-area access (super_admin, admin, editor).
 */
export async function requireAdminAccess(): Promise<{
  user: User;
  session: Session;
  profile: UserProfile;
}> {
  const auth = await requireAuth();

  if (!canAccessAdmin(auth.profile)) {
    redirect("/admin/akses-ditolak");
  }

  return auth;
}

/**
 * Requires Super Admin for user management.
 */
export async function requireSuperAdmin(): Promise<{
  user: User;
  session: Session;
  profile: UserProfile;
}> {
  const auth = await requireAdminAccess();

  if (auth.profile.role !== "super_admin") {
    redirect("/admin/akses-ditolak");
  }

  return auth;
}

type PermissionCheck = (profile: UserProfile) => boolean;

/**
 * For Server Actions — throws AuthError (401/403) instead of redirecting.
 */
export async function requirePermission(
  check: PermissionCheck,
  options?: { forbiddenMessage?: string },
): Promise<{ user: User; session: Session; profile: UserProfile }> {
  const result = await getSession();

  if (result.error || !result.user || !result.profile) {
    throw new AuthError(UNAUTHORIZED_MESSAGE, 401);
  }

  if (!check(result.profile)) {
    throw new AuthError(options?.forbiddenMessage ?? FORBIDDEN_MESSAGE, 403);
  }

  return {
    user: result.user,
    session: result.session,
    profile: result.profile,
  };
}

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}

/**
 * Server Action: sign in with email + password.
 * Returns user id from sign-in response (reliable before cookies propagate).
 */
export async function signInWithEmail(
  email: string,
  password: string,
): Promise<SignInResult> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes("invalid login")) {
      return { error: "Email atau password salah. Silakan coba lagi." };
    }
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return { error: "Email belum dikonfirmasi. Periksa inbox email kamu." };
    }
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "Login gagal. Silakan coba lagi." };
  }

  return { userId: data.user.id };
}

export async function signOut(): Promise<void> {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
}

/** Fetch profile for middleware (no redirect). */
export async function getProfileForUserId(
  userId: string,
): Promise<UserProfile | null> {
  return fetchProfile(userId);
}
