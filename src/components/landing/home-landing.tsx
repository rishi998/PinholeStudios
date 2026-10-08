"use client";

import { Buildings, Car, Lightning, Microphone, Plant, Users } from "@phosphor-icons/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { ContactForm } from "@/components/features/contact-form";
import { TrustBand } from "@/components/features/trust-band";
import { ApertureMark } from "@/components/layout/aperture-mark";
import { SectionHeading } from "@/components/layout/section-heading";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { Button } from "@/components/ui/button";
import { SampleBadge } from "@/components/ui/sample-badge";
import { testimonials } from "@/data/testimonials";
import { studios } from "@/data/studios";
import { useCases } from "@/data/services";
import { formatInr } from "@/lib/quote";
import { siteConfig } from "@/lib/site.config";

const ApertureHero = dynamic(() => import("@/components/three/aperture-hero").then((mod) => mod.ApertureHero), { ssr: false });
const StudioScene = dynamic(() => import("@/components/three/studio-scene").then((mod) => mod.StudioScene), { ssr: false });
const TestimonialGlobe = dynamic(() => import("@/components/features/testimonial-globe").then((mod) => mod.TestimonialGlobe), { ssr: false });

const swatches = ["from-zinc-600 to-stone-900", "from-emerald-600 to-green-950", "from-amber-500 to-orange-950", "from-stone-200 to-zinc-600", "from-violet-600 to-purple-950", "from-lime-600 to-green-950", "from-teal-600 to-emerald-950"];

export function HomeLanding() {
  const hero = useRef<HTMLElement>(null);
  const cardA = useRef<HTMLAnchorElement>(null);
  const cardB = useRef<HTMLAnchorElement>(null);
  const [hour, setHour] = useState<"midday" | "golden">("golden");
  const [preset, setPreset] = useState("empty-studio");
  const [show3d, setShow3d] = useState(false);
  const [progress, setProgress] = useState(0);
  const skipped = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("pinhole-boot", onStoreChange);
      return () => window.removeEventListener("pinhole-boot", onStoreChange);
    },
    () => sessionStorage.getItem("pinhole-booted") === "1" || window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  useEffect(() => {
    if (skipped) return;
    let value = 0;
    const timer = window.setInterval(() => {
      value += 8;
      setProgress(Math.min(100, value));
      if (value >= 100) {
        window.clearInterval(timer);
        sessionStorage.setItem("pinhole-booted", "1");
        window.dispatchEvent(new Event("pinhole-boot"));
      }
    }, 90);
    return () => window.clearInterval(timer);
  }, [skipped]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!hero.current || !cardA.current || !cardB.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.matchMedia("(max-width: 1023px)").matches) return;
    const tween = gsap.to([cardA.current, cardB.current], {
      scrollTrigger: { trigger: hero.current, start: "top top", end: "bottom top", scrub: true },
      x: (index) => (index === 0 ? -80 : 80),
      rotation: (index) => (index === 0 ? -10 : 8),
      opacity: 0.15,
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [skipped]);

  return (
    <>
      {skipped ? null : (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-background text-primary">
          <div className="grid justify-items-center gap-4">
            <ApertureMark className="size-24" />
            <p className="font-mono text-sm tracking-[0.18em]">{progress}</p>
            <button type="button" className="text-xs text-muted-foreground underline" onClick={() => { sessionStorage.setItem("pinhole-booted", "1"); window.dispatchEvent(new Event("pinhole-boot")); }}>
              Skip
            </button>
          </div>
        </div>
      )}

      <section ref={hero} className="relative min-h-[100svh] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,oklch(0.72_0.16_55/0.28),transparent_46%)]" />
        <div className="pointer-events-none absolute top-8 right-0 hidden h-[70%] w-[46%] lg:block">
          <ApertureHero />
        </div>
        <div className="relative mx-auto grid min-h-[100svh] w-full max-w-6xl content-center gap-8 px-4 py-24">
          <div className="max-w-3xl">
            <p className="font-mono text-xs tracking-[0.18em] text-primary uppercase">Delhi&apos;s production-ready studio floors</p>
            <h1 className="mt-4 font-display text-[clamp(3rem,9vw,8.5rem)] leading-[0.92] font-extrabold tracking-[-0.04em] text-balance">
              Seven spaces.
              <br />
              One <em className="font-serif text-[var(--ember)] italic">frame</em> at a time.
            </h1>
            <p className="mt-5 max-w-[60ch] text-[18px] leading-[1.65] text-muted-foreground">
              Film, pre-wedding, podcast and brand shoots, with sets, lights and crew ready at Farm 57, Kapashera.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button nativeButton={false} size="lg" render={<Link href="/plan-my-shoot" />}>
                Plan my shoot
              </Button>
              <Button nativeButton={false} size="lg" variant="secondary" render={<Link href="/work" />} data-cursor="PLAY">
                Watch showreel
              </Button>
              <WhatsAppLink placement="home-hero" size="lg" />
            </div>
            <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              7 studios · AC · Parking · Crew on call
              <SampleBadge />
            </p>
          </div>
          <div className="flex gap-4 lg:absolute lg:right-8 lg:bottom-24">
            <Link ref={cardA} href="/studios" className="grid h-[170px] w-[280px] max-w-[46vw] -rotate-2 content-between rounded-3xl border border-border bg-card/80 p-4 backdrop-blur-md lg:-rotate-6">
              <span className="font-mono text-xs tracking-[0.18em] text-primary">07 STUDIOS</span>
              <span className="font-display text-2xl">Explore spaces</span>
            </Link>
            <Link ref={cardB} href="/availability" className="grid h-[170px] w-[280px] max-w-[46vw] rotate-2 content-between rounded-3xl border border-border bg-card/90 p-4 lg:rotate-3">
              <span className="font-mono text-xs tracking-[0.18em] text-primary">NEXT FREE DATE</span>
              <span className="text-sm text-muted-foreground">Open the calendar and send a request. Confirmation stays on WhatsApp.</span>
            </Link>
          </div>
          <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">Scroll to continue</p>
        </div>
      </section>

      <section className="overflow-hidden py-10">
        <div className="flex w-max gap-8 motion-safe:animate-[marquee_36s_linear_infinite]">
          {[...useCases, "Pre-wedding", ...useCases].map((item, index) => (
            <span key={`${item}-${index}`} className="font-display text-5xl font-extrabold tracking-tight text-transparent [-webkit-text-stroke:1.5px_oklch(0.72_0.16_75)] md:text-7xl">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-16">
        <SectionHeading eyebrow="01 — 07" title="The floors," accent="named." lede="Each space is a different kind of set. Open one, or preview it in 3D." />
        <ul className="grid gap-4">
          {studios.map((studio, index) => (
            <li key={studio.slug} className={`grid items-end overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br p-6 md:min-h-64 ${swatches[index] ?? swatches[0]}`}>
              <p className="font-mono text-sm tracking-[0.18em] text-white/80">{studio.index} / 07</p>
              <h3 className="font-display text-4xl font-extrabold text-white">{studio.name}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button nativeButton={false} render={<Link href={`/studios/${studio.slug}`} />}>Explore studio</Button>
                <Button nativeButton={false} variant="secondary" render={<Link href="/recce" />}>360° recce</Button>
                <Button nativeButton={false} variant="secondary" render={<Link href={`/demo?studio=${studio.slug}`} />}>Preview in 3D</Button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-16 lg:grid-cols-2">
        <SectionHeading eyebrow="Demo" title="Walk the floor" accent="before" lede="A designed preview of the lot. The full scene, lighting presets and camera chips live on the demo page." />
        <div>
          <Button nativeButton={false} render={<Link href="/demo" />}>Open full 3D demo</Button>
          {show3d ? (
            <div className="mt-4">
              <StudioScene studio={preset} hour={hour} />
              <div className="mt-3 flex flex-wrap gap-2">
                {studios.map((studio) => (
                  <button key={studio.slug} type="button" className="h-11 rounded-full border border-white/15 px-3 text-sm" onClick={() => setPreset(studio.slug)}>
                    {studio.name}
                  </button>
                ))}
                <button type="button" className="h-11 rounded-full bg-primary px-3 text-sm text-primary-foreground" onClick={() => setHour(hour === "midday" ? "golden" : "midday")}>
                  {hour === "midday" ? "Midday" : "Golden hour"}
                </button>
              </div>
            </div>
          ) : (
            <button type="button" className="mt-4 grid h-64 w-full place-items-center rounded-3xl border border-border bg-card" onClick={() => setShow3d(true)}>
              Tap to explore
            </button>
          )}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-16 md:grid-cols-3">
        {[
          [Buildings, "Large floors", "Open indoor space for builds and commercials."],
          [Plant, "Indoor and outdoor", "House sets, garden and lawn on one lot."],
          [Microphone, "Podcast ready", "A treated room for conversations and reels."],
          [Lightning, "Lights and sound", "Grip, lighting and sound support on request."],
          [Car, "Parking", "On-site parking for cast, crew and vans."],
          [Users, "Crew on call", "Technicians and coordination through WhatsApp."],
        ].map(([Icon, title, text]) => (
          <article key={String(title)} className="rounded-3xl border border-border bg-card p-5">
            <span className="grid size-14 place-items-center rounded-2xl border border-border text-primary shadow-[0_0_24px_-8px_oklch(0.79_0.16_76)]">
              <Icon weight="duotone" size={28} />
            </span>
            <h3 className="mt-4 font-display text-2xl">{String(title)}</h3>
            <p className="mt-2 text-muted-foreground">{String(text)}</p>
          </article>
        ))}
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-6">
          <SectionHeading eyebrow="Stories" title="Trusted by creators" accent="and brands." lede="Sample stories until real clients and links are supplied." />
          <TestimonialGlobe />
        </div>
      </section>

      <section className="bg-[oklch(0.9_0.04_75)] px-4 py-20 text-[oklch(0.28_0.04_55)]">
        <div className="mx-auto grid w-full max-w-6xl gap-6">
          <p className="font-mono text-xs tracking-[0.18em] text-[oklch(0.55_0.14_65)] uppercase">Choose your space</p>
          <h2 className="font-display text-[clamp(2rem,5vw,4.25rem)] leading-[0.95] font-extrabold">Hourly, half day, <em className="font-serif italic">full day.</em></h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Hourly", studios[0]?.pricing.hourly ?? 0],
              ["Half day", studios[0]?.pricing.halfDay ?? 0],
              ["Full day", studios[0]?.pricing.fullDay ?? 0],
            ].map(([label, price], index) => (
              <article key={String(label)} className={`rounded-3xl border border-black/10 bg-white p-6 ${index === 1 ? "md:-translate-y-4" : ""}`}>
                <p className="font-mono text-xs tracking-[0.18em] uppercase">{String(label)}{index === 1 ? " · Popular" : ""}</p>
                <p className="mt-3 flex items-center gap-2 font-display text-4xl tabular-nums">
                  {formatInr(Number(price))}
                  <SampleBadge />
                </p>
                <p className="mt-3 text-sm">AC, power, parking and Wi-Fi on the indoor floors.</p>
                <Button nativeButton={false} className="mt-4" render={<Link href="/pricing" />}>Get my quote</Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-16">
        <TrustBand />
        <p className="text-sm text-muted-foreground">{testimonials.length} sample stories. Names stay “Sample client” until the studio supplies real quotes.</p>
      </section>

      <section className="relative overflow-hidden px-4 py-20">
        <div className="relative mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.92] font-extrabold">
              You&apos;ve seen the frame. <em className="font-serif text-[var(--ember)] italic">Let&apos;s shoot.</em>
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button nativeButton={false} size="lg" render={<Link href="/plan-my-shoot" />}>Plan my shoot</Button>
              <WhatsAppLink placement="home-close" size="lg" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{siteConfig.address.line}</p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
