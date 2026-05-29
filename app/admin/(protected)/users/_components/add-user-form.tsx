"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createUserAction, type CreateUserActionState } from "../actions";
import { USER_ROLES, ROLE_LABELS } from "@/lib/auth/permissions";
import type { UserRole } from "@/types/auth";

const defaultValues = {
  email: "",
  fullName: "",
  role: "viewer" as UserRole,
};

export function AddUserForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<CreateUserActionState, FormData>(
    async (_prev, formData) => createUserAction(_prev, formData),
    null,
  );

  useEffect(() => {
    if (state && "success" in state && state.success) {
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  const values =
    state && "values" in state
      ? state.values
      : defaultValues;

  const errors = state && "errors" in state ? state.errors : {};

  return (
    <div className="rounded-2xl border border-white/80 bg-white/80 shadow-[0_10px_30px_-20px_rgba(13,148,136,0.35)] backdrop-blur-sm dark:border-teal-900/30 dark:bg-slate-900/70">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Tambah Pengguna Baru
          </p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Buat akun login untuk admin, editor, atau jemaat
          </p>
        </div>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-teal-100 bg-teal-50 text-teal-700 transition-transform dark:border-teal-900/40 dark:bg-teal-900/30 dark:text-teal-300 ${open ? "rotate-180" : ""}`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {open ? (
        <form action={formAction} className="space-y-4 border-t border-teal-100/70 px-5 py-5 dark:border-teal-900/40">
          {state && "success" in state && state.success ? (
            <div
              role="status"
              className="rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm font-semibold text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
            >
              Pengguna berhasil ditambahkan.
            </div>
          ) : null}

          {errors.form ? (
            <div
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
            >
              {errors.form}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="user-email" className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                Email <span className="text-rose-500">*</span>
              </label>
              <input
                id="user-email"
                name="email"
                type="email"
                required
                autoComplete="off"
                defaultValue={values.email}
                disabled={isPending}
                placeholder="nama@email.com"
                className="w-full rounded-xl border border-teal-100 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 disabled:opacity-60 dark:border-teal-900/40 dark:bg-slate-800 dark:text-slate-100"
              />
              {errors.email ? (
                <p className="text-xs text-rose-600 dark:text-rose-400">{errors.email}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="user-full-name" className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                Nama lengkap
              </label>
              <input
                id="user-full-name"
                name="full_name"
                type="text"
                autoComplete="off"
                defaultValue={values.fullName}
                disabled={isPending}
                placeholder="Nama tampilan"
                className="w-full rounded-xl border border-teal-100 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 disabled:opacity-60 dark:border-teal-900/40 dark:bg-slate-800 dark:text-slate-100"
              />
              {errors.fullName ? (
                <p className="text-xs text-rose-600 dark:text-rose-400">{errors.fullName}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="user-role" className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                Role <span className="text-rose-500">*</span>
              </label>
              <select
                id="user-role"
                name="role"
                required
                defaultValue={values.role}
                disabled={isPending}
                className="w-full rounded-xl border border-teal-100 bg-white px-4 py-2.5 text-sm font-semibold text-teal-700 outline-none focus:border-teal-400 dark:border-teal-900/40 dark:bg-slate-800 dark:text-teal-300"
              >
                {USER_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </option>
                ))}
              </select>
              {errors.role ? (
                <p className="text-xs text-rose-600 dark:text-rose-400">{errors.role}</p>
              ) : null}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="user-password" className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                Password awal <span className="text-rose-500">*</span>
              </label>
              <input
                id="user-password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                disabled={isPending}
                placeholder="Minimal 8 karakter"
                className="w-full rounded-xl border border-teal-100 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 disabled:opacity-60 dark:border-teal-900/40 dark:bg-slate-800 dark:text-slate-100"
              />
              {errors.password ? (
                <p className="text-xs text-rose-600 dark:text-rose-400">{errors.password}</p>
              ) : (
                <p className="text-xs text-slate-400">
                  Bagikan password ini kepada pengguna; mereka bisa menggantinya nanti di Supabase jika diaktifkan.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_-14px_rgba(13,148,136,0.9)] transition-all hover:from-teal-400 hover:to-emerald-400 disabled:opacity-70"
            >
              {isPending ? "Menyimpan..." : "Simpan Pengguna"}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => setOpen(false)}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              Batal
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
