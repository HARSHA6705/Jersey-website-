"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CartLine, EmptyCart, Totals } from "@/components/order-summary";
import { inputClass, labelClass, primaryButton } from "@/components/kit-options";
import { cart, useCartItems, useCartReady } from "@/lib/cart";

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  className = "",
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  className?: string;
  required?: boolean;
}) {
  return (
    <label className={`block ${className}`}>
      <span className={labelClass}>{label}</span>
      <input name={name} type={type} autoComplete={autoComplete} required={required} className={`${inputClass} mt-2`} />
    </label>
  );
}

export default function CheckoutForm() {
  const items = useCartItems();
  const router = useRouter();
  const ready = useCartReady();
  const [submitting, setSubmitting] = useState(false);

  if (!ready) return <div className="min-h-[40vh]" />;
  if (items.length === 0 && !submitting) return <EmptyCart />;

  const placeOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    // TODO: send the order to a backend / payment provider. For now the order
    // is confirmed client-side so the full flow can be clicked through.
    const orderId = `BP-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    cart.clear();
    router.push(`/checkout/confirmed?order=${orderId}`);
  };

  return (
    <form onSubmit={placeOrder} className="mt-10 grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-16">
      <div className="space-y-10">
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-4 font-display text-lg uppercase">Contact</legend>
          <Field label="Email" name="email" type="email" autoComplete="email" className="sm:col-span-2" />
          <Field label="Phone" name="phone" type="tel" autoComplete="tel" className="sm:col-span-2" required={false} />
        </fieldset>

        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-4 font-display text-lg uppercase">Delivery</legend>
          <Field label="First name" name="firstName" autoComplete="given-name" />
          <Field label="Last name" name="lastName" autoComplete="family-name" />
          <Field label="Address" name="address" autoComplete="street-address" className="sm:col-span-2" />
          <Field label="City" name="city" autoComplete="address-level2" />
          <Field label="Postcode" name="postcode" autoComplete="postal-code" />
          <Field label="Country" name="country" autoComplete="country-name" className="sm:col-span-2" />
        </fieldset>

        <fieldset>
          <legend className="mb-4 font-display text-lg uppercase">Payment</legend>
          <label className="flex items-center gap-3 rounded-xl border border-[#e7efee]/40 bg-[#e7efee]/[0.04] px-4 py-4">
            <input type="radio" name="payment" value="cod" defaultChecked className="accent-[#e7efee]" />
            <span>Pay on delivery</span>
          </label>
          <p className="mt-3 text-xs text-[#e7efee]/50">Card payments are coming soon.</p>
        </fieldset>
      </div>

      <aside className="h-fit rounded-2xl border border-[#e7efee]/15 bg-[#e7efee]/[0.03] p-6 lg:sticky lg:top-28">
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-[#e7efee]/60 md:text-xs">
          Your order
        </h2>
        <ul className="mt-2">
          {items.map((item) => (
            <CartLine key={item.id} item={item} editable={false} />
          ))}
        </ul>
        <div className="mt-5">
          <Totals items={items} />
        </div>
        <button type="submit" disabled={submitting} className={`${primaryButton} mt-6`}>
          {submitting ? "Placing order…" : "Place order"}
        </button>
      </aside>
    </form>
  );
}
