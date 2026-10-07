import { requireUser } from "@/lib/session";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  const session = await requireUser();
  return (
    <section className="rounded-3xl border border-border bg-card/80 p-6">
      <h1 className="font-display text-3xl">Hello, {session.user.name}</h1>
      <p className="mt-2 text-muted-foreground">{session.user.email}</p>
    </section>
  );
}
