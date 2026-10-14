import Link from "next/link";
import { PLAYERS } from "@/lib/products";

const linkClass =
  "text-[#e7efee]/70 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7efee] rounded";

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[#e7efee]/15">
      <div className="mx-auto grid max-w-[90rem] gap-10 px-4 py-14 md:grid-cols-4 md:px-[max(5.6vw,2rem)]">
        <div className="md:col-span-2">
          <p className="font-display text-2xl uppercase">Blaze Pro</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#e7efee]/70">
            Pro-fit matchday jerseys, pressed with your name and number in our
            Oslo studio. Ships in 5 days.
          </p>
        </div>

        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-widest text-[#e7efee]/50">Shop</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {PLAYERS.map((p) => (
              <li key={p.id}>
                <Link href={`/shop?player=${p.id}`} className={linkClass}>
                  {p.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/custom" className={linkClass}>
                Kit builder
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-widest text-[#e7efee]/50">Help</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/support#sizing" className={linkClass}>Size guide</Link></li>
            <li><Link href="/support#shipping" className={linkClass}>Shipping</Link></li>
            <li><Link href="/support#returns" className={linkClass}>Returns</Link></li>
            <li><Link href="/teams" className={linkClass}>Team orders</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#e7efee]/10">
        <p className="mx-auto max-w-[90rem] px-4 py-5 font-mono text-[10px] uppercase tracking-widest text-[#e7efee]/45 md:px-[max(5.6vw,2rem)]">
          © 2026 Blaze Pro · Oslo
        </p>
      </div>
    </footer>
  );
}
