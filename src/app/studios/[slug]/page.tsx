import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AvailabilityCalendar } from "@/components/features/availability-calendar";
import { StudioGallery } from "@/components/features/gallery";
import { HouseTabs } from "@/components/features/house-tabs";
import { QuoteDrawer } from "@/components/features/quote-drawer";
import { RecceViewer } from "@/components/features/recce-viewer";
import { ShortlistButton } from "@/components/features/shortlist-button";
import { PageIntro } from "@/components/layout/page-intro";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { FloorPlan } from "@/components/studios/floor-plan";
import { SceneSlot } from "@/components/three/scene-slot";
import { SampleBadge } from "@/components/ui/sample-badge";
import { Button } from "@/components/ui/button";
import { studioPhotos } from "@/data/pinhole-media";
import { sampleReviews } from "@/data/site-content";
import { getStudio, studios } from "@/data/studios";
import { getService } from "@/data/services";
import { availabilityFor } from "@/lib/queries";
import { recceTourUrl } from "@/lib/recce";
import { formatInr } from "@/lib/quote";
import { siteConfig } from "@/lib/site.config";

export const dynamic = "force-dynamic";

const stageColors: Record<string, string> = {
  "empty-studio": "#8a8175",
  "green-screen-studio": "#1f8a4c",
  "the-house-setup": "#e8a317",
  "white-cyclorama": "#d6d3cd",
  "podcast-setup": "#6d28d9",
  "garden-area": "#4d7c0f",
  "lawn-area": "#0f766e",
};

export function generateStaticParams() {
  return studios.map((studio) => ({ slug: studio.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const studio = getStudio(slug);
  return { title: studio?.name ?? "Studio", description: studio?.description };
}

export default async function StudioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const studio = getStudio(slug);
  if (!studio) notFound();
  const rows = await availabilityFor(studio.slug);
  const reviews = sampleReviews.filter((review) => review.studio === studio.slug).slice(0, 3);
  const photos = studioPhotos[studio.slug] ?? [];
  const price = (value: number) => (siteConfig.pricing.mode === "range" ? `${formatInr(studio.pricing.rangeHourly[0])}–${formatInr(studio.pricing.rangeHourly[1])}` : formatInr(value));

  return (
    <>
      <PageIntro eyebrow={studio.index} title={studio.name} lede={studio.description} />
      <div className="mx-auto grid w-full max-w-[var(--page-width)] gap-10 px-5 pt-8 pb-[var(--space-section)] md:px-8">
        {photos[0] ? (
          <Image src={photos[0].src} alt={photos[0].alt} width={1600} height={900} priority className="aspect-[16/9] h-auto w-full rounded-[var(--radius)] object-cover" />
        ) : (
          <SceneSlot kind="stage" color={stageColors[studio.slug]} className="aspect-[16/9] overflow-hidden rounded-[var(--radius)] border border-border" />
        )}
        <div className="flex flex-wrap gap-3">
          <ShortlistButton slug={studio.slug} />
          <QuoteDrawer studioSlug={studio.slug} />
          <Button nativeButton={false} variant="outline" render={<a href={`/api/studios/${studio.slug}/spec-sheet`} />}>
            Download spec sheet
          </Button>
          <WhatsAppLink placement="studio" />
          <Button nativeButton={false} variant="secondary" render={<Link href={`/demo?studio=${studio.slug}`} />}>
            Preview in 3D
          </Button>
        </div>
        <p>{studio.suitability}</p>
        <section>
          <p className="flex items-center gap-3 text-sm text-muted-foreground">
            Measurements below are sample figures until the studio confirms them.
            <SampleBadge />
          </p>
          <ul className="mt-4 border-t border-border">
            {studio.specs.map((spec) => (
              <li key={spec.label} className="flex items-center justify-between gap-3 border-b border-border py-3">
                <span>{spec.label}</span>
                <span className="text-muted-foreground">{spec.value}</span>
              </li>
            ))}
          </ul>
        </section>
        <FloorPlan {...studio.floor} />
        <section>
          <p className="flex items-center gap-3 text-sm text-muted-foreground">
            These rates are sample figures for this room. They are not a confirmed booking price.
            <SampleBadge />
          </p>
          <div className="mt-4 grid border-t border-border md:grid-cols-3">
            {[
              ["Hourly", price(studio.pricing.hourly)],
              ["Half day", price(studio.pricing.halfDay)],
              ["Full day", price(studio.pricing.fullDay)],
            ].map(([label, value]) => (
              <article key={label} className="border-b border-border py-5 md:border-b-0 md:px-6 md:first:pl-0">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-2 font-display text-3xl tracking-[-0.03em]">{value}</p>
                {studio.pricing.popular && label === "Half day" ? <p className="mt-2 text-sm text-[var(--ember)]">Often requested</p> : null}
                <p className="mt-2 text-sm text-muted-foreground">Includes {studio.pricing.includes.join(", ")}</p>
              </article>
            ))}
          </div>
        </section>
        {studio.setups ? <HouseTabs setups={studio.setups} /> : null}
        <StudioGallery name={studio.name} swatch={studio.swatch} photos={photos} />
        <div className="grid gap-6 md:grid-cols-3">
          <List title="Facilities" items={studio.facilities} />
          <List title="Use cases" items={studio.useCases} />
          <List title="Amenities" items={[...studio.amenities, ...studio.equipment]} />
        </div>
        <RecceViewer title={studio.name} url={recceTourUrl} />
        <AvailabilityCalendar studioSlug={studio.slug} rows={rows.map((row) => ({ date: row.date, slot: row.slot, state: row.state }))} />
        <ul className="grid gap-3 md:grid-cols-2">
          {reviews.map((review) => (
            <li key={review.id} className="rounded-3xl border border-border bg-card/80 p-5">
              <p>{review.text}</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                {review.author}
                <SampleBadge />
              </p>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3">
          {studio.relatedServices.map((slug) => {
            const service = getService(slug);
            return service ? (
              <Button key={slug} nativeButton={false} variant="secondary" render={<Link href={`/services/${slug}`} />}>
                {service.name}
              </Button>
            ) : null;
          })}
          {studios
            .filter((item) => item.slug !== studio.slug)
            .slice(0, 3)
            .map((item) => (
              <Button key={item.slug} nativeButton={false} variant="outline" render={<Link href={`/studios/${item.slug}`} />}>
                {item.name}
              </Button>
            ))}
        </div>
      </div>
    </>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 className="font-display text-2xl">{title}</h2>
      <ul className="mt-3 grid gap-2">
        {items.map((item) => (
          <li key={item} className="border-b border-border py-2 text-sm">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
