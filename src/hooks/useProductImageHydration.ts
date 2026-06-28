"use client";

import { useCallback, useEffect, useState } from "react";
import { clearAllProductCaches } from "@/lib/generate-clothes.client";
import {
  ensureImageCacheVersion,
  getAllClientCachedImages,
  IMAGE_CACHE_VERSION,
} from "@/lib/image-cache-client";
import {
  resolveCachedFront,
  runBackPipeline,
  runFrontPipeline,
} from "@/lib/image-pipeline";
import type { ProductDisplay } from "@/data/mockProducts";
import type { Product } from "@/data/mockProducts";

export type DisplayProduct = ProductDisplay & {
  isGenerating: boolean;
};

function buildInitialDisplayProducts(products: Product[]): DisplayProduct[] {
  return products.map((product) => ({
    ...product,
    imageUrl: product.fallbackImageUrl,
    isGenerating: false,
  }));
}

function buildDisplayProducts(
  products: Product[],
  clientCache: Record<string, string>,
  forceRegenerate: boolean,
): DisplayProduct[] {
  return products.map((product) => {
    const cachedFront = resolveCachedFront(product.id, clientCache);
    return {
      ...product,
      imageUrl: cachedFront ?? product.fallbackImageUrl,
      isGenerating: forceRegenerate || !cachedFront,
    };
  });
}

export function useProductImageHydration(products: Product[]) {
  const [displayProducts, setDisplayProducts] = useState<DisplayProduct[]>(() =>
    buildInitialDisplayProducts(products),
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isRegeneratingAll, setIsRegeneratingAll] = useState(false);

  const runPipeline = useCallback(
    async (forceRegenerate: boolean, isCancelled: () => boolean) => {
      const clientCache = forceRegenerate ? {} : getAllClientCachedImages();
      setDisplayProducts(buildDisplayProducts(products, clientCache, forceRegenerate));

      const onStatus = (message: string) => {
        if (!isCancelled()) {
          setStatusMessage(message);
        }
      };

      await runFrontPipeline(products, {
        forceRegenerate,
        clientCache,
        onStatus,
        isCancelled,
      });

      if (!isCancelled()) {
        setDisplayProducts((current) =>
          current.map((item) => {
            const cached = resolveCachedFront(item.id, getAllClientCachedImages());
            return cached
              ? { ...item, imageUrl: cached, isGenerating: false }
              : item;
          }),
        );
      }

      await runBackPipeline(products, { forceRegenerate, onStatus, isCancelled });
      onStatus("AI lookbook images ready — seed-pinned front/back pairs");
    },
    [products],
  );

  useEffect(() => {
    let cancelled = false;
    const force = ensureImageCacheVersion(IMAGE_CACHE_VERSION);
    void runPipeline(force, () => cancelled);
    return () => {
      cancelled = true;
    };
  }, [runPipeline]);

  const regenerateAllPairs = useCallback(async () => {
    setIsRegeneratingAll(true);
    setStatusMessage("Clearing caches and regenerating all seed-pinned pairs…");

    try {
      await clearAllProductCaches(products);
      await runPipeline(true, () => false);
    } catch {
      setStatusMessage("Regeneration failed — please try again");
    } finally {
      setIsRegeneratingAll(false);
    }
  }, [products, runPipeline]);

  return {
    displayProducts,
    statusMessage,
    isRegeneratingAll,
    regenerateAllPairs,
  };
}
