import { Suspense } from "react";

import { AuthForm } from "@/components/features/auth-form";
import { PageIntro } from "@/components/layout/page-intro";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <>
      <PageIntro title="Sign in" lede="Browsing and WhatsApp enquiries stay open without an account." />
      <div className="px-4 pb-16">
        <Suspense>
          <AuthForm mode="login" />
        </Suspense>
      </div>
    </>
  );
}
