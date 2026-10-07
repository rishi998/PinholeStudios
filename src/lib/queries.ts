import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { availability, bookingRequest, enquiry, eventLog, shortlist } from "@/db/schema";

async function readOrEmpty<T>(query: Promise<T>, fallback: T): Promise<T> {
  try {
    return await query;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const missingTable = message.includes("no such table") || message.includes("SQLITE_ERROR");
    if (missingTable || process.env.NEXT_PHASE === "phase-production-build") return fallback;
    throw error;
  }
}

export async function listEnquiries() {
  return readOrEmpty(db.select().from(enquiry).orderBy(desc(enquiry.createdAt)), []);
}

export async function enquiriesForUser(userId: string) {
  return readOrEmpty(db.select().from(enquiry).where(eq(enquiry.userId, userId)).orderBy(desc(enquiry.createdAt)), []);
}

export async function listBookings() {
  return readOrEmpty(db.select().from(bookingRequest).orderBy(desc(bookingRequest.createdAt)), []);
}

export async function bookingsForUser(userId: string) {
  return readOrEmpty(db.select().from(bookingRequest).where(eq(bookingRequest.userId, userId)).orderBy(desc(bookingRequest.createdAt)), []);
}

export async function availabilityFor(studioSlug?: string) {
  try {
    if (!studioSlug) return await db.select().from(availability);
    return await db.select().from(availability).where(eq(availability.studioSlug, studioSlug));
  } catch {
    return [];
  }
}

export async function shortlistFor(userId: string) {
  return readOrEmpty(db.select().from(shortlist).where(eq(shortlist.userId, userId)), []);
}

export async function recentEvents() {
  return readOrEmpty(db.select().from(eventLog).orderBy(desc(eventLog.createdAt)).limit(200), []);
}

export async function adminStats() {
  const [enquiries, events] = await Promise.all([listEnquiries(), recentEvents()]);
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recent = enquiries.filter((row) => row.createdAt.getTime() > weekAgo);
  const byType = new Map<string, number>();
  for (const row of recent) byType.set(row.type, (byType.get(row.type) ?? 0) + 1);
  return {
    weekCount: recent.length,
    byType: [...byType.entries()],
    clicks: events.filter((event) => event.name === "whatsapp_click").length,
  };
}
