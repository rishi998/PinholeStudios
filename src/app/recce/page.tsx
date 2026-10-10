import Link from "next/link";

import { RecceViewer } from "@/components/features/recce-viewer";
import { PageIntro } from "@/components/layout/page-intro";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { Button } from "@/components/ui/button";
import { studios } from "@/data/studios";
import { recceTourUrl } from "@/lib/recce";

export const metadata = { title: "360° Recce" };

export default function ReccePage() {
  return (
    <>
      <PageIntro
        eyebrow="Before you book"
        title="360° Recce"
        lede="One walk-through of the lot. Drag inside the tour to look around. It is the same tour for the studio, not a separate reconstruction of each room."
      />
      <div className="mx-auto w-full max-w-[var(--page-width)] px-5 pt-8 pb-[var(--space-section)] md:px-8">
        <RecceViewer title="Pinhole Studio" url={recceTourUrl} />
        <div className="mt-12 flex flex-wrap items-center gap-3">
          <Button nativeButton={false} render={<Link href="/studios" />} size="lg">
            Choose a studio
          </Button>
          <WhatsAppLink placement="recce" variant="outline" />
        </div>
        <ul className="mt-10 border-t border-border">
          {studios.map((studio) => (
            <li key={studio.slug} className="border-b border-border">
              <Link href={`/studios/${studio.slug}`} className="flex items-baseline justify-between gap-4 py-4 underline-offset-4 hover:underline">
                <span className="font-display text-2xl tracking-[-0.03em]">{studio.name}</span>
                <span className="hidden text-sm text-muted-foreground sm:block">{studio.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
