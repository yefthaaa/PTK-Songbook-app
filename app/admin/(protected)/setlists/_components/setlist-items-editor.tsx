"use client";

import type { SetlistItem } from "@/types/setlist";
import type { Song } from "@/types/song";

type SetlistItemsEditorProps = {
  songs: Song[];
  items: SetlistItem[];
  onChange: (items: SetlistItem[]) => void;
  error?: string;
};

export function SetlistItemsEditor({ songs, items, onChange, error }: SetlistItemsEditorProps) {
  function addSong(songId: string) {
    const song = songs.find((s) => s.id === songId);
    if (!song) return;
    if (items.some((i) => i.songId === song.id)) return;

    onChange([
      ...items,
      {
        songId: song.id,
        songSlug: song.slug,
        songTitle: song.title,
        songNumber: song.number,
        songKey: song.key,
        order: items.length,
      },
    ]);
  }

  function removeAt(index: number) {
    onChange(items.filter((_, i) => i !== index).map((item, i) => ({ ...item, order: i })));
  }

  function move(index: number, dir: -1 | 1) {
    const next = index + dir;
    if (next < 0 || next >= items.length) return;
    const copy = [...items];
    const temp = copy[index];
    copy[index] = copy[next]!;
    copy[next] = temp!;
    onChange(copy.map((item, i) => ({ ...item, order: i })));
  }

  function updateNotes(index: number, notes: string) {
    onChange(items.map((item, i) => (i === index ? { ...item, notes } : item)));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <select
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) {
              addSong(e.target.value);
              e.target.value = "";
            }
          }}
          className="min-w-[200px] flex-1 rounded-xl border border-teal-100 bg-white px-3 py-2.5 text-sm font-semibold text-teal-700 dark:border-teal-900/40 dark:bg-slate-800 dark:text-teal-300"
        >
          <option value="">+ Tambah lagu ke setlist...</option>
          {songs.map((song) => (
            <option key={song.id} value={song.id} disabled={items.some((i) => i.songId === song.id)}>
              {song.number} — {song.title}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{error}</p>
      ) : null}

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-teal-200/70 px-4 py-6 text-center text-sm text-slate-500 dark:border-teal-900/40">
          Belum ada lagu. Pilih dari dropdown di atas.
        </p>
      ) : (
        <ol className="space-y-2">
          {items.map((item, index) => (
            <li
              key={`${item.songId}-${index}`}
              className="rounded-xl border border-teal-100/80 bg-teal-50/40 p-3 dark:border-teal-900/40 dark:bg-teal-900/10"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {index + 1}. {item.songTitle}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.songNumber} • Key {item.songKey}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="rounded-lg border border-teal-100 bg-white px-2 py-1 text-xs font-bold disabled:opacity-40"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                    className="rounded-lg border border-teal-100 bg-white px-2 py-1 text-xs font-bold disabled:opacity-40"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAt(index)}
                    className="rounded-lg border border-rose-100 bg-white px-2 py-1 text-xs font-bold text-rose-600"
                  >
                    Hapus
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={item.notes ?? ""}
                onChange={(e) => updateNotes(index, e.target.value)}
                placeholder="Catatan (opsional) — mis. hanya reff"
                className="mt-2 w-full rounded-lg border border-teal-100 bg-white px-3 py-2 text-xs dark:border-teal-900/40 dark:bg-slate-800"
              />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
