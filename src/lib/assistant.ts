import { studios } from "@/data/studios";
import { rankStudios } from "@/lib/finder";
import { waLink } from "@/lib/whatsapp";

export function answerLocally(text: string) {
  const q = text.toLowerCase();
  if (q.includes("podcast")) {
    const match = rankStudios("podcast")[0];
    return `Podcast Setup is the best match for a podcast. ${match?.studio.summary}. I can hand this to the team on WhatsApp.`;
  }
  if (q.includes("parking")) {
    return "Parking is listed among Pinhole Studio's advantages. The team can confirm access for your date on WhatsApp.";
  }
  if (q.includes("book") || q.includes("quote")) {
    return "Bookings are confirmed on WhatsApp. No online payment is taken here. Use the handoff button and the team will share availability.";
  }
  if (q.includes("green")) {
    return "Green Screen Studio is the chroma key space. Specs and rates on the site are marked Sample until the studio confirms them.";
  }
  const named = studios.find((studio) => q.includes(studio.name.toLowerCase()));
  if (named) return `${named.name}: ${named.description}`;
  return "I can help with Pinhole Studio's spaces, services and how to enquire. For a confirmed rate or date, continue on WhatsApp.";
}

export function handoffLink(summary: string) {
  return waLink(`Hi Pinhole Studio, ${summary}`);
}
