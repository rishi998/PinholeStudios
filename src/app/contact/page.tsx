import { ContactForm } from "@/components/features/contact-form";
import { PageIntro } from "@/components/layout/page-intro";
import { directionsUrl, siteConfig } from "@/lib/site.config";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  const map = `https://maps.google.com/maps?q=${encodeURIComponent(siteConfig.address.mapsQuery)}&z=15&output=embed`;

  return (
    <>
      <PageIntro title="Contact" lede={siteConfig.address.line} />
      <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 pb-16 lg:grid-cols-2">
        <ContactForm />
        <div className="grid content-start gap-4">
          <ul className="grid gap-2">
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
          <a href={directionsUrl} className="text-sm underline-offset-4 hover:underline">
            Get directions
          </a>
          <iframe title="Map of Pinhole Studio" className="h-72 w-full rounded-3xl border border-border" src={map} loading="lazy" />
        </div>
      </div>
    </>
  );
}
