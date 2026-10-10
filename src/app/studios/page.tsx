import { Suspense } from "react";

import { StudioFinder } from "@/components/features/finder";
import { PageIntro } from "@/components/layout/page-intro";

export const metadata = { title: "Studios" };

export default function StudiosPage() {
  return (
    <>
      <PageIntro eyebrow="Seven rooms" title="Studios" lede="Seven ready-to-use locations for shoots, content and events." />
      <div className="mx-auto w-full max-w-[var(--page-width)] px-5 pt-8 pb-[var(--space-section)] md:px-8">
        <Suspense>
          <StudioFinder />
        </Suspense>
      </div>
    </>
  );
}
