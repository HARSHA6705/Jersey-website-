"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/product-card";
import { PLAYERS, type PlayerId, type Product } from "@/lib/products";

type Sort = "featured" | "price-asc" | "price-desc";

export default function ShopGrid({
  products,
  initialPlayer,
  basePath = "/shop",
}: {
  products: Product[];
  initialPlayer: PlayerId | "all";
  basePath?: string;
}) {
  const [player, setPlayer] = useState<PlayerId | "all">(initialPlayer);
  const [sort, setSort] = useState<Sort>("featured");

  const visible = useMemo(() => {
    const list = player === "all" ? products : products.filter((p) => p.player === player);
    if (sort === "price-asc") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, player, sort]);

  const selectPlayer = (next: PlayerId | "all") => {
    setPlayer(next);
    // Keep the URL shareable without triggering a server round-trip
    const url = next === "all" ? basePath : `${basePath}?player=${next}`;
    window.history.replaceState(null, "", url);
  };

  return (
    <section aria-label="Products" className="pt-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-4 flex min-w-0 gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Filter by player">
          {[{ id: "all" as const, chip: "All" }, ...PLAYERS].map(({ id, chip }) => (
            <button
              key={id}
              type="button"
              onClick={() => selectPlayer(id)}
              aria-pressed={player === id}
              className={`shrink-0 rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7efee] md:text-xs ${
                player === id
                  ? "border-[#e7efee] bg-[#e7efee] text-[#0e1f16]"
                  : "border-[#e7efee]/25 text-[#e7efee]/75 hover:border-[#e7efee]/60 hover:text-white"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 lg:justify-end">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#e7efee]/55 md:text-xs" aria-live="polite">
            {visible.length} {visible.length === 1 ? "jersey" : "jerseys"}
          </p>
          <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#e7efee]/55 md:text-xs">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-full border border-[#e7efee]/25 bg-[#0e1f16] px-3 py-2 text-[#e7efee] focus-visible:outline-2 focus-visible:outline-[#e7efee]"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low → high</option>
              <option value="price-desc">Price: high → low</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
