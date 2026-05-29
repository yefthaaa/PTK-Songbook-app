import type { UserRole, UserProfile } from "@/types/auth";

export const USER_ROLES = [
  "super_admin",
  "admin",
  "editor",
  "viewer",
] as const satisfies readonly UserRole[];

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer / Jemaat",
};

export function hasRole(
  user: Pick<UserProfile, "role"> | null | undefined,
  roles: UserRole | UserRole[],
): boolean {
  if (!user) return false;
  const allowed = Array.isArray(roles) ? roles : [roles];
  return allowed.includes(user.role);
}

export function canAccessAdmin(
  user: Pick<UserProfile, "role"> | null | undefined,
): boolean {
  return hasRole(user, ["super_admin", "admin", "editor"]);
}

export function canManageUsers(
  user: Pick<UserProfile, "role"> | null | undefined,
): boolean {
  return hasRole(user, "super_admin");
}

export function canCreateUser(
  user: Pick<UserProfile, "role"> | null | undefined,
): boolean {
  return canManageUsers(user);
}

export function canCreateSong(
  user: Pick<UserProfile, "role"> | null | undefined,
): boolean {
  return hasRole(user, ["super_admin", "admin", "editor"]);
}

export function canEditSong(
  user: Pick<UserProfile, "role"> | null | undefined,
): boolean {
  return canCreateSong(user);
}

export function canDeleteSong(
  user: Pick<UserProfile, "role"> | null | undefined,
): boolean {
  return hasRole(user, ["super_admin", "admin"]);
}

export function canManageSetlists(
  user: Pick<UserProfile, "role"> | null | undefined,
): boolean {
  return canCreateSong(user);
}

export function canDeleteSetlist(
  user: Pick<UserProfile, "role"> | null | undefined,
): boolean {
  return canDeleteSong(user);
}

export function canImportSongs(
  user: Pick<UserProfile, "role"> | null | undefined,
): boolean {
  return hasRole(user, ["super_admin", "admin"]);
}

export function canExportSongs(
  user: Pick<UserProfile, "role"> | null | undefined,
): boolean {
  return canAccessAdmin(user);
}

/** Super Admin may modify any user; Admin must not touch Super Admin accounts. */
export function canModifyTargetUser(
  actor: Pick<UserProfile, "role" | "id">,
  target: Pick<UserProfile, "role" | "id">,
): boolean {
  if (!canManageUsers(actor)) return false;
  if (actor.id === target.id) return false;
  if (target.role === "super_admin" && actor.role !== "super_admin") return false;
  return true;
}

export function canDeleteTargetUser(
  actor: Pick<UserProfile, "role" | "id">,
  target: Pick<UserProfile, "role" | "id">,
): boolean {
  if (!canManageUsers(actor)) return false;
  if (actor.id === target.id) return false;
  if (target.role === "super_admin" && actor.role !== "super_admin") return false;
  return true;
}
