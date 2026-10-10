import { Suspense } from "react";

import { WorkBrowser } from "@/components/features/work-browser";
import { PageIntro } from "@/components/layout/page-intro";

export const metadata = { title: "Work" };

export default function WorkPage() {
  return (
    <>
      <PageIntro eyebrow="Stills and film" title="Work" lede="Stills and the studio showreel from Pinhole Studio." />
      <div className="mx-auto w-full max-w-[var(--page-width)] px-5 pt-8 pb-[var(--space-section)] md:px-8">
        <Suspense>
          <WorkBrowser />
        </Suspense>
      </div>
    </>
  );
}
