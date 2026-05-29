"use server";

import { revalidatePath } from "next/cache";
import {
  requirePermission,
  requireSuperAdmin,
  isAuthError,
} from "@/lib/auth/helpers";
import { FORBIDDEN_MESSAGE } from "@/lib/auth/errors";
import {
  canCreateUser,
  canDeleteTargetUser,
  canModifyTargetUser,
  canManageUsers,
} from "@/lib/auth/permissions";
import {
  adminCountSuperAdmins,
  adminCreateUser,
  adminDeleteUser,
  adminGetUserById,
  adminUpdateUserRole,
} from "@/services/admin-users-service";
import type { UserRole } from "@/types/auth";
import { USER_ROLES } from "@/lib/auth/permissions";

export type UserActionResult = { error: string } | { success: true };

export type CreateUserFormErrors = {
  email?: string;
  password?: string;
  fullName?: string;
  role?: string;
  form?: string;
};

export type CreateUserActionState = {
  errors: CreateUserFormErrors;
  values: {
    email: string;
    fullName: string;
    role: string;
  };
} | { success: true } | null;

function actionError(message: string): UserActionResult {
  return { error: message };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateCreateUserForm(values: {
  email: string;
  password: string;
  fullName: string;
  role: string;
}): CreateUserFormErrors {
  const errors: CreateUserFormErrors = {};

  if (!values.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = "Format email tidak valid.";
  }

  if (!values.password) {
    errors.password = "Password wajib diisi.";
  } else if (values.password.length < 8) {
    errors.password = "Password minimal 8 karakter.";
  }

  if (!USER_ROLES.includes(values.role as UserRole)) {
    errors.role = "Role tidak valid.";
  }

  return errors;
}

function hasCreateUserErrors(errors: CreateUserFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

export async function createUserAction(
  _prev: CreateUserActionState,
  formData: FormData,
): Promise<CreateUserActionState> {
  try {
    await requirePermission(canCreateUser);
  } catch (err) {
    if (isAuthError(err)) {
      return {
        errors: { form: err.message },
        values: {
          email: (formData.get("email") as string) ?? "",
          fullName: (formData.get("full_name") as string) ?? "",
          role: (formData.get("role") as string) ?? "viewer",
        },
      };
    }
    throw err;
  }

  const values = {
    email: (formData.get("email") as string | null)?.trim() ?? "",
    password: (formData.get("password") as string | null) ?? "",
    fullName: (formData.get("full_name") as string | null)?.trim() ?? "",
    role: (formData.get("role") as string | null) ?? "viewer",
  };

  const formValues = {
    email: values.email,
    fullName: values.fullName,
    role: values.role,
  };

  const errors = validateCreateUserForm(values);
  if (hasCreateUserErrors(errors)) {
    return { errors, values: formValues };
  }

  try {
    await adminCreateUser({
      email: values.email,
      password: values.password,
      fullName: values.fullName || undefined,
      role: values.role as UserRole,
    });
  } catch (err) {
    return {
      errors: {
        form: err instanceof Error ? err.message : "Gagal menambahkan pengguna.",
      },
      values: formValues,
    };
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserRoleAction(
  userId: string,
  role: string,
): Promise<UserActionResult> {
  try {
    const { profile: actor } = await requirePermission(canManageUsers);

    if (!USER_ROLES.includes(role as UserRole)) {
      return actionError("Role tidak valid.");
    }

    const target = await adminGetUserById(userId);
    if (!target) {
      return actionError("Pengguna tidak ditemukan.");
    }

    if (!canModifyTargetUser(actor, target)) {
      return actionError(FORBIDDEN_MESSAGE);
    }

    if (target.role === "super_admin" && role !== "super_admin") {
      const count = await adminCountSuperAdmins();
      if (count <= 1) {
        return actionError(
          "Tidak dapat mengubah role Super Admin terakhir. Tambahkan Super Admin lain terlebih dahulu.",
        );
      }
    }

    await adminUpdateUserRole(userId, role as UserRole);
    revalidatePath("/admin/users");
    return { success: true };
  } catch (err) {
    if (isAuthError(err)) {
      return actionError(err.message);
    }
    return actionError(err instanceof Error ? err.message : "Gagal memperbarui role.");
  }
}

export async function deleteUserAction(userId: string): Promise<UserActionResult> {
  try {
    const { profile: actor } = await requireSuperAdmin();

    const target = await adminGetUserById(userId);
    if (!target) {
      return actionError("Pengguna tidak ditemukan.");
    }

    if (!canDeleteTargetUser(actor, target)) {
      return actionError(FORBIDDEN_MESSAGE);
    }

    if (target.role === "super_admin") {
      const count = await adminCountSuperAdmins();
      if (count <= 1) {
        return actionError(
          "Tidak dapat menghapus Super Admin terakhir. Tambahkan Super Admin lain terlebih dahulu.",
        );
      }
    }

    await adminDeleteUser(userId);
    revalidatePath("/admin/users");
    return { success: true };
  } catch (err) {
    if (isAuthError(err)) {
      return actionError(err.message);
    }
    return actionError(err instanceof Error ? err.message : "Gagal menghapus pengguna.");
  }
}
