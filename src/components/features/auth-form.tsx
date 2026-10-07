"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export function AuthForm({ mode }: { mode: "login" | "signup" | "forgot" | "reset" }) {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string>();
  const [info, setInfo] = useState<string>();
  const [pending, setPending] = useState(false);

  return (
    <form
      className="mx-auto grid w-full max-w-md gap-4 rounded-3xl border border-border bg-card/80 p-5"
      onSubmit={async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setPending(true);
        setError(undefined);
        const email = String(data.get("email") ?? "");
        const password = String(data.get("password") ?? "");
        const next = params.get("next") || "/account";
        if (mode === "login") {
          const result = await authClient.signIn.email({ email, password, callbackURL: next });
          if (result.error) setError(result.error.message ?? "Could not sign in.");
          else router.push(next);
        } else if (mode === "signup") {
          const result = await authClient.signUp.email({
            name: String(data.get("name") ?? ""),
            email,
            password,
            callbackURL: "/account",
            phone: String(data.get("phone") ?? ""),
          });
          if (result.error) setError(result.error.message ?? "Could not create the account.");
          else router.push("/account");
        } else if (mode === "forgot") {
          const result = await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" });
          if (result.error) setError(result.error.message ?? "Could not send the reset link.");
          else setInfo("If that email exists, the reset link is printed in the dev server log.");
        } else {
          const token = params.get("token") ?? "";
          const result = await authClient.resetPassword({ newPassword: password, token });
          if (result.error) setError(result.error.message ?? "Could not reset the password.");
          else router.push("/login");
        }
        setPending(false);
      }}
    >
      {mode === "signup" ? (
        <Field label="Name" htmlFor="auth-name">
          <Input id="auth-name" name="name" required autoComplete="name" />
        </Field>
      ) : null}
      {mode !== "reset" ? (
        <Field label="Email" htmlFor="auth-email">
          <Input id="auth-email" name="email" type="email" required autoComplete="email" />
        </Field>
      ) : null}
      {mode === "signup" ? (
        <Field label="Phone" htmlFor="auth-phone">
          <Input id="auth-phone" name="phone" type="tel" autoComplete="tel" />
        </Field>
      ) : null}
      {mode !== "forgot" ? (
        <Field label={mode === "reset" ? "New password" : "Password"} htmlFor="auth-password">
          <Input id="auth-password" name="password" type="password" required minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} />
        </Field>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {info ? <p className="text-sm text-muted-foreground">{info}</p> : null}
      <Button type="submit" disabled={pending}>
        {mode === "login" ? "Sign in" : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Save password"}
      </Button>
      <p className="text-sm text-muted-foreground">
        {mode === "login" ? <Link href="/signup">Create an account</Link> : <Link href="/login">Sign in</Link>}
        {" · "}
        <Link href="/forgot-password">Forgot password</Link>
      </p>
    </form>
  );
}
