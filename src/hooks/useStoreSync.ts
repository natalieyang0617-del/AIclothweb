"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getProductVotes,
  VOTES_UPDATED_EVENT,
} from "@/lib/preorder-storage";

/** Re-run `sync` when localStorage-backed store events fire. */
export function useStoreSync(sync: () => void, events: string[]): void {
  useEffect(() => {
    sync();
    const onUpdate = () => sync();
    events.forEach((event) => window.addEventListener(event, onUpdate));
    window.addEventListener("storage", onUpdate);
    return () => {
      events.forEach((event) => window.removeEventListener(event, onUpdate));
      window.removeEventListener("storage", onUpdate);
    };
  }, [sync, events]);
}

export function useProductVotes(productId: string, baseVotes: number): number {
  const [currentVotes, setCurrentVotes] = useState(baseVotes);
  const sync = useCallback(
    () => setCurrentVotes(getProductVotes(productId, baseVotes)),
    [productId, baseVotes],
  );
  useStoreSync(sync, [VOTES_UPDATED_EVENT]);
  return currentVotes;
}
