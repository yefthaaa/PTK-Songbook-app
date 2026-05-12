"use client";

import { useActionState, useRef } from "react";
import { loginAction } from "./actions";

type LoginState = { error: string; email: string } | null;

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    async (_prev, formData) => {
      const result = await loginAction(formData);
      // loginAction either returns an error object or calls redirect() (no return)
      return result ?? null;
    },
    null,
  );

  const passwordRef = useRef<HTMLInputElement>(null);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {/* hidden field to carry redirect target through the action */}
      <input type="hidden" name="next" value={next} />

      {/* Error banner */}
      {state?.error ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-rose-200/80 bg-rose-50/80 px-4 py-3.5 text-sm text-rose-700 backdrop-blur-sm dark:border-rose-800/50 dark:bg-rose-950/50 dark:text-rose-300"
        >
          <svg
            className="mt-0.5 h-4 w-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{state.error}</span>
        </div>
      ) : null}

      {/* Email field */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state?.email ?? ""}
          required
          disabled={isPending}
          placeholder="admin@gereja.org"
          className="w-full rounded-xl border border-teal-100 bg-white/80 px-4 py-3 text-sm text-slate-800 outline-none ring-0 transition-all placeholder:text-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 disabled:opacity-60 dark:border-teal-900/40 dark:bg-slate-800/70 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-500"
        />
      </div>

      {/* Password field */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400"
        >
          Password
        </label>
        <input
          ref={passwordRef}
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isPending}
          placeholder="••••••••"
          className="w-full rounded-xl border border-teal-100 bg-white/80 px-4 py-3 text-sm text-slate-800 outline-none ring-0 transition-all placeholder:text-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 disabled:opacity-60 dark:border-teal-900/40 dark:bg-slate-800/70 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-500"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-16px_rgba(13,148,136,0.9)] transition-all duration-200 hover:from-teal-400 hover:to-emerald-400 hover:shadow-[0_16px_32px_-14px_rgba(13,148,136,0.8)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Masuk...
          </span>
        ) : (
          "Masuk ke Dashboard"
        )}
      </button>
    </form>
  );
}
