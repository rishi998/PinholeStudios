export function SectionHeading({
  eyebrow,
  title,
  accent,
  lede,
  as = "h2",
}: {
  eyebrow: string;
  title: string;
  accent: string;
  lede?: string;
  as?: "h1" | "h2";
}) {
  const Tag = as;
  return (
    <div className="max-w-[60ch]">
      <p className="font-mono text-xs tracking-[0.18em] text-primary uppercase">{eyebrow}</p>
      <Tag className={`mt-3 font-display font-extrabold tracking-[-0.04em] text-balance ${as === "h1" ? "text-[clamp(3rem,9vw,8.5rem)] leading-[0.92]" : "text-[clamp(2rem,5vw,4.25rem)] leading-[0.95]"}`}>
        {title} <em className="font-serif text-[var(--ember,#ff6b35)] italic">{accent}</em>
      </Tag>
      {lede ? <p className="mt-4 max-w-[60ch] text-[17px] leading-[1.65] text-[#d3cddb]">{lede}</p> : null}
    </div>
  );
}
