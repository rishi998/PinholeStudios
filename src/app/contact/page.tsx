import { ContactForm } from "@/components/features/contact-form";
import { PageIntro } from "@/components/layout/page-intro";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { directionsUrl, siteConfig } from "@/lib/site.config";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  const map = `https://maps.google.com/maps?q=${encodeURIComponent(siteConfig.address.mapsQuery)}&z=15&output=embed`;

  return (
    <>
      <PageIntro
        eyebrow="Kapashera"
        title="Contact"
        lede="Tell us the shoot, the date you have in mind, and how to reach you. The studio replies on WhatsApp."
      />
      <div className="mx-auto grid w-full max-w-[var(--page-width)] gap-12 px-5 pt-8 pb-[var(--space-section)] lg:grid-cols-12 md:px-8">
        <div className="lg:col-span-6">
          <ContactForm />
          <p className="mt-4 text-sm text-muted-foreground">
            Sending the form saves your note. After it is saved, you can open WhatsApp with the same message. Saving it does not confirm a booking.
          </p>
          <div className="mt-6">
            <WhatsAppLink placement="contact" variant="outline">
              Or start on WhatsApp
            </WhatsAppLink>
          </div>
        </div>
        <div className="grid content-start gap-6 lg:col-span-5 lg:col-start-8">
          <p className="text-sm leading-relaxed">{siteConfig.address.line}</p>
          <a href={directionsUrl} className="text-sm underline-offset-4 hover:underline">
            Get directions
          </a>
          <ul className="grid gap-2 text-sm">
            {siteConfig.phones.map((phone) => (
              <li key={phone.tel}>
                <a className="underline-offset-4 hover:underline" href={`tel:${phone.tel}`}>
                  {phone.display}
                </a>
              </li>
            ))}
            <li>
              <a className="underline-offset-4 hover:underline" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </li>
          </ul>
          <iframe title="Map of Pinhole Studio" className="h-72 w-full rounded-[var(--radius)] border border-border" src={map} loading="lazy" />
        </div>
      </div>
    </>
  );
}
