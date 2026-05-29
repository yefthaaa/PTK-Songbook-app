"use server";

import { getProfileForUserId, signInWithEmail } from "@/lib/auth/helpers";
import { canAccessAdmin } from "@/lib/auth/permissions";

export type LoginActionResult =
  | { ok: false; error: string; email: string }
  | { ok: true; redirectTo: string; email: string };

export async function loginAction(formData: FormData): Promise<LoginActionResult> {
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";
  const next = (formData.get("next") as string | null) ?? "/admin";

  if (!email || !password) {
    return { ok: false, error: "Email dan password wajib diisi.", email };
  }

  const signIn = await signInWithEmail(email, password);

  if ("error" in signIn) {
    return { ok: false, error: signIn.error, email };
  }

  const profile = await getProfileForUserId(signIn.userId);

  if (!profile) {
    return {
      ok: false,
      error: "Profil pengguna tidak ditemukan. Pastikan migration database sudah dijalankan di Supabase.",
      email,
    };
  }

  if (!canAccessAdmin(profile)) {
    return {
      ok: true,
      redirectTo: "/admin/akses-ditolak",
      email,
    };
  }

  const safeNext =
    next.startsWith("/admin") &&
    !next.startsWith("/admin/login") &&
    !next.startsWith("/admin/logout")
      ? next
      : "/admin";

  return { ok: true, redirectTo: safeNext, email };
}
