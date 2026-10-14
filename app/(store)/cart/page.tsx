import type { Metadata } from "next";
import CartView from "@/components/cart-view";
import PageHeading from "@/components/page-heading";

export const metadata: Metadata = { title: "Your Cart · BLAZE PRO" };

export default function CartPage() {
  return (
    <>
      <PageHeading eyebrow="Checkout · Step 1 of 2" title="Your Cart" />
      <CartView />
    </>
  );
}
