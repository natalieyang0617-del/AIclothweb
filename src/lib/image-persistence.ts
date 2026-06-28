import { access, copyFile, mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

export const UPLOADS_DIR = path.join(process.cwd(), "public/uploads/clothes");
export const UPLOADS_PUBLIC_PREFIX = "/uploads/clothes";

const LEGACY_IMAGES_DIR = path.join(process.cwd(), ".cache/images");

export class ImagePersistenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImagePersistenceError";
  }
}

export function sanitizeCacheKey(cacheKey: string): string {
  return cacheKey.replace(/[^a-zA-Z0-9_-]/g, "_");
}

export function getPublicPath(cacheKey: string): string {
  return `${UPLOADS_PUBLIC_PREFIX}/${sanitizeCacheKey(cacheKey)}.webp`;
}

export function getDiskPath(cacheKey: string): string {
  return path.join(UPLOADS_DIR, `${sanitizeCacheKey(cacheKey)}.webp`);
}

export function isPersistedPublicPath(url: string): boolean {
  return url.startsWith(`${UPLOADS_PUBLIC_PREFIX}/`);
}

export async function fileExists(cacheKey: string): Promise<boolean> {
  try {
    await access(getDiskPath(cacheKey));
    return true;
  } catch {
    return false;
  }
}

export async function persistRemoteImage(
  cacheKey: string,
  remoteUrl: string,
): Promise<string> {
  if (!remoteUrl.startsWith("http")) {
    throw new ImagePersistenceError(
      `Refusing to persist non-remote URL for ${cacheKey}`,
    );
  }

  let response: Response;

  try {
    response = await fetch(remoteUrl);
  } catch (error) {
    throw new ImagePersistenceError(
      `Network error downloading ${cacheKey}: ${error instanceof Error ? error.message : "unknown"}`,
    );
  }

  if (!response.ok) {
    throw new ImagePersistenceError(
      `Failed to download ${cacheKey}: HTTP ${response.status}`,
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(getDiskPath(cacheKey), buffer);

  return getPublicPath(cacheKey);
}

export async function readImageDataUri(cacheKey: string): Promise<string | null> {
  try {
    const buffer = await readFile(getDiskPath(cacheKey));
    return `data:image/webp;base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function deleteImageFile(cacheKey: string): Promise<void> {
  try {
    await unlink(getDiskPath(cacheKey));
  } catch {
    // file may not exist
  }
}

async function migrateLegacyFile(cacheKey: string): Promise<string | null> {
  const legacyPath = path.join(
    LEGACY_IMAGES_DIR,
    `${sanitizeCacheKey(cacheKey)}.webp`,
  );

  try {
    await access(legacyPath);
  } catch {
    return null;
  }

  await mkdir(UPLOADS_DIR, { recursive: true });
  await copyFile(legacyPath, getDiskPath(cacheKey));
  return getPublicPath(cacheKey);
}

let migrationDone = false;

/** Moves legacy `.cache/images` files into `public/uploads/clothes/`. */
export async function migrateLegacyDiskFiles(
  manifest: Record<string, string>,
): Promise<Record<string, string>> {
  if (migrationDone) {
    return manifest;
  }

  migrationDone = true;
  const next = { ...manifest };

  try {
    await access(LEGACY_IMAGES_DIR);
  } catch {
    return next;
  }

  const { readdir } = await import("node:fs/promises");
  const files = await readdir(LEGACY_IMAGES_DIR);

  for (const file of files) {
    if (!file.endsWith(".webp")) {
      continue;
    }

    const cacheKey = file.replace(/\.webp$/, "");
    const migrated = await migrateLegacyFile(cacheKey);

    if (migrated) {
      next[cacheKey] = migrated;
    }
  }

  return next;
}

export function normalizeManifestEntry(
  cacheKey: string,
  entry: string,
): string | null {
  if (isPersistedPublicPath(entry)) {
    return entry;
  }

  if (entry.startsWith("/api/cached-image")) {
    return getPublicPath(cacheKey);
  }

  return null;
}
