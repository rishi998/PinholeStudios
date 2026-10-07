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
import { sampleReviews } from "@/data/site-content";
import { getStudio, studios } from "@/data/studios";
import { getService } from "@/data/services";
import { availabilityFor } from "@/lib/queries";
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
  const price = (value: number) => (siteConfig.pricing.mode === "range" ? `${formatInr(studio.pricing.rangeHourly[0])}–${formatInr(studio.pricing.rangeHourly[1])}` : formatInr(value));

  return (
    <>
      <PageIntro title={studio.name} lede={studio.description} />
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-16">
        <SceneSlot kind="stage" color={stageColors[studio.slug]} className="h-[360px] overflow-hidden rounded-3xl border border-border" />
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
        <ul className="grid gap-2 md:grid-cols-2">
          {studio.specs.map((spec) => (
            <li key={spec.label} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card/70 px-4 py-3">
              <span>{spec.label}</span>
              <span className="flex items-center gap-2 text-muted-foreground">
                {spec.value}
                <SampleBadge />
              </span>
            </li>
          ))}
        </ul>
        <FloorPlan {...studio.floor} />
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Hourly", price(studio.pricing.hourly)],
            ["Half day", price(studio.pricing.halfDay)],
            ["Full day", price(studio.pricing.fullDay)],
          ].map(([label, value]) => (
            <article key={label} className="rounded-3xl border border-border bg-[linear-gradient(160deg,#2a1d12,#141210)] p-5">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 flex items-center gap-2 font-display text-2xl">
                {value}
                <SampleBadge />
              </p>
              {studio.pricing.popular && label === "Half day" ? <p className="mt-2 text-sm text-primary">Popular</p> : null}
              <p className="mt-2 text-sm text-muted-foreground">Includes {studio.pricing.includes.join(", ")}</p>
            </article>
          ))}
        </div>
        {studio.setups ? <HouseTabs setups={studio.setups} /> : null}
        <StudioGallery name={studio.name} swatch={studio.swatch} />
        <div className="grid gap-6 md:grid-cols-3">
          <List title="Facilities" items={studio.facilities} />
          <List title="Use cases" items={studio.useCases} />
          <List title="Amenities" items={[...studio.amenities, ...studio.equipment]} />
        </div>
        <RecceViewer title={studio.name} url={process.env.NEXT_PUBLIC_RECCE_URL} />
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
          <li key={item} className="rounded-2xl border border-border bg-card/60 px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
