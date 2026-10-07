import { ShortlistView } from "@/components/features/shortlist-view";
import { shortlistFor } from "@/lib/queries";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Shortlist" };

export default async function ShortlistPage() {
  const session = await requireUser();
  const saved = await shortlistFor(session.user.id);
  return <ShortlistView saved={saved.map((row) => row.studioSlug)} />;
}
