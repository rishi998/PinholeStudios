import { BookingControls } from "@/components/features/booking-controls";
import { listBookings } from "@/lib/queries";

export const metadata = { title: "Booking requests" };

export default async function AdminBookingsPage() {
  const rows = await listBookings();
  return (
    <section className="grid gap-3">
      <h1 className="font-display text-3xl">Booking requests</h1>
      {rows.map((row) => (
        <article key={row.id} className="rounded-3xl border border-border bg-card/80 p-4">
          <p>
            {row.name} · {row.studioSlug} · {row.date} · {row.slot}
          </p>
          <p className="text-sm text-muted-foreground">{row.status}</p>
          <BookingControls id={row.id} />
        </article>
      ))}
    </section>
  );
}
