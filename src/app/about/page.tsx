import { ContactForm } from "@/components/features/contact-form";
import { PageIntro } from "@/components/layout/page-intro";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { SceneSlot } from "@/components/three/scene-slot";
import { equipmentSupport } from "@/data/services";
import { studios } from "@/data/studios";
import { siteConfig } from "@/lib/site.config";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <PageIntro title="About us" lede="Pinhole Studio is a professional studio and production space at Farm 57, Kapashera Estate, New Delhi." />
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-16">
        <SceneSlot kind="stage" color="#e8a317" className="h-[360px] overflow-hidden rounded-3xl border border-border" />
        <p>The space is built for shoots, content creation and events, with ready locations and production infrastructure on one lot.</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {siteConfig.ecosystem.map((item) => (
            <a key={item.label} href={item.href} className="rounded-3xl border border-border bg-card/70 p-5">
              {item.label}
            </a>
          ))}
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {studios.map((studio) => (
            <li key={studio.slug} className="rounded-2xl border border-border bg-card px-4 py-3">
              {studio.name}
            </li>
          ))}
        </ul>
        <section className="grid gap-3 md:grid-cols-2">
          <article className="rounded-3xl border border-border bg-card/70 p-5">
            <h2 className="font-display text-2xl">Mission</h2>
            <p className="mt-2 text-muted-foreground">Give productions a ready floor, house, chroma and outdoor space without building a location from scratch.</p>
          </article>
          <article className="rounded-3xl border border-border bg-card/70 p-5">
            <h2 className="font-display text-2xl">Vision</h2>
            <p className="mt-2 text-muted-foreground">A working studio lot in Kapashera for film, content, events and workshops.</p>
          </article>
        </section>
        <p>It serves production houses, agencies, creators, educators and event teams.</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {equipmentSupport.map((item) => (
            <li key={item} className="rounded-2xl border border-border px-4 py-3">
              {item}
            </li>
          ))}
        </ul>
        <WhatsAppLink placement="about">Book Pinhole Studio today</WhatsAppLink>
        <ContactForm />
      </div>
    </>
  );
}
