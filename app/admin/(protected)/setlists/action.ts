"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requirePermission, isAuthError } from "@/lib/auth/helpers";
import { FORBIDDEN_MESSAGE } from "@/lib/auth/errors";
import { canManageSetlists, canDeleteSetlist } from "@/lib/auth/permissions";
import {
  adminCreateSetlist,
  adminUpdateSetlist,
  adminDeleteSetlist,
} from "@/services/admin-setlists-service";
import {
  parseSetlistFormData,
  validateSetlistForm,
  hasSetlistErrors,
  generateSlug,
  type SetlistValidationErrors,
} from "@/lib/validation/setlist-validation";

export type SetlistActionState = {
  errors: SetlistValidationErrors;
  values: Record<string, string>;
} | null;

function toFormValues(formData: FormData, values: ReturnType<typeof parseSetlistFormData>) {
  return {
    title: values.title,
    slug: values.slug,
    service_date: values.serviceDate,
    notes: values.notes,
    items_json: (formData.get("items_json") as string) ?? "[]",
  };
}

export async function createSetlistAction(
  _prev: SetlistActionState,
  formData: FormData,
): Promise<SetlistActionState> {
  const values = parseSetlistFormData(formData);
  const formValues = toFormValues(formData, values);

  try {
    await requirePermission(canManageSetlists);
  } catch (err) {
    if (isAuthError(err)) {
      return { errors: { form: err.message }, values: formValues };
    }
    throw err;
  }

  const errors = validateSetlistForm(values);
  if (hasSetlistErrors(errors)) {
    return { errors, values: formValues };
  }

  try {
    await adminCreateSetlist({
      title: values.title,
      slug: values.slug || generateSlug(values.title),
      service_date: values.serviceDate || null,
      notes: values.notes || null,
      items: values.items.map((item, i) => ({ ...item, order: i })),
    });
  } catch (err) {
    return {
      errors: { form: err instanceof Error ? err.message : "Gagal menyimpan setlist." },
      values: formValues,
    };
  }

  revalidatePath("/setlist");
  redirect("/admin/setlists");
}

export async function updateSetlistAction(
  id: string,
  _prev: SetlistActionState,
  formData: FormData,
): Promise<SetlistActionState> {
  const values = parseSetlistFormData(formData);
  const formValues = toFormValues(formData, values);

  try {
    await requirePermission(canManageSetlists);
  } catch (err) {
    if (isAuthError(err)) {
      return { errors: { form: err.message }, values: formValues };
    }
    throw err;
  }

  const errors = validateSetlistForm(values);
  if (hasSetlistErrors(errors)) {
    return { errors, values: formValues };
  }

  try {
    await adminUpdateSetlist(id, {
      title: values.title,
      slug: values.slug,
      service_date: values.serviceDate || null,
      notes: values.notes || null,
      items: values.items.map((item, i) => ({ ...item, order: i })),
    });
  } catch (err) {
    return {
      errors: { form: err instanceof Error ? err.message : "Gagal memperbarui setlist." },
      values: formValues,
    };
  }

  revalidatePath("/setlist");
  redirect("/admin/setlists");
}

export async function deleteSetlistAction(id: string): Promise<{ error: string } | null> {
  try {
    await requirePermission(canDeleteSetlist);
    await adminDeleteSetlist(id);
    revalidatePath("/setlist");
    revalidatePath("/admin/setlists");
    return null;
  } catch (err) {
    if (isAuthError(err)) {
      return { error: err.message };
    }
    return { error: err instanceof Error ? err.message : "Gagal menghapus setlist." };
  }
}
