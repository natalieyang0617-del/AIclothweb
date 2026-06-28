import type { Product } from "@/data/mockProducts";
import type { GenerateClothesResponse } from "@/lib/generate-clothes.server";
import {
  clearAllClientCachedImages,
  getBackViewCacheKey,
  removeClientCachedImageUrl,
} from "@/lib/image-cache-client";

export interface GenerateImageParams {
  productId: string;
  garmentStyle: string;
  garmentDescription?: string;
  variant?: "product" | "hero" | "back";
  forceRegenerate?: boolean;
}

interface GenerateErrorPayload {
  error?: string;
  retry_after?: number;
}

const MAX_RETRIES = 3;
const DEFAULT_RETRY_AFTER_MS = 9000;
export const GENERATION_THROTTLE_MS = 5000;

let chain: Promise<unknown> = Promise.resolve();

function enqueueGeneration<T>(task: () => Promise<T>): Promise<T> {
  const run = chain.then(() => task());
  chain = run.then(() => undefined).catch(() => undefined);
  return run;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRetryAfterMs(
  response: Response,
  payload: GenerateErrorPayload,
): number {
  const header = response.headers.get("retry-after");
  if (header) {
    const seconds = Number.parseInt(header, 10);
    if (!Number.isNaN(seconds)) {
      return seconds * 1000;
    }
  }
  if (typeof payload.retry_after === "number" && payload.retry_after > 0) {
    return payload.retry_after * 1000;
  }
  return DEFAULT_RETRY_AFTER_MS;
}

async function postGenerateClothes(
  params: GenerateImageParams,
): Promise<GenerateClothesResponse> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const response = await fetch("/api/generate-clothes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (response.status === 429) {
      const payload = (await response.json()) as GenerateErrorPayload;
      const waitMs = parseRetryAfterMs(response, payload);
      if (attempt < MAX_RETRIES) {
        await sleep(waitMs);
        continue;
      }
      lastError = new Error(payload.error ?? "Rate limit exceeded");
      break;
    }

    if (!response.ok) {
      const payload = (await response.json()) as GenerateErrorPayload;
      throw new Error(payload.error ?? "Failed to generate image");
    }

    return response.json() as Promise<GenerateClothesResponse>;
  }

  throw lastError ?? new Error("Failed to generate image after retries");
}

export async function fetchGeneratedImage(
  params: GenerateImageParams,
): Promise<GenerateClothesResponse> {
  return enqueueGeneration(async () => {
    const result = await postGenerateClothes(params);
    if (!result.cached) {
      await sleep(GENERATION_THROTTLE_MS);
    }
    return result;
  });
}

export async function fetchBackViewImage(
  product: Product,
  forceRegenerate = false,
): Promise<GenerateClothesResponse> {
  return fetchGeneratedImage({
    productId: getBackViewCacheKey(product.id),
    garmentStyle: product.title,
    variant: "back",
    forceRegenerate,
  });
}

export async function clearGeneratedImageCache(
  productId: string,
): Promise<void> {
  const response = await fetch(
    `/api/generate-clothes/cache?productId=${encodeURIComponent(productId)}`,
    { method: "DELETE" },
  );
  if (!response.ok) {
    const payload = (await response.json()) as { error?: string };
    throw new Error(payload.error ?? "Failed to clear image cache");
  }
}

export async function clearAllGeneratedImageCache(): Promise<number> {
  const response = await fetch("/api/generate-clothes/cache?all=true", {
    method: "DELETE",
  });
  if (!response.ok) {
    const payload = (await response.json()) as { error?: string };
    throw new Error(payload.error ?? "Failed to clear all image caches");
  }
  const payload = (await response.json()) as { cleared?: number };
  return payload.cleared ?? 0;
}

export async function clearAllProductCaches(products: Product[]): Promise<void> {
  clearAllClientCachedImages();

  for (const product of products) {
    removeClientCachedImageUrl(product.id);
    removeClientCachedImageUrl(getBackViewCacheKey(product.id));
    await clearGeneratedImageCache(product.id);
    await clearGeneratedImageCache(getBackViewCacheKey(product.id));
  }

  await clearAllGeneratedImageCache();
}
