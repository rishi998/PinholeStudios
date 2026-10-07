"use client";

import { useEffect, useState } from "react";

import { StudioImage } from "@/components/studios/studio-image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const frames = ["01", "02", "03", "04"];

export function StudioGallery({ name, swatch }: { name: string; swatch: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const index = frames.indexOf(open ?? "");

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setOpen(frames[(index + 1) % frames.length] ?? frames[0]);
      if (event.key === "ArrowLeft") setOpen(frames[(index - 1 + frames.length) % frames.length] ?? frames[0]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, open]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3">
        {frames.map((frame) => (
          <li key={frame}>
            <button type="button" className="block w-full overflow-hidden rounded-3xl" onClick={() => setOpen(frame)}>
              <StudioImage swatch={swatch} label={`${name} ${frame}`} className="h-40" />
            </button>
          </li>
        ))}
      </ul>
      <Dialog open={Boolean(open)} onOpenChange={(next) => setOpen(next ? open : null)}>
        <DialogContent className="max-w-3xl">
          <DialogTitle>
            {name} {open}
          </DialogTitle>
          {open ? <StudioImage swatch={swatch} label={`${name} ${open}`} className="h-72 rounded-3xl" /> : null}
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(frames[(index - 1 + frames.length) % frames.length] ?? null)}>
              Previous
            </Button>
            <Button type="button" variant="secondary" onClick={() => setOpen(frames[(index + 1) % frames.length] ?? null)}>
              Next
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
