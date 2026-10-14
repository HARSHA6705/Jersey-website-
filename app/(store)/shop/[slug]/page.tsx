import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductBuy from "@/components/product-buy";
import ProductCard from "@/components/product-card";
import { getPlayer, getProduct, listedProducts } from "@/lib/products";

export function generateStaticParams() {
  return listedProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product || product.hidden) return { title: "Jersey not found · BLAZE PRO" };
  return { title: `${product.name} · BLAZE PRO`, description: product.tagline };
}

export default async function ProductPage(props: PageProps<"/shop/[slug]">) {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product || product.hidden) notFound();

  const player = getPlayer(product.player);
  const related = listedProducts()
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => Number(b.player === product.player) - Number(a.player === product.player))
    .slice(0, 4);

  return (
    <>
      <nav aria-label="Breadcrumb" className="font-mono text-[10px] uppercase tracking-widest text-[#e7efee]/55 md:text-xs">
        <Link href="/shop" className="hover:text-white">Shop</Link>
        <span className="mx-2">/</span>
        {player ? (
          <Link href={`/shop?player=${player.id}`} className="hover:text-white">{player.chip}</Link>
        ) : null}
        <span className="mx-2">/</span>
        <span className="text-[#e7efee]/85">{product.name}</span>
      </nav>

      <ProductBuy product={product} />

      <section className="mt-16 grid gap-10 border-t border-[#e7efee]/15 pt-10 md:grid-cols-2">
        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-widest text-[#e7efee]/55 md:text-xs">Details</h2>
          <p className="mt-4 max-w-lg leading-relaxed text-[#e7efee]/85">{product.description}</p>
          <ul className="mt-6 space-y-3">
            {product.features.map((f) => (
              <li key={f} className="flex gap-3 text-sm text-[#e7efee]/80">
                <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-[#e7efee]/50" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <dl className="grid content-start gap-6 sm:grid-cols-2">
          {[
            { label: "Fabric", value: product.fabric },
            { label: "Fit", value: product.fit },
            { label: "Delivery", value: "Ships in 5 days · free over ₹2,999" },
            { label: "Returns", value: "30 days on unprinted shirts" },
          ].map((spec) => (
            <div key={spec.label} className="border-t border-[#e7efee]/25 pt-3">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-[#e7efee]/55">{spec.label}</dt>
              <dd className="mt-1.5 text-sm text-[#e7efee]/90">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-20">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-xl uppercase md:text-2xl">You may also like</h2>
          <Link href="/shop" className="border-b border-[#e7efee]/40 pb-1 font-mono text-[10px] uppercase tracking-widest hover:border-[#e7efee] md:text-xs">
            View all →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
