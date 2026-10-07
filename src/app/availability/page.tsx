import { AvailabilityCalendar } from "@/components/features/availability-calendar";
import { PageIntro } from "@/components/layout/page-intro";
import { studios } from "@/data/studios";
import { availabilityFor } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Availability" };

export default async function AvailabilityPage({ searchParams }: { searchParams: Promise<{ studio?: string }> }) {
  const { studio: requested } = await searchParams;
  const studio = studios.find((item) => item.slug === requested) ?? studios[0];
  if (!studio) return null;
  const rows = await availabilityFor(studio.slug);

  return (
    <>
      <PageIntro title="Availability" lede="Pick a studio, then a free date. Booking requests stay pending until the studio confirms them on WhatsApp." />
      <div className="mx-auto grid w-full max-w-4xl gap-4 px-4 pb-16">
        <div className="flex gap-2 overflow-x-auto">
          {studios.map((item) => (
            <a key={item.slug} href={`/availability?studio=${item.slug}`} className={`shrink-0 rounded-full px-4 py-2 text-sm ${item.slug === studio.slug ? "bg-primary text-primary-foreground" : "border border-border"}`}>
              {item.name}
            </a>
          ))}
        </div>
        <AvailabilityCalendar studioSlug={studio.slug} rows={rows.map((row) => ({ date: row.date, slot: row.slot, state: row.state }))} />
      </div>
    </>
  );
}
