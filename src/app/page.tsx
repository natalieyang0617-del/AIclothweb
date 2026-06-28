import HeroLookbook from "@/components/HeroLookbook";
import ProductCard from "@/components/ProductCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { mockProducts } from "@/data/mockProducts";

const curatedAesthetics = [
  "Grunge Core",
  "Couture Mashup",
  "Street Automation",
  "Deconstructed Denim",
  "Y2K Revival",
  "Raw Utility",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f9f9f9] text-zinc-900">
      <SiteHeader showNav activePath="shop" />

      <section className="grid bg-white lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-16 lg:py-24 xl:px-20">
          <p className="mb-6 text-[11px] uppercase tracking-[0.32em] text-neutral-500">
            Pre-Order · Collection 01
          </p>
          <h1 className="max-w-xl text-3xl font-medium uppercase leading-[1.05] tracking-[0.06em] sm:text-4xl lg:text-5xl xl:text-6xl">
            Collection 01: The Synthesis
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-neutral-600 sm:text-base">
            AI-generated silhouettes. Manifested by consumer demand. Zero waste.
          </p>
          <div className="mt-10">
            <a
              href="#drops"
              className="inline-block border border-black bg-black px-10 py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-white transition-colors duration-200 hover:bg-neutral-900"
            >
              Shop the Drops
            </a>
          </div>
        </div>

        <HeroLookbook />
      </section>

      <section
        id="aesthetics"
        className="border-y border-neutral-200 bg-white py-14 sm:py-16"
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
          <p className="mb-10 text-center text-[11px] uppercase tracking-[0.28em] text-neutral-500">
            Curated Aesthetics
          </p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
            {curatedAesthetics.map((aesthetic) => (
              <li key={aesthetic} className="text-center">
                <span className="text-[11px] font-light uppercase tracking-[0.24em] text-zinc-900 sm:text-xs">
                  {aesthetic}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="drops" className="scroll-mt-16 px-6 py-20 sm:px-10 sm:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 max-w-2xl">
            <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-neutral-500">
              The Drop
            </p>
            <h2 className="text-2xl font-medium uppercase tracking-[0.06em] sm:text-3xl">
              Vote to Launch
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600">
              Each piece is produced only when demand is met. Pre-order now or
              vote to bring your favourite silhouette into production.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-10 xl:gap-y-20">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
