import GlassHero from "@/components/glass-hero";

export default function Page() {
  return (
    <main className="w-full h-[100dvh] overflow-hidden max-md:h-auto max-md:min-h-[100dvh] max-md:overflow-x-hidden max-md:overflow-y-visible max-md:w-full max-md:max-w-full">
      {/* Desktop: fixed viewport, no scroll (unchanged). Mobile: natural flow so the hero can scroll vertically. */}
      <GlassHero />
    </main>
  );
}
