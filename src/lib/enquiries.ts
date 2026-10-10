"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { LEAD_STATUSES, enquiry } from "@/db/schema";
import { saveEnquiry } from "@/lib/lead";
import { rateLimit } from "@/lib/rate-limit";
import { getSession, requireAdmin } from "@/lib/session";

const schema = z.object({
  type: z.string().min(1).max(40),
  name: z.string().min(2).max(80),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().trim().min(1).max(20),
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
  return saveEnquiry({ ...parsed.data, userId: session?.user.id });
}

export async function setEnquiryStatus(id: string, status: string, notes: string) {
  await requireAdmin();
  if (!LEAD_STATUSES.includes(status as (typeof LEAD_STATUSES)[number])) return;
  await db.update(enquiry).set({ status, notes }).where(eq(enquiry.id, id));
  revalidatePath("/admin/leads");
}
