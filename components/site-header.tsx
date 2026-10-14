"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cartTotals, useCartItems } from "@/lib/cart";

export const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/players", label: "Players" },
  { href: "/custom", label: "Custom" },
  { href: "/retro", label: "Retro" },
  { href: "/support", label: "Support" },
];

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7efee]";

export function CartPill({ className = "" }: { className?: string }) {
  const { count } = cartTotals(useCartItems());
  return (
    <Link
      href="/cart"
      className={`bg-white text-[#0a0f18] font-mono text-xs uppercase tracking-wider px-5 py-2.5 rounded-full border border-white/80 shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all min-h-[44px] inline-flex items-center justify-center font-medium max-md:px-3 max-md:text-[10px] whitespace-nowrap ${focusRing} ${className}`}
    >
      Cart ({count})
    </Link>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#e7efee]/15 bg-[#0e1f16]/85 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-4 py-3 md:px-[max(5.6vw,2rem)]"
        aria-label="Main Navigation"
      >
        <Link href="/" className={`flex items-center gap-3 rounded-md p-1 min-h-[44px] group ${focusRing}`}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e7efee] transition-colors group-hover:bg-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4 stroke-[#0e1f16]"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 4h10v2.2l-1.5 1V19a1.8 1.8 0 0 1-1.8 1.8H10.3A1.8 1.8 0 0 1 8.5 19V7.2L7 6.2V4Z" />
              <path d="M8.5 12.5h7" />
            </svg>
          </span>
          <span className="font-mono text-xs md:text-sm uppercase tracking-widest font-semibold whitespace-nowrap">
            BLAZE PRO
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest">
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded px-1 py-0.5 transition-colors ${focusRing} ${
                    active
                      ? "text-white underline underline-offset-8 decoration-[#e7efee]/50"
                      : "text-[#e7efee]/70 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <CartPill />
      </nav>

      {/* Mobile: links in a scrollable row under the brand bar */}
      <ul className="md:hidden flex gap-6 overflow-x-auto [scrollbar-width:none] border-t border-[#e7efee]/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest">
        {NAV_LINKS.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <li key={link.href} className="shrink-0">
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`${focusRing} ${active ? "text-white" : "text-[#e7efee]/65"}`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </header>
  );
}
