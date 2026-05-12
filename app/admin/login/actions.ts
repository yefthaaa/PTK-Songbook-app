"use server";

import { redirect } from "next/navigation";
import { signInWithEmail } from "@/lib/auth/helpers";

export async function loginAction(formData: FormData): Promise<{ error: string; email: string } | never> {
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";
  const next = (formData.get("next") as string | null) ?? "/admin";

  // Basic server-side validation
  if (!email || !password) {
    return { error: "Email dan password wajib diisi.", email };
  }

  const error = await signInWithEmail(email, password);

  if (error) {
    return { error, email };
  }

  // Successful login → redirect to intended destination
  redirect(next);
}
