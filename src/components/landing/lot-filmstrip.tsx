"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { pinholeLogo, studioPhotos } from "@/data/pinhole-media";
import { studios } from "@/data/studios";
import { cn } from "cn";

gsap.registerPlugin(ScrollTrigger);

const frames = studios.flatMap((studio, studioIndex) =>
  (studioPhotos[studio.slug] ?? []).slice(0, 2).map((photo, photoIndex) => ({
    studioIndex,
    photoIndex,
    src: photo.src,
    alt: photo.alt,
  })),
);

function frameMetrics(track: HTMLElement, rail: HTMLElement) {
  const card = track.querySelector<HTMLElement>(".lot-card");
  if (!card) return { step: 0, center: 0, max: 0 };
  const styles = getComputedStyle(track);
  const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
  const step = card.offsetWidth + gap;
  const center = Math.max(0, (rail.clientWidth - card.offsetWidth) / 2);
  return { step, center, max: Math.max(0, (frames.length - 1) * step) };
}

export function LotFilmstrip() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [activeFrame, setActiveFrame] = useState(0);
  const activeStudio = frames[activeFrame]?.studioIndex ?? 0;

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    const rail = railRef.current;
    const track = trackRef.current;
    if (!wrap || !stage || !rail || !track) return;

    const media = window.matchMedia("(prefers-reduced-motion: no-preference)");
    let context: gsap.Context | null = null;

    const setup = () => {
      context?.revert();
      context = null;
      triggerRef.current = null;
      if (!media.matches || getComputedStyle(wrap).display === "none") return;
      const header = document.querySelector("header");
      const headerHeight = Math.ceil(header?.getBoundingClientRect().height ?? 80);
      stage.style.top = `${headerHeight}px`;
      stage.style.height = `calc(100svh - ${headerHeight}px)`;

      context = gsap.context(() => {
        const open = wrap.querySelector<HTMLElement>(".lot-open");
        const head = wrap.querySelector<HTMLElement>(".lot-head");
        const copy = wrap.querySelector<HTMLElement>(".lot-copy");
        let lastFrame = -1;
        const trigger = ScrollTrigger.create({
          trigger: wrap,
          start: () => `top ${Math.ceil(document.querySelector("header")?.getBoundingClientRect().height ?? 80)}px`,
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const intro = Math.min(1, self.progress / 0.16);
            const scene = intro < 0.45 ? 0 : Math.min(1, (intro - 0.45) / 0.55);
            const film = Math.max(0, (self.progress - 0.16) / 0.84);
            if (open) {
              const shown = intro < 0.62 ? Math.min(1, intro / 0.28) : 1 - (intro - 0.62) / 0.38;
              gsap.set(open, {
                opacity: Math.max(0, shown),
                y: intro < 0.62 ? 16 * (1 - intro / 0.62) : -28 * ((intro - 0.62) / 0.38),
                scale: 0.94 + 0.06 * Math.min(1, intro / 0.28),
              });
            }
            gsap.set([head, rail, copy], { opacity: scene, y: 20 * (1 - scene) });
            const metrics = frameMetrics(track, rail);
            const focus = film * (frames.length - 1);
            gsap.set(track, { x: metrics.center - film * metrics.max });
            track.querySelectorAll<HTMLElement>(".lot-card").forEach((card, cardIndex) => {
              const distance = Math.abs(cardIndex - focus);
              gsap.set(card, { scale: distance < 0.45 ? 1 : 0.94, opacity: distance < 0.45 ? 1 : 0.5 });
            });
            const index = Math.min(frames.length - 1, Math.max(0, Math.round(focus)));
            if (index !== lastFrame) {
              lastFrame = index;
              setActiveFrame(index);
            }
          },
        });
        triggerRef.current = trigger;
        track.querySelectorAll("img").forEach((image) => {
          if (image instanceof HTMLImageElement && !image.complete) {
            image.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
          }
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

  function focusFrame(index: number) {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const film = frames.length <= 1 ? 0 : index / (frames.length - 1);
    const progress = 0.16 + film * 0.84;
    window.scrollTo({ top: trigger.start + progress * (trigger.end - trigger.start), behavior: "smooth" });
  }

  return (
    <section aria-label="The lot">
      <div ref={wrapRef} className="lot-pin-wrap">
        <div ref={stageRef} className="lot-stage relative bg-background">
          <div className="lot-open" aria-hidden="true">
            <span className="lot-mark">
              <Image src={pinholeLogo} alt="" width={600} height={320} className="lot-logo" />
            </span>
          </div>
          <div className="lot-head mx-auto flex w-full max-w-[var(--page-width)] items-end justify-between gap-6 px-5 md:px-8">
            <div>
              <p className="font-mono text-[0.72rem] tracking-[0.18em] text-muted-foreground uppercase">The lot</p>
              <h2 className="mt-2 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[0.95] font-extrabold tracking-[-0.04em]">
                Choose the <em className="font-serif text-[var(--ember)] italic">room</em>
              </h2>
            </div>
            <p className="flex flex-wrap justify-end gap-x-5 gap-y-2 text-sm">
              <Link href="/recce" className="underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                Walk the lot in 360
              </Link>
              <Link href="/demo" className="underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                Open the floor plan
              </Link>
            </p>
          </div>

          <div ref={railRef} className="lot-rail">
            <div ref={trackRef} className="lot-track flex items-center gap-4 px-5 will-change-transform md:gap-6 md:px-8">
              {frames.map((frame, index) => {
                const studio = studios[frame.studioIndex];
                return (
                  <button
                    key={`${studio.slug}-${frame.photoIndex}`}
                    type="button"
                    className="lot-card relative block shrink-0 overflow-hidden rounded-[var(--radius)] bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    aria-current={index === activeFrame ? "true" : undefined}
                    aria-label={`${studio.name}, view ${frame.photoIndex + 1}`}
                    onClick={() => focusFrame(index)}
                  >
                    <Image
                      src={frame.src}
                      alt={frame.alt}
                      fill
                      sizes="(max-width: 1024px) 62vw, 46vw"
                      className="object-contain"
                      priority={index === 0}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lot-copy relative mx-auto min-h-28 w-full max-w-[var(--page-width)] px-5 md:px-8">
            {studios.map((studio, index) => {
              const active = index === activeStudio;
              const passed = index < activeStudio;
              return (
                <div
                  key={studio.slug}
                  className={cn("max-w-[42rem]", active ? "relative" : "pointer-events-none absolute inset-x-5 top-0 md:inset-x-8")}
                  aria-hidden={!active}
                >
                  <p className={cn("font-mono text-[0.72rem] tracking-[0.16em] text-muted-foreground transition duration-500", active ? "translate-x-0 opacity-100" : passed ? "translate-x-3 opacity-0" : "-translate-x-3 opacity-0")}>
                    {studio.index} / 07
                  </p>
                  <h3 className={cn("mt-1 font-display text-[clamp(1.6rem,3vw,2.4rem)] tracking-[-0.03em] transition duration-500 delay-75", active ? "translate-y-0 opacity-100" : passed ? "-translate-y-3 opacity-0" : "translate-y-4 opacity-0")}>
                    {studio.name}
                  </h3>
                  <p className={cn("mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground transition duration-500 delay-150", active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")}>
                    {studio.description} {studio.suitability}
                  </p>
                  <Link
                    href={`/studios/${studio.slug}`}
                    tabIndex={active ? 0 : -1}
                    className={cn("mt-2 inline-flex underline-offset-4 transition delay-200 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none", active ? "opacity-100" : "opacity-0")}
                  >
                    Explore studio
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="lot-static mx-auto w-full max-w-[var(--page-width)] px-5 pb-[var(--space-section)] md:px-8">
        <div className="flex flex-col gap-6 border-t border-border pt-12">
          <div>
            <p className="font-mono text-[0.72rem] tracking-[0.18em] text-muted-foreground uppercase">The lot</p>
            <h2 className="mt-3 font-display text-[clamp(2.25rem,4.5vw,4rem)] leading-[0.95] font-extrabold tracking-[-0.04em]">
              Choose the <em className="font-serif text-[var(--ember)] italic">room</em>
            </h2>
          </div>
          <p className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link href="/recce" className="underline-offset-4 hover:underline">
              Walk the lot in 360
            </Link>
            <Link href="/demo" className="underline-offset-4 hover:underline">
              Open the floor plan
            </Link>
          </p>
        </div>
        <ul className="mt-10 grid gap-10">
          {studios.map((studio) => {
            const photo = studioPhotos[studio.slug]?.[0];
            return (
              <li key={studio.slug}>
                <Link href={`/studios/${studio.slug}`} className="block rounded-[var(--radius)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                  <span className="relative block aspect-[4/3] overflow-hidden rounded-[var(--radius)] bg-card">
                    {photo ? <Image src={photo.src} alt={photo.alt} fill sizes="100vw" className="object-cover" /> : null}
                  </span>
                  <span className="mt-3 flex items-baseline justify-between gap-3">
                    <span className="font-display text-2xl tracking-[-0.03em]">{studio.name}</span>
                    <span className="font-mono text-[0.72rem] tracking-[0.16em] text-muted-foreground">{studio.index}</span>
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{studio.description}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
