import ProductImage from "@/components/ProductImage";
import { HERO_LOOKBOOK } from "@/data/mockProducts";

export default function HeroLookbook() {
  return (
    <div className="relative min-h-[420px] lg:min-h-[680px]">
      <ProductImage
        src={HERO_LOOKBOOK.imageUrl}
        fallbackSrc={HERO_LOOKBOOK.fallbackImageUrl}
        alt="Spring 2026 editorial streetwear lookbook"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
