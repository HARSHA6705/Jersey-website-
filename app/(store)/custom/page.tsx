import type { Metadata } from "next";
import KitBuilder from "@/components/kit-builder";
import PageHeading from "@/components/page-heading";

export const metadata: Metadata = {
  title: "Kit Builder · BLAZE PRO",
  description: "Build a pro-fit jersey in your country or club colours, with your name and number.",
};

export default function CustomPage() {
  return (
    <>
      <PageHeading eyebrow="Custom · Made to order" title="Build Your Kit">
        Pick your country or club, add a name and number, and we&apos;ll
        sublimate it onto a pro-fit jersey. Made to order, ships in 7 days.
      </PageHeading>
      <KitBuilder />
    </>
  );
}
