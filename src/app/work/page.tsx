import { Suspense } from "react";

import { WorkBrowser } from "@/components/features/work-browser";
import { PageIntro } from "@/components/layout/page-intro";
import { SceneSlot } from "@/components/three/scene-slot";

export const metadata = { title: "Work" };

export default function WorkPage() {
  return (
    <>
      <PageIntro title="Work" lede="Sample films and stills across the studio spaces. Replace these with the client's portfolio." />
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 pb-16">
        <SceneSlot kind="stage" color="#6d28d9" className="h-[280px] overflow-hidden rounded-3xl border border-border" />
        <Suspense>
          <WorkBrowser />
        </Suspense>
      </div>
    </>
  );
}
