"use client";

import ProductImage from "@/components/ProductImage";
import LaunchProgressBar from "@/components/product/LaunchProgressBar";
import SiteHeader from "@/components/SiteHeader";
import { useProductDetail } from "@/hooks/useProductDetail";
import type { Product } from "@/data/mockProducts";

type ViewAngle = "front" | "back";

interface ProductDetailViewProps {
  product: Product;
}

const toggleBaseClass =
  "flex-1 border px-4 py-3 text-[10px] font-medium uppercase tracking-[0.16em] transition-colors";

function toggleClass(active: boolean): string {
  return active
    ? "border-black bg-black text-white"
    : "border-neutral-300 bg-white text-neutral-700 hover:border-black";
}

function ProductViewToggle({
  viewAngle,
  onChange,
}: {
  viewAngle: ViewAngle;
  onChange: (angle: ViewAngle) => void;
}) {
  return (
    <div className="mt-4 flex gap-2">
      <button
        type="button"
        onClick={() => onChange("front")}
        className={`${toggleBaseClass} ${toggleClass(viewAngle === "front")}`}
      >
        Front View
      </button>
      <button
        type="button"
        onClick={() => onChange("back")}
        className={`${toggleBaseClass} ${toggleClass(viewAngle === "back")}`}
      >
        Back View
      </button>
    </div>
  );
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const {
    viewAngle,
    setViewAngle,
    activeImageUrl,
    showBackShimmer,
    sizes,
    selectedSize,
    setSelectedSize,
    currentVotes,
    isSubmitting,
    confirmationMessage,
    confirmPreorder,
  } = useProductDetail(product);

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-zinc-900">
      <SiteHeader showNav />

      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <section>
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
              <ProductImage
                key={`${product.id}-${viewAngle}-${activeImageUrl}`}
                src={activeImageUrl}
                fallbackSrc={product.fallbackImageUrl}
                alt={`${product.title} — ${viewAngle} view`}
                className="h-full w-full object-cover transition-opacity duration-500"
              />
              {showBackShimmer && (
                <div className="absolute inset-0 image-shimmer backdrop-blur-[2px]" />
              )}
              {showBackShimmer && (
                <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                  Generating back view…
                </span>
              )}
              <span className="absolute bottom-4 left-4 bg-white/90 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-neutral-600">
                {viewAngle === "front" ? "Front View" : "Back View"}
              </span>
            </div>

            <ProductViewToggle viewAngle={viewAngle} onChange={setViewAngle} />
          </section>

          <section>
            <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-500">
              {product.collectionSubtitle}
            </p>
            <h1 className="mt-3 text-2xl font-medium uppercase tracking-[0.06em] sm:text-3xl">
              {product.title}
            </h1>
            <p className="mt-4 text-lg text-neutral-900">${product.price}</p>

            <div className="mt-6 flex flex-wrap gap-x-3 gap-y-2">
              {product.trendTags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] uppercase tracking-[0.14em] text-neutral-500"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="mt-8 text-sm leading-relaxed text-neutral-600">
              {product.description}
            </p>

            <div className="mt-10 border-t border-neutral-200 pt-8">
              <LaunchProgressBar
                currentVotes={currentVotes}
                targetVotes={product.targetVotes}
                showHeading
              />
            </div>

            <div
              id="preorder"
              className="mt-10 scroll-mt-24 border-t border-neutral-200 pt-8"
            >
              <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                Select Size
              </p>
              <div className="grid grid-cols-4 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`border px-4 py-3 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-neutral-300 bg-white text-neutral-800 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => void confirmPreorder()}
                disabled={isSubmitting}
                className="mt-6 w-full border border-black bg-black px-6 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-neutral-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Confirming…" : "Confirm Preorder"}
              </button>

              {confirmationMessage && (
                <p className="mt-4 text-xs leading-relaxed text-neutral-600">
                  {confirmationMessage}
                </p>
              )}

              <p className="mt-4 text-[10px] leading-relaxed text-neutral-400">
                Each confirmed preorder counts as one vote toward the production
                threshold. No payment required at this stage.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
