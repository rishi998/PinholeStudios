"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { Button } from "@/components/ui/button";
import { cameraPresets } from "@/components/three/studio-scene";

const StudioScene = dynamic(() => import("@/components/three/studio-scene").then((mod) => mod.StudioScene), { ssr: false });

function DemoView() {
  const params = useSearchParams();
  const initial = params.get("studio") ?? "overview";
  const [studio, setStudio] = useState(cameraPresets[initial] ? initial : "overview");
  const [hour, setHour] = useState<"midday" | "golden">("golden");
  const [panel, setPanel] = useState<"customize" | "about" | null>(null);

  return (
    <div className="grid gap-4 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-4xl font-extrabold">Step inside Pinhole</h1>
        <Button nativeButton={false} variant="secondary" render={<Link href="/" />}>
          Back
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">Drag is limited in this preview. Pick a view below. Sun colour follows the lighting preset.</p>
      <StudioScene studio={studio} hour={hour} className="h-[70svh]" />
      <div className="flex gap-2 overflow-x-auto" data-demo-presets>
        {Object.entries(cameraPresets).map(([id, preset]) => (
          <button key={id} type="button" data-preset={id} className={`h-11 shrink-0 rounded-full px-4 text-sm ${studio === id ? "bg-primary text-primary-foreground" : "border border-border bg-card"}`} onClick={() => setStudio(id)}>
            {preset.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" onClick={() => setPanel(panel === "customize" ? null : "customize")}>
          Customize the scene
        </Button>
        <Button type="button" variant="secondary" onClick={() => setPanel(panel === "about" ? null : "about")}>
          About
        </Button>
        <Button type="button" onClick={() => setHour(hour === "midday" ? "golden" : "midday")}>
          {hour === "midday" ? "Midday" : "Golden hour"}
        </Button>
      </div>
      {panel ? (
        <div className="max-w-md rounded-3xl border border-border bg-card/90 p-5 backdrop-blur-md" onKeyDown={(event) => { if (event.key === "Escape") setPanel(null); }}>
          {panel === "customize" ? (
            <>
              <p className="font-medium">Lighting</p>
              <p className="mt-2 text-sm text-muted-foreground">Midday is cooler. Golden hour pushes the sun toward ember. Ultra shadows stay off in this build because they are expensive for the GPU.</p>
            </>
          ) : (
            <>
              <p>A virtual walk of the Farm 57 lot. Book the real space on WhatsApp.</p>
              <div className="mt-3 flex gap-2">
                <WhatsAppLink placement="demo" />
                <Button nativeButton={false} variant="secondary" render={<Link href="/plan-my-shoot" />}>
                  Plan my shoot
                </Button>
              </div>
            </>
          )}
          <button type="button" className="mt-3 text-sm underline" onClick={() => setPanel(null)}>
            Close
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function DemoPage() {
  return (
    <Suspense>
      <DemoView />
    </Suspense>
  );
}
