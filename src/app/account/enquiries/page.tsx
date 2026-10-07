import { enquiriesForUser } from "@/lib/queries";
import { requireUser } from "@/lib/session";

export const metadata = { title: "My enquiries" };

export default async function EnquiriesPage() {
  const session = await requireUser();
  const rows = await enquiriesForUser(session.user.id);
  return (
    <section className="grid gap-3">
      <h1 className="font-display text-3xl">Enquiries</h1>
      {rows.length === 0 ? <p className="text-muted-foreground">No saved enquiries yet. Guest forms still go to WhatsApp.</p> : null}
      {rows.map((row) => (
        <article key={row.id} className="rounded-3xl border border-border bg-card/80 p-4">
          <p className="text-sm text-muted-foreground">{row.type} · {row.status}</p>
          <p className="mt-2 whitespace-pre-wrap">{row.message}</p>
        </article>
      ))}
    </section>
  );
}
