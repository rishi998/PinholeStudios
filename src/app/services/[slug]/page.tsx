import Link from "next/link";
import { notFound } from "next/navigation";

import { PageIntro } from "@/components/layout/page-intro";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { StudioImage } from "@/components/studios/studio-image";
import { equipmentSupport, getService, services } from "@/data/services";
import { getStudio } from "@/data/studios";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  return { title: service?.name ?? "Service", description: service?.description };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <PageIntro title={service.name} lede={service.description} />
      <div className="mx-auto grid w-full max-w-5xl gap-6 px-4 pb-16">
        <ul className="flex flex-wrap gap-2">
          {service.useCases.map((item) => (
            <li key={item} className="rounded-full border border-border bg-card/70 px-3 py-1 text-sm">
              {item}
            </li>
          ))}
        </ul>
        <ul className="grid gap-3 sm:grid-cols-2">
          {service.studios.map((studioSlug) => {
            const studio = getStudio(studioSlug);
            if (!studio) return null;
            return (
              <li key={studio.slug}>
                <Link href={`/studios/${studio.slug}`} className="grid overflow-hidden rounded-3xl border border-border sm:grid-cols-[140px_1fr]">
                  <StudioImage swatch={studio.swatch} label={studio.name} className="h-28" />
                  <span className="p-4">{studio.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <ul className="grid gap-2 sm:grid-cols-2">
          {equipmentSupport.map((item) => (
            <li key={item} className="rounded-2xl border border-border px-4 py-3">
              {item}
            </li>
          ))}
        </ul>
        <WhatsAppLink placement="service" />
      </div>
    </>
  );
}
