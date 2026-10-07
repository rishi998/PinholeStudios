import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse, streamText, tool, type UIMessage } from "ai";
import { headers } from "next/headers";
import { z } from "zod";

import { studios } from "@/data/studios";
import { services } from "@/data/services";
import { policies } from "@/data/site-content";
import { db } from "@/db";
import { availability } from "@/db/schema";
import { answerLocally, handoffLink } from "@/lib/assistant";
import { rankStudios } from "@/lib/finder";
import { rateLimit } from "@/lib/rate-limit";
import { eq } from "drizzle-orm";

export const maxDuration = 30;

function model() {
  if (process.env.ANTHROPIC_API_KEY) return anthropic("claude-sonnet-4-5");
  if (process.env.OPENAI_API_KEY) return openai("gpt-4.1-mini");
  return null;
}

export async function POST(request: Request) {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for") ?? "local";
  if (!rateLimit(`chat:${ip}`, 20, 10 * 60 * 1000)) {
    return new Response("Too many messages", { status: 429 });
  }

  const body = (await request.json()) as { messages?: UIMessage[] };
  const messages = body.messages ?? [];
  const last = messages.at(-1);
  const text = last?.parts?.map((part) => (part.type === "text" ? part.text : "")).join(" ") ?? "";
  if (text.length > 800) return new Response("Message too long", { status: 400 });

  const chosen = model();
  if (!chosen) {
    const reply = answerLocally(text);
    const href = handoffLink(text.slice(0, 240) || "I'd like to know more about the studios.");
    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        const id = "local";
        writer.write({ type: "text-start", id });
        writer.write({ type: "text-delta", id, delta: `${reply}\n\n[Continue on WhatsApp](${href})` });
        writer.write({ type: "text-end", id });
      },
    });
    return createUIMessageStreamResponse({ stream });
  }

  const result = streamText({
    model: chosen,
    system: `You are the Pinhole Studio assistant. Only answer about Pinhole Studio, Farm 57, Kapashera Estate, New Delhi. Phones +91 85069 05757, +91 99997 63457, +91 98186 37485. Email pinholestudioz@gmail.com. Enquiries go to WhatsApp. Studios: ${studios.map((s) => `${s.name}: ${s.summary}`).join("; ")}. Services: ${services.map((s) => s.name).join(", ")}. Policies: ${policies.map((p) => p.title).join(", ")}. Never invent prices, specs or availability beyond tool results. Sample data must be described as sample. If the user wants a quote or booking, call startEnquiry.`,
    messages: await convertToModelMessages(messages),
    tools: {
      recommendStudio: tool({
        description: "Rank studios for a shoot",
        inputSchema: z.object({ shootType: z.string(), needs: z.array(z.string()).optional() }),
        execute: async ({ shootType }) => rankStudios(shootType as never).slice(0, 3).map((item) => ({ name: item.studio.name, score: item.score })),
      }),
      getStudioSpecs: tool({
        description: "Read sample specs for a studio slug",
        inputSchema: z.object({ slug: z.string() }),
        execute: async ({ slug }) => studios.find((studio) => studio.slug === slug)?.specs ?? [],
      }),
      checkAvailability: tool({
        description: "Read stored availability",
        inputSchema: z.object({ slug: z.string(), date: z.string() }),
        execute: async ({ slug, date }) => db.select().from(availability).where(eq(availability.studioSlug, slug)).then((rows) => rows.filter((row) => row.date === date)),
      }),
      startEnquiry: tool({
        description: "Create a WhatsApp handoff",
        inputSchema: z.object({ summary: z.string() }),
        execute: async ({ summary }) => ({ href: handoffLink(summary) }),
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
