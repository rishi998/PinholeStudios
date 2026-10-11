import Link from "next/link";

import { ContactForm } from "@/components/features/contact-form";
import { LotFilmstrip } from "@/components/landing/lot-filmstrip";
import { Reveal } from "@/components/landing/reveal";
import { Showreel } from "@/components/landing/showreel";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { Button } from "@/components/ui/button";
import { SampleBadge } from "@/components/ui/sample-badge";
import { showreel, studioPhotos } from "@/data/pinhole-media";
import { studios } from "@/data/studios";
import { formatInr } from "@/lib/quote";
import { siteConfig } from "@/lib/site.config";

const lot = [
  ["Indoor floors", "An empty production floor, a green screen, and a white cyclorama."],
  ["The house", "Bedroom, living room, kitchen, and dining, already dressed."],
  ["Outdoors", "A garden and a lawn on the same lot."],
  ["Podcast room", "A set built for interviews and long conversations."],
] as const;

export function HomeLanding() {
  const poster = studioPhotos["empty-studio"]?.[0]?.src;

  return (
    <div>
      <section className="mx-auto w-full max-w-[var(--page-width)] px-5 pt-8 pb-[var(--space-section)] md:px-8 md:pt-14">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5 lg:pb-8">
            <Reveal>
              <p className="font-mono text-[0.72rem] tracking-[0.18em] text-muted-foreground uppercase">
                Pinhole Studio · New Delhi
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-5 font-display text-[length:var(--heading-hero)] leading-[0.92] font-extrabold tracking-[-0.045em] text-balance">
                Seven spaces.
                <br />
                One <em className="font-serif text-[var(--ember)] italic">frame</em> at a time.
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-[34ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
                A working lot in Kapashera for films, podcasts, and events. See the rooms, then hold a date.
              </p>
            </Reveal>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button nativeButton={false} render={<Link href="/plan-my-shoot" />} size="lg">
                Plan my shoot
              </Button>
              <WhatsAppLink placement="home-hero" variant="outline" />
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              <Link
                href="/availability"
                className="text-foreground underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                Check which dates are open
              </Link>
            </p>
          </div>
          <Reveal className="lg:col-span-7" delay={0.12}>
            <figure>
            <Showreel src={showreel} poster={poster} />
            <figcaption className="mt-3 text-sm text-muted-foreground">
              Showreel from the studio. Playback starts muted.
            </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      <LotFilmstrip />

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid w-full max-w-[var(--page-width)] gap-10 px-5 py-[var(--space-section)] md:grid-cols-12 md:px-8">
          <Reveal className="md:col-span-4">
            <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[0.95] font-extrabold tracking-[-0.04em]">
              What is already <em className="font-serif text-[var(--ember)] italic">here</em>
            </h2>
          </Reveal>
          <Reveal className="md:col-span-8" delay={0.08}>
          <dl className="grid gap-8 sm:grid-cols-2">
            {lot.map(([title, copy]) => (
              <div key={title}>
                <dt className="font-display text-xl tracking-[-0.03em]">{title}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</dd>
              </div>
            ))}
          </dl>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[var(--page-width)] px-5 py-[var(--space-section)] md:px-8">
        <Reveal className="max-w-[40ch]">
          <p className="flex items-center gap-3 font-mono text-[0.72rem] tracking-[0.18em] text-muted-foreground uppercase">
            Full-day rates
            <SampleBadge />
          </p>
          <h2 className="mt-3 font-display text-[clamp(2.25rem,4.5vw,4rem)] leading-[0.95] font-extrabold tracking-[-0.04em]">
            A starting <em className="font-serif text-[var(--ember)] italic">figure</em>
          </h2>
          <p className="mt-4 text-muted-foreground">
            These full-day amounts are sample rates. The quote you send is the one the studio confirms.
          </p>
        </Reveal>
        <ul className="mt-10 border-t border-border">
          {studios.map((studio) => (
            <li key={studio.slug} className="grid gap-2 border-b border-border py-5 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8">
              <div>
                <Link href={`/studios/${studio.slug}`} className="font-display text-2xl tracking-[-0.03em] underline-offset-4 hover:underline">
                  {studio.name}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">{studio.suitability}</p>
              </div>
              <p className="font-mono text-sm tabular-nums">{formatInr(studio.pricing.fullDay)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Button nativeButton={false} render={<Link href="/pricing" />} size="lg">
            Get my quote
          </Button>
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto grid w-full max-w-[var(--page-width)] gap-12 px-5 py-[var(--space-section)] md:px-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <h2 className="font-display text-[clamp(2.4rem,5vw,4.25rem)] leading-[0.94] font-extrabold tracking-[-0.04em] text-balance">
              Tell us the date.
              <br />
              We will <em className="font-serif text-[var(--ember)] italic">hold</em> it.
            </h2>
            <p className="mt-5 max-w-[36ch] text-muted-foreground">{siteConfig.address.line}</p>
            <div className="mt-6">
              <WhatsAppLink placement="home-close" />
            </div>
          </Reveal>
          <div className="lg:col-span-6 lg:col-start-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
