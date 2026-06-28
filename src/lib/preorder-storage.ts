import { getProductById } from "@/data/mockProducts";

export type ProductSize = "XS" | "S" | "M" | "L";

export interface PreorderRecord {
  productId: string;
  size: ProductSize;
  confirmedAt: string;
}

export interface EnrichedPreorder extends PreorderRecord {
  title: string;
  price: number;
  imageUrl: string;
  fallbackImageUrl: string;
}

const VOTES_KEY = "vibe-product-votes";
const PREORDERS_KEY = "vibe-product-preorders";
const LAUNCH_NOTIFICATIONS_KEY = "vibe-launch-notifications";

export const PREORDERS_UPDATED_EVENT = "vibe-preorders-updated";
export const VOTES_UPDATED_EVENT = "vibe-votes-updated";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

function readVotes(): Record<string, number> {
  const parsed = readJson<unknown>(VOTES_KEY, {});
  return parsed && typeof parsed === "object" && !Array.isArray(parsed)
    ? (parsed as Record<string, number>)
    : {};
}

function readPreorders(): PreorderRecord[] {
  const parsed = readJson<unknown>(PREORDERS_KEY, []);
  return Array.isArray(parsed) ? (parsed as PreorderRecord[]) : [];
}

function dispatch(eventName: string): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(eventName));
  }
}

export function getProductVotes(productId: string, baseVotes: number): number {
  return readVotes()[productId] ?? baseVotes;
}

export function incrementProductVotes(
  productId: string,
  baseVotes: number,
): number {
  const votes = readVotes();
  const next = (votes[productId] ?? baseVotes) + 1;
  votes[productId] = next;
  writeJson(VOTES_KEY, votes);
  dispatch(VOTES_UPDATED_EVENT);
  return next;
}

export function savePreorder(
  productId: string,
  size: ProductSize,
): PreorderRecord {
  const record: PreorderRecord = {
    productId,
    size,
    confirmedAt: new Date().toISOString(),
  };
  writeJson(PREORDERS_KEY, [...readPreorders(), record]);
  dispatch(PREORDERS_UPDATED_EVENT);
  return record;
}

export function getAllPreorders(): PreorderRecord[] {
  return readPreorders();
}

export function getPreorderCount(): number {
  return readPreorders().length;
}

export function getLatestPreorderForProduct(
  productId: string,
): PreorderRecord | null {
  return readPreorders().filter((r) => r.productId === productId).at(-1) ?? null;
}

export function saveLaunchNotificationEmail(email: string): void {
  const normalized = email.trim().toLowerCase();
  const existing = readJson<string[]>(LAUNCH_NOTIFICATIONS_KEY, []);
  if (!existing.includes(normalized)) {
    writeJson(LAUNCH_NOTIFICATIONS_KEY, [...existing, normalized]);
  }
}

export function enrichPreorders(records: PreorderRecord[]): EnrichedPreorder[] {
  return records
    .map((record) => {
      const product = getProductById(record.productId);
      return product
        ? {
            ...record,
            title: product.title,
            price: product.price,
            imageUrl: product.imageUrl,
            fallbackImageUrl: product.fallbackImageUrl,
          }
        : null;
    })
    .filter((item): item is EnrichedPreorder => item !== null)
    .reverse();
}

export function formatPreorderTime(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

export function sumPreorderValue(preorders: EnrichedPreorder[]): number {
  return preorders.reduce((sum, item) => sum + item.price, 0);
}
