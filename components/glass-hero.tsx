"use client";

import React, { useEffect, useRef } from "react";

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
      className="relative isolate overflow-hidden h-[100dvh] min-h-0 min-w-[320px] touch-none select-none bg-[#0e1f16] text-[#e7efee] max-md:h-auto max-md:min-h-[100dvh] max-md:touch-pan-y"
      aria-label="GRIDLINE JERSEYS pro-fit matchday kit hero"
    >
      {/* 1. Base Portrait Layer */}
      <div className="hero-bg-base z-0" aria-hidden="true" />

      {/* 2. Reveal Portrait Layer (Liquid Glass Anatomical Version) */}
      <div className="hero-bg-reveal z-10 pointer-events-none" aria-hidden="true" />

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
          <a
            href="#"
            className="flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e7efee] rounded-md p-1 min-h-[44px]"
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
            <span className="font-mono text-xs md:text-sm uppercase tracking-widest font-semibold text-[#e7efee] max-md:text-[11px] max-md:whitespace-nowrap">
              GRIDLINE JERSEYS
            </span>
          </a>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-[#e7efee]/75">
            <li>
              <a
                href="#shop"
                className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7efee] rounded px-1 py-0.5"
              >
                Shop
              </a>
            </li>
            <li>
              <a
                href="#custom"
                className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7efee] rounded px-1 py-0.5"
              >
                Custom
              </a>
            </li>
            <li>
              <a
                href="#teams"
                className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7efee] rounded px-1 py-0.5"
              >
                Teams
              </a>
            </li>
            <li>
              <a
                href="#support"
                className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7efee] rounded px-1 py-0.5"
              >
                Support
              </a>
            </li>
          </ul>

          {/* CTA Link / Button */}
          <a
            href="#cart"
            className="bg-white text-[#0a0f18] font-mono text-xs uppercase tracking-wider px-5 py-2.5 rounded-full border border-white/80 shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7efee] min-h-[44px] inline-flex items-center justify-center font-medium max-md:px-4 max-md:text-[10px] max-md:whitespace-nowrap"
          >
            Cart (0)
          </a>
        </nav>
      </header>

      {/* 5. Editorial Content Overlay Layer */}
      {/* Desktop: absolute overlay (unchanged). Mobile: clean vertical flow below the header, scrollable */}
      <div className="absolute inset-0 z-40 pointer-events-none max-md:relative max-md:flex max-md:flex-col max-md:min-h-[100dvh] max-md:px-4 max-md:pt-[max(6.5rem,calc(env(safe-area-inset-top)+5.5rem))] max-md:pb-[max(4.5rem,calc(env(safe-area-inset-bottom)+4rem))]">
        {/* Top meta row — brand / product lines, dot-separated */}
        <div className="absolute top-[24%] md:top-[13%] left-[max(1.25rem,env(safe-area-inset-left))] md:left-[max(5.6vw,2rem)] right-[max(1.25rem,env(safe-area-inset-right))] md:right-[max(5.6vw,2rem)] flex items-start justify-between gap-6 animate-season-up max-md:static max-md:flex-col max-md:gap-2">
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-[#e7efee]/70">
            Gridline Jerseys · Oslo · Est. 2024
          </p>
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-[#e7efee]/70 md:text-right">
            Pro-Fit · Matchday Jersey
          </p>
        </div>

        {/* Main Headline */}
        <div className="absolute top-[30%] md:top-[26%] left-[max(1.25rem,env(safe-area-inset-left))] md:left-[max(5.6vw,2rem)] max-w-[62%] md:max-w-none min-w-[280px] max-md:static max-md:mt-2 max-md:max-w-none max-md:pb-7">
          <h1 className="font-sans font-light tracking-[-0.085em] text-[#e7efee] text-[clamp(2.7rem,12.5vw,3.8rem)] leading-[0.87] md:text-[clamp(5.4rem,6.2vw,6.8rem)] md:leading-[0.93] max-md:text-[13.5vw] max-md:tracking-[-0.06em] max-md:whitespace-nowrap">
            <span className="flex items-start gap-3 animate-line-1">
              <span>BUILT</span>
              <span className="mt-[0.35em] shrink-0 border border-[#e7efee]/35 px-1.5 py-0.5 font-mono text-[9px] tracking-widest text-[#e7efee]/80 md:text-[11px]">
                25/26
              </span>
            </span>
            <span className="block animate-line-2">FOR</span>
            <span className="block animate-line-3">MATCHDAY</span>
          </h1>
        </div>

        {/* Body copy — sentence case, under the headline */}
        <div className="absolute top-[58%] left-[max(1.25rem,env(safe-area-inset-left))] md:left-[max(5.6vw,2rem)] max-w-[85vw] md:max-w-md animate-tagline-up max-md:static max-md:mt-6 max-md:max-w-none">
          <p className="font-sans text-sm md:text-base text-[#e7efee]/85 leading-relaxed">
            Breathable, sublimated pro-fit jerseys — home &amp; away colorways
            in every size, with your name and number pressed on.
          </p>
        </div>

        {/* Right-edge vertical spec line (desktop only) */}
        <div className="absolute right-[max(0.6rem,env(safe-area-inset-right))] md:right-[max(1.4vw,0.9rem)] top-1/2 -translate-y-1/2 animate-tagline-up max-md:hidden">
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-[#e7efee]/60 [writing-mode:vertical-rl] rotate-180">
            Sublimated · Home &amp; Away Colorways · Custom Name &amp; Number ·
            Ships in 5 Days
          </p>
        </div>

        {/* Bottom spec strip + order link */}
        <div className="absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-[max(1.25rem,env(safe-area-inset-left))] md:left-[max(5.6vw,2rem)] right-[max(1.25rem,env(safe-area-inset-right))] md:right-[max(5.6vw,2rem)] animate-copy-up max-md:static max-md:mt-auto max-md:pt-8">
          <div className="md:flex md:items-end md:justify-between md:gap-10">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-flow-col md:auto-cols-max md:gap-x-8">
              {[
                { label: "Fabric", value: "Pro-Fit Aero Mesh" },
                { label: "Print", value: "Name & Number" },
                { label: "Colorways", value: "Home & Away" },
                { label: "Price", value: "€79" },
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

            <a
              href="#shop"
              className="pointer-events-auto mt-6 inline-block border-b border-[#e7efee]/40 pb-1 font-mono text-[10px] uppercase tracking-widest text-[#e7efee] transition-colors hover:border-[#e7efee] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e7efee] md:mt-0 md:shrink-0 md:text-xs"
            >
              Shop Jerseys · Ships in 5 Days
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
