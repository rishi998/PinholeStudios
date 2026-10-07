import { adminStats } from "@/lib/queries";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  const stats = await adminStats();

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <article className="rounded-3xl border border-border bg-card/80 p-5">
        <p className="text-sm text-muted-foreground">Enquiries this week</p>
        <p className="font-display text-4xl">{stats.weekCount}</p>
      </article>
      <article className="rounded-3xl border border-border bg-card/80 p-5">
        <p className="text-sm text-muted-foreground">WhatsApp events</p>
        <p className="font-display text-4xl">{stats.clicks}</p>
      </article>
      <article className="rounded-3xl border border-border bg-card/80 p-5">
        <p className="text-sm text-muted-foreground">By type</p>
        <ul className="mt-2 text-sm">
          {stats.byType.map(([type, count]) => (
            <li key={type}>
              {type}: {count}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
