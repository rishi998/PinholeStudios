"use client";

import { useState } from "react";

import { SceneSlot } from "@/components/three/scene-slot";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

export function RecceViewer({ title, url }: { title: string; url?: string }) {
  const [open, setOpen] = useState(false);

  if (!url) {
    return (
      <div className="grid gap-3">
        <SceneSlot kind="room" className="h-[320px] overflow-hidden rounded-3xl border border-border" />
        <p className="text-sm text-muted-foreground">Add NEXT_PUBLIC_RECCE_URL to replace this preview with the live 360 tour for {title}.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <div className="relative aspect-video overflow-hidden rounded-3xl border border-border bg-[linear-gradient(160deg,#2a1c10,#102018)]">
        {open ? (
          <iframe className="size-full" src={url} title={`${title} 360 recce`} />
        ) : (
          <button
            type="button"
            className="grid size-full place-items-center text-white"
            onClick={() => {
              setOpen(true);
              track("recce_click", { studio: title });
            }}
          >
            Tap to explore
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" onClick={() => document.querySelector("iframe")?.requestFullscreen()}>
          Fullscreen
        </Button>
        <Button nativeButton={false} variant="outline" render={<a href={url} target="_blank" rel="noreferrer" />}>
          Open in new tab
        </Button>
      </div>
    </div>
  );
}
