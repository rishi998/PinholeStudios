import { SampleBadge } from "@/components/ui/sample-badge";

export function FloorPlan({
  widthM,
  depthM,
  doorM,
  zones,
}: {
  widthM: number;
  depthM: number;
  doorM: number;
  zones: string[];
}) {
  const scale = 280 / Math.max(widthM, depthM);
  const width = widthM * scale;
  const depth = depthM * scale;
  const door = Math.max(16, doorM * scale);

  return (
    <figure className="rounded-3xl border border-border bg-[linear-gradient(180deg,#24180f,#12100e)] p-4">
      <svg viewBox="0 0 360 280" className="h-64 w-full" role="img" aria-label="Sample floor plan">
        <rect x={(360 - width) / 2} y={(240 - depth) / 2} width={width} height={depth} fill="#3a2a1c" stroke="#e8a317" />
        <rect x={(360 - door) / 2} y={(240 - depth) / 2 + depth - 4} width={door} height={8} fill="#f5e6c8" />
        <text x="180" y="24" textAnchor="middle" fill="#f5e6c8" fontSize="12">
          {widthM} m
        </text>
        <text x="24" y="140" fill="#f5e6c8" fontSize="12">
          {depthM} m
        </text>
      </svg>
      <figcaption className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        Zones: {zones.join(", ")}. Entry door marked on the near edge.
        <SampleBadge />
      </figcaption>
    </figure>
  );
}
