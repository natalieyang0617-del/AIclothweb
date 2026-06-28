"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import ProductImage from "@/components/ProductImage";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useStoreSync } from "@/hooks/useStoreSync";
import {
  enrichPreorders,
  formatPreorderTime,
  getAllPreorders,
  PREORDERS_UPDATED_EVENT,
  saveLaunchNotificationEmail,
  sumPreorderValue,
  type EnrichedPreorder,
} from "@/lib/preorder-storage";

function LaunchNotificationForm() {
  const [email, setEmail] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (!toastVisible) {
      return;
    }
    const timer = window.setTimeout(() => setToastVisible(false), 4200);
    return () => window.clearTimeout(timer);
  }, [toastVisible]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed.includes("@")) {
      return;
    }

    saveLaunchNotificationEmail(trimmed);
    setEmail("");
    setToastVisible(true);
  }

  return (
    <>
      <section className="border-t border-neutral-200 bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-500">
            Launch Notification
          </p>
          <h2 className="mt-4 text-xl font-medium uppercase tracking-[0.06em] sm:text-2xl">
            Secure Your Priority Slot
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600">
            Enter your email to secure your priority production slot and get
            notified when this collection drops.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label htmlFor="launch-email" className="sr-only">
              Email address
            </label>
            <input
              id="launch-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your@email.com"
              className="w-full border border-neutral-300 bg-[#fafafa] px-4 py-4 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-black"
            />
            <button
              type="submit"
              className="w-full border border-black bg-black px-6 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-neutral-900"
            >
              Reserve Priority Access
            </button>
          </form>
        </div>
      </section>

      <div
        role="status"
        aria-live="polite"
        className={`fixed inset-x-0 bottom-8 z-50 flex justify-center px-6 transition-all duration-500 ${
          toastVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <div className="max-w-md border border-neutral-200 bg-white px-6 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">
            Priority Reserved
          </p>
          <p className="mt-1 text-sm text-neutral-800">
            Your place in the production queue is locked.
          </p>
        </div>
      </div>
    </>
  );
}

export default function PreorderDashboard() {
  const [preorders, setPreorders] = useState<EnrichedPreorder[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const refresh = useCallback(() => {
    setPreorders(enrichPreorders(getAllPreorders()));
    setIsHydrated(true);
  }, []);

  useStoreSync(refresh, [PREORDERS_UPDATED_EVENT]);

  const totalValue = sumPreorderValue(preorders);

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-zinc-900">
      <SiteHeader showNav activePath="dashboard" />

      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-16 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-500">
            Your Preorders
          </p>
          <h1 className="mt-3 text-2xl font-medium uppercase tracking-[0.06em] sm:text-3xl">
            Production Queue
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600">
            Pieces reserved for Collection 01. Each preorder holds your size and
            secures a vote toward launch.
          </p>
        </div>

        <section className="mt-12">
          {!isHydrated ? (
            <div className="border border-neutral-200 bg-white px-6 py-16 text-center">
              <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">
                Loading your queue…
              </p>
            </div>
          ) : preorders.length === 0 ? (
            <div className="border border-neutral-200 bg-white px-6 py-16 text-center sm:px-10">
              <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                Queue Empty
              </p>
              <p className="mt-3 text-sm text-neutral-600">
                You haven&apos;t preordered any pieces yet.
              </p>
              <Link
                href="/#drops"
                className="mt-8 inline-block border border-black bg-black px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-neutral-900"
              >
                Browse the Drop
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-end justify-between border-b border-neutral-200 pb-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                  {preorders.length}{" "}
                  {preorders.length === 1 ? "Piece" : "Pieces"} Reserved
                </p>
                <p className="text-sm text-neutral-600">
                  Est. ${totalValue.toLocaleString()}
                </p>
              </div>

              <ul className="divide-y divide-neutral-200 border border-neutral-200 bg-white">
                {preorders.map((item, index) => (
                  <li
                    key={`${item.productId}-${item.confirmedAt}-${index}`}
                    className="flex gap-5 p-5 sm:gap-6 sm:p-6"
                  >
                    <Link
                      href={`/product/${item.productId}`}
                      className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden bg-neutral-100 sm:w-28"
                    >
                      <ProductImage
                        src={item.imageUrl}
                        fallbackSrc={item.fallbackImageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                      <div>
                        <Link
                          href={`/product/${item.productId}`}
                          className="text-sm font-medium uppercase tracking-[0.04em] transition-opacity hover:opacity-70 sm:text-base"
                        >
                          {item.title}
                        </Link>
                        <p className="mt-2 text-sm text-neutral-600">
                          ${item.price}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                        <span className="border border-neutral-300 px-2.5 py-1">
                          Size {item.size}
                        </span>
                        <span>{formatPreorderTime(item.confirmedAt)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </main>

      <LaunchNotificationForm />
      <SiteFooter />
    </div>
  );
}
