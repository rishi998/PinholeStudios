"use client";

import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

type ChatMessage = { role: "user" | "assistant"; text: string };

const suggestions = ["Which studio for a podcast?", "Do you have parking?", "How do I book?", "Get a quote"];

function readStream(raw: string) {
  let text = "";
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) continue;
    const payload = trimmed.slice(5).trim();
    if (!payload || payload === "[DONE]") continue;
    try {
      const event = JSON.parse(payload) as { type?: string; delta?: string };
      if (event.type === "text-delta" && event.delta) text += event.delta;
    } catch {
      // ignore non-json lines
    }
  }
  return text;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: "Ask about studios, parking, booking or a quote. I may make mistakes. For confirmed details, chat on WhatsApp." },
  ]);

  async function send(text: string) {
    const next = text.trim();
    if (!next || pending) return;
    const history = [...messages, { role: "user" as const, text: next }];
    setMessages(history);
    setInput("");
    setPending(true);
    track("chat_message", { page: window.location.pathname });
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: history.map((message, index) => ({
          id: String(index),
          role: message.role,
          parts: [{ type: "text", text: message.text }],
        })),
      }),
    });
    const reply = response.ok ? readStream(await response.text()) : "I could not answer just now. Continue on WhatsApp.";
    if (reply.includes("wa.me")) track("chat_handoff", { page: window.location.pathname });
    setMessages((current) => [...current, { role: "assistant", text: reply || "Continue on WhatsApp for a confirmed answer." }]);
    setPending(false);
  }

  return (
    <div className="fixed right-3 bottom-[calc(9.5rem+env(safe-area-inset-bottom))] z-30 md:right-6 md:bottom-24">
      {open ? (
        <div className="mb-3 flex h-[min(560px,70dvh)] w-[min(380px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="font-medium">Studio assistant</p>
            <Button type="button" size="icon" variant="ghost" aria-label="Close assistant" onClick={() => setOpen(false)}>
              <X />
            </Button>
          </div>
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <p key={`${message.role}-${index}`} className={`rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${message.role === "user" ? "ml-8 bg-primary text-primary-foreground" : "mr-8 bg-muted"}`}>
                {message.text}
              </p>
            ))}
            {pending ? <p className="text-sm text-muted-foreground">Typing…</p> : null}
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button key={suggestion} type="button" className="rounded-full border border-border px-3 py-1 text-xs" onClick={() => void send(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
          <form
            className="flex gap-2 border-t border-border p-3"
            onSubmit={(event) => {
              event.preventDefault();
              void send(input);
            }}
          >
            <input className="h-12 min-w-0 flex-1 rounded-xl bg-muted/50 px-3 text-base" value={input} maxLength={800} onChange={(event) => setInput(event.target.value)} aria-label="Message" />
            <Button type="submit" disabled={pending}>
              Send
            </Button>
          </form>
          <p className="px-4 pb-3 text-xs text-muted-foreground">AI assistant, may make mistakes. For confirmed details, chat on WhatsApp.</p>
        </div>
      ) : null}
      <Button
        type="button"
        size="icon"
        aria-label="Open studio assistant"
        onClick={() => {
          setOpen((value) => !value);
          track("chat_open", { page: window.location.pathname });
        }}
      >
        <MessageCircle />
      </Button>
    </div>
  );
}
