"use client";

import Link from "next/link";
import { useState } from "react";

import { services } from "@/data/services";

export function ServicePicker() {
  const [audience, setAudience] = useState<string>("");
  const matches = audience ? services.filter((service) => service.audience === audience) : services;

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={`h-11 rounded-full px-4 text-sm ${audience === "" ? "bg-primary text-primary-foreground" : "border border-border"}`} onClick={() => setAudience("")}>
          All
        </button>
        {services.map((service) => (
          <button
            key={service.slug}
            type="button"
            className={`h-11 rounded-full px-4 text-sm ${audience === service.audience ? "bg-primary text-primary-foreground" : "border border-border"}`}
            onClick={() => setAudience(service.audience)}
          >
            I am {service.audience.toLowerCase()}
          </button>
        ))}
      </div>
      <ul className="grid gap-3">
        {matches.map((service) => (
          <li key={service.slug}>
            <Link href={`/services/${service.slug}`} className="block rounded-3xl border border-border bg-card/70 p-5">
              <span className="font-display text-xl">{service.name}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{service.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
