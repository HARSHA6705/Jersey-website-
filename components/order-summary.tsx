"use client";

import Image from "next/image";
import Link from "next/link";
import JerseyArt from "@/components/jersey-art";
import { QtyStepper } from "@/components/kit-options";
import { cart, cartTotals, unitPrice, type CartItem } from "@/lib/cart";
import { FREE_SHIPPING_THRESHOLD, formatPrice, getProduct } from "@/lib/products";

export function CartLine({ item, editable = true }: { item: CartItem; editable?: boolean }) {
  const product = getProduct(item.slug)!;
  const href = product.hidden ? "/custom" : `/shop/${product.slug}`;
  const print = [item.name, item.number].filter(Boolean).join(" · ");

  return (
    <li className="flex gap-4 border-b border-[#e7efee]/12 py-5 md:gap-6">
      <Link
        href={href}
        className="store-grid-bg relative block aspect-square w-20 shrink-0 overflow-hidden rounded-xl border border-[#e7efee]/15 bg-[#e7efee]/[0.03] md:w-28"
      >
        {product.photos ? (
          <Image src={product.photos.front} alt="" fill sizes="112px" className="object-contain p-1" />
        ) : (
          <JerseyArt kit={item.custom ?? product.kit} className="absolute inset-[10%] h-[80%] w-[80%]" />
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={href} className="text-base tracking-tight hover:underline md:text-lg">
              {item.team ? `${item.team} — ${product.name}` : product.name}
            </Link>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[#e7efee]/55">
              Size {item.size}
              {print ? ` · ${print}` : ""}
              {!editable ? ` · ×${item.qty}` : ""}
            </p>
          </div>
          <p className="shrink-0">{formatPrice(unitPrice(item) * item.qty)}</p>
        </div>
        {editable ? (
          <div className="flex items-center justify-between">
            <QtyStepper value={item.qty} onChange={(n) => cart.setQty(item.id, n)} label={`Quantity of ${product.name}`} />
            <button
              type="button"
              onClick={() => cart.remove(item.id)}
              className="font-mono text-[10px] uppercase tracking-widest text-[#e7efee]/55 underline underline-offset-4 hover:text-white"
            >
              Remove
            </button>
          </div>
        ) : null}
      </div>
    </li>
  );
}

export function Totals({ items }: { items: CartItem[] }) {
  const { subtotal, shipping, total } = cartTotals(items);
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-[#e7efee]/70">Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[#e7efee]/70">Shipping</dt>
          <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
        </div>
        <div className="flex justify-between border-t border-[#e7efee]/15 pt-3 text-lg">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
      {remaining > 0 ? (
        <p className="mt-4 text-xs text-[#e7efee]/60">
          Add {formatPrice(remaining)} more for free delivery.
        </p>
      ) : null}
    </div>
  );
}

export function EmptyCart() {
  return (
    <div className="py-20 text-center">
      <p className="text-lg text-[#e7efee]/80">Your cart is empty.</p>
      <Link
        href="/shop"
        className="mt-6 inline-block border-b border-[#e7efee]/40 pb-1 font-mono text-xs uppercase tracking-widest hover:border-[#e7efee]"
      >
        Shop jerseys →
      </Link>
    </div>
  );
}
