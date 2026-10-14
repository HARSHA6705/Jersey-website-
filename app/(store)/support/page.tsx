import type { Metadata } from "next";
import PageHeading from "@/components/page-heading";

export const metadata: Metadata = {
  title: "Support · BLAZE PRO",
  description: "Size guide, shipping, returns and answers to common questions.",
};

const SIZE_CHART = [
  { size: "XS", chest: "84–89", length: "68" },
  { size: "S", chest: "89–94", length: "70" },
  { size: "M", chest: "94–100", length: "72" },
  { size: "L", chest: "100–106", length: "74" },
  { size: "XL", chest: "106–112", length: "76" },
  { size: "XXL", chest: "112–120", length: "78" },
];

const FAQS = [
  {
    q: "How long does printing take?",
    a: "Name and number printing is done in our Oslo studio and adds no extra time — printed jerseys still ship within 5 days. Custom kits from the kit builder ship in 7.",
  },
  {
    q: "Can I return a printed jersey?",
    a: "Printed and custom shirts are made for you, so they can only be returned if faulty. Unprinted shirts can be returned within 30 days.",
  },
  {
    q: "Is the fit true to size?",
    a: "Pro-fit shirts are cut athletic and slim. If you prefer a relaxed fit or are between sizes, go one size up. Retro shirts are a regular cut.",
  },
  {
    q: "How should I wash my jersey?",
    a: "Turn it inside out, wash at 30°C and hang to dry. Avoid tumble drying and ironing over the print.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes — we ship across Europe and to most countries worldwide. Delivery is free on orders over ₹2,999.",
  },
];

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-32 font-display text-xl uppercase md:text-2xl">
      {children}
    </h2>
  );
}

export default function SupportPage() {
  return (
    <>
      <PageHeading eyebrow="Help centre" title="Support">
        Sizing, delivery, returns and everything else. Can&apos;t find an answer?
        Email{" "}
        <a href="mailto:hello@blazepro.example" className="underline underline-offset-4 hover:text-white">
          hello@blazepro.example
        </a>
        .
      </PageHeading>

      <nav aria-label="Support sections" className="flex flex-wrap gap-2 pt-8">
        {[
          ["#sizing", "Size guide"],
          ["#shipping", "Shipping"],
          ["#returns", "Returns"],
          ["#faq", "FAQ"],
        ].map(([href, label]) => (
          <a
            key={href}
            href={href}
            className="rounded-full border border-[#e7efee]/25 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-[#e7efee]/75 hover:border-[#e7efee]/60 hover:text-white md:text-xs"
          >
            {label}
          </a>
        ))}
      </nav>

      <section aria-labelledby="sizing" className="pt-14">
        <SectionTitle id="sizing">Size guide</SectionTitle>
        <p className="mt-3 text-sm text-[#e7efee]/70">Measurements in cm. Chest measured around the fullest part.</p>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-[#e7efee]/15">
          <table className="w-full min-w-[22rem] text-left text-sm">
            <thead className="bg-[#e7efee]/[0.05] font-mono text-[10px] uppercase tracking-widest text-[#e7efee]/60">
              <tr>
                <th scope="col" className="px-5 py-3 font-normal">Size</th>
                <th scope="col" className="px-5 py-3 font-normal">Chest</th>
                <th scope="col" className="px-5 py-3 font-normal">Body length</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_CHART.map((row) => (
                <tr key={row.size} className="border-t border-[#e7efee]/10">
                  <th scope="row" className="px-5 py-3 font-mono font-normal">{row.size}</th>
                  <td className="px-5 py-3 text-[#e7efee]/85">{row.chest}</td>
                  <td className="px-5 py-3 text-[#e7efee]/85">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-12 pt-14 md:grid-cols-2">
        <section aria-labelledby="shipping">
          <SectionTitle id="shipping">Shipping</SectionTitle>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[#e7efee]/80">
            <li>Stock and printed jerseys ship within 5 days; custom kits within 7.</li>
            <li>Free delivery on orders over ₹2,999, otherwise ₹99 flat.</li>
            <li>You&apos;ll get a tracking link by email as soon as your order leaves the studio.</li>
          </ul>
        </section>
        <section aria-labelledby="returns">
          <SectionTitle id="returns">Returns</SectionTitle>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[#e7efee]/80">
            <li>Unprinted shirts: free returns within 30 days, unworn with tags.</li>
            <li>Printed and custom shirts: returnable only if faulty — we&apos;ll replace them.</li>
            <li>Start a return by emailing us your order number.</li>
          </ul>
        </section>
      </div>

      <section aria-labelledby="faq" className="pt-14">
        <SectionTitle id="faq">FAQ</SectionTitle>
        <div className="mt-6 divide-y divide-[#e7efee]/12 border-y border-[#e7efee]/12">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base md:text-lg [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="font-mono text-xl text-[#e7efee]/60 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#e7efee]/75">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
