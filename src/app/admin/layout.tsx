import Link from "next/link";

import { requireAdmin } from "@/lib/session";

const links = [
  ["Stats", "/admin"],
  ["Leads", "/admin/leads"],
  ["Bookings", "/admin/bookings"],
  ["Availability", "/admin/availability"],
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12">
      <nav className="flex gap-2 overflow-x-auto">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="rounded-full border border-border px-4 py-2 text-sm">
            {label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
