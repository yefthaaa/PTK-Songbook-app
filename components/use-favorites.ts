"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { readFavorites, writeFavorites } from "@/lib/favorites";

export function useFavorites() {
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setFavoriteSlugs(readFavorites());
    setIsReady(true);
  }, []);

  const favoriteSet = useMemo(() => new Set(favoriteSlugs), [favoriteSlugs]);

  const toggleFavorite = useCallback((slug: string) => {
    setFavoriteSlugs((current) => {
      const next = current.includes(slug)
        ? current.filter((value) => value !== slug)
        : [...current, slug];
      writeFavorites(next);
      return next;
    });
  }, []);

  return { favoriteSlugs, favoriteSet, isReady, toggleFavorite };
}

