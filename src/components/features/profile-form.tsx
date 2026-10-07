"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/lib/profile";

export function ProfileForm({ name, phone }: { name: string; phone: string }) {
  const [message, setMessage] = useState<string>();

  return (
    <form
      className="grid max-w-md gap-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const result = await updateProfile({ name: String(data.get("name") ?? ""), phone: String(data.get("phone") ?? "") });
        setMessage(result.ok ? "Saved." : result.error);
      }}
    >
      <h1 className="font-display text-3xl">Profile</h1>
      <Field label="Name" htmlFor="profile-name">
        <Input id="profile-name" name="name" defaultValue={name} required />
      </Field>
      <Field label="Phone" htmlFor="profile-phone">
        <Input id="profile-phone" name="phone" type="tel" defaultValue={phone} />
      </Field>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      <Button type="submit">Save</Button>
    </form>
  );
}
