"use client";

import { useEffect } from "react";

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
