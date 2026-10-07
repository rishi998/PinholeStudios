import { cn } from "cn";

export function StudioImage({
  swatch,
  label,
  className,
  src,
}: {
  swatch: string;
  label: string;
  className?: string;
  src?: string;
}) {
  if (src) {
    return <img src={src} alt={label} className={cn("h-full w-full object-cover", className)} />;
  }
  return (
    <div className={cn("relative grid place-items-end overflow-hidden bg-linear-to-br p-4", swatch, className)} role="img" aria-label={label}>
      <span className="rounded-full bg-black/40 px-3 py-1 text-xs text-white">{label}</span>
    </div>
  );
}
