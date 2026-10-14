"use client";

import Link from "next/link";
import { CartLine, EmptyCart, Totals } from "@/components/order-summary";
import { primaryButton } from "@/components/kit-options";
import { useCartItems, useCartReady } from "@/lib/cart";

export default function CartView() {
  const items = useCartItems();
  const ready = useCartReady();

  if (!ready) return <div className="min-h-[40vh]" />;
  if (items.length === 0) return <EmptyCart />;

  return (
    <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-16">
      <ul aria-label="Cart items">
        {items.map((item) => (
          <CartLine key={item.id} item={item} />
        ))}
      </ul>

      <aside className="h-fit rounded-2xl border border-[#e7efee]/15 bg-[#e7efee]/[0.03] p-6 lg:sticky lg:top-28 lg:mt-5">
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-[#e7efee]/60 md:text-xs">Order summary</h2>
        <div className="mt-5">
          <Totals items={items} />
        </div>
        <Link href="/checkout" className={`${primaryButton} mt-6`}>
          Checkout
        </Link>
        <Link
          href="/shop"
          className="mt-4 block text-center font-mono text-[10px] uppercase tracking-widest text-[#e7efee]/60 hover:text-white"
        >
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
