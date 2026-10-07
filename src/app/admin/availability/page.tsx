import { Button } from "@/components/ui/button";
import { studios } from "@/data/studios";
import { setAvailability } from "@/lib/bookings";

export const metadata = { title: "Availability manager" };

export default function AvailabilityManagerPage() {
  return (
    <section className="grid max-w-lg gap-4">
      <h1 className="font-display text-3xl">Availability</h1>
      <form
        className="grid gap-3 rounded-3xl border border-border bg-card/80 p-4"
        action={async (formData) => {
          "use server";
          await setAvailability({
            studioSlug: String(formData.get("studio") ?? ""),
            date: String(formData.get("date") ?? ""),
            slot: String(formData.get("slot") ?? ""),
            state: String(formData.get("state") ?? "free") as "free" | "booked" | "limited",
          });
        }}
      >
        <select name="studio" className="h-12 rounded-xl bg-muted/50 px-3">
          {studios.map((studio) => (
            <option key={studio.slug} value={studio.slug}>
              {studio.name}
            </option>
          ))}
        </select>
        <input name="date" type="date" required className="h-12 rounded-xl bg-muted/50 px-3" />
        <select name="slot" className="h-12 rounded-xl bg-muted/50 px-3">
          {["morning", "afternoon", "evening", "full-day"].map((slot) => (
            <option key={slot}>{slot}</option>
          ))}
        </select>
        <select name="state" className="h-12 rounded-xl bg-muted/50 px-3">
          <option value="booked">booked</option>
          <option value="limited">limited</option>
          <option value="free">free</option>
        </select>
        <Button type="submit">Update date</Button>
      </form>
    </section>
  );
}
