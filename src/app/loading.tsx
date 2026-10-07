export default function Loading() {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-4 px-4 py-16">
      <div className="h-12 w-2/3 animate-pulse rounded-2xl bg-muted" />
      <div className="h-64 animate-pulse rounded-3xl bg-[linear-gradient(160deg,#2a1c12,#171410)]" />
    </div>
  );
}
