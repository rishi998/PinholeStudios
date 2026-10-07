export function ApertureMark({ className = "size-10" }: { className?: string }) {
  const blades = Array.from({ length: 9 }, (_, index) => {
    const angle = (index / 9) * 360;
    return `rotate(${angle} 16 16)`;
  });

  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {blades.map((transform) => (
        <path key={transform} d="M16 16 L22 6.2 A12 12 0 0 1 27.2 12.5 Z" fill="currentColor" transform={transform} />
      ))}
      <circle cx="16" cy="16" r="3.2" fill="#07060a" />
    </svg>
  );
}
