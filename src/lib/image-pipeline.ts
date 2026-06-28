"use client";

import type { Product } from "@/data/mockProducts";
import {
  fetchBackViewImage,
  fetchGeneratedImage,
} from "@/lib/generate-clothes.client";
import type { ClientImageCache } from "@/lib/image-cache-client";
import {
  getBackCachedImageUrl,
  getClientCachedImageUrl,
  setBackCachedImageUrl,
  setClientCachedImageUrl,
} from "@/lib/image-cache-client";

const inFlightBackGenerations = new Map<string, Promise<string | null>>();

export function resolveCachedFront(
  productId: string,
  clientCache: ClientImageCache,
): string | null {
  const url = clientCache[productId];
  return url?.startsWith("/uploads/clothes/") ? url : null;
}

export function isBackViewGenerating(productId: string): boolean {
  return inFlightBackGenerations.has(productId);
}

export async function generateBackViewIfNeeded(
  product: Product,
  forceRegenerate = false,
): Promise<string | null> {
  if (!forceRegenerate) {
    const cached = getBackCachedImageUrl(product.id);
    if (cached) {
      return cached;
    }
  }

  const existing = inFlightBackGenerations.get(product.id);
  if (existing && !forceRegenerate) {
    return existing;
  }

  const task = (async () => {
    try {
      const result = await fetchBackViewImage(product, forceRegenerate);
      setBackCachedImageUrl(product.id, result.imageUrl);
      return result.imageUrl;
    } catch (error) {
      console.error(`Failed to generate back view for ${product.id}:`, error);
      return null;
    } finally {
      inFlightBackGenerations.delete(product.id);
    }
  })();

  inFlightBackGenerations.set(product.id, task);
  return task;
}

async function generateFrontImage(
  product: Product,
  forceRegenerate: boolean,
): Promise<string> {
  const result = await fetchGeneratedImage({
    productId: product.id,
    garmentStyle: product.title,
    variant: "product",
    forceRegenerate,
  });

  setClientCachedImageUrl(product.id, result.imageUrl);
  return result.imageUrl;
}

export async function runFrontPipeline(
  products: Product[],
  options: {
    forceRegenerate: boolean;
    clientCache: ClientImageCache;
    onStatus: (message: string) => void;
    isCancelled: () => boolean;
  },
): Promise<void> {
  for (const product of products) {
    if (options.isCancelled()) {
      return;
    }

    const cachedFront = resolveCachedFront(product.id, options.clientCache);
    if (!options.forceRegenerate && cachedFront) {
      continue;
    }

    options.onStatus(`Generating front view — ${product.title}…`);

    try {
      await generateFrontImage(product, options.forceRegenerate);
    } catch {
      options.onStatus(
        `Image unavailable for ${product.title} — showing placeholder`,
      );
    }
  }
}

export async function runBackPipeline(
  products: Product[],
  options: {
    forceRegenerate: boolean;
    onStatus: (message: string) => void;
    isCancelled: () => boolean;
  },
): Promise<void> {
  for (const product of products) {
    if (options.isCancelled()) {
      return;
    }

    if (!options.forceRegenerate && getBackCachedImageUrl(product.id)) {
      continue;
    }

    if (product.id === "capsule-005" && !getClientCachedImageUrl(product.id)) {
      continue;
    }

    options.onStatus(`Generating back view — ${product.title}…`);

    try {
      await generateBackViewIfNeeded(product, options.forceRegenerate);
    } catch {
      options.onStatus(`Back view pending for ${product.title}`);
    }
  }
}
