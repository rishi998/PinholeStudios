"use client";

import { useState, useSyncExternalStore } from "react";

import { EnquirySuccess } from "@/components/enquiry/enquiry-success";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { studios } from "@/data/studios";
import { track } from "@/lib/analytics";
import { submitEnquiry } from "@/lib/enquiries";
import { suggestStudio } from "@/lib/finder";

const shoots = ["Ad film", "Podcast", "Product shoot", "Interview", "Music video", "Event", "Short film", "Reels/Content", "Workshop", "Other"];
const extras = ["camera", "lights", "sound", "crew", "art direction", "set customisation", "parking needs"];
const KEY = "pinhole-plan";
const EVENT = "pinhole-plan-change";

type Draft = {
  step: number;
  shoot: string;
  slugs: string[];
  suggest: boolean;
  date: string;
  slot: string;
  hours: number;
  crew: number;
  extras: string[];
};

const empty: Draft = { step: 0, shoot: "", slugs: [], suggest: false, date: "", slot: "Morning", hours: 4, crew: 4, extras: [] };

function readDraft() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(KEY) ?? "";
}

function writeDraft(next: Draft) {
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
}

export function PlanWizard() {
  const raw = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(EVENT, onStoreChange);
      return () => window.removeEventListener(EVENT, onStoreChange);
    },
    readDraft,
    () => "",
  );
  let draft = empty;
  if (raw) {
    try {
      draft = { ...empty, ...(JSON.parse(raw) as Draft) };
    } catch {
      draft = empty;
    }
  }
  const setDraft = (next: Draft) => writeDraft(next);
  const [href, setHref] = useState<string>();
  const [error, setError] = useState<string>();
  const [started, setStarted] = useState(false);

  if (href) return <EnquirySuccess href={href} />;

  const mark = () => {
    if (!started) {
      setStarted(true);
      track("form_start", { page: "/plan-my-shoot" });
    }
  };

  return (
    <div className="grid gap-6 rounded-3xl border border-border bg-card/80 p-5">
      <p className="text-sm text-muted-foreground">Step {draft.step + 1} of 5</p>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary" style={{ width: `${((draft.step + 1) / 5) * 100}%` }} />
      </div>
      {draft.step === 0 ? (
        <div className="flex flex-wrap gap-2">
          {shoots.map((shoot) => (
            <Button key={shoot} type="button" variant={draft.shoot === shoot ? "default" : "outline"} onClick={() => { mark(); setDraft({ ...draft, shoot }); }}>
              {shoot}
            </Button>
          ))}
        </div>
      ) : null}
      {draft.step === 1 ? (
        <div className="grid gap-2">
          <Button type="button" variant={draft.suggest ? "default" : "outline"} onClick={() => setDraft({ ...draft, suggest: !draft.suggest, slugs: [] })}>
            Not sure, suggest one
          </Button>
          {studios.map((studio) => (
            <button
              key={studio.slug}
              type="button"
              className={`rounded-2xl border px-4 py-3 text-left ${draft.slugs.includes(studio.slug) ? "border-primary bg-primary/10" : "border-border"}`}
              onClick={() =>
                setDraft({
                  ...draft,
                  suggest: false,
                  slugs: draft.slugs.includes(studio.slug) ? draft.slugs.filter((slug) => slug !== studio.slug) : [...draft.slugs, studio.slug],
                })
              }
            >
              {studio.name}
            </button>
          ))}
        </div>
      ) : null}
      {draft.step === 2 ? (
        <div className="grid gap-3">
          <Field label="Date" htmlFor="plan-date">
            <Input id="plan-date" type="date" value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} />
          </Field>
          <div className="flex flex-wrap gap-2">
            {["Morning", "Afternoon", "Evening", "Full day"].map((slot) => (
              <Button key={slot} type="button" size="sm" variant={draft.slot === slot ? "default" : "outline"} onClick={() => setDraft({ ...draft, slot })}>
                {slot}
              </Button>
            ))}
          </div>
        </div>
      ) : null}
      {draft.step === 3 ? (
        <div className="grid gap-3">
          <label className="grid gap-2 text-sm">
            Hours {draft.hours}
            <input type="range" min={2} max={12} value={draft.hours} onChange={(event) => setDraft({ ...draft, hours: Number(event.target.value) })} />
          </label>
          <label className="grid gap-2 text-sm">
            Crew size {draft.crew}
            <input type="range" min={1} max={30} value={draft.crew} onChange={(event) => setDraft({ ...draft, crew: Number(event.target.value) })} />
          </label>
        </div>
      ) : null}
      {draft.step === 4 ? (
        <form
          className="grid gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const suggested = draft.suggest ? suggestStudio(draft.shoot.toLowerCase().includes("podcast") ? "podcast" : "ad-film") : undefined;
            const names = draft.suggest ? suggested?.name ?? "Suggest one" : studios.filter((studio) => draft.slugs.includes(studio.slug)).map((studio) => studio.name).join(", ");
            const message = [
              "Hi Pinhole Studio, I'd like to plan a shoot.",
              `Shoot: ${draft.shoot}`,
              `Studio: ${names}`,
              `Date: ${draft.date} ${draft.slot}`,
              `Hours: ${draft.hours}`,
              `Crew: ${draft.crew}`,
              `Extras: ${draft.extras.join(", ") || "none"}`,
              `Notes: ${String(data.get("notes") ?? "")}`,
            ].join("\n");
            const result = await submitEnquiry({
              type: "plan",
              name: String(data.get("name") ?? ""),
              phone: String(data.get("phone") ?? ""),
              email: String(data.get("email") ?? ""),
              message,
              sourcePage: "/plan-my-shoot",
              company: String(data.get("company") ?? ""),
            });
            if (!result.ok) {
              setError(result.error);
              return;
            }
            localStorage.removeItem(KEY);
            track("form_submit", { page: "/plan-my-shoot" });
            setHref(result.href);
          }}
        >
          <div className="flex flex-wrap gap-2">
            {extras.map((extra) => (
              <Button
                key={extra}
                type="button"
                size="sm"
                variant={draft.extras.includes(extra) ? "default" : "outline"}
                onClick={() => setDraft({ ...draft, extras: draft.extras.includes(extra) ? draft.extras.filter((item) => item !== extra) : [...draft.extras, extra] })}
              >
                {extra}
              </Button>
            ))}
          </div>
          <Field label="Name" htmlFor="plan-name">
            <Input id="plan-name" name="name" required />
          </Field>
          <Field label="Phone" htmlFor="plan-phone">
            <Input id="plan-phone" name="phone" type="tel" required />
          </Field>
          <Field label="Email" htmlFor="plan-email">
            <Input id="plan-email" name="email" type="email" />
          </Field>
          <Field label="Notes" htmlFor="plan-notes">
            <Textarea id="plan-notes" name="notes" />
          </Field>
          <input name="company" className="hidden" tabIndex={-1} autoComplete="off" />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit">Send plan on WhatsApp</Button>
        </form>
      ) : null}
      <div className="flex gap-2">
        <Button type="button" variant="ghost" disabled={draft.step === 0} onClick={() => setDraft({ ...draft, step: draft.step - 1 })}>
          Back
        </Button>
        {draft.step < 4 ? (
          <Button
            type="button"
            disabled={(draft.step === 0 && !draft.shoot) || (draft.step === 1 && !draft.suggest && draft.slugs.length === 0) || (draft.step === 2 && !draft.date)}
            onClick={() => setDraft({ ...draft, step: draft.step + 1 })}
          >
            Next
          </Button>
        ) : null}
      </div>
    </div>
  );
}
