"use client";

import { addMonths, eachDayOfInterval, endOfMonth, format, isBefore, startOfMonth, startOfToday } from "date-fns";
import { useState } from "react";

import { EnquirySuccess } from "@/components/enquiry/enquiry-success";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { requestBooking } from "@/lib/bookings";
import { track } from "@/lib/analytics";

const slots = ["morning", "afternoon", "evening", "full-day"] as const;

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
  const [href, setHref] = useState<string>();
  const [error, setError] = useState<string>();
  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  const today = startOfToday();

  if (href) return <EnquirySuccess href={href} />;

  return (
    <div className="grid gap-4 rounded-3xl border border-border bg-card/80 p-4">
      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="ghost" onClick={() => setMonth(addMonths(month, -1))}>
          Previous
        </Button>
        <p className="font-medium">{format(month, "MMMM yyyy")}</p>
        <Button type="button" variant="ghost" onClick={() => setMonth(addMonths(month, 1))}>
          Next
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
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
              className={`h-11 rounded-xl text-sm disabled:opacity-40 ${picked ? "bg-primary text-primary-foreground" : state === "booked" ? "bg-danger/20" : state === "limited" ? "bg-primary/25" : "bg-success/15"}`}
              onClick={() => setDate(key)}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">Free is green, limited is amber, booked is red, your pick is solid amber.</p>
      {date ? (
        <form
          className="grid gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
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
              return;
            }
            track("booking_request", { studio: studioSlug });
            setHref(result.href);
          }}
        >
          <div className="flex flex-wrap gap-2">
            {slots.map((item) => {
              const blocked = rows.some((row) => row.date === date && row.slot === item && row.state === "booked");
              return (
                <Button key={item} type="button" size="sm" variant={slot === item ? "default" : "outline"} disabled={blocked} onClick={() => setSlot(item)}>
                  {item}
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
          <p className="text-sm text-muted-foreground">You&apos;ll get confirmation on WhatsApp. No online payment needed.</p>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit">Send booking request</Button>
        </form>
      ) : null}
    </div>
  );
}
