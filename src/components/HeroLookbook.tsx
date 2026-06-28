"use client";

import { useCallback, useEffect, useState } from "react";
import ProductImage from "@/components/ProductImage";
import {
  clearGeneratedImageCache,
  fetchGeneratedImage,
} from "@/lib/generate-clothes.client";
import {
  getClientCachedImageUrl,
  removeClientCachedImageUrl,
  setClientCachedImageUrl,
} from "@/lib/image-cache-client";

const heroLookbook = {
  id: "hero-lookbook-2026",
  title: "Spring 2026 Editorial Streetwear Lookbook",
  description:
    "A group of high-fashion models in a minimalist urban setting, wearing a cohesive blend of oversized tailoring and romantic textures.",
  fallbackImageUrl:
    "https://images.unsplash.com/photo-1515886657613-9f3515b0fe78?w=1200&q=85&auto=format&fit=crop",
};

export default function HeroLookbook() {
  const [imageUrl, setImageUrl] = useState(heroLookbook.fallbackImageUrl);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasError, setHasError] = useState(false);

  const hydrate = useCallback(async (forceRegenerate = false) => {
    if (!forceRegenerate) {
      const cached = getClientCachedImageUrl(heroLookbook.id);
      if (cached) {
        setImageUrl(cached);
        setHasError(false);
        return;
      }
    }

    setIsGenerating(true);

    try {
      const result = await fetchGeneratedImage({
        productId: heroLookbook.id,
        garmentStyle: heroLookbook.title,
        garmentDescription: heroLookbook.description,
        variant: "hero",
        forceRegenerate,
      });

      setClientCachedImageUrl(heroLookbook.id, result.imageUrl);
      setImageUrl(result.imageUrl);
      setHasError(false);
    } catch {
      setImageUrl(heroLookbook.fallbackImageUrl);
      setHasError(true);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void hydrate().finally(() => {
      if (cancelled) {
        return;
      }
    });
    return () => {
      cancelled = true;
    };
  }, [hydrate]);

  async function regenerate() {
    removeClientCachedImageUrl(heroLookbook.id);
    await clearGeneratedImageCache(heroLookbook.id);
    await hydrate(true);
  }

  return (
    <div className="relative min-h-[420px] lg:min-h-[680px]">
      <ProductImage
        src={imageUrl}
        fallbackSrc={heroLookbook.fallbackImageUrl}
        alt="Spring 2026 editorial streetwear lookbook"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
      />
      {isGenerating && (
        <span className="absolute left-4 top-4 bg-white/90 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-neutral-600">
          Generating lookbook…
        </span>
      )}
      {hasError && !isGenerating && (
        <span className="absolute left-4 top-4 bg-white/90 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-neutral-500">
          Placeholder shown — image unavailable
        </span>
      )}
      {process.env.NODE_ENV === "development" && (
        <button
          type="button"
          onClick={() => void regenerate()}
          className="absolute bottom-4 right-4 border border-black/20 bg-white/90 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-neutral-700 transition-colors hover:bg-white"
        >
          Regenerate Hero
        </button>
      )}
    </div>
  );
}
