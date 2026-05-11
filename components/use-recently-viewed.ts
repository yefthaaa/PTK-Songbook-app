"use client";

import { useCallback, useEffect, useState } from "react";
import { pushRecentlyViewed, readRecentlyViewed } from "@/lib/recently-viewed";

export function useRecentlyViewed() {
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setRecentSlugs(readRecentlyViewed());
    setIsReady(true);
  }, []);

  const addRecent = useCallback((slug: string) => {
    const next = pushRecentlyViewed(slug);
    setRecentSlugs(next);
  }, []);

  return { recentSlugs, isReady, addRecent };
}

