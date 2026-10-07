"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="mx-auto grid max-w-xl gap-4 px-4 py-20">
      <h1 className="font-display text-4xl">Something stalled on set.</h1>
      <p className="text-muted-foreground">Try that page again. If it keeps failing, WhatsApp the studio.</p>
      <Button type="button" onClick={reset}>
        Try again
      </Button>
    </section>
  );
}
