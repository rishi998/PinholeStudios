"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { StudioImage } from "@/components/studios/studio-image";
import { SampleBadge } from "@/components/ui/sample-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { workCategories, workItems } from "@/data/site-content";
import { waLink } from "@/lib/whatsapp";

const swatches: Record<string, string> = {
  Events: "from-amber-500 to-stone-900",
  "Empty Studio": "from-zinc-500 to-stone-800",
  "Green Screen": "from-emerald-500 to-green-950",
  "House Setup": "from-orange-400 to-amber-900",
  Cyclorama: "from-stone-200 to-zinc-500",
  Podcast: "from-violet-500 to-purple-950",
  Garden: "from-lime-600 to-green-950",
  Lawn: "from-teal-500 to-emerald-950",
};

export function WorkBrowser() {
  const params = useSearchParams();
  const router = useRouter();
  const category = params.get("cat") ?? "All";
  const items = workItems.filter((item) => category === "All" || item.category === category);
  const [active, setActive] = useState<string | null>(null);
  const current = workItems.find((item) => item.id === active);

  return (
    <div className="grid gap-6">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {workCategories.map((item) => (
          <button
            key={item}
            type="button"
            className={`h-11 shrink-0 rounded-full px-4 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${category === item ? "bg-[var(--ember)] text-[oklch(0.2_0.03_50)]" : "border border-border"}`}
            onClick={() => router.replace(item === "All" ? "/work" : `/work?cat=${encodeURIComponent(item)}`, { scroll: false })}
          >
            {item}
          </button>
        ))}
      </div>
      <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.id} className={"videoSrc" in item ? "sm:col-span-2" : undefined}>
            <button type="button" className="block w-full rounded-[var(--radius)] text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none" onClick={() => setActive(item.id)}>
              {"videoSrc" in item ? (
                <span className="relative block overflow-hidden rounded-[var(--radius)] bg-[oklch(0.16_0.012_50)]">
                  <video className="block aspect-[1920/1080] w-full object-contain" src={item.videoSrc} muted playsInline preload="metadata" />
                </span>
              ) : (
                <StudioImage swatch={swatches[item.category] ?? "from-amber-500 to-stone-900"} src={"image" in item ? item.image : undefined} label={item.title} className="aspect-[4/3] rounded-[var(--radius)]" />
              )}
              <span className="mt-3 flex items-center gap-2 font-display text-xl tracking-[-0.03em]">
                {item.title}
                {item.isSample ? <SampleBadge /> : null}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Dialog open={Boolean(current)} onOpenChange={(open) => setActive(open ? active : null)}>
        <DialogContent className="max-w-3xl">
          <DialogTitle>{current?.title}</DialogTitle>
          {current && "videoSrc" in current ? (
            <video className="block aspect-[1920/1080] w-full rounded-[var(--radius)] bg-[oklch(0.16_0.012_50)] object-contain" src={current.videoSrc} controls playsInline />
          ) : current ? (
            <StudioImage swatch={swatches[current.category] ?? "from-amber-500 to-stone-900"} src={"image" in current ? current.image : undefined} label={current.title} className="h-64 rounded-2xl" />
          ) : null}
          {current ? (
            <Button nativeButton={false} render={<a href={waLink(`Hi Pinhole Studio, I'd like to book a similar ${current.category} shoot.`)} target="_blank" rel="noreferrer" />}>
              Book a similar shoot
            </Button>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
