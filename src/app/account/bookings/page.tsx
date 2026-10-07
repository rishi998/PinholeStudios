import { bookingsForUser } from "@/lib/queries";
import { requireUser } from "@/lib/session";

export const metadata = { title: "My bookings" };

export default async function BookingsPage() {
  const session = await requireUser();
  const rows = await bookingsForUser(session.user.id);
  return (
    <section className="grid gap-3">
      <h1 className="font-display text-3xl">Booking requests</h1>
      {rows.length === 0 ? <p className="text-muted-foreground">No requests yet. Send one from a studio calendar.</p> : null}
      {rows.map((row) => (
        <article key={row.id} className="rounded-3xl border border-border bg-card/80 p-4">
          <p>
            {row.studioSlug} · {row.date} · {row.slot}
          </p>
          <p className="text-sm text-muted-foreground">{row.status}</p>
        </article>
      ))}
    </section>
  );
}
