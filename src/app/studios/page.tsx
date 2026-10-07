import { Suspense } from "react";

import { StudioFinder } from "@/components/features/finder";
import { PageIntro } from "@/components/layout/page-intro";

export const metadata = { title: "Studios" };

export default function StudiosPage() {
  return (
    <>
      <PageIntro title="Studios" lede="Seven ready-to-use locations for shoots, content and events." />
      <div className="mx-auto w-full max-w-6xl px-4 pb-16">
        <Suspense>
          <StudioFinder />
        </Suspense>
      </div>
    </>
  );
}
