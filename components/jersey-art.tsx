import { useId } from "react";
import type { KitColors } from "@/lib/products";

type JerseyArtProps = {
  kit: KitColors;
  view?: "front" | "back";
  name?: string;
  number?: string;
  className?: string;
  title?: string;
};

// Shirt silhouette (sleeves included) on a 200×220 canvas
const BODY =
  "M70 18 L86 10 Q100 22 114 10 L130 18 L178 44 L162 84 L144 76 L144 206 Q100 214 56 206 L56 76 L38 84 L22 44 Z";

function PatternLayer({ kit }: { kit: KitColors }) {
  const { accent, pattern } = kit;
  switch (pattern) {
    case "stripes":
      return (
        <g fill={accent}>
          {[64, 88, 112, 136].map((x) => (
            <rect key={x} x={x - 4} y={0} width={8} height={220} />
          ))}
        </g>
      );
    case "hoops":
      return (
        <g fill={accent}>
          {[44, 76, 108, 140, 172, 204].map((y) => (
            <rect key={y} x={0} y={y} width={200} height={12} />
          ))}
        </g>
      );
    case "sash":
      return <polygon fill={accent} points="40,40 72,24 170,190 138,214" />;
    case "band":
      return (
        <g>
          <rect fill={kit.trim} x={83} y={0} width={34} height={220} />
          <rect fill={accent} x={87} y={0} width={26} height={220} />
        </g>
      );
    case "split":
      return <rect fill={accent} x={100} y={0} width={100} height={220} />;
    default:
      return null;
  }
}

export default function JerseyArt({
  kit,
  view = "front",
  name,
  number,
  className,
  title,
}: JerseyArtProps) {
  const uid = useId().replace(/:/g, "");
  const clipId = `jersey-clip-${uid}`;
  const shadeId = `jersey-shade-${uid}`;

  return (
    <svg
      viewBox="0 0 200 220"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={BODY} />
        </clipPath>
        <linearGradient id={shadeId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <rect width="200" height="220" fill={kit.base} />
        <PatternLayer kit={kit} />
        {/* Sleeve cuffs */}
        <polygon fill={kit.trim} points="22,44 30,40 46,80 38,84" />
        <polygon fill={kit.trim} points="178,44 170,40 154,80 162,84" />
        {/* Hem band */}
        <rect fill={kit.trim} x="0" y="202" width="200" height="12" opacity="0.9" />
        <rect width="200" height="220" fill={`url(#${shadeId})`} />
      </g>

      {/* Collar */}
      {view === "front" ? (
        <path d="M86 10 L100 30 L114 10" fill="none" stroke={kit.trim} strokeWidth="5" strokeLinejoin="round" />
      ) : (
        <path d="M86 10 Q100 18 114 10" fill="none" stroke={kit.trim} strokeWidth="5" strokeLinecap="round" />
      )}

      <path d={BODY} fill="none" stroke="#000" strokeOpacity="0.28" strokeWidth="1.2" />

      {view === "front" ? (
        <g>
          {/* Crest */}
          <path
            d="M121 52 h14 v8 q0 8 -7 11 q-7 -3 -7 -11 z"
            fill="none"
            stroke={kit.trim}
            strokeWidth="2"
          />
          <text
            x="74"
            y="62"
            textAnchor="middle"
            fontFamily="var(--font-mono), monospace"
            fontSize="8"
            letterSpacing="1"
            fill={kit.trim}
          >
            BP
          </text>
          {number ? (
            <text
              x="100"
              y="108"
              textAnchor="middle"
              fontFamily="var(--font-display), sans-serif"
              fontWeight="700"
              fontSize="22"
              fill={kit.trim}
            >
              {number}
            </text>
          ) : null}
        </g>
      ) : (
        <g fill={kit.trim} fontFamily="var(--font-display), sans-serif" fontWeight="700" textAnchor="middle">
          {name ? (
            <text x="100" y="66" fontSize={name.length > 8 ? 10 : 12} letterSpacing="1.5">
              {name}
            </text>
          ) : null}
          {number ? (
            <text x="100" y="150" fontSize="64" letterSpacing="-2">
              {number}
            </text>
          ) : null}
        </g>
      )}
    </svg>
  );
}
