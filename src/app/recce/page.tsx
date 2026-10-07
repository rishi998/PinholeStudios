import { RecceViewer } from "@/components/features/recce-viewer";
import { PageIntro } from "@/components/layout/page-intro";
import { studios } from "@/data/studios";

export const metadata = { title: "360° Recce" };

export default function ReccePage() {
  const url = process.env.NEXT_PUBLIC_RECCE_URL;

  return (
    <>
      <PageIntro title="360° Recce" lede="Walk each studio before you book. The pins mark the lighting grid and the entry." />
      <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 pb-16">
        {studios.map((studio) => (
          <section key={studio.slug} className="grid gap-3">
            <h2 className="font-display text-2xl">{studio.name}</h2>
            <RecceViewer title={studio.name} url={url} />
          </section>
        ))}
      </div>
    </>
  );
}
