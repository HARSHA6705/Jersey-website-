"use client";

import { getImageProps } from "next/image";
import { useEffect, useState } from "react";
import { preload } from "react-dom";

// Phones held upright get the tall portrait crop; everything else (desktop, tablet,
// phone landscape) gets the wide one. The two queries never overlap, so exactly one
// file is preloaded and downloaded.
const PORTRAIT = "(max-width: 767px) and (orientation: portrait)";
const WIDE = "(min-width: 768px), (orientation: landscape)";

type Art = { desktop: string; mobile: string };

const BASE: Art = { desktop: "/images/Base_image_desktop.webp", mobile: "/images/Base_image_mobile.webp" };
const REVEAL: Art = { desktop: "/images/Reveal_image_desktop.webp", mobile: "/images/Reveal_image_mobile.webp" };

function artDirected(art: Art, extra: { fetchPriority: "high" | "low"; loading: "eager" }) {
  const common = { alt: "", sizes: "100vw", ...extra };
  const { props: wide } = getImageProps({ ...common, src: art.desktop, width: 1754, height: 896 });
  const { props: portrait } = getImageProps({ ...common, src: art.mobile, width: 941, height: 1672 });
  return { wide, portrait };
}

function ArtPicture({ art, priority }: { art: Art; priority: boolean }) {
  // Never lazy: the base is the LCP image, and the reveal layer is only mounted after
  // page load anyway (a lazy image under a fully-masked layer may never be fetched)
  const { wide, portrait } = artDirected(art, {
    fetchPriority: priority ? "high" : "low",
    loading: "eager",
  });

  if (priority) {
    // Start the LCP image download from <head>, before the body is parsed
    preload(wide.src, { as: "image", fetchPriority: "high", imageSrcSet: wide.srcSet, imageSizes: "100vw", media: WIDE });
    preload(portrait.src, { as: "image", fetchPriority: "high", imageSrcSet: portrait.srcSet, imageSizes: "100vw", media: PORTRAIT });
  }

  return (
    <picture>
      <source media={PORTRAIT} srcSet={portrait.srcSet} sizes="100vw" width={941} height={1672} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- decorative: alt="" comes from getImageProps */}
      <img {...wide} />
    </picture>
  );
}

/** Base hero portrait — the page's LCP element. */
export function HeroBase() {
  return (
    <div className="hero-bg-base z-0" aria-hidden="true">
      <ArtPicture art={BASE} priority />
    </div>
  );
}

/** "Liquid glass" reveal layer: only seen under the pointer, so it loads after the page has. */
export function HeroReveal() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const start = () => {
      timer = setTimeout(() => setReady(true), 300);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div className="hero-bg-reveal z-10 pointer-events-none" aria-hidden="true">
      {ready ? <ArtPicture art={REVEAL} priority={false} /> : null}
    </div>
  );
}
