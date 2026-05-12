import type { User } from "@supabase/supabase-js";

export type AdminUser = {
  id: string;
  email: string;
};

export function toAdminUser(user: User): AdminUser {
  return {
    id: user.id,
    email: user.email ?? "(no email)",
  };
}

export type LoginFormState = {
  error: string | null;
  email: string;
};
