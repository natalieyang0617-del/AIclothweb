import { NextRequest, NextResponse } from "next/server";
import {
  clearAllCachedImages,
  deleteCachedImage,
} from "@/lib/image-manifest";

export const runtime = "nodejs";

export async function DELETE(request: NextRequest) {
  try {
    const clearAll = request.nextUrl.searchParams.get("all") === "true";

    if (clearAll) {
      const cleared = await clearAllCachedImages();
      return NextResponse.json({
        cleared,
        message: `Cleared ${cleared} cached image(s) from server`,
      });
    }

    const productId = request.nextUrl.searchParams.get("productId")?.trim();

    if (!productId) {
      return NextResponse.json(
        { error: "productId query param is required (or use ?all=true)" },
        { status: 400 },
      );
    }

    const deleted = await deleteCachedImage(productId);

    return NextResponse.json({
      productId,
      deleted,
      message: deleted
        ? `Cache cleared for ${productId}`
        : `No server cache entry found for ${productId}`,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to clear cache";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
