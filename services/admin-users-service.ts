/**
 * Admin Users Service — uses service role (server only).
 */
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import type { UserProfile, ProfileDbRow, UserRole } from "@/types/auth";
import { mapProfileRow } from "@/types/auth";

export type CreateUserInput = {
  email: string;
  password: string;
  fullName?: string;
  role: UserRole;
};

export async function adminListUsers(): Promise<UserProfile[]> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,full_name,role,created_at")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Gagal memuat daftar pengguna: ${error.message}`);
  }

  return ((data ?? []) as ProfileDbRow[]).map(mapProfileRow);
}

export async function adminGetUserById(id: string): Promise<UserProfile | null> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,full_name,role,created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Gagal memuat pengguna: ${error.message}`);
  }

  if (!data) return null;
  return mapProfileRow(data as ProfileDbRow);
}

export async function adminCreateUser(input: CreateUserInput): Promise<UserProfile> {
  const supabase = getSupabaseServiceClient();
  const email = input.email.trim().toLowerCase();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: input.password,
    email_confirm: true,
    user_metadata: {
      full_name: input.fullName?.trim() ?? "",
    },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
      throw new Error("Email sudah terdaftar. Gunakan email lain.");
    }
    throw new Error(`Gagal membuat akun: ${error.message}`);
  }

  if (!data.user) {
    throw new Error("Gagal membuat akun pengguna.");
  }

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: data.user.id,
      email,
      full_name: input.fullName?.trim() || null,
      role: input.role,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (profileError) {
    await supabase.auth.admin.deleteUser(data.user.id);
    throw new Error(`Gagal menyimpan profil: ${profileError.message}`);
  }

  const profile = await adminGetUserById(data.user.id);
  if (!profile) {
    throw new Error("Akun dibuat tetapi profil tidak ditemukan.");
  }

  return profile;
}

export async function adminUpdateUserRole(
  userId: string,
  role: UserRole,
): Promise<void> {
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) {
    throw new Error(`Gagal memperbarui role: ${error.message}`);
  }
}

export async function adminCountSuperAdmins(): Promise<number> {
  const supabase = getSupabaseServiceClient();
  const { count, error } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "super_admin");

  if (error) {
    throw new Error(`Gagal menghitung Super Admin: ${error.message}`);
  }

  return count ?? 0;
}

export async function adminDeleteUser(userId: string): Promise<void> {
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    throw new Error(`Gagal menghapus pengguna: ${error.message}`);
  }
}
