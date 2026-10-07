"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { shortlist, user } from "@/db/schema";
import { requireUser } from "@/lib/session";

const profileSchema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().max(20).optional(),
});

export async function updateProfile(input: z.infer<typeof profileSchema>) {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Check your name and phone." };
  const session = await requireUser();
  await db.update(user).set({ name: parsed.data.name, phone: parsed.data.phone || null }).where(eq(user.id, session.user.id));
  revalidatePath("/account/profile");
  return { ok: true as const };
}

export async function saveShortlist(slugs: string[]) {
  const session = await requireUser();
  const existing = await db.select().from(shortlist).where(eq(shortlist.userId, session.user.id));
  const have = new Set(existing.map((row) => row.studioSlug));
  for (const slug of slugs) {
    if (have.has(slug)) continue;
    await db.insert(shortlist).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      studioSlug: slug,
    });
  }
  revalidatePath("/account/shortlist");
  return { ok: true as const };
}
