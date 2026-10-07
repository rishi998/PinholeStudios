import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { NextResponse } from "next/server";

import { getStudio } from "@/data/studios";
import { siteConfig } from "@/lib/site.config";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const studio = getStudio(slug);
  if (!studio) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  page.drawRectangle({ x: 0, y: 780, width: 595, height: 62, color: rgb(0.1, 0.1, 0.1) });
  page.drawText("PINHOLE STUDIO", { x: 40, y: 808, size: 16, font: bold, color: rgb(0.95, 0.72, 0.2) });
  page.drawText(studio.name, { x: 40, y: 740, size: 22, font: bold, color: rgb(0.1, 0.1, 0.1) });
  page.drawText("Sample spec sheet. Replace with confirmed studio data.", { x: 40, y: 716, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
  studio.specs.forEach((spec, index) => {
    const y = 680 - index * 22;
    page.drawText(spec.label, { x: 40, y, size: 11, font: bold });
    page.drawText(`${spec.value} (sample)`, { x: 220, y, size: 11, font });
  });
  page.drawText(`Floor ${studio.floor.widthM}m x ${studio.floor.depthM}m (sample)`, { x: 40, y: 460, size: 12, font });
  page.drawRectangle({ x: 40, y: 360, width: studio.floor.widthM * 8, height: studio.floor.depthM * 6, borderColor: rgb(0.1, 0.1, 0.1), borderWidth: 1 });
  page.drawText(`${siteConfig.address.line}`, { x: 40, y: 80, size: 9, font });
  page.drawText("WhatsApp +91 85069 05757", { x: 40, y: 64, size: 9, font });

  const bytes = await pdf.save();
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${studio.slug}-spec-sheet.pdf"`,
    },
  });
}
