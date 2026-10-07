import { Badge } from "@/components/ui/badge";
import { showSampleBadge } from "@/data/site-content";

export function SampleBadge({ show = true }: { show?: boolean }) {
  if (!show || !showSampleBadge()) return null;
  return <Badge variant="outline">Sample</Badge>;
}
