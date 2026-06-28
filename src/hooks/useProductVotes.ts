"use client";

import { useCallback, useState } from "react";
import {
  getProductVotes,
  VOTES_UPDATED_EVENT,
} from "@/lib/preorder-storage";
import { useStoreSync } from "@/hooks/useStoreSync";

export function useProductVotes(productId: string, baseVotes: number): number {
  const [currentVotes, setCurrentVotes] = useState(baseVotes);
  const sync = useCallback(
    () => setCurrentVotes(getProductVotes(productId, baseVotes)),
    [productId, baseVotes],
  );

  useStoreSync(sync, [VOTES_UPDATED_EVENT]);

  return currentVotes;
}
