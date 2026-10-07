import Link from "next/link";

import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

const links = [
  ["Overview", "/account"],
  ["Enquiries", "/account/enquiries"],
  ["Bookings", "/account/bookings"],
  ["Shortlist", "/account/shortlist"],
  ["Profile", "/account/profile"],
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 md:grid-cols-[200px_1fr]">
      <nav className="flex gap-2 overflow-x-auto md:flex-col">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="rounded-full border border-border px-4 py-2 text-sm">
            {label}
          </Link>
        ))}
      </nav>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
