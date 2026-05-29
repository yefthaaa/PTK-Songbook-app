import { requireSuperAdmin } from "@/lib/auth/helpers";
import { ROLE_LABELS, canModifyTargetUser, canDeleteTargetUser } from "@/lib/auth/permissions";
import { adminListUsers } from "@/services/admin-users-service";
import { AddUserForm } from "./_components/add-user-form";
import { UserRoleSelect } from "./_components/user-role-select";
import { DeleteUserButton } from "./_components/delete-user-button";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default async function AdminUsersPage() {
  const { profile: actor } = await requireSuperAdmin();
  const users = await adminListUsers();

  return (
    <div className="space-y-6 motion-safe:animate-[fade-slide_.35s_ease-out]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700/70 dark:text-teal-400/70">
          Super Admin
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Manajemen User
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {users.length} pengguna terdaftar
        </p>
      </div>

      <AddUserForm />

      {users.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-teal-200/70 bg-white/60 p-8 text-center dark:border-teal-900/30 dark:bg-slate-900/50">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Belum ada pengguna lain. Gunakan form di atas untuk menambahkan akun.
          </p>
        </div>
      ) : null}

      {users.length > 0 ? (
      <div className="hidden overflow-hidden rounded-2xl border border-white/80 bg-white/80 shadow-[0_10px_30px_-20px_rgba(13,148,136,0.35)] backdrop-blur-sm dark:border-teal-900/30 dark:bg-slate-900/70 md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-teal-100/70 dark:border-teal-900/40">
              <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-[0.15em] text-slate-400">Nama</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-[0.15em] text-slate-400">Email</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-[0.15em] text-slate-400">Role</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-[0.15em] text-slate-400">Dibuat</th>
              <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-[0.15em] text-slate-400">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-teal-50 dark:divide-teal-900/20">
            {users.map((user) => {
              const canEdit = canModifyTargetUser(actor, user);
              const canDelete = canDeleteTargetUser(actor, user);
              const isSelf = actor.id === user.id;

              return (
                <tr key={user.id} className="hover:bg-teal-50/40 dark:hover:bg-teal-900/10">
                  <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100">
                    {user.fullName || "—"}
                    {isSelf ? (
                      <span className="ml-2 text-[10px] font-bold uppercase text-teal-600 dark:text-teal-400">
                        (Anda)
                      </span>
                    ) : null}
                  </td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{user.email}</td>
                  <td className="px-5 py-4">
                    {canEdit ? (
                      <UserRoleSelect userId={user.id} currentRole={user.role} />
                    ) : (
                      <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                        {ROLE_LABELS[user.role]}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500">{formatDate(user.createdAt)}</td>
                  <td className="px-5 py-4 text-right">
                    <DeleteUserButton
                      userId={user.id}
                      email={user.email}
                      disabled={!canDelete}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      ) : null}

      {users.length > 0 ? (
      <div className="space-y-3 md:hidden">
        {users.map((user) => {
          const canEdit = canModifyTargetUser(actor, user);
          const canDelete = canDeleteTargetUser(actor, user);
          const isSelf = actor.id === user.id;

          return (
            <div
              key={user.id}
              className="rounded-2xl border border-white/80 bg-white/80 p-4 dark:border-teal-900/30 dark:bg-slate-900/70"
            >
              <p className="font-bold text-slate-900 dark:text-slate-100">
                {user.fullName || user.email}
                {isSelf ? " (Anda)" : ""}
              </p>
              <p className="text-xs text-slate-500">{user.email}</p>
              <p className="mt-1 text-xs text-slate-400">Dibuat: {formatDate(user.createdAt)}</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-teal-50 pt-3 dark:border-teal-900/20">
                {canEdit ? (
                  <UserRoleSelect userId={user.id} currentRole={user.role} />
                ) : (
                  <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">
                    {ROLE_LABELS[user.role]}
                  </span>
                )}
                <DeleteUserButton
                  userId={user.id}
                  email={user.email}
                  disabled={!canDelete}
                />
              </div>
            </div>
          );
        })}
      </div>
      ) : null}
    </div>
  );
}
