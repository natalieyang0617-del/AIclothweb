import { NextRequest, NextResponse } from "next/server";
import {
  generateClothesImage,
  type GenerateClothesRequest,
} from "@/lib/generate-clothes.server";

export const runtime = "nodejs";

export type {
  GenerateClothesRequest,
  GenerateClothesResponse,
} from "@/lib/generate-clothes.server";

const DEFAULT_RETRY_AFTER_SECONDS = 9;

function isRateLimitError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }
  const message = error.message.toLowerCase();
  return (
    message.includes("429") ||
    message.includes("rate limit") ||
    message.includes("too many requests")
  );
}

function parseRetryAfterSeconds(error: unknown): number {
  if (error && typeof error === "object") {
    const record = error as Record<string, unknown>;
    if (typeof record.retry_after === "number" && record.retry_after > 0) {
      return record.retry_after;
    }
    const response = record.response;
    if (response && typeof response === "object") {
      const headers = (response as { headers?: { get?: (key: string) => string | null } })
        .headers;
      const retryAfter = headers?.get?.("retry-after");
      if (retryAfter) {
        const seconds = Number.parseInt(retryAfter, 10);
        if (!Number.isNaN(seconds)) {
          return seconds;
        }
      }
    }
  }
  return DEFAULT_RETRY_AFTER_SECONDS;
}

function rateLimitResponse(error: unknown) {
  const retryAfter = parseRetryAfterSeconds(error);
  const message =
    error instanceof Error ? error.message : "Replicate rate limit exceeded";

  return NextResponse.json(
    { error: message, retry_after: retryAfter },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfter) },
    },
  );
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<GenerateClothesRequest>;

  const productId = body.productId?.trim();
  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  const input: GenerateClothesRequest = {
    productId,
    garmentStyle: body.garmentStyle,
    garmentDescription: body.garmentDescription,
    variant: body.variant,
    forceRegenerate: body.forceRegenerate ?? false,
  };

  try {
    return NextResponse.json(await generateClothesImage(input));
  } catch (error) {
    if (isRateLimitError(error)) {
      return rateLimitResponse(error);
    }

    const message =
      error instanceof Error ? error.message : "Image generation failed";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
