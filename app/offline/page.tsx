import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-50 px-4">
      <div className="max-w-md rounded-3xl border bg-white p-8 text-center shadow">
        <h1 className="text-xl font-bold text-slate-900">Anda sedang offline</h1>
        <p className="mt-3 text-sm text-slate-600">
          Lagu yang pernah dimuat akan tetap tersedia di halaman utama jika sudah disimpan di perangkat ini.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white"
        >
          Ke Songbook
        </Link>
      </div>
    </div>
  );
}
