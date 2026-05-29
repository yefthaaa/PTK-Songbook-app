"use client";

import { useTransition, useState } from "react";
import { updateUserRoleAction } from "../actions";
import type { UserRole } from "@/types/auth";
import { USER_ROLES, ROLE_LABELS } from "@/lib/auth/permissions";

type UserRoleSelectProps = {
  userId: string;
  currentRole: UserRole;
  disabled?: boolean;
};

export function UserRoleSelect({ userId, currentRole, disabled }: UserRoleSelectProps) {
  const [isPending, startTransition] = useTransition();
  const [role, setRole] = useState(currentRole);
  const [error, setError] = useState<string | null>(null);

  function handleChange(nextRole: UserRole) {
    setRole(nextRole);
    setError(null);
    startTransition(async () => {
      const result = await updateUserRoleAction(userId, nextRole);
      if ("error" in result) {
        setError(result.error);
        setRole(currentRole);
      }
    });
  }

  return (
    <div className="space-y-1">
      <select
        value={role}
        disabled={disabled || isPending}
        onChange={(e) => handleChange(e.target.value as UserRole)}
        className="rounded-lg border border-teal-100 bg-white px-2.5 py-1.5 text-xs font-semibold text-teal-700 outline-none focus:border-teal-400 disabled:opacity-60 dark:border-teal-900/40 dark:bg-slate-800 dark:text-teal-300"
      >
        {USER_ROLES.map((r) => (
          <option key={r} value={r}>
            {ROLE_LABELS[r]}
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-[10px] text-rose-600 dark:text-rose-400">{error}</p>
      ) : null}
      {isPending ? (
        <p className="text-[10px] text-slate-400">Menyimpan...</p>
      ) : null}
    </div>
  );
}
