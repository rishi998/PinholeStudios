import { AvailabilityCalendar } from "@/components/features/availability-calendar";
import { PageIntro } from "@/components/layout/page-intro";
import { studios } from "@/data/studios";
import { availabilityFor } from "@/lib/queries";
import { cn } from "cn";

export const dynamic = "force-dynamic";

export const metadata = { title: "Availability" };

export default async function AvailabilityPage({ searchParams }: { searchParams: Promise<{ studio?: string }> }) {
  const { studio: requested } = await searchParams;
  const studio = studios.find((item) => item.slug === requested) ?? studios[0];
  if (!studio) return null;
  const rows = await availabilityFor(studio.slug);

  return (
    <>
      <PageIntro
        eyebrow="A request, not a hold"
        title="Availability"
        lede="Pick a studio and a preferred date. This calendar is the studio's own list, not a live diary. An unmarked day is not a guaranteed opening, and the studio confirms the request on WhatsApp."
      />
      <div className="mx-auto w-full max-w-[var(--page-width)] px-5 pt-8 pb-[var(--space-section)] md:px-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {studios.map((item) => (
            <a
              key={item.slug}
              href={`/availability?studio=${item.slug}`}
              className={cn(
                "h-11 shrink-0 rounded-full border px-4 py-2 text-sm",
                item.slug === studio.slug ? "border-transparent bg-[var(--ember)] text-[oklch(0.2_0.03_50)]" : "border-border"
              )}
            >
              {item.name}
            </a>
          ))}
        </div>
        <div className="mt-8 max-w-3xl">
          <AvailabilityCalendar studioSlug={studio.slug} rows={rows.map((row) => ({ date: row.date, slot: row.slot, state: row.state }))} />
        </div>
      </div>
    </>
  );
}
