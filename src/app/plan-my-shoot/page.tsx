import { PlanWizard } from "@/components/features/plan-wizard";
import { PageIntro } from "@/components/layout/page-intro";

export const metadata = { title: "Plan my shoot" };

export default function PlanMyShootPage() {
  return (
    <>
      <PageIntro
        eyebrow="Five steps"
        title="Plan my shoot"
        lede="Choose a room and a preferred date. The draft stays on this device. WhatsApp is how the studio confirms it."
      />
      <div className="mx-auto w-full max-w-3xl px-5 pt-8 pb-[var(--space-section)] md:px-8">
        <PlanWizard />
      </div>
    </>
  );
}
