import { SITE_FOOTER } from "@/data/mockProducts";

export default function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <span className="text-[11px] uppercase tracking-[0.28em] text-neutral-500">
          {SITE_FOOTER.brand}
        </span>
        <p className="text-[11px] text-neutral-400">{SITE_FOOTER.tagline}</p>
      </div>
    </footer>
  );
}
