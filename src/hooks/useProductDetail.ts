"use client";

import { useEffect, useState } from "react";
import {
  generateBackViewIfNeeded,
  isBackViewGenerating,
} from "@/lib/image-pipeline";
import {
  getLatestPreorderForProduct,
  incrementProductVotes,
  savePreorder,
  type ProductSize,
} from "@/lib/preorder-storage";
import {
  getClientCachedImageUrl,
  getBackViewCacheKey,
  IMAGE_CACHED_EVENT,
} from "@/lib/image-cache-client";
import type { Product } from "@/data/mockProducts";
import { useProductVotes } from "@/hooks/useProductVotes";

type ViewAngle = "front" | "back";
const SIZES: ProductSize[] = ["XS", "S", "M", "L"];

export function useProductDetail(product: Product) {
  const [viewAngle, setViewAngle] = useState<ViewAngle>("front");
  const [frontImageUrl, setFrontImageUrl] = useState(product.fallbackImageUrl);
  const [backImageUrl, setBackImageUrl] = useState<string | null>(null);
  const [isBackGenerating, setIsBackGenerating] = useState(false);
  const [selectedSize, setSelectedSize] = useState<ProductSize>("M");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null,
  );
  const currentVotes = useProductVotes(product.id, product.currentVotes);

  useEffect(() => {
    setFrontImageUrl(
      getClientCachedImageUrl(product.id) ?? product.fallbackImageUrl,
    );

    const cachedBack = getClientCachedImageUrl(getBackViewCacheKey(product.id));
    if (cachedBack) {
      setBackImageUrl(cachedBack);
    } else {
      let cancelled = false;
      setIsBackGenerating(true);

      void generateBackViewIfNeeded(product).then((url) => {
        if (!cancelled && url) {
          setBackImageUrl(url);
        }
        if (!cancelled) {
          setIsBackGenerating(false);
        }
      });

      const onCached = (event: Event) => {
        const { cacheKey, imageUrl } = (
          event as CustomEvent<{ cacheKey: string; imageUrl: string }>
        ).detail;

        if (cacheKey === getBackViewCacheKey(product.id)) {
          setBackImageUrl(imageUrl);
          setIsBackGenerating(false);
        }
      };

      window.addEventListener(IMAGE_CACHED_EVENT, onCached);

      return () => {
        cancelled = true;
        window.removeEventListener(IMAGE_CACHED_EVENT, onCached);
      };
    }
  }, [product]);

  useEffect(() => {
    const latest = getLatestPreorderForProduct(product.id);
    if (latest) {
      setSelectedSize(latest.size);
    }
  }, [product.id]);

  const activeImageUrl =
    viewAngle === "back" && backImageUrl ? backImageUrl : frontImageUrl;
  const showBackShimmer =
    viewAngle === "back" && isBackGenerating && !backImageUrl;

  async function confirmPreorder() {
    setIsSubmitting(true);
    setConfirmationMessage(null);

    await new Promise((resolve) => setTimeout(resolve, 400));

    const nextVotes = incrementProductVotes(product.id, product.currentVotes);
    const record = savePreorder(product.id, selectedSize);

    setConfirmationMessage(
      `Preorder confirmed — Size ${record.size}. You are voter #${nextVotes}.`,
    );
    setIsSubmitting(false);
  }

  return {
    viewAngle,
    setViewAngle,
    activeImageUrl,
    showBackShimmer,
    sizes: SIZES,
    selectedSize,
    setSelectedSize,
    currentVotes,
    isSubmitting,
    confirmationMessage,
    confirmPreorder,
  };
}
