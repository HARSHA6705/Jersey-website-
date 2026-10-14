"use client";

import Image from "next/image";
import { useState } from "react";
import JerseyArt from "@/components/jersey-art";
import {
  AddedNotice,
  PrintFields,
  QtyStepper,
  SizePicker,
  primaryButton,
} from "@/components/kit-options";
import { cart, unitPrice } from "@/lib/cart";
import { formatPrice, getPlayer, type Product, type Size } from "@/lib/products";

export default function ProductBuy({ product }: { product: Product }) {
  const [view, setView] = useState<"front" | "back">(product.print ? "back" : "front");
  const [size, setSize] = useState<Size | null>(null);
  const [name, setName] = useState(product.print?.name ?? "");
  const [number, setNumber] = useState(product.print?.number ?? "");
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);

  const player = getPlayer(product.player);
  // The back photo shows the player's print — switch to the drawn preview once it's edited
  const printEdited = name !== (product.print?.name ?? "") || number !== (product.print?.number ?? "");
  const photo = product.photos && !(view === "back" && printEdited) ? product.photos[view] : null;
  const price = unitPrice({ slug: product.slug, name, number });

  const addToCart = () => {
    if (!size) {
      setSizeError(true);
      return;
    }
    cart.add({ slug: product.slug, size, name: name.trim() || undefined, number: number || undefined }, qty);
    setAdded(true);
  };

  return (
    <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      {/* Preview */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="store-grid-bg relative aspect-square overflow-hidden rounded-3xl border border-[#e7efee]/15 bg-[#e7efee]/[0.03]">
          {photo ? (
            <Image
              src={photo}
              alt={`${product.name}, ${view} view`}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain p-[6%]"
            />
          ) : (
            <JerseyArt
              kit={product.kit}
              view={view}
              name={name}
              number={number}
              title={`${product.name}, ${view} view`}
              className="absolute inset-[10%] h-[80%] w-[80%] animate-copy-up"
            />
          )}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 rounded-full border border-[#e7efee]/25 bg-[#0e1f16]/70 p-1 backdrop-blur" role="group" aria-label="Preview side">
            {(["front", "back"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                  view === v ? "bg-[#e7efee] text-[#0e1f16]" : "text-[#e7efee]/70 hover:text-white"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Buy box */}
      <div className="animate-copy-up">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#e7efee]/60 md:text-xs">
          {player ? `${player.name} · ` : ""}
          {product.teamGroup === "country" ? "National team" : "Club"} · {product.retro ? "Retro kit" : "Home kit"}
        </p>
        <h1 className="mt-3 font-display text-[clamp(1.8rem,4.6vw,3.2rem)] uppercase leading-[1.05]">
          {product.name}
        </h1>
        <p className="mt-3 text-[#e7efee]/75">{product.tagline}</p>
        <p className="mt-6 text-3xl tracking-tight">{formatPrice(price)}</p>

        <div className="mt-8 space-y-8">
          <SizePicker
            value={size}
            onChange={(s) => {
              setSize(s);
              setSizeError(false);
            }}
            error={sizeError}
          />
          <PrintFields
            name={name}
            number={number}
            onName={setName}
            onNumber={setNumber}
            included={Boolean(product.print)}
            onFocus={() => setView("back")}
          />
          <div className="flex items-center gap-4">
            <QtyStepper value={qty} onChange={setQty} />
            <button type="button" onClick={addToCart} className={primaryButton}>
              Add to cart · {formatPrice(price * qty)}
            </button>
          </div>
        </div>

        {added ? <AddedNotice onClose={() => setAdded(false)} /> : null}

        <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-[#e7efee]/50">
          Ships in 5 days · Free delivery over ₹2,999
        </p>
      </div>
    </div>
  );
}
