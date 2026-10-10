import { randomUUID } from "node:crypto";
import { and, eq, gte } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { bookingRequest, enquiry, eventLog } from "@/db/schema";
import { waLink } from "@/lib/whatsapp";

const duplicateWindowMs = 2 * 60 * 1000;

export function normalizePhone(input: string) {
  let digits = input.replace(/\D/g, "").replace(/^0+/, "");
  if (digits.startsWith("91") && digits.length === 12) digits = digits.slice(2);
  if (!/^[6-9]\d{9}$/.test(digits)) return null;
  return `+91${digits}`;
}

export function finalizeEnquiryMessage(input: { message: string; name: string; phone: string; email?: string; id: string }) {
  const lines = [input.message.trim()];
  if (!input.message.includes(input.name)) lines.push(`Name: ${input.name}`);
  if (!input.message.includes(input.phone)) lines.push(`Phone: ${input.phone}`);
  if (input.email && !input.message.includes(input.email)) lines.push(`Email: ${input.email}`);
  lines.push(`Reference: ${input.id}`);
  lines.push("This is a request. It is not a confirmed booking.");
  return lines.join("\n");
}

const enquirySchema = z.object({
  type: z.string().min(1).max(40),
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().min(1).max(20),
  message: z.string().trim().min(4).max(4000),
  sourcePage: z.string().min(1).max(200),
  payload: z.string().max(8000).optional(),
});

export async function saveEnquiry(input: z.infer<typeof enquirySchema> & { userId?: string }) {
  const parsed = enquirySchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Check the form and try again." };
  const phone = normalizePhone(parsed.data.phone);
  if (!phone) return { ok: false as const, error: "Enter a valid Indian mobile number." };

  try {
    const since = new Date(Date.now() - duplicateWindowMs);
    const recent = await db
      .select()
      .from(enquiry)
      .where(and(eq(enquiry.phone, phone), eq(enquiry.type, parsed.data.type), gte(enquiry.createdAt, since)));
    const duplicate = recent.find((row) => row.message.startsWith(parsed.data.message));
    if (duplicate) {
      return { ok: true as const, id: duplicate.id, href: waLink(duplicate.message), duplicate: true as const };
    }

    const id = randomUUID();
    const message = finalizeEnquiryMessage({
      message: parsed.data.message,
      name: parsed.data.name,
      phone,
      email: parsed.data.email || undefined,
      id,
    });
    await db.insert(enquiry).values({
      id,
      type: parsed.data.type,
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone,
      message,
      sourcePage: parsed.data.sourcePage,
      userId: input.userId,
      payload: parsed.data.payload,
    });
    try {
      await db.insert(eventLog).values({
        id: randomUUID(),
        name: parsed.data.type === "quote" ? "quote_submit" : "form_submit",
        page: parsed.data.sourcePage,
        payload: parsed.data.type,
      });
    } catch {
      // The enquiry row is the record that matters. A log failure must not hide a saved lead.
    }
    return { ok: true as const, id, href: waLink(message), duplicate: false as const };
  } catch {
    return { ok: false as const, error: "Could not save that enquiry. Please try again." };
  }
}

const bookingSchema = z.object({
  studioSlug: z.string().min(1),
  studioName: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slot: z.enum(["morning", "afternoon", "evening", "full-day"]),
  name: z.string().trim().min(2),
  phone: z.string().trim().min(1).max(20),
  email: z.string().trim().email().optional().or(z.literal("")),
});

const slotLabel = { morning: "Morning", afternoon: "Afternoon", evening: "Evening", "full-day": "Full day" } as const;

export async function saveBookingRequest(input: z.infer<typeof bookingSchema> & { userId?: string }) {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Check the booking details." };
  const phone = normalizePhone(parsed.data.phone);
  if (!phone) return { ok: false as const, error: "Enter a valid Indian mobile number." };

  try {
    const since = new Date(Date.now() - duplicateWindowMs);
    const recent = await db
      .select()
      .from(bookingRequest)
      .where(and(eq(bookingRequest.phone, phone), eq(bookingRequest.studioSlug, parsed.data.studioSlug), eq(bookingRequest.date, parsed.data.date), eq(bookingRequest.slot, parsed.data.slot), gte(bookingRequest.createdAt, since)));
    const duplicate = recent[0];
    if (duplicate) {
      return { ok: true as const, id: duplicate.id, href: waLink(duplicate.message), duplicate: true as const };
    }

    const id = randomUUID();
    const message = finalizeEnquiryMessage({
      message: [
        "Hi Pinhole Studio, I'd like to request a booking.",
        `Studio: ${parsed.data.studioName}`,
        `Preferred date: ${parsed.data.date}`,
        `Preferred duration: ${slotLabel[parsed.data.slot]}`,
        "Please confirm whether this date is free. The calendar is not a live diary.",
      ].join("\n"),
      name: parsed.data.name,
      phone,
      email: parsed.data.email || undefined,
      id,
    });
    await db.insert(bookingRequest).values({
      id,
      studioSlug: parsed.data.studioSlug,
      date: parsed.data.date,
      slot: parsed.data.slot,
      name: parsed.data.name,
      phone,
      email: parsed.data.email || null,
      message,
      userId: input.userId,
    });
    return { ok: true as const, id, href: waLink(message), duplicate: false as const };
  } catch {
    return { ok: false as const, error: "Could not save that request. Please try again." };
  }
}
