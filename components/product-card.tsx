import Image from "next/image";
import Link from "next/link";
import JerseyArt from "@/components/jersey-art";
import { formatPrice, getPlayer, type Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const player = getPlayer(product.player);
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e7efee]"
    >
      <div className="store-grid-bg relative aspect-square overflow-hidden rounded-2xl border border-[#e7efee]/15 bg-[#e7efee]/[0.03] transition-colors group-hover:border-[#e7efee]/35">
        {product.print ? (
          <span className="absolute left-3 top-3 z-10 rounded-full border border-[#e7efee]/30 bg-[#0e1f16]/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest">
            #{product.print.number}
          </span>
        ) : null}
        {product.photos ? (
          <div className="absolute inset-0">
            <Image
              src={product.photos.front}
              alt={`${product.name} jersey, front`}
              fill
              sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, 50vw"
              className="object-contain p-[6%] transition-opacity duration-300 group-hover:opacity-0"
            />
            {/* Hover-only back view: display:none on touch screens, so the lazy image is never fetched there */}
            <Image
              src={product.photos.back}
              alt=""
              fill
              sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, 50vw"
              className="hidden object-contain p-[6%] opacity-0 transition-opacity duration-300 group-hover:opacity-100 [@media(hover:hover)]:block"
            />
          </div>
        ) : (
          <JerseyArt
            kit={product.kit}
            view="back"
            name={product.print?.name}
            number={product.print?.number}
            className="absolute inset-[12%] h-[76%] w-[76%] transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-rotate-2"
          />
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#e7efee]/55">
            {player?.chip}
            {product.teamGroup === "country" ? " · Country" : " · Club"}
            {product.retro ? " · Retro" : ""}
          </p>
          <h3 className="mt-1 text-base tracking-tight md:text-lg">{product.name}</h3>
        </div>
        <p className="shrink-0 text-base md:text-lg">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
