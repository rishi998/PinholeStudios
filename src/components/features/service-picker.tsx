"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { studioPhotos } from "@/data/pinhole-media";
import { services } from "@/data/services";
import { getStudio } from "@/data/studios";
import { cn } from "cn";

const audiences = [...new Set(services.map((service) => service.audience))];

export function ServicePicker() {
  const [audience, setAudience] = useState<string>("");
  const matches = audience ? services.filter((service) => service.audience === audience) : services;

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          className={cn(
            "h-11 shrink-0 rounded-full border px-4 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            audience === "" ? "border-transparent bg-[var(--ember)] text-[oklch(0.2_0.03_50)]" : "border-border"
          )}
          onClick={() => setAudience("")}
        >
          All
        </button>
        {audiences.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={audience === item}
            className={cn(
              "h-11 shrink-0 rounded-full border px-4 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              audience === item ? "border-transparent bg-[var(--ember)] text-[oklch(0.2_0.03_50)]" : "border-border"
            )}
            onClick={() => setAudience(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <ul className="mt-8 border-t border-border">
        {matches.map((service) => {
          const studio = getStudio(service.studios[0] ?? "");
          const photo = studio ? studioPhotos[studio.slug]?.[0] : undefined;
          return (
            <li key={service.slug} className="grid items-center gap-6 border-b border-border py-8 md:grid-cols-12">
              <Link href={`/services/${service.slug}`} className="md:col-span-5">
                {photo ? (
                  <span className="relative block aspect-[4/3] overflow-hidden rounded-[var(--radius)]">
                    <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 28rem" />
                  </span>
                ) : null}
              </Link>
              <div className="md:col-span-7">
                <h2 className="font-display text-3xl tracking-[-0.03em]">
                  <Link href={`/services/${service.slug}`} className="underline-offset-4 hover:underline">
                    {service.name}
                  </Link>
                </h2>
                <p className="mt-3 max-w-[46ch] text-muted-foreground">{service.description}</p>
                <p className="mt-4 text-sm">
                  <Link href={`/services/${service.slug}`} className="underline-offset-4 hover:underline">
                    See the rooms
                  </Link>
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
