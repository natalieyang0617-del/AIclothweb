import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  deleteImageFile,
  fileExists,
  getPublicPath,
  migrateLegacyDiskFiles,
  normalizeManifestEntry,
  persistRemoteImage,
  readImageDataUri,
} from "@/lib/image-persistence";

const CACHE_DIR = path.join(process.cwd(), ".cache");
const MANIFEST_FILE = path.join(CACHE_DIR, "generated-images.json");

type ImageManifest = Record<string, string>;

async function readManifestFile(): Promise<ImageManifest> {
  try {
    const raw = await readFile(MANIFEST_FILE, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as ImageManifest;
    }
    return {};
  } catch {
    return {};
  }
}

async function writeManifestFile(manifest: ImageManifest): Promise<void> {
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(MANIFEST_FILE, JSON.stringify(manifest, null, 2), "utf-8");
}

let manifestInitialized = false;

async function ensureManifestMigrated(): Promise<ImageManifest> {
  let manifest = await readManifestFile();

  if (!manifestInitialized) {
    manifestInitialized = true;
    manifest = await migrateLegacyDiskFiles(manifest);

    const normalized: ImageManifest = {};
    let changed = false;

    for (const [cacheKey, entry] of Object.entries(manifest)) {
      if (entry.startsWith("http")) {
        changed = true;
        continue;
      }

      const publicPath = normalizeManifestEntry(cacheKey, entry);
      if (!publicPath || !(await fileExists(cacheKey))) {
        changed = true;
        continue;
      }

      normalized[cacheKey] = publicPath;
    }

    if (changed || Object.keys(normalized).length !== Object.keys(manifest).length) {
      manifest = normalized;
      await writeManifestFile(manifest);
    }
  }

  return manifest;
}

export async function getCachedImagePath(
  cacheKey: string,
): Promise<string | null> {
  await ensureManifestMigrated();
  return (await fileExists(cacheKey)) ? getPublicPath(cacheKey) : null;
}

export async function setCachedImageFromRemote(
  cacheKey: string,
  remoteUrl: string,
): Promise<string> {
  const publicPath = await persistRemoteImage(cacheKey, remoteUrl);
  const manifest = await ensureManifestMigrated();
  manifest[cacheKey] = publicPath;
  await writeManifestFile(manifest);
  return publicPath;
}

export async function deleteCachedImage(cacheKey: string): Promise<boolean> {
  const manifest = await ensureManifestMigrated();
  const hadEntry = cacheKey in manifest;

  if (hadEntry) {
    delete manifest[cacheKey];
    await writeManifestFile(manifest);
  }

  await deleteImageFile(cacheKey);
  return hadEntry || (await fileExists(cacheKey));
}

export async function clearAllCachedImages(): Promise<number> {
  const manifest = await ensureManifestMigrated();
  const keys = Object.keys(manifest);

  await Promise.all(keys.map((key) => deleteImageFile(key)));
  await writeManifestFile({});
  return keys.length;
}

export async function getImageReferenceForReplicate(
  cacheKey: string,
): Promise<string | null> {
  return readImageDataUri(cacheKey);
}
