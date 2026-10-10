export function PageIntro({ eyebrow, title, lede }: { eyebrow?: string; title: string; lede: string }) {
  return (
    <section className="mx-auto w-full max-w-[var(--page-width)] px-5 pt-10 md:px-8 md:pt-16">
      {eyebrow ? <p className="font-mono text-[0.72rem] tracking-[0.18em] text-muted-foreground uppercase">{eyebrow}</p> : null}
      <h1 className={`font-display text-[clamp(2.75rem,6vw,5.25rem)] leading-[0.92] font-extrabold tracking-[-0.045em] text-balance ${eyebrow ? "mt-4" : ""}`}>
        {title}
      </h1>
      <p className="mt-5 max-w-[46ch] text-[1.0625rem] leading-relaxed text-muted-foreground">{lede}</p>
    </section>
  );
}
