export function PageIntro({ title, lede }: { title: string; lede: string }) {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto w-full max-w-5xl px-4 py-16 md:py-24">
        <h1 className="font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.92] font-extrabold tracking-[-0.04em] text-balance">{title}</h1>
        <p className="mt-4 max-w-[60ch] text-[17px] leading-[1.65] text-muted-foreground">{lede}</p>
      </div>
    </section>
  )
}
