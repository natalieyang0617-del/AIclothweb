"use client";

import { useEffect, useState } from "react";
import { getProductVotes } from "@/lib/preorder-storage";

export function useProductVotes(productId: string, baseVotes: number): number {
  const [currentVotes, setCurrentVotes] = useState(baseVotes);

  useEffect(() => {
    const sync = () => setCurrentVotes(getProductVotes(productId, baseVotes));

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("vibe-votes-updated", sync);
    window.addEventListener("focus", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("vibe-votes-updated", sync);
      window.removeEventListener("focus", sync);
    };
  }, [productId, baseVotes]);

  return currentVotes;
}
