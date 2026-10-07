"use server";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { LEAD_STATUSES, enquiry, eventLog } from "@/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { getSession, requireAdmin } from "@/lib/session";
import { waLink } from "@/lib/whatsapp";

const schema = z.object({
  type: z.string().min(1).max(40),
  name: z.string().min(2).max(80),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(8).max(20),
  message: z.string().min(4).max(4000),
  sourcePage: z.string().min(1).max(200),
  company: z.string().max(0).optional(),
  payload: z.string().max(8000).optional(),
});

export async function submitEnquiry(input: z.infer<typeof schema>) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Check the form and try again." };
  if (parsed.data.company) return { ok: false as const, error: "Could not send that enquiry." };

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for") ?? "local";
  if (!rateLimit(`enquiry:${ip}`, 12, 10 * 60 * 1000)) {
    return { ok: false as const, error: "Too many enquiries. Please try again shortly." };
  }

  const session = await getSession();
  const id = randomUUID();
  await db.insert(enquiry).values({
    id,
    type: parsed.data.type,
    name: parsed.data.name,
    email: parsed.data.email || null,
    phone: parsed.data.phone,
    message: parsed.data.message,
    sourcePage: parsed.data.sourcePage,
    userId: session?.user.id,
    payload: parsed.data.payload,
  });
  await db.insert(eventLog).values({
    id: randomUUID(),
    name: parsed.data.type === "quote" ? "quote_submit" : "form_submit",
    page: parsed.data.sourcePage,
    payload: parsed.data.type,
  });

  return { ok: true as const, href: waLink(parsed.data.message), id };
}

export async function setEnquiryStatus(id: string, status: string, notes: string) {
  await requireAdmin();
  if (!LEAD_STATUSES.includes(status as (typeof LEAD_STATUSES)[number])) return;
  await db.update(enquiry).set({ status, notes }).where(eq(enquiry.id, id));
  revalidatePath("/admin/leads");
}
