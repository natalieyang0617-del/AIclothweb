"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductImage from "@/components/ProductImage";
import LaunchProgressBar from "@/components/product/LaunchProgressBar";
import { isBackViewGenerating } from "@/lib/image-pipeline";
import {
  getBackCachedImageUrl,
  getBackViewCacheKey,
  IMAGE_CACHED_EVENT,
} from "@/lib/image-cache-client";
import { useProductVotes } from "@/hooks/useProductVotes";
import type { ProductDisplay } from "@/data/mockProducts";

interface ProductCardProps {
  product: ProductDisplay;
}

export default function ProductCard({ product }: ProductCardProps) {
  const {
    id,
    title,
    collectionSubtitle,
    description,
    imageUrl,
    fallbackImageUrl,
    trendTags,
    price,
    currentVotes: baseVotes,
    targetVotes,
    daysLeft,
  } = product;

  const currentVotes = useProductVotes(id, baseVotes);
  const [backImageUrl, setBackImageUrl] = useState<string | null>(null);
  const [isBackGenerating, setIsBackGenerating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const cached = getBackCachedImageUrl(id);
    if (cached) {
      setBackImageUrl(cached);
      setIsBackGenerating(false);
      return;
    }

    setIsBackGenerating(isBackViewGenerating(id));

    const onCached = (event: Event) => {
      const { cacheKey, imageUrl: cachedUrl } = (
        event as CustomEvent<{ cacheKey: string; imageUrl: string }>
      ).detail;

      if (cacheKey === getBackViewCacheKey(id)) {
        setBackImageUrl(cachedUrl);
        setIsBackGenerating(false);
      }
    };

    window.addEventListener(IMAGE_CACHED_EVENT, onCached);
    return () => window.removeEventListener(IMAGE_CACHED_EVENT, onCached);
  }, [id]);

  const productHref = `/product/${id}`;
  const showBackOnHover = isHovered && Boolean(backImageUrl);
  const showHoverPlaceholder = isHovered && !backImageUrl && isBackGenerating;

  return (
    <article className="group flex flex-col bg-white text-black">
      <Link href={productHref} className="block">
        <div
          className="relative aspect-[3/4] overflow-hidden bg-neutral-100"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <ProductImage
            src={imageUrl}
            fallbackSrc={fallbackImageUrl}
            alt={title}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              showBackOnHover ? "opacity-0" : "opacity-100"
            }`}
          />
          {backImageUrl && (
            <ProductImage
              src={backImageUrl}
              fallbackSrc={fallbackImageUrl}
              alt={`${title} — back view`}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                showBackOnHover ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
          {showHoverPlaceholder && (
            <>
              <div className="absolute inset-0 backdrop-blur-md bg-white/40" />
              <div className="absolute inset-0 image-shimmer opacity-70" />
            </>
          )}
          <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.18em] text-neutral-500">
            {daysLeft}d left
          </span>
          {showBackOnHover && (
            <span className="absolute bottom-3 right-3 bg-white/90 px-2 py-1 text-[9px] uppercase tracking-[0.14em] text-neutral-600">
              Back View
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-4 pt-4">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {trendTags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] uppercase tracking-[0.14em] text-neutral-500"
            >
              {tag}
            </span>
          ))}
        </div>

        <div>
          <Link href={productHref}>
            <h3 className="text-sm font-medium uppercase tracking-[0.06em] transition-opacity hover:opacity-70">
              {title}
            </h3>
          </Link>
          <p className="mt-1 text-[11px] tracking-wide text-neutral-500">
            {collectionSubtitle}
          </p>
          <p className="mt-2 text-xs text-neutral-900">${price}</p>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-neutral-600">
            {description}
          </p>
        </div>

        <LaunchProgressBar currentVotes={currentVotes} targetVotes={targetVotes} />

        <div className="mt-auto grid grid-cols-2 gap-2 pt-2">
          <Link
            href={productHref}
            className="border border-black bg-transparent px-3 py-3 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-black transition-colors hover:bg-neutral-50"
          >
            Vote
          </Link>
          <Link
            href={`${productHref}#preorder`}
            className="border border-black bg-black px-3 py-3 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-neutral-900"
          >
            Pre-Order Now
          </Link>
        </div>
      </div>
    </article>
  );
}
