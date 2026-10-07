import { PlanWizard } from "@/components/features/plan-wizard";
import { PageIntro } from "@/components/layout/page-intro";

export const metadata = { title: "Plan my shoot" };

export default function PlanMyShootPage() {
  return (
    <>
      <PageIntro title="Plan my shoot" lede="Five steps, then WhatsApp. A refresh keeps the draft on this device." />
      <div className="mx-auto w-full max-w-3xl px-4 pb-16">
        <PlanWizard />
      </div>
    </>
  );
}
