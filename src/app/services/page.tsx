import { ServicePicker } from "@/components/features/service-picker";
import { PageIntro } from "@/components/layout/page-intro";

export const metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <>
      <PageIntro
        eyebrow="What the lot is for"
        title="Services"
        lede="Production space matched to the kind of project you are making."
      />
      <div className="mx-auto w-full max-w-[var(--page-width)] px-5 pt-8 pb-[var(--space-section)] md:px-8">
        <ServicePicker />
      </div>
    </>
  );
}
