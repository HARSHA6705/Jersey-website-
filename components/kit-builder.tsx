"use client";

import { useState } from "react";
import JerseyArt from "@/components/jersey-art";
import {
  AddedNotice,
  PrintFields,
  QtyStepper,
  SizePicker,
  labelClass,
  primaryButton,
} from "@/components/kit-options";
import { cart, unitPrice } from "@/lib/cart";
import { CUSTOM_SLUG, formatPrice, type Size } from "@/lib/products";
import { TEAMS, teamsIn, type TeamGroup } from "@/lib/teams";

const GROUPS: { id: TeamGroup; label: string }[] = [
  { id: "country", label: "Country" },
  { id: "club", label: "Club" },
];

export default function KitBuilder() {
  const [group, setGroup] = useState<TeamGroup>("country");
  const [teamId, setTeamId] = useState(TEAMS[0].id);
  const [view, setView] = useState<"front" | "back">("front");
  const [size, setSize] = useState<Size | null>(null);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);

  const team = TEAMS.find((t) => t.id === teamId)!;
  const price = unitPrice({ slug: CUSTOM_SLUG, name, number });

  const selectGroup = (next: TeamGroup) => {
    setGroup(next);
    // Jump to the first team of the new group so the preview always matches the tab
    if (team.group !== next) setTeamId(teamsIn(next)[0].id);
  };

  const addToCart = () => {
    if (!size) {
      setSizeError(true);
      return;
    }
    cart.add(
      {
        slug: CUSTOM_SLUG,
        size,
        name: name.trim() || undefined,
        number: number || undefined,
        custom: team.kit,
        team: team.name,
      },
      qty
    );
    setAdded(true);
  };

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="store-grid-bg relative aspect-square overflow-hidden rounded-3xl border border-[#e7efee]/15 bg-[#e7efee]/[0.03]">
          <p className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-widest text-[#e7efee]/70 md:text-xs">
            {team.name}
          </p>
          <JerseyArt
            kit={team.kit}
            view={view}
            name={name}
            number={number}
            title={`${team.name} kit, ${view} view`}
            className="absolute inset-[10%] h-[80%] w-[80%]"
          />
          <button
            type="button"
            onClick={() => setView(view === "front" ? "back" : "front")}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-[#e7efee]/25 bg-[#0e1f16]/70 px-4 py-2 font-mono text-[10px] uppercase tracking-widest backdrop-blur hover:border-[#e7efee]/60"
          >
            Show {view === "front" ? "back" : "front"} ↻
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <fieldset>
          <legend className={labelClass}>Kit type</legend>
          <div className="mt-3 grid grid-cols-2 gap-2 rounded-full border border-[#e7efee]/20 p-1" role="group">
            {GROUPS.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => selectGroup(g.id)}
                aria-pressed={group === g.id}
                className={`min-h-[44px] rounded-full font-mono text-xs uppercase tracking-widest transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7efee] ${
                  group === g.id ? "bg-[#e7efee] text-[#0e1f16]" : "text-[#e7efee]/70 hover:text-white"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={labelClass}>
            {group === "country" ? "Country" : "Club"} ·{" "}
            <span className="normal-case tracking-normal text-[#e7efee]/80">{team.name}</span>
          </legend>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {teamsIn(group).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTeamId(t.id)}
                aria-pressed={teamId === t.id}
                className={`flex flex-col items-center gap-2 rounded-xl border px-1 py-3 transition-colors focus-visible:outline-2 focus-visible:outline-[#e7efee] ${
                  teamId === t.id ? "border-[#e7efee] bg-[#e7efee]/10" : "border-[#e7efee]/20 hover:border-[#e7efee]/50"
                }`}
              >
                <JerseyArt kit={t.kit} className="h-11 w-11" />
                <span className="text-center font-mono text-[9px] uppercase leading-tight tracking-widest">{t.name}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <SizePicker
          value={size}
          onChange={(s) => {
            setSize(s);
            setSizeError(false);
          }}
          error={sizeError}
        />
        <PrintFields name={name} number={number} onName={setName} onNumber={setNumber} onFocus={() => setView("back")} />

        <div className="flex items-center gap-4">
          <QtyStepper value={qty} onChange={setQty} />
          <button type="button" onClick={addToCart} className={primaryButton}>
            Add to cart · {formatPrice(price * qty)}
          </button>
        </div>
        {added ? <AddedNotice onClose={() => setAdded(false)} /> : null}
      </div>
    </div>
  );
}
