import Image from "next/image";
import Link from "next/link";

import { ContactForm } from "@/components/features/contact-form";
import { PageIntro } from "@/components/layout/page-intro";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { aboutPhoto } from "@/data/pinhole-media";
import { equipmentSupport } from "@/data/services";
import { studios } from "@/data/studios";
import { siteConfig } from "@/lib/site.config";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="The studio"
        title="About us"
        lede="Pinhole Studio is a professional studio and production space at Farm 57, Kapashera Estate, New Delhi."
      />
      <div className="mx-auto w-full max-w-[var(--page-width)] px-5 pt-10 pb-[var(--space-section)] md:px-8">
        <Image
          src={aboutPhoto}
          alt="Pinhole Studio"
          width={1600}
          height={900}
          priority
          className="aspect-[16/9] h-auto w-full rounded-[var(--radius)] object-cover"
        />
        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="grid gap-6 lg:col-span-7">
            <p className="text-[1.0625rem] leading-relaxed">
              The space is built for shoots, content creation and events, with ready locations and production infrastructure on one lot.
            </p>
            <p className="text-muted-foreground">It serves production houses, agencies, creators, educators and event teams.</p>
            <p className="text-sm text-muted-foreground">{siteConfig.address.line}</p>
          </div>
          <dl className="grid gap-8 lg:col-span-5">
            <div>
              <dt className="font-display text-2xl tracking-[-0.03em]">Mission</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Give productions a ready floor, house, chroma and outdoor space without building a location from scratch.
              </dd>
            </div>
            <div>
              <dt className="font-display text-2xl tracking-[-0.03em]">Vision</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                A working studio lot in Kapashera for film, content, events and workshops.
              </dd>
            </div>
          </dl>
        </div>

        <section className="mt-16 border-t border-border pt-12">
          <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[0.95] font-extrabold tracking-[-0.04em]">
            The <em className="font-serif text-[var(--ember)] italic">floors</em>
          </h2>
          <ul className="mt-8 border-t border-border">
            {studios.map((studio) => (
              <li key={studio.slug} className="border-b border-border">
                <Link
                  href={`/studios/${studio.slug}`}
                  className="flex items-baseline justify-between gap-6 py-4 underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <span className="font-display text-2xl tracking-[-0.03em]">{studio.name}</span>
                  <span className="hidden text-sm text-muted-foreground sm:block">{studio.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 border-t border-border pt-12">
          <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[0.95] font-extrabold tracking-[-0.04em]">
            On <em className="font-serif text-[var(--ember)] italic">call</em>
          </h2>
          <ul className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {equipmentSupport.map((item) => (
              <li key={item} className="border-b border-border py-3 text-sm">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 grid gap-10 border-t border-border pt-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[0.95] font-extrabold tracking-[-0.04em]">
              Book the <em className="font-serif text-[var(--ember)] italic">lot</em>
            </h2>
            <div className="mt-6">
              <WhatsAppLink placement="about">Book Pinhole Studio today</WhatsAppLink>
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ContactForm />
          </div>
        </section>
      </div>
    </>
  );
}
