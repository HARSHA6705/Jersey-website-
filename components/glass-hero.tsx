"use client";

import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { HeroBase, HeroReveal } from "@/components/hero-art";
import { CartPill, NAV_LINKS } from "@/components/site-header";

const DESKTOP_RADIUS = 235;
const MOBILE_RADIUS = 150;

export default function GlassHero() {
  const heroRef = useRef<HTMLElement | null>(null);

  // Pointer position & animation state stored purely in refs (no React re-renders)
  const rawPosRef = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const smoothPosRef = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const currentRadiusRef = useRef<number>(0);
  const targetRadiusRef = useRef<number>(0);
  const isTrackingRef = useRef<boolean>(false);
  const frameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const animate = () => {
      const isReduced = reducedMotionQuery.matches;
      const posFactor = isReduced ? 1 : 0.14;
      const radiusFactor = isReduced ? 1 : 0.12;

      // Interpolate smoothed position towards raw target position
      if (rawPosRef.current.x !== -999 && rawPosRef.current.y !== -999) {
        if (smoothPosRef.current.x === -999 || smoothPosRef.current.y === -999) {
          smoothPosRef.current.x = rawPosRef.current.x;
          smoothPosRef.current.y = rawPosRef.current.y;
        } else {
          smoothPosRef.current.x +=
            (rawPosRef.current.x - smoothPosRef.current.x) * posFactor;
          smoothPosRef.current.y +=
            (rawPosRef.current.y - smoothPosRef.current.y) * posFactor;
        }
      }

      // Interpolate radius towards target radius
      currentRadiusRef.current +=
        (targetRadiusRef.current - currentRadiusRef.current) * radiusFactor;

      // Update CSS variables directly on container element
      heroEl.style.setProperty(
        "--reveal-x",
        `${smoothPosRef.current.x.toFixed(2)}px`
      );
      heroEl.style.setProperty(
        "--reveal-y",
        `${smoothPosRef.current.y.toFixed(2)}px`
      );
      heroEl.style.setProperty(
        "--reveal-radius",
        `${currentRadiusRef.current.toFixed(2)}px`
      );

      frameIdRef.current = requestAnimationFrame(animate);
    };

    frameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, []);

  const updateRawPos = (e: React.PointerEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    rawPosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "mouse") {
      updateRawPos(e);
      if (smoothPosRef.current.x === -999) {
        smoothPosRef.current = { ...rawPosRef.current };
      }
      targetRadiusRef.current = DESKTOP_RADIUS;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "mouse") {
      updateRawPos(e);
      if (targetRadiusRef.current === 0) {
        targetRadiusRef.current = DESKTOP_RADIUS;
      }
    } else {
      // Touch or pen: update position only while tracking
      if (isTrackingRef.current) {
        updateRawPos(e);
      }
    }
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "mouse") {
      targetRadiusRef.current = 0;
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") {
      isTrackingRef.current = true;
      try {
        if ("setPointerCapture" in e.target) {
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
        }
      } catch {
        // Fallback if capture fails
      }
      updateRawPos(e);
      smoothPosRef.current = { ...rawPosRef.current };
      targetRadiusRef.current = MOBILE_RADIUS;
    }
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || isTrackingRef.current) {
      isTrackingRef.current = false;
      targetRadiusRef.current = 0;
      try {
        if ("releasePointerCapture" in e.target) {
          (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        }
      } catch {
        // Fallback
      }
    }
  };

  return (
    <section
      ref={heroRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUpOrCancel}
      onPointerCancel={handlePointerUpOrCancel}
      className="relative isolate overflow-hidden h-[100dvh] min-h-0 min-w-[320px] touch-none select-none bg-[#0e1f16] text-[#e7efee] max-md:h-auto max-md:min-h-[100dvh] max-md:min-w-0 max-md:touch-pan-y"
      aria-label="BLAZE PRO pro-fit matchday kit hero"
    >
      {/* 1. Base Portrait Layer (LCP image — real <img>, preloaded, high priority) */}
      <HeroBase />

      {/* 2. Reveal Portrait Layer (Liquid Glass Anatomical Version) — loads after the page */}
      <HeroReveal />

      {/* 3. Technical Grid & Background Circle Layer */}
      <div
        className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Technical Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-6 md:grid-cols-12 md:grid-rows-4 opacity-30 md:opacity-50">
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className="border-r border-b border-[#e7efee]/15 last:border-r-0"
            />
          ))}
        </div>

        {/* Oversized Fine-Line Technical Circle */}
        <div className="absolute rounded-full border border-[#e7efee]/20 w-[150vw] md:w-[min(78vw,72rem)] aspect-square left-[-76%] md:left-[8%] top-[-8%] md:top-[-36%] pointer-events-none" />
      </div>

      {/* 4. Navigation */}
      <header className="absolute top-0 left-0 right-0 z-50 pt-[max(2.5rem,env(safe-area-inset-top))] px-[max(1.25rem,env(safe-area-inset-left))] md:px-[max(5.6vw,2rem)] pr-[max(1.25rem,env(safe-area-inset-right))] md:pr-[max(5.6vw,2rem)] animate-nav-down max-md:pt-[max(1rem,env(safe-area-inset-top))] max-md:px-3">
        <nav
          className="flex items-center justify-between w-full"
          aria-label="Main Navigation"
        >
          {/* Brand Monogram & Name */}
          <Link
            href="/"
            className="flex items-center gap-3 max-md:gap-2 group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e7efee] rounded-md p-1 min-h-[44px]"
          >
            <span className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-white/80 flex items-center justify-center shadow-xs group-hover:bg-white transition-colors">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 stroke-[#e7efee]"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {/* GRIDLINE monogram */}
                <path d="M7 4h10v2.2l-1.5 1V19a1.8 1.8 0 0 1-1.8 1.8H10.3A1.8 1.8 0 0 1 8.5 19V7.2L7 6.2V4Z" />
                <path d="M8.5 12.5h7" />
              </svg>
            </span>
            <span className="font-mono text-xs md:text-sm uppercase tracking-widest font-semibold text-[#e7efee] max-md:text-[10px] max-md:whitespace-nowrap">
              BLAZE PRO
            </span>
          </Link>

          {/* Desktop Nav Links — grouped beside the brand (auto right margin) so they stay
              clear of the player artwork on the right half */}
          <ul className="hidden md:flex md:ml-10 md:mr-auto lg:ml-14 items-center gap-6 lg:gap-8 font-mono text-xs uppercase tracking-widest text-[#e7efee]/75">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7efee] rounded px-1 py-0.5"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile-only Collections link — sits between brand and cart. Hidden on md+ where the full nav shows */}
          <Link
            href="/shop"
            className="md:hidden shrink font-mono text-[9px] uppercase tracking-widest text-[#e7efee]/75 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7efee] rounded px-1 py-0.5 whitespace-nowrap"
          >
            Collections
          </Link>

          {/* CTA Link / Button */}
          <CartPill />
        </nav>
      </header>

      {/* 5. Editorial Content Overlay Layer */}
      {/* Desktop: absolute overlay (unchanged). Mobile: clean vertical flow below the header, scrollable */}
      <div className="absolute inset-0 z-40 pointer-events-none max-md:relative max-md:flex max-md:flex-col max-md:min-h-[100dvh] max-md:px-4 max-md:pt-[max(6.5rem,calc(env(safe-area-inset-top)+5.5rem))] max-md:pb-[max(4.5rem,calc(env(safe-area-inset-bottom)+4rem))]">
        {/* Top meta row — brand / product lines, dot-separated (hidden on mobile portrait) */}
        <div className="hero-meta absolute top-[24%] md:top-[13%] left-[max(1.25rem,env(safe-area-inset-left))] md:left-[max(5.6vw,2rem)] right-[max(1.25rem,env(safe-area-inset-right))] md:right-[max(5.6vw,2rem)] flex items-start justify-between gap-6 animate-season-up max-md:static max-md:flex-col max-md:gap-2">
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-[#e7efee]/70">
            Blaze Pro · Oslo · Est. 2024
          </p>
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-[#e7efee]/70 md:text-right">
            Pro-Fit · Matchday Jersey
          </p>
        </div>

        {/* Main Headline — BUILT/FOR/MATCHDAY on tablet (md–lg); NEYMAR/JR on mobile + laptop (lg+) */}
        <div className="absolute top-[30%] md:top-[26%] left-[max(1.25rem,env(safe-area-inset-left))] md:left-[max(5.6vw,2rem)] max-w-[62%] md:max-w-none min-w-[280px] max-md:static max-md:mt-2 max-md:max-w-none max-md:pb-7">
          <h1 className="hero-title font-light tracking-[-0.085em] text-[#e7efee] text-[clamp(2.7rem,12.5vw,3.8rem)] leading-[0.87] md:text-[clamp(5.4rem,6.2vw,6.8rem)] md:leading-[0.93] max-md:text-[13.5vw] max-md:tracking-[-0.06em] max-md:whitespace-nowrap">
            {/* Tablet headline — unchanged (md through lg) */}
            <span className="hidden lg:hidden md:flex items-start gap-3 animate-line-1">
              <span>BUILT</span>
              <span className="mt-[0.35em] shrink-0 border border-[#e7efee]/35 px-1.5 py-0.5 font-mono text-[9px] tracking-widest text-[#e7efee]/80 md:text-[11px]">
                25/26
              </span>
            </span>
            <span className="hidden lg:hidden md:block animate-line-2">FOR</span>
            <span className="hidden lg:hidden md:block animate-line-3">MATCHDAY</span>

            {/* Mobile + laptop headline — NEYMAR / JR in the AZONIX-style face */}
            <span className="block max-lg:md:hidden animate-line-1">NEYMAR</span>
            <span className="block max-lg:md:hidden animate-line-2">JR</span>
          </h1>
        </div>

        {/* Mobile portrait: invisible flow spacer — pushes the product information
            into normal document flow BELOW the Neymar artwork band (its fade edge),
            so nothing overlaps the player. */}
        <div aria-hidden="true" className="spacer-m hidden max-md:block max-md:h-[calc(66dvh-13.5rem)]" />

        {/* Body copy — laptop (lg+): Neymar intro sentence. Tablet + phone landscape:
            original jersey sentence. Mobile portrait: removed via .mobile-desc rule. */}
        <div className="mobile-desc absolute top-[58%] left-[max(1.25rem,env(safe-area-inset-left))] md:left-[max(5.6vw,2rem)] max-w-[85vw] md:max-w-md animate-tagline-up">
          <p className="font-sans text-sm md:text-base text-[#e7efee]/85 leading-relaxed">
            <span className="hidden lg:inline">
              Neymar Jr is a Brazilian football icon whose game is defined by
              skill, creativity, movement, and individual expression.
            </span>
            <span className="lg:hidden">
              Breathable, sublimated pro-fit jerseys — home &amp; away colorways
              in every size, with your name and number pressed on.
            </span>
          </p>
        </div>

        {/* Right-edge vertical spec line (desktop only) */}
        <div className="absolute right-[max(0.6rem,env(safe-area-inset-right))] md:right-[max(1.4vw,0.9rem)] top-1/2 -translate-y-1/2 animate-tagline-up max-md:hidden">
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-[#e7efee]/60 [writing-mode:vertical-rl] rotate-180">
            Sublimated · Home &amp; Away Colorways · Custom Name &amp; Number ·
            Ships in 5 Days
          </p>
        </div>

        {/* Bottom spec strip + order link — mobile portrait: normal flow below the player + description */}
        <div className="absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-[max(1.25rem,env(safe-area-inset-left))] md:left-[max(5.6vw,2rem)] right-[max(1.25rem,env(safe-area-inset-right))] md:right-[max(5.6vw,2rem)] animate-copy-up max-md:static max-md:mt-6 max-md:-mx-4 max-md:px-4 max-md:pb-6 max-md:bg-gradient-to-t max-md:from-[#0e1f16] max-md:via-[#0e1f16]/95 max-md:to-transparent">
          <div className="hero-strip-inner md:flex md:items-end md:justify-between md:gap-10">
            <dl className="hero-specs grid grid-cols-2 gap-x-6 gap-y-5 md:grid-flow-col md:auto-cols-max md:gap-x-8 max-md:grid-cols-1 max-md:gap-y-5">
              {[
                { label: "Fabric", value: "Pro-Fit Aero Mesh" },
                { label: "Print", value: "Name & Number" },
                { label: "Colorways", value: "Home & Away" },
                { label: "Price", value: "₹2,499" },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="border-t border-[#e7efee]/25 pt-3 md:min-w-[8.5rem]"
                >
                  <dt className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-[#e7efee]/60">
                    {spec.label}
                  </dt>
                  <dd className="mt-1.5 font-sans text-base md:text-lg tracking-tight text-[#e7efee]">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>

            <Link
              href="/shop"
              className="hero-cta pointer-events-auto max-md:mt-7 inline-block border-b border-[#e7efee]/40 pb-1 font-mono text-[10px] uppercase tracking-widest text-[#e7efee] transition-colors hover:border-[#e7efee] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e7efee] md:mt-0 md:shrink-0 md:text-xs"
            >
              <span className="cta-m-label">Explore NJR Jerseys →</span>
              <span className="cta-d-label">Shop Jerseys · Ships in 5 Days</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
