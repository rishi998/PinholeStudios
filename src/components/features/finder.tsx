"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { StudioImage } from "@/components/studios/studio-image";
import { Badge } from "@/components/ui/badge";
import { mustOptions, shootOptions, type MustHave, type ShootType } from "@/data/studios";
import { track } from "@/lib/analytics";
import { rankStudios } from "@/lib/finder";
import { cn } from "cn";

export function StudioFinder({ compact = false }: { compact?: boolean }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const shoot = (params.get("shoot") as ShootType | null) ?? undefined;
  const must = (params.get("must")?.split(",").filter(Boolean) ?? []) as MustHave[];
  const ranked = rankStudios(shoot, must);

  function update(nextShoot: ShootType | undefined, nextMust: MustHave[]) {
    const query = new URLSearchParams(params.toString());
    if (nextShoot) query.set("shoot", nextShoot);
    else query.delete("shoot");
    if (nextMust.length) query.set("must", nextMust.join(","));
    else query.delete("must");
    router.replace(`${pathname}?${query.toString()}`, { scroll: false });
    track("finder_use", { page: pathname, shoot: nextShoot });
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12">
      <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold">Which studio do I need?</h2>
      <p className="mt-2 text-muted-foreground">I&apos;m shooting a…</p>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {shootOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={shoot === option.id}
            className={cn("h-11 shrink-0 rounded-full border px-4 text-sm", shoot === option.id ? "bg-primary text-primary-foreground" : "border-border")}
            onClick={() => update(shoot === option.id ? undefined : option.id, must)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {compact ? null : (
        <div className="mt-3 flex flex-wrap gap-2">
          {mustOptions.map((option) => {
            const on = must.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={on}
                className={cn("h-11 rounded-full border px-4 text-sm", on ? "bg-primary text-primary-foreground" : "border-border")}
                onClick={() => update(shoot, on ? must.filter((item) => item !== option.id) : [...must, option.id])}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {ranked.length === 0 ? (
            <WhatsAppLink placement="finder-empty">Tell us what you need</WhatsAppLink>
          ) : (
            ranked.map(({ studio, score }, index) => (
              <motion.article layout key={studio.slug} className="overflow-hidden rounded-3xl border border-border bg-card">
                <StudioImage swatch={studio.swatch} label={studio.name} className="h-36" />
                <div className="grid gap-2 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-xl">{studio.name}</h3>
                    <Badge>{index === 0 && shoot ? "Best for your shoot" : `${score}%`}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{studio.summary}</p>
                  <Link href={`/studios/${studio.slug}`} className="text-sm underline-offset-4 hover:underline">View studio</Link>
                </div>
              </motion.article>
            ))
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
