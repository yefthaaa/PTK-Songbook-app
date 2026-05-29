"use client";

import { useCallback, useEffect, useState } from "react";
import { getSetlists } from "@/services/setlists-service";
import type { ServiceSetlist } from "@/types/setlist";

export function useSetlists() {
  const [setlists, setSetlists] = useState<ServiceSetlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await getSetlists();
      setSetlists(data);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Gagal memuat setlist");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { setlists, isLoading, errorMessage, refreshSetlists: refresh };
}
