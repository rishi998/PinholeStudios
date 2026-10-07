import { Suspense } from "react";

import { AuthForm } from "@/components/features/auth-form";
import { PageIntro } from "@/components/layout/page-intro";

export const metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <>
      <PageIntro title="Forgot password" lede="In development the reset link is printed in the server log." />
      <div className="px-4 pb-16">
        <Suspense>
          <AuthForm mode="forgot" />
        </Suspense>
      </div>
    </>
  );
}
