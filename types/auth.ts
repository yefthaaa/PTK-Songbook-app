import type { User } from "@supabase/supabase-js";

export type UserRole = "super_admin" | "admin" | "editor" | "viewer";

export type UserProfile = {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
  createdAt: string | null;
};

export type ProfileDbRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string | null;
};

export type AdminUser = {
  id: string;
  email: string;
  role: UserRole;
  fullName: string | null;
};

export function mapProfileRow(row: ProfileDbRow): UserProfile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    createdAt: row.created_at,
  };
}

export function toAdminUser(profile: UserProfile): AdminUser {
  return {
    id: profile.id,
    email: profile.email,
    role: profile.role,
    fullName: profile.fullName,
  };
}

/** @deprecated Use UserProfile from getCurrentUserProfile instead */
export function toAdminUserFromAuth(user: User): AdminUser {
  return {
    id: user.id,
    email: user.email ?? "(no email)",
    role: "viewer",
    fullName: null,
  };
}

export type LoginFormState = {
  error: string | null;
  email: string;
};
