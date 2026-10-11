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

    const media = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    let context: gsap.Context | null = null;

    const setup = () => {
      context?.revert();
      context = null;
      triggerRef.current = null;
      if (!media.matches || getComputedStyle(wrap).display === "none") return;

      context = gsap.context(() => {
        const cue = gsap.timeline({ paused: true });
        cue.from(".lot-cue", { opacity: 0, y: 14, duration: 0.55, stagger: 0.08, ease: "power3.out", immediateRender: false });

        let lastFrame = -1;
        const trigger = ScrollTrigger.create({
          trigger: wrap,
          start: "top 5rem",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          onEnter: () => cue.play(),
          onUpdate: (self) => {
            const metrics = frameMetrics(track, rail);
            gsap.set(track, { x: metrics.center - self.progress * metrics.max });
            const index = Math.min(frames.length - 1, Math.max(0, Math.round(self.progress * (frames.length - 1))));
            const cards = track.querySelectorAll<HTMLElement>(".lot-card");
            cards.forEach((card, cardIndex) => {
              const distance = Math.abs(cardIndex - self.progress * (frames.length - 1));
              gsap.set(card, { scale: distance < 0.45 ? 1 : 0.94, opacity: distance < 0.45 ? 1 : 0.55 });
            });
            if (index !== lastFrame) {
              lastFrame = index;
              setActiveFrame(index);
            }
          },
        });
        triggerRef.current = trigger;
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
    const progress = frames.length <= 1 ? 0 : index / (frames.length - 1);
    window.scrollTo({ top: trigger.start + progress * (trigger.end - trigger.start), behavior: "smooth" });
  }

  return (
    <section aria-label="The lot">
      <div ref={wrapRef} className="lot-pin-wrap">
        <div ref={stageRef} className="lot-stage bg-background">
          <div className="mx-auto flex w-full max-w-[var(--page-width)] items-end justify-between gap-6 px-5 md:px-8">
            <div>
              <span className="lot-cue lot-mark" aria-hidden="true">
                <Image src={pinholeLogo} alt="" width={600} height={320} className="lot-logo" />
              </span>
              <p className="lot-cue mt-4 font-mono text-[0.72rem] tracking-[0.18em] text-muted-foreground uppercase">The lot</p>
              <h2 className="lot-cue mt-2 font-display text-[clamp(2.25rem,4.5vw,4rem)] leading-[0.95] font-extrabold tracking-[-0.04em]">
                Choose the <em className="font-serif text-[var(--ember)] italic">room</em>
              </h2>
            </div>
            <p className="lot-cue flex flex-wrap justify-end gap-x-5 gap-y-2 text-sm">
              <Link href="/recce" className="underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                Walk the lot in 360
              </Link>
              <Link href="/demo" className="underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                Open the floor plan
              </Link>
            </p>
          </div>

          <div ref={railRef} className="mt-6 overflow-hidden">
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
                      className="object-cover"
                      priority={index === 0}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative mx-auto mt-6 min-h-40 w-full max-w-[var(--page-width)] px-5 md:px-8">
            {studios.map((studio, index) => (
              <div
                key={studio.slug}
                className={cn(
                  "max-w-[46ch] transition-[opacity,transform] duration-500",
                  index === activeStudio ? "relative opacity-100" : "pointer-events-none absolute inset-x-5 top-0 opacity-0 md:inset-x-8",
                  index < activeStudio ? "-translate-y-3" : index > activeStudio ? "translate-y-4" : "translate-y-0",
                )}
                aria-hidden={index !== activeStudio}
              >
                <p className="font-mono text-[0.72rem] tracking-[0.16em] text-muted-foreground">
                  {studio.index} / 07
                </p>
                <h3 className="mt-2 font-display text-3xl tracking-[-0.03em]">{studio.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{studio.description}</p>
                <p className="mt-2 text-sm leading-relaxed">{studio.suitability}</p>
                <Link
                  href={`/studios/${studio.slug}`}
                  tabIndex={index === activeStudio ? 0 : -1}
                  className="mt-3 inline-flex underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  Explore studio
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lot-fallback mx-auto w-full max-w-[var(--page-width)] px-5 pb-[var(--space-section)] md:px-8">
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
