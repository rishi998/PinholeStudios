import { randomUUID } from "node:crypto";

import { db } from "@/db";
import { availability } from "@/db/schema";
import { studios } from "@/data/studios";

function iso(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

const slots = ["morning", "afternoon", "evening", "full-day"];

async function main() {
  const rows = studios.flatMap((studio, index) => {
    const booked = iso(index + 1);
    const limited = iso(index + 3);
    return [
      ...slots.map((slot) => ({
        id: randomUUID(),
        studioSlug: studio.slug,
        date: booked,
        slot,
        state: "booked",
      })),
      {
        id: randomUUID(),
        studioSlug: studio.slug,
        date: limited,
        slot: "afternoon",
        state: "limited",
      },
    ];
  });

  for (const row of rows) {
    await db.insert(availability).values(row).onConflictDoNothing();
  }
  console.info(`Seeded ${rows.length} availability rows.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
