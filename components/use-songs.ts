"use client";

import { useCallback, useEffect, useState } from "react";
import { getSongs } from "@/services/songs-service";
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
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch songs";
      setErrorMessage(message);
      setSongs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSongs();
  }, [refreshSongs]);

  return { songs, isLoading, errorMessage, refreshSongs };
}

