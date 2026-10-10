"use client";

import { addMonths, eachDayOfInterval, endOfMonth, format, getDay, isBefore, startOfMonth, startOfToday } from "date-fns";
import { useState } from "react";

import { EnquirySuccess } from "@/components/enquiry/enquiry-success";
import { clearReceipt, useReceipt, writeReceipt } from "@/lib/enquiry-receipt";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { requestBooking } from "@/lib/bookings";
import { track } from "@/lib/analytics";

const slots = ["morning", "afternoon", "evening", "full-day"] as const;
const slotLabel: Record<(typeof slots)[number], string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  "full-day": "Full day",
};
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Row = { date: string; slot: string; state: string };

function dayState(rows: Row[], date: string) {
  const matches = rows.filter((row) => row.date === date);
  if (matches.some((row) => row.slot === "full-day" && row.state === "booked") || slots.every((slot) => matches.some((row) => row.slot === slot && row.state === "booked"))) {
    return "booked";
  }
  if (matches.some((row) => row.state === "booked" || row.state === "limited")) return "limited";
  return "free";
}

export function AvailabilityCalendar({ studioSlug, rows }: { studioSlug: string; rows: Row[] }) {
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const [date, setDate] = useState<string>();
  const [slot, setSlot] = useState<(typeof slots)[number]>("morning");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  const lead = (getDay(startOfMonth(month)) + 6) % 7;
  const today = startOfToday();
  const receiptKey = `booking:${studioSlug}`;
  const saved = useReceipt(receiptKey);

  if (saved) {
    return (
      <EnquirySuccess
        href={saved.href}
        reference={saved.reference}
        onDismiss={() => {
          clearReceipt(receiptKey);
        }}
      />
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="ghost" onClick={() => setMonth(addMonths(month, -1))}>
          Previous
        </Button>
        <p className="font-display text-xl tracking-[-0.03em]">{format(month, "MMMM yyyy")}</p>
        <Button type="button" variant="ghost" onClick={() => setMonth(addMonths(month, 1))}>
          Next
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[0.7rem] tracking-[0.12em] text-muted-foreground uppercase">
        {weekdays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: lead }, (_, index) => (
          <span key={`lead-${index}`} />
        ))}
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const state = dayState(rows, key);
          const past = isBefore(day, today);
          const picked = date === key;
          return (
            <button
              key={key}
              type="button"
              disabled={past || state === "booked"}
              aria-pressed={picked}
              className={`h-11 rounded-xl border text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-40 ${picked ? "border-transparent bg-[var(--ember)] text-[oklch(0.2_0.03_50)]" : state === "booked" ? "border-border line-through" : state === "limited" ? "border-[var(--ember)]" : "border-border"}`}
              onClick={() => setDate(key)}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
      <p className="text-sm text-muted-foreground">
        Choose a preferred date. An open day is a request, not a confirmed booking. A crossed-out day is already held. An outlined ember day is limited.
      </p>
      {date ? (
        <form
          method="post"
          className="grid gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            if (pending) return;
            setPending(true);
            const data = new FormData(event.currentTarget);
            try {
              const result = await requestBooking({
                studioSlug,
                date,
                slot,
                name: String(data.get("name") ?? ""),
                phone: String(data.get("phone") ?? ""),
                email: String(data.get("email") ?? ""),
                company: String(data.get("company") ?? ""),
              });
              if (!result.ok) {
                setError(result.error);
                setPending(false);
                return;
              }
              track("booking_request", { studio: studioSlug });
              writeReceipt(receiptKey, { href: result.href, reference: result.id });
              setPending(false);
            } catch {
              setError("Could not save that request. You can still write on WhatsApp.");
              setPending(false);
            }
          }}
        >
          <div className="flex flex-wrap gap-2">
            {slots.map((item) => {
              const blocked = rows.some((row) => row.date === date && row.slot === item && row.state === "booked");
              return (
                <Button key={item} type="button" size="sm" variant={slot === item ? "default" : "outline"} disabled={blocked} onClick={() => setSlot(item)}>
                  {slotLabel[item]}
                </Button>
              );
            })}
          </div>
          <Field label="Name" htmlFor={`${studioSlug}-name`}>
            <Input id={`${studioSlug}-name`} name="name" required />
          </Field>
          <Field label="Phone" htmlFor={`${studioSlug}-phone`}>
            <Input id={`${studioSlug}-phone`} name="phone" type="tel" required />
          </Field>
          <Field label="Email" htmlFor={`${studioSlug}-email`}>
            <Input id={`${studioSlug}-email`} name="email" type="email" />
          </Field>
          <input name="company" className="hidden" tabIndex={-1} autoComplete="off" />
          <p className="text-sm text-muted-foreground">
            Preferred date {date}, {slotLabel[slot]}. Sending this saves the request. You can then open WhatsApp so the studio can confirm whether the day is free.
          </p>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" loading={pending}>Send booking request</Button>
        </form>
      ) : null}
    </div>
  );
}
