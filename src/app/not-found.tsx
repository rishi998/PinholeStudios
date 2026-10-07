import Link from "next/link";

import { SceneSlot } from "@/components/three/scene-slot";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-16 lg:grid-cols-2">
      <div>
        <h1 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-none font-semibold">That page is not on the lot.</h1>
        <p className="mt-4 text-muted-foreground">Try a studio, or go back home.</p>
        <Button nativeButton={false} className="mt-6" render={<Link href="/studios" />}>
          Browse studios
        </Button>
      </div>
      <SceneSlot kind="aperture" className="h-[320px] overflow-hidden rounded-3xl border border-border" />
    </section>
  );
}
