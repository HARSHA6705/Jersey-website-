export default function PageHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="animate-season-up border-b border-[#e7efee]/15 pb-8 md:pb-12">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[#e7efee]/60 md:text-xs">
        {eyebrow}
      </p>
      <h1 className="mt-3 font-display text-[clamp(2rem,7vw,4.4rem)] uppercase leading-[1.02]">
        {title}
      </h1>
      {children ? (
        <div className="mt-4 max-w-xl text-sm leading-relaxed text-[#e7efee]/75 md:text-base">
          {children}
        </div>
      ) : null}
    </div>
  );
}
