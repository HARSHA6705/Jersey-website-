import type { Metadata } from "next";
import Link from "next/link";
import PageHeading from "@/components/page-heading";
import TeamQuoteForm from "@/components/team-quote-form";

export const metadata: Metadata = {
  title: "Team Orders · BLAZE PRO",
  description: "Kit out your whole squad — bulk pricing, free numbering, one delivery.",
};

const TIERS = [
  { range: "10–24 kits", discount: "10% off", note: "Free name & number printing" },
  { range: "25–49 kits", discount: "15% off", note: "Plus a free custom crest" },
  { range: "50+ kits", discount: "20% off", note: "Dedicated kit manager" },
];

const STEPS = [
  { title: "Send your brief", body: "Tell us your squad size, colours and deadline using the form below." },
  { title: "Approve the design", body: "We send back a mock-up within 2 working days. Unlimited revisions." },
  { title: "Share the roster", body: "One spreadsheet with names, numbers and sizes — we handle the rest." },
  { title: "Kick off", body: "Shirts are pressed and shipped together in 10–14 days." },
];

export default function TeamsPage() {
  return (
    <>
      <PageHeading eyebrow="Clubs · Schools · Five-a-side" title="Team Orders">
        Kit out the whole squad in matching pro-fit jerseys. Bulk pricing, free
        numbering and one delivery to your clubhouse.
      </PageHeading>

      <section aria-labelledby="pricing" className="pt-12">
        <h2 id="pricing" className="font-mono text-[10px] uppercase tracking-widest text-[#e7efee]/60 md:text-xs">
          Squad pricing
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {TIERS.map((t) => (
            <div key={t.range} className="rounded-2xl border border-[#e7efee]/15 bg-[#e7efee]/[0.03] p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-[#e7efee]/60">{t.range}</p>
              <p className="mt-3 font-display text-3xl uppercase">{t.discount}</p>
              <p className="mt-3 text-sm text-[#e7efee]/75">{t.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="how" className="pt-16">
        <h2 id="how" className="font-mono text-[10px] uppercase tracking-widest text-[#e7efee]/60 md:text-xs">
          How it works
        </h2>
        <ol className="mt-6 grid gap-8 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="border-t border-[#e7efee]/25 pt-4">
              <span className="font-mono text-xs text-[#e7efee]/50">0{i + 1}</span>
              <h3 className="mt-2 text-lg tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#e7efee]/70">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="quote" className="mt-16 grid gap-10 rounded-3xl border border-[#e7efee]/15 p-6 md:p-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 id="quote" className="font-display text-2xl uppercase md:text-3xl">Request a quote</h2>
          <p className="mt-4 text-sm leading-relaxed text-[#e7efee]/75">
            Want to see what it looks like first? Design a sample in the{" "}
            <Link href="/custom" className="underline underline-offset-4 hover:text-white">kit builder</Link>{" "}
            and mention it in your message.
          </p>
        </div>
        <TeamQuoteForm />
      </section>
    </>
  );
}
