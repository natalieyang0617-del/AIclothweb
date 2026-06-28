"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getPreorderCount,
  PREORDERS_UPDATED_EVENT,
} from "@/lib/preorder-storage";

interface SiteHeaderProps {
  showNav?: boolean;
  activePath?: "shop" | "dashboard";
}

export default function SiteHeader({
  showNav = true,
  activePath,
}: SiteHeaderProps) {
  const [preorderCount, setPreorderCount] = useState(0);

  useEffect(() => {
    function refreshCount() {
      setPreorderCount(getPreorderCount());
    }

    refreshCount();

    window.addEventListener(PREORDERS_UPDATED_EVENT, refreshCount);
    window.addEventListener("storage", refreshCount);

    return () => {
      window.removeEventListener(PREORDERS_UPDATED_EVENT, refreshCount);
      window.removeEventListener("storage", refreshCount);
    };
  }, []);

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
        <Link
          href="/"
          className="text-sm font-medium uppercase tracking-[0.35em] transition-opacity hover:opacity-70"
        >
          Vibe
        </Link>

        <div className="flex items-center gap-6 sm:gap-8">
          {showNav && (
            <nav className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.2em] text-neutral-600 sm:flex">
              <a
                href="/#drops"
                className={`transition-colors hover:text-black ${
                  activePath === "shop" ? "text-black" : ""
                }`}
              >
                Shop
              </a>
              <a
                href="/#aesthetics"
                className="transition-colors hover:text-black"
              >
                Collections
              </a>
            </nav>
          )}

          <Link
            href="/dashboard"
            aria-label={
              preorderCount > 0
                ? `Preorder dashboard, ${preorderCount} items`
                : "Preorder dashboard"
            }
            className={`relative flex h-9 w-9 items-center justify-center transition-colors ${
              activePath === "dashboard"
                ? "text-black"
                : "text-neutral-600 hover:text-black"
            }`}
          >
            <ShoppingBag className="h-[18px] w-[18px] stroke-[1.25]" />
            {preorderCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-black px-0.5 text-[9px] font-medium leading-none text-white">
                {preorderCount > 9 ? "9+" : preorderCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
