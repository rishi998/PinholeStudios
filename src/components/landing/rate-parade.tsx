"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { SampleBadge } from "@/components/ui/sample-badge";
import { studios } from "@/data/studios";
import { formatInr } from "@/lib/quote";
import { cn } from "cn";

gsap.registerPlugin(ScrollTrigger);

const cards = studios.map((studio) => ({
  slug: studio.slug,
  name: studio.name,
  index: studio.index,
  price: studio.pricing.fullDay,
}));

function Doodle({ slug, active }: { slug: string; active: boolean }) {
  return <span className={cn("rate-doodle", active && "is-on")} aria-hidden="true">{drawings[slug]}</span>;
}

const drawings: Record<string, ReactNode> = {
  "empty-studio": (
    <svg viewBox="0 0 120 80">
      <rect x="26" y="36" width="68" height="32" rx="6" />
      <g className="rate-slate">
        <rect x="26" y="18" width="68" height="16" rx="4" className="rate-fill" />
        <path d="M34 22h8M48 22h8M62 22h8M76 22h8" />
      </g>
      <circle cx="78" cy="52" r="2.2" className="rate-eye" />
    </svg>
  ),
  "green-screen-studio": (
    <svg viewBox="0 0 120 80">
      <rect x="18" y="16" width="52" height="40" rx="4" className="rate-green" />
      <rect x="58" y="28" width="40" height="26" rx="6" />
      <circle cx="78" cy="41" r="7" className="rate-lens" />
      <path d="M70 54h16" />
    </svg>
  ),
  "the-house-setup": (
    <svg viewBox="0 0 120 80">
      <path d="M24 40 L60 18 L96 40" />
      <rect x="34" y="40" width="52" height="26" rx="2" />
      <rect x="54" y="50" width="12" height="16" className="rate-fill" />
      <circle cx="44" cy="50" r="3" />
    </svg>
  ),
  "white-cyclorama": (
    <svg viewBox="0 0 120 80">
      <path d="M24 58c8-28 64-28 72 0" className="rate-cyc" />
      <path d="M60 14v10M48 18l6 8M72 18l-6 8" />
      <path d="M42 28h36" className="rate-cone" />
    </svg>
  ),
  "podcast-setup": (
    <svg viewBox="0 0 120 80">
      <rect x="52" y="16" width="16" height="28" rx="8" />
      <path d="M46 34a14 14 0 0 0 28 0" />
      <path d="M60 48v10" />
      <path d="M28 30h8M28 40h12M84 30h8M80 40h12" className="rate-waves" />
    </svg>
  ),
  "garden-area": (
    <svg viewBox="0 0 120 80">
      <circle cx="78" cy="28" r="10" className="rate-sun" />
      <path d="M78 12v4M78 40v4M62 28h-4M98 28h-4" className="rate-rays" />
      <path d="M30 58c8-16 18-16 24 0" />
      <path d="M42 58V40" />
    </svg>
  ),
  "lawn-area": (
    <svg viewBox="0 0 120 80">
      <path d="M22 60h76" />
      <path d="M34 60c6-18 14-18 18 0" />
      <rect x="62" y="34" width="28" height="18" rx="4" />
      <circle cx="76" cy="43" r="4" className="rate-lens" />
      <path d="M62 34h28" className="rate-frame" />
    </svg>
  ),
};

export function RateParade() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const rail = railRef.current;
    const track = trackRef.current;
    if (!wrap || !rail || !track) return;
    const media = window.matchMedia("(prefers-reduced-motion: no-preference)");
    let context: gsap.Context | null = null;

    const setup = () => {
      context?.revert();
      context = null;
      if (!media.matches || getComputedStyle(wrap).display === "none") return;
      const headerHeight = Math.ceil(document.querySelector("header")?.getBoundingClientRect().height ?? 80);
      const stage = wrap.querySelector<HTMLElement>(".rate-stage");
      if (stage) {
        stage.style.top = `${headerHeight}px`;
        stage.style.height = `calc(100svh - ${headerHeight}px)`;
      }
      context = gsap.context(() => {
        let last = -1;
        ScrollTrigger.create({
          trigger: wrap,
          start: () => `top ${Math.ceil(document.querySelector("header")?.getBoundingClientRect().height ?? 80)}px`,
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const card = track.querySelector<HTMLElement>(".rate-card");
            if (!card) return;
            const gap = Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
            const step = card.offsetWidth + gap;
            const center = Math.max(0, (rail.clientWidth - card.offsetWidth) / 2);
            const max = Math.max(0, (cards.length - 1) * step);
            const focus = self.progress * (cards.length - 1);
            gsap.set(track, { x: center - self.progress * max });
            track.querySelectorAll<HTMLElement>(".rate-card").forEach((item, index) => {
              const distance = Math.abs(index - focus);
              gsap.set(item, { scale: distance < 0.45 ? 1 : 0.94, opacity: distance < 0.45 ? 1 : 0.62 });
            });
            const index = Math.min(cards.length - 1, Math.max(0, Math.round(focus)));
            if (index !== last) {
              last = index;
              setActive(index);
            }
          },
        });
      }, wrap);
    };

    const onResize = () => ScrollTrigger.refresh();
    setup();
    media.addEventListener("change", setup);
    window.addEventListener("resize", onResize);
    return () => {
      media.removeEventListener("change", setup);
      window.removeEventListener("resize", onResize);
      context?.revert();
    };
  }, []);

  function rail(tracked: boolean) {
    return (
      <div ref={tracked ? trackRef : undefined} className="rate-track flex items-stretch gap-4 px-5 md:gap-6 md:px-8">
        {cards.map((card, index) => (
          <article key={card.slug} className="rate-card shrink-0 rounded-[var(--radius)] border border-border bg-card p-4" aria-current={index === active ? "true" : undefined}>
            <Doodle slug={card.slug} active={index === active} />
            <p className="mt-3 font-mono text-[0.72rem] tracking-[0.16em] text-muted-foreground">{card.index} / 07</p>
            <h3 className="mt-1 font-display text-xl tracking-[-0.03em]">
              <Link href={`/studios/${card.slug}`} className="underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                {card.name}
              </Link>
            </h3>
            <p className="mt-2 font-mono text-lg tabular-nums">{formatInr(card.price)}</p>
          </article>
        ))}
      </div>
    );
  }

  return (
    <section className="py-[var(--space-section)]" aria-label="Full-day rates">
      <div className="mx-auto w-full max-w-[var(--page-width)] px-5 md:px-8">
        <p className="flex items-center gap-3 font-mono text-[0.72rem] tracking-[0.18em] text-muted-foreground uppercase">
          Full-day rates
          <SampleBadge />
        </p>
        <h2 className="mt-3 font-display text-[clamp(2.25rem,4.5vw,4rem)] leading-[0.95] font-extrabold tracking-[-0.04em]">
          A starting <em className="font-serif text-[var(--ember)] italic">figure</em>
        </h2>
        <p className="mt-4 max-w-[46ch] text-muted-foreground">
          These full-day amounts are sample rates. The quote you send is the one the studio confirms.
        </p>
      </div>
      <div ref={wrapRef} className="rate-pin">
        <div className="rate-stage bg-background">
          <div ref={railRef} className="rate-rail overflow-hidden">
            {rail(true)}
          </div>
        </div>
      </div>
      <div className="rate-static overflow-x-auto pb-2">{rail(false)}</div>
      <div className="mx-auto mt-8 w-full max-w-[var(--page-width)] px-5 md:px-8">
        <Button nativeButton={false} render={<Link href="/pricing" />} size="lg">
          Get my quote
        </Button>
      </div>
    </section>
  );
}
