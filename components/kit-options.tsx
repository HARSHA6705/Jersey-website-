"use client";

import Link from "next/link";
import { NAME_MAX, PRINT_PRICE, SIZES, formatPrice, type Size } from "@/lib/products";

export const labelClass = "font-mono text-[10px] uppercase tracking-widest text-[#e7efee]/60 md:text-xs";
export const inputClass =
  "w-full rounded-xl border border-[#e7efee]/25 bg-[#e7efee]/[0.04] px-4 py-3 text-base text-[#e7efee] placeholder:text-[#e7efee]/35 focus:border-[#e7efee]/70 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7efee]";
export const primaryButton =
  "inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-white px-6 font-mono text-xs font-medium uppercase tracking-widest text-[#0a0f18] shadow-xs transition-all hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7efee]";

export function cleanName(value: string) {
  return value.toUpperCase().replace(/[^A-Z .'-]/g, "").slice(0, NAME_MAX);
}

export function cleanNumber(value: string) {
  return value.replace(/\D/g, "").slice(0, 2);
}

export function SizePicker({
  value,
  onChange,
  error,
}: {
  value: Size | null;
  onChange: (size: Size) => void;
  error?: boolean;
}) {
  return (
    <fieldset>
      <div className="flex items-center justify-between">
        <legend className={labelClass}>Size</legend>
        <Link href="/support#sizing" className="font-mono text-[10px] uppercase tracking-widest text-[#e7efee]/60 underline underline-offset-4 hover:text-white">
          Size guide
        </Link>
      </div>
      <div className="mt-3 grid grid-cols-6 gap-2">
        {SIZES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            aria-pressed={value === s}
            className={`min-h-[44px] rounded-xl border font-mono text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7efee] ${
              value === s
                ? "border-[#e7efee] bg-[#e7efee] text-[#0e1f16]"
                : "border-[#e7efee]/25 hover:border-[#e7efee]/60"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-sm text-[#ffb4a2]">
          Pick a size first.
        </p>
      ) : null}
    </fieldset>
  );
}

export function PrintFields({
  name,
  number,
  onName,
  onNumber,
  onFocus,
  included = false,
}: {
  included?: boolean;
  name: string;
  number: string;
  onName: (v: string) => void;
  onNumber: (v: string) => void;
  onFocus?: () => void;
}) {
  return (
    <fieldset>
      <legend className={labelClass}>
        Name &amp; number <span className="normal-case tracking-normal text-[#e7efee]/45">
          {included ? "· included — edit to print your own" : `· optional, +${formatPrice(PRINT_PRICE)}`}
        </span>
      </legend>
      <div className="mt-3 grid grid-cols-[1fr_6rem] gap-2">
        <label className="sr-only" htmlFor="print-name">Name on back</label>
        <input
          id="print-name"
          value={name}
          onChange={(e) => onName(cleanName(e.target.value))}
          onFocus={onFocus}
          placeholder="NEYMAR JR"
          autoComplete="off"
          maxLength={NAME_MAX}
          className={`${inputClass} uppercase`}
        />
        <label className="sr-only" htmlFor="print-number">Number</label>
        <input
          id="print-number"
          value={number}
          onChange={(e) => onNumber(cleanNumber(e.target.value))}
          onFocus={onFocus}
          placeholder="10"
          inputMode="numeric"
          autoComplete="off"
          className={`${inputClass} text-center`}
        />
      </div>
      <p className="mt-2 text-xs text-[#e7efee]/50">Up to {NAME_MAX} letters · numbers 0–99</p>
    </fieldset>
  );
}

export function QtyStepper({
  value,
  onChange,
  label = "Quantity",
}: {
  value: number;
  onChange: (n: number) => void;
  label?: string;
}) {
  const btn =
    "h-10 w-10 rounded-full text-lg leading-none transition-colors hover:bg-[#e7efee]/10 disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-[#e7efee]";
  return (
    <div className="inline-flex items-center rounded-full border border-[#e7efee]/25" role="group" aria-label={label}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        −
      </button>
      <span className="w-8 text-center font-mono text-sm" aria-live="polite">{value}</span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= 20} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}

export function AddedNotice({ onClose }: { onClose: () => void }) {
  return (
    <div role="status" className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-[#19c37d]/40 bg-[#19c37d]/10 px-4 py-3 text-sm">
      <span>Added to your cart.</span>
      <span className="flex items-center gap-4">
        <Link href="/cart" className="font-mono text-[10px] uppercase tracking-widest underline underline-offset-4">
          View cart →
        </Link>
        <button type="button" onClick={onClose} aria-label="Dismiss" className="text-[#e7efee]/60 hover:text-white">
          ×
        </button>
      </span>
    </div>
  );
}
