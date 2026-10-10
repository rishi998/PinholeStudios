"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";

export function RecceViewer({ title, url }: { title: string; url: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);

  if (!url) {
    return (
      <div className="grid min-h-64 place-items-center rounded-[var(--radius)] border border-border bg-card p-8 text-center">
        <p>The 360 tour is not available just now.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4" data-lenis-prevent>
      <div className="relative overflow-hidden rounded-[var(--radius)] border border-border bg-[oklch(0.16_0.012_50)]">
        {loaded ? null : (
          <p className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-[oklch(0.92_0.01_85)]">
            Loading the tour…
          </p>
        )}
        <iframe
          ref={frame}
          src={url}
          title={`${title} 360 recce`}
          className="h-[min(70vh,720px)] w-full"
          allow="fullscreen; accelerometer; gyroscope; magnetometer; xr-spatial-tracking"
          allowFullScreen
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" onClick={() => frame.current?.requestFullscreen()}>
          Fullscreen
        </Button>
        <Button nativeButton={false} variant="outline" render={<a href={url} target="_blank" rel="noreferrer" />}>
          Open the tour
        </Button>
      </div>
    </div>
  );
}
