"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { EnquirySuccess } from "@/components/enquiry/enquiry-success";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { track } from "@/lib/analytics";
import { submitEnquiry } from "@/lib/enquiries";

export function ContactForm() {
  const pathname = usePathname();
  const [error, setError] = useState<string>();
  const [href, setHref] = useState<string>();
  const [pending, setPending] = useState(false);
  const [started, setStarted] = useState(false);

  if (href) return <EnquirySuccess href={href} />;

  return (
    <form
      className="grid gap-4"
      onFocus={() => {
        if (!started) {
          setStarted(true);
          track("form_start", { page: pathname });
        }
      }}
      onSubmit={async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setPending(true);
        const result = await submitEnquiry({
          type: "contact",
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          phone: String(data.get("phone") ?? ""),
          message: String(data.get("message") ?? ""),
          sourcePage: pathname,
          company: String(data.get("company") ?? ""),
        });
        setPending(false);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setHref(result.href);
      }}
    >
      <Field label="Name" htmlFor="contact-name" error={error}>
        <Input id="contact-name" name="name" autoComplete="name" required aria-describedby={error ? "contact-name-error" : undefined} />
      </Field>
      <Field label="Email" htmlFor="contact-email">
        <Input id="contact-email" name="email" type="email" autoComplete="email" inputMode="email" required />
      </Field>
      <Field label="Phone" htmlFor="contact-phone">
        <div className="flex">
          <span className="grid h-12 place-items-center rounded-l-xl border border-r-0 border-input bg-muted px-3 text-sm">+91</span>
          <Input id="contact-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" required className="rounded-l-none" />
        </div>
      </Field>
      <Field label="Message" htmlFor="contact-message">
        <Textarea id="contact-message" name="message" required maxLength={1000} />
      </Field>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <Button type="submit" loading={pending}>Submit</Button>
    </form>
  );
}
