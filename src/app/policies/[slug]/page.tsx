import { notFound } from "next/navigation";

import { PageIntro } from "@/components/layout/page-intro";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SampleBadge } from "@/components/ui/sample-badge";
import { policies, policyTopics } from "@/data/site-content";

export function generateStaticParams() {
  return policies.map((policy) => ({ slug: policy.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = policies.find((item) => item.slug === slug);
  return { title: policy?.title ?? "Policy" };
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = policies.find((item) => item.slug === slug);
  if (!policy) notFound();

  return (
    <>
      <PageIntro title={policy.title} lede="Sample policy text. Replace with the official document before launch." />
      <div className="mx-auto w-full max-w-3xl px-4 pb-16 print:max-w-none">
        <p className="mb-4 flex items-center gap-2 text-sm">
          Replace with official text
          <SampleBadge />
        </p>
        <Accordion>
          {policyTopics.map((topic) => (
            <AccordionItem key={topic} value={topic}>
              <AccordionTrigger>{topic}</AccordionTrigger>
              <AccordionContent>
                Sample guidance for {topic.toLowerCase()} at Pinhole Studio. The team confirms the working rule on WhatsApp before a booking is locked.
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
}
