import { listEnquiries } from "@/lib/queries";
import { requireAdmin } from "@/lib/session";

function cell(value: string | null) {
  return `"${(value ?? "").replaceAll('"', '""')}"`;
}

export async function GET() {
  await requireAdmin();
  const rows = await listEnquiries();
  const header = ["id", "type", "name", "email", "phone", "status", "source", "message", "created"].join(",");
  const body = rows.map((row) =>
    [row.id, row.type, row.name, row.email, row.phone, row.status, row.sourcePage, row.message, row.createdAt.toISOString()].map(cell).join(","),
  );
  return new Response([header, ...body].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=leads.csv",
    },
  });
}
