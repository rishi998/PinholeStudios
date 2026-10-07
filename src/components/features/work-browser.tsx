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
  const [playing, setPlaying] = useState(false);
  const current = workItems.find((item) => item.id === active);

  return (
    <div className="grid gap-6">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {workCategories.map((item) => (
          <button
            key={item}
            type="button"
            className={`h-11 shrink-0 rounded-full px-4 text-sm ${category === item ? "bg-primary text-primary-foreground" : "border border-border bg-card"}`}
            onClick={() => router.replace(item === "All" ? "/work" : `/work?cat=${encodeURIComponent(item)}`, { scroll: false })}
          >
            {item}
          </button>
        ))}
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id}>
            <button type="button" className="block w-full overflow-hidden rounded-3xl text-left" onClick={() => { setActive(item.id); setPlaying(false); }}>
              <StudioImage swatch={swatches[item.category] ?? "from-amber-500 to-stone-900"} label={item.title} className="h-48" />
              <span className="mt-2 flex items-center gap-2 text-sm">
                {item.title}
                <SampleBadge />
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Dialog open={Boolean(current)} onOpenChange={(open) => setActive(open ? active : null)}>
        <DialogContent className="max-w-3xl">
          <DialogTitle>{current?.title}</DialogTitle>
          {current?.kind === "video" && "vimeoId" in current ? (
            playing ? (
              <iframe className="aspect-video w-full rounded-2xl" src={`https://player.vimeo.com/video/${current.vimeoId}`} title={current.title} allow="autoplay; fullscreen" />
            ) : (
              <button type="button" className="relative block w-full" onClick={() => setPlaying(true)}>
                <StudioImage swatch={swatches[current.category] ?? "from-amber-500 to-stone-900"} label="Play sample film" className="h-64 rounded-2xl" />
              </button>
            )
          ) : current?.kind === "instagram" ? (
            <p className="text-sm text-muted-foreground">Instagram cards stay as styled previews. Add a profile URL in site config to link out.</p>
          ) : current ? (
            <StudioImage swatch={swatches[current.category] ?? "from-amber-500 to-stone-900"} label={current.title} className="h-64 rounded-2xl" />
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
