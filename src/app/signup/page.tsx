import { Suspense } from "react";

import { AuthForm } from "@/components/features/auth-form";
import { PageIntro } from "@/components/layout/page-intro";

export const metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <>
      <PageIntro title="Create account" lede="Save a shortlist and see booking requests. Enquiries still work as a guest." />
      <div className="px-4 pb-16">
        <Suspense>
          <AuthForm mode="signup" />
        </Suspense>
      </div>
    </>
  );
}
