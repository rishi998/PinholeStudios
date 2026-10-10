import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageIntro } from "@/components/layout/page-intro";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { Button } from "@/components/ui/button";
import { studioPhotos } from "@/data/pinhole-media";
import { getService, services } from "@/data/services";
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
  const related = service.studios.map((studioSlug) => getStudio(studioSlug)).filter((studio) => studio != null);
  const lead = related[0];
  const photo = lead ? studioPhotos[lead.slug]?.[0] : undefined;

  return (
    <>
      <PageIntro eyebrow={service.audience} title={service.name} lede={service.description} />
      <div className="mx-auto w-full max-w-[var(--page-width)] px-5 pt-8 pb-[var(--space-section)] md:px-8">
        {photo ? (
          <Image
            src={photo.src}
            alt={photo.alt}
            width={1600}
            height={1000}
            priority
            className="aspect-[16/10] h-auto w-full rounded-[var(--radius)] object-cover"
          />
        ) : null}
        <div className="mt-10 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[0.95] font-extrabold tracking-[-0.04em]">
              Used for
            </h2>
            <ul className="mt-6 border-t border-border">
              {service.useCases.map((item) => (
                <li key={item} className="border-b border-border py-3 text-sm">
                  {item}
                </li>
              ))}
            </ul>
            {lead ? (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button nativeButton={false} render={<Link href={`/studios/${lead.slug}`} />} size="lg">
                  See {lead.name}
                </Button>
                <WhatsAppLink placement="service" variant="outline" />
              </div>
            ) : (
              <div className="mt-8">
                <WhatsAppLink placement="service" />
              </div>
            )}
          </div>
          <div className="lg:col-span-7">
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[0.95] font-extrabold tracking-[-0.04em]">
              Rooms that fit
            </h2>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2">
              {related.map((studio) => {
                const still = studioPhotos[studio.slug]?.[0];
                return (
                  <li key={studio.slug}>
                    <Link href={`/studios/${studio.slug}`} className="group block focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                      {still ? (
                        <span className="relative block aspect-[4/3] overflow-hidden rounded-[var(--radius)]">
                          <Image src={still.src} alt={still.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 24rem" />
                        </span>
                      ) : null}
                      <span className="mt-3 block font-display text-xl tracking-[-0.03em]">{studio.name}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">{studio.summary}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
