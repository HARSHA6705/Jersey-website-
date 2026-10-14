import type { Metadata } from "next";
import PageHeading from "@/components/page-heading";
import ShopGrid from "@/components/shop-grid";
import { getPlayer, listedProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Retro Jerseys · BLAZE PRO",
  description: "Throwback shirts from the clubs where the legends made their name.",
};

export default async function RetroPage(props: PageProps<"/retro">) {
  const { player } = await props.searchParams;
  const initial = getPlayer(typeof player === "string" ? player : undefined)?.id;

  return (
    <>
      <PageHeading eyebrow="Throwback · Former clubs" title="Retro" />
      <ShopGrid
        key={initial ?? "all"}
        products={listedProducts().filter((p) => p.retro)}
        initialPlayer={initial ?? "all"}
        basePath="/retro"
      />
    </>
  );
}
