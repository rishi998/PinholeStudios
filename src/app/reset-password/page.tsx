import { Suspense } from "react";

import { AuthForm } from "@/components/features/auth-form";
import { PageIntro } from "@/components/layout/page-intro";

export const metadata = { title: "Reset password" };

export default function ResetPasswordPage() {
  return (
    <>
      <PageIntro title="Reset password" lede="Choose a new password for this account." />
      <div className="px-4 pb-16">
        <Suspense>
          <AuthForm mode="reset" />
        </Suspense>
      </div>
    </>
  );
}
