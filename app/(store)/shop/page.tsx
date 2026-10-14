import type { Metadata } from "next";
import PageHeading from "@/components/page-heading";
import ShopGrid from "@/components/shop-grid";
import { getPlayer, listedProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop Jerseys · BLAZE PRO",
  description: "Neymar, Ronaldo, Messi, Mbappé, Bellingham and Vini Jr jerseys from every club and country they have played for.",
};

export default async function ShopPage(props: PageProps<"/shop">) {
  const { player } = await props.searchParams;
  const initial = getPlayer(typeof player === "string" ? player : undefined)?.id;

  return (
    <>
      <PageHeading eyebrow="Collection · 25/26" title="Shop Jerseys" />
      {/* key resets the client filter state when the ?player link changes */}
      <ShopGrid key={initial ?? "all"} products={listedProducts()} initialPlayer={initial ?? "all"} />
    </>
  );
}
