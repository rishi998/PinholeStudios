import { ServicePicker } from "@/components/features/service-picker";
import { PageIntro } from "@/components/layout/page-intro";

export const metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <>
      <PageIntro title="Services" lede="Production space matched to the kind of project you are making." />
      <div className="mx-auto w-full max-w-5xl px-4 pb-16">
        <ServicePicker />
      </div>
    </>
  );
}
