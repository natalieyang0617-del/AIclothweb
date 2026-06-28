import {
  readJson,
  readStorageString,
  removeStorageKey,
  writeJson,
  writeStorageString,
} from "@/lib/storage/local-storage";

const STORAGE_KEY = "vibe-generated-images";
const CACHE_VERSION_KEY = "vibe-image-cache-version";

/** Bump when storage contract changes. */
export const IMAGE_CACHE_VERSION = "3-local-persistence";

export const IMAGE_CACHED_EVENT = "vibe-image-cached";

export type ClientImageCache = Record<string, string>;

function isValidPersistedPath(url: string): boolean {
  return url.startsWith("/uploads/clothes/");
}

function readCache(): ClientImageCache {
  const parsed = readJson<unknown>(STORAGE_KEY, {});
  return parsed && typeof parsed === "object" && !Array.isArray(parsed)
    ? (parsed as ClientImageCache)
    : {};
}

function writeCache(cache: ClientImageCache): void {
  writeJson(STORAGE_KEY, cache);
}

function notifyImageCached(cacheKey: string, imageUrl: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(IMAGE_CACHED_EVENT, {
      detail: { cacheKey, imageUrl },
    }),
  );
}

export function getBackViewCacheKey(productId: string): string {
  return `${productId}-back`;
}

export function getClientCachedImageUrl(cacheKey: string): string | null {
  const url = readCache()[cacheKey] ?? null;
  return url && isValidPersistedPath(url) ? url : null;
}

export function getBackCachedImageUrl(productId: string): string | null {
  return getClientCachedImageUrl(getBackViewCacheKey(productId));
}

export function setClientCachedImageUrl(
  cacheKey: string,
  imageUrl: string,
): void {
  if (!isValidPersistedPath(imageUrl)) {
    return;
  }

  const cache = readCache();
  cache[cacheKey] = imageUrl;
  writeCache(cache);
  notifyImageCached(cacheKey, imageUrl);
}

export function setBackCachedImageUrl(
  productId: string,
  imageUrl: string,
): void {
  setClientCachedImageUrl(getBackViewCacheKey(productId), imageUrl);
}

export function removeClientCachedImageUrl(cacheKey: string): void {
  const cache = readCache();
  delete cache[cacheKey];
  writeCache(cache);
}

export function getAllClientCachedImages(): ClientImageCache {
  const resolved: ClientImageCache = {};

  for (const [key, url] of Object.entries(readCache())) {
    if (isValidPersistedPath(url)) {
      resolved[key] = url;
    }
  }

  return resolved;
}

export function clearAllClientCachedImages(): void {
  removeStorageKey(STORAGE_KEY);
}

export function getImageCacheVersion(): string | null {
  return readStorageString(CACHE_VERSION_KEY);
}

export function setImageCacheVersion(version: string): void {
  writeStorageString(CACHE_VERSION_KEY, version);
}

export function ensureImageCacheVersion(currentVersion: string): boolean {
  if (getImageCacheVersion() === currentVersion) {
    return false;
  }

  clearAllClientCachedImages();
  setImageCacheVersion(currentVersion);
  return true;
}
