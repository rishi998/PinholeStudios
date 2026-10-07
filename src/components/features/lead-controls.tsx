"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { LEAD_STATUSES } from "@/db/schema";
import { setEnquiryStatus } from "@/lib/enquiries";

export function LeadControls({ id, status, notes }: { id: string; status: string; notes: string }) {
  const [value, setValue] = useState(status);
  const [note, setNote] = useState(notes);

  return (
    <form
      className="mt-3 grid gap-2"
      onSubmit={async (event) => {
        event.preventDefault();
        await setEnquiryStatus(id, value, note);
      }}
    >
      <select className="h-12 rounded-xl bg-muted/50 px-3" value={value} onChange={(event) => setValue(event.target.value)}>
        {LEAD_STATUSES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <textarea className="min-h-20 rounded-xl bg-muted/50 p-3" value={note} onChange={(event) => setNote(event.target.value)} />
      <Button type="submit" size="sm">
        Save lead
      </Button>
    </form>
  );
}
