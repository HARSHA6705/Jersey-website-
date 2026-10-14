import type { Metadata } from "next";
import CheckoutForm from "@/components/checkout-form";
import PageHeading from "@/components/page-heading";

export const metadata: Metadata = { title: "Checkout · BLAZE PRO" };

export default function CheckoutPage() {
  return (
    <>
      <PageHeading eyebrow="Checkout · Step 2 of 2" title="Checkout" />
      <CheckoutForm />
    </>
  );
}
