import type { Metadata } from "next";
import Link from "next/link";
import JerseyArt from "@/components/jersey-art";
import PageHeading from "@/components/page-heading";
import { PLAYERS, formatPrice, playerKits } from "@/lib/products";
import { getTeam } from "@/lib/teams";

export const metadata: Metadata = {
  title: "Players · BLAZE PRO",
  description: "Shop jerseys by player — Neymar, Ronaldo, Messi, Mbappé, Bellingham and Vini Jr.",
};

export default function PlayersPage() {
  return (
    <>
      <PageHeading eyebrow="Shop by player" title="Players" />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PLAYERS.map((player) => {
          const kits = playerKits(player.id);
          // Lead with the national-team shirt, the one every fan recognises
          const hero = kits.find((k) => k.teamGroup === "country") ?? kits[0];
          const from = Math.min(...kits.map((k) => k.price));

          return (
            <Link
              key={player.id}
              href={`/shop?player=${player.id}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-[#e7efee]/15 bg-[#e7efee]/[0.03] transition-colors hover:border-[#e7efee]/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e7efee]"
            >
              <div className="store-grid-bg relative aspect-[4/3] border-b border-[#e7efee]/10">
                <span className="absolute left-5 top-5 font-display text-3xl uppercase text-[#e7efee]/90">
                  {player.chip}
                </span>
                <JerseyArt
                  kit={hero.kit}
                  view="back"
                  name={hero.print?.name}
                  number={hero.print?.number}
                  className="absolute bottom-[8%] right-[8%] h-[72%] w-[60%] transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-rotate-2"
                />
              </div>

              <div className="flex flex-1 flex-col gap-4 p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-lg tracking-tight">{player.name}</h2>
                  <p className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-[#e7efee]/55">
                    {kits.length} jerseys
                  </p>
                </div>

                {/* Every team this player has worn, as colour dots */}
                <ul className="flex flex-wrap gap-x-4 gap-y-2">
                  {kits.map((k) => {
                    const team = getTeam(k.teamId ?? "");
                    return (
                      <li key={k.slug} className="flex items-center gap-1.5 text-xs text-[#e7efee]/70">
                        <span
                          aria-hidden="true"
                          className="h-2.5 w-2.5 rounded-full border border-white/30"
                          style={{ backgroundColor: k.kit.base }}
                        />
                        {team?.short}
                      </li>
                    );
                  })}
                </ul>

                <p className="mt-auto flex items-center justify-between border-t border-[#e7efee]/12 pt-4 font-mono text-[10px] uppercase tracking-widest">
                  <span className="text-[#e7efee]/55">From {formatPrice(from)}</span>
                  <span className="text-[#e7efee] transition-transform group-hover:translate-x-1">Shop →</span>
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
