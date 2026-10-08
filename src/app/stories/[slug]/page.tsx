import Link from "next/link";
import { notFound } from "next/navigation";

import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { SampleBadge } from "@/components/ui/sample-badge";
import { Button } from "@/components/ui/button";
import { getStudio } from "@/data/studios";
import { getTestimonial, testimonials } from "@/data/testimonials";

export function generateStaticParams() {
  return testimonials.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = getTestimonial(slug);
  return { title: story ? `${story.role} story` : "Story" };
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = getTestimonial(slug);
  if (!story) notFound();
  const studio = getStudio(story.studioSlug);
  const index = testimonials.findIndex((item) => item.slug === slug);
  const prev = testimonials[(index - 1 + testimonials.length) % testimonials.length];
  const next = testimonials[(index + 1) % testimonials.length];

  return (
    <article className="mx-auto grid w-full max-w-4xl gap-8 px-4 py-16">
      <p className="font-mono text-xs tracking-[0.18em] text-primary uppercase">{story.category}</p>
      <h1 className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.92] font-extrabold">
        {story.role} <em className="font-serif text-[var(--ember)] italic">{story.clientName}</em>
      </h1>
      <p className="flex items-center gap-2 text-muted-foreground">
        {story.quote}
        <SampleBadge />
      </p>
      {studio ? (
        <Button nativeButton={false} variant="secondary" render={<Link href={`/studios/${studio.slug}`} />}>
          Shot in {studio.name}
        </Button>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-3xl border border-border bg-card p-5">
          <h2 className="font-display text-2xl">The brief</h2>
          <p className="mt-2 text-muted-foreground">{story.caseStudy.brief}</p>
        </section>
        <section className="rounded-3xl border border-border bg-card p-5">
          <h2 className="font-display text-2xl">The challenge</h2>
          <p className="mt-2 text-muted-foreground">{story.caseStudy.challenge}</p>
        </section>
      </div>
      <ol className="grid gap-3">
        {story.caseStudy.howWeHandled.map((step) => (
          <li key={step.step} className="rounded-3xl border border-border bg-card p-4">
            <p className="font-mono text-xs tracking-[0.18em] text-primary uppercase">{step.step}</p>
            <p className="mt-2">{step.text}</p>
          </li>
        ))}
      </ol>
      <p>{story.caseStudy.delivered}</p>
      <ul className="flex flex-wrap gap-3">
        {story.caseStudy.numbers?.map((item) => (
          <li key={item.label} className="rounded-2xl border border-border bg-card px-4 py-3">
            <span className="block font-display text-2xl">{item.value}</span>
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <SampleBadge />
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        {story.links.map((link) => (
          <a key={link.url + link.type} href={link.url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-border px-4 py-2 text-sm">
            {link.label ?? link.type}
          </a>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <WhatsAppLink placement="story" message={`Hi Pinhole Studio, I'd like to book a similar ${story.category} shoot in the ${studio?.name ?? "studio"}.`} />
        <Button nativeButton={false} variant="secondary" render={<Link href="/plan-my-shoot" />}>
          Plan my shoot
        </Button>
        {prev ? <Link href={`/stories/${prev.slug}`}>Previous</Link> : null}
        {next ? <Link href={`/stories/${next.slug}`}>Next</Link> : null}
      </div>
    </article>
  );
}
