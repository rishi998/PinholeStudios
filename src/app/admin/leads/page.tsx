import { LeadControls } from "@/components/features/lead-controls";
import { listEnquiries } from "@/lib/queries";

export const metadata = { title: "Leads" };

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const { q = "", status = "" } = await searchParams;
  const rows = (await listEnquiries()).filter((row) => {
    const haystack = `${row.name} ${row.message} ${row.type}`.toLowerCase();
    return (!q || haystack.includes(q.toLowerCase())) && (!status || row.status === status);
  });

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl">Leads</h1>
        <a className="text-sm underline" href="/api/admin/leads.csv">
          Export CSV
        </a>
      </div>
      <form className="flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder="Search" className="h-12 rounded-xl bg-muted/50 px-3" />
        <input name="status" defaultValue={status} placeholder="Status" className="h-12 rounded-xl bg-muted/50 px-3" />
        <button className="h-12 rounded-full bg-primary px-4 text-primary-foreground" type="submit">
          Filter
        </button>
      </form>
      {rows.map((row) => (
        <article key={row.id} className="rounded-3xl border border-border bg-card/80 p-4">
          <p className="font-medium">{row.name}</p>
          <p className="text-sm text-muted-foreground">
            {row.type} · {row.sourcePage} · {row.createdAt.toISOString()}
          </p>
          <p className="mt-2 whitespace-pre-wrap">{row.message}</p>
          <LeadControls id={row.id} status={row.status} notes={row.notes} />
        </article>
      ))}
    </section>
  );
}
