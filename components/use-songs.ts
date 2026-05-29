"use client";

import { useCallback, useEffect, useState } from "react";
import { getSongs } from "@/services/songs-service";
import { isOffline, loadSongsCache, saveSongsCache } from "@/lib/offline/songs-cache";
import type { Song } from "@/types/song";

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refreshSongs = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const fetchedSongs = await getSongs();
      setSongs(fetchedSongs);
      saveSongsCache(fetchedSongs);
    } catch (error) {
      const cached = loadSongsCache();
      if (cached && cached.length > 0) {
        setSongs(cached);
        setErrorMessage(
          isOffline()
            ? "Offline — menampilkan lagu tersimpan di perangkat."
            : "Gagal memuat dari server — menampilkan cache.",
        );
      } else {
        const message = error instanceof Error ? error.message : "Failed to fetch songs";
        setErrorMessage(message);
        setSongs([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSongs();
  }, [refreshSongs]);

  return { songs, isLoading, errorMessage, refreshSongs };
}

