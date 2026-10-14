import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Order Confirmed · BLAZE PRO" };

export default async function ConfirmedPage(props: PageProps<"/checkout/confirmed">) {
  const { order } = await props.searchParams;
  const orderId = typeof order === "string" && /^BP-[A-Z0-9]{1,8}$/.test(order) ? order : null;

  return (
    <div className="mx-auto max-w-2xl py-10 text-center md:py-20">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[#19c37d] md:text-xs">Order confirmed</p>
      <h1 className="mt-4 font-display text-[clamp(2rem,6vw,3.6rem)] uppercase leading-[1.05]">
        Thanks — it&apos;s on the press
      </h1>
      {orderId ? (
        <p className="mt-6 font-mono text-sm uppercase tracking-widest text-[#e7efee]/80">
          Order {orderId}
        </p>
      ) : null}
      <p className="mx-auto mt-6 max-w-md leading-relaxed text-[#e7efee]/75">
        We&apos;ll email you when your jerseys leave our Oslo studio. Printed
        shirts ship in 5 days, custom kits in 7.
      </p>
      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link
          href="/shop"
          className="inline-flex min-h-[48px] items-center rounded-full bg-white px-6 font-mono text-xs uppercase tracking-widest text-[#0a0f18]"
        >
          Keep shopping
        </Link>
        <Link href="/support" className="border-b border-[#e7efee]/40 pb-1 font-mono text-xs uppercase tracking-widest hover:border-[#e7efee]">
          Questions? Support →
        </Link>
      </div>
    </div>
  );
}
