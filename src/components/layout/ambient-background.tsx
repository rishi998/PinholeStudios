export function AmbientBackground({ quiet = false }: { quiet?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#07060a]" />
      <div className={`absolute -top-[20%] -left-[10%] size-[60vw] rounded-full bg-[#ffb020] blur-[80px] motion-safe:animate-[drift_30s_ease-in-out_infinite] ${quiet ? "opacity-10" : "opacity-30"}`} />
      <div className={`absolute -right-[8%] -bottom-[18%] size-[50vw] rounded-full bg-[#ff6b35] blur-[90px] motion-safe:animate-[drift_30s_ease-in-out_infinite_reverse] ${quiet ? "opacity-10" : "opacity-25"}`} />
      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay motion-safe:animate-[grain_0.7s_steps(2)_infinite]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#07060a_100%)]" />
    </div>
  );
}
