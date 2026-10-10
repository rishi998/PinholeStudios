"use client";

import { useEffect, useState } from "react";

import { StudioImage } from "@/components/studios/studio-image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const frames = ["01", "02", "03", "04"];

export function StudioGallery({
  name,
  swatch,
  photos = [],
}: {
  name: string;
  swatch: string;
  photos?: { src: string; alt: string }[];
}) {
  const items = photos.length ? photos.map((photo) => photo.src) : frames;
  const [open, setOpen] = useState<string | null>(null);
  const index = items.indexOf(open ?? "");

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setOpen(items[(index + 1) % items.length] ?? items[0]);
      if (event.key === "ArrowLeft") setOpen(items[(index - 1 + items.length) % items.length] ?? items[0]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items, open]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3">
        {items.map((frame) => {
          const photo = photos.find((item) => item.src === frame);
          return (
            <li key={frame}>
              <button type="button" className="block w-full overflow-hidden rounded-3xl" onClick={() => setOpen(frame)}>
                <StudioImage swatch={swatch} src={photo?.src} label={photo?.alt ?? `${name} ${frame}`} className="aspect-[4/3] h-auto" />
              </button>
            </li>
          );
        })}
      </ul>
      <Dialog open={Boolean(open)} onOpenChange={(next) => setOpen(next ? open : null)}>
        <DialogContent className="max-w-3xl">
          <DialogTitle>{photos.find((item) => item.src === open)?.alt ?? name}</DialogTitle>
          {open ? <StudioImage swatch={swatch} src={photos.find((item) => item.src === open)?.src} label={name} className="aspect-[4/3] h-auto rounded-3xl" /> : null}
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(items[(index - 1 + items.length) % items.length] ?? null)}>
              Previous
            </Button>
            <Button type="button" variant="secondary" onClick={() => setOpen(items[(index + 1) % items.length] ?? null)}>
              Next
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
