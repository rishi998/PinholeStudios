"use server";

import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { availability, bookingRequest, eventLog } from "@/db/schema";
import { getStudio } from "@/data/studios";
import { saveBookingRequest } from "@/lib/lead";
import { getSession, requireAdmin } from "@/lib/session";

const requestSchema = z.object({
  studioSlug: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slot: z.enum(["morning", "afternoon", "evening", "full-day"]),
  name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email().optional().or(z.literal("")),
  company: z.string().max(0).optional(),
});

export async function requestBooking(input: z.infer<typeof requestSchema>) {
  const parsed = requestSchema.safeParse(input);
  if (!parsed.success || parsed.data.company) return { ok: false as const, error: "Check the booking details." };
  const session = await getSession();
  const studioName = getStudio(parsed.data.studioSlug)?.name ?? parsed.data.studioSlug;
  const saved = await saveBookingRequest({ ...parsed.data, studioName, userId: session?.user.id });
  if (!saved.ok) return saved;
  try {
    await db.insert(eventLog).values({
      id: randomUUID(),
      name: "booking_request",
      page: `/studios/${parsed.data.studioSlug}`,
      studio: parsed.data.studioSlug,
    });
  } catch {
    // The booking request is already stored.
  }
  return saved;
}

export async function setBookingStatus(id: string, status: "approved" | "declined") {
  await requireAdmin();
  const rows = await db.select().from(bookingRequest).where(eq(bookingRequest.id, id));
  const row = rows[0];
  if (!row) return;
  await db.update(bookingRequest).set({ status }).where(eq(bookingRequest.id, id));
  if (status === "approved") {
    const slots = row.slot === "full-day" ? ["morning", "afternoon", "evening", "full-day"] : [row.slot];
    for (const slot of slots) {
      const existing = await db
        .select()
        .from(availability)
        .where(and(eq(availability.studioSlug, row.studioSlug), eq(availability.date, row.date), eq(availability.slot, slot)));
      if (existing[0]) {
        await db.update(availability).set({ state: "booked" }).where(eq(availability.id, existing[0].id));
      } else {
        await db.insert(availability).values({
          id: randomUUID(),
          studioSlug: row.studioSlug,
          date: row.date,
          slot,
          state: "booked",
        });
      }
    }
  }
  revalidatePath("/admin/bookings");
  revalidatePath("/availability");
}

export async function setAvailability(input: { studioSlug: string; date: string; slot: string; state: "free" | "booked" | "limited" }) {
  await requireAdmin();
  const existing = await db
    .select()
    .from(availability)
    .where(and(eq(availability.studioSlug, input.studioSlug), eq(availability.date, input.date), eq(availability.slot, input.slot)));
  if (input.state === "free" && existing[0]) {
    await db.delete(availability).where(eq(availability.id, existing[0].id));
  } else if (existing[0]) {
    await db.update(availability).set({ state: input.state }).where(eq(availability.id, existing[0].id));
  } else if (input.state !== "free") {
    await db.insert(availability).values({ id: randomUUID(), ...input });
  }
  revalidatePath("/admin/availability");
}
