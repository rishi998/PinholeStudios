import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const destRoot = path.join(root, "public/media/custom");

const files = [
  ["branding/logo.png", "https://pinholestudio.in/wp-content/uploads/2026/02/Logo-Pinhole.png"],
  ["branding/favicon.png", "https://pinholestudio.in/wp-content/uploads/2026/02/Pinhole-Studio-Favicon.png"],
  ["branding/pinhole-media.png", "https://pinholestudio.in/wp-content/uploads/2026/02/Pinhole-Media.png"],
  ["homepage/showreel.mp4", "https://pinholestudio.in/wp-content/uploads/2026/03/pinhole-studio-video.mp4"],
  ["homepage/about.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/6F86C7C3-2EAF-44C4-9600-1C93A41F0604_1_201_a.jpeg"],
  ["studios/empty-studio/01.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/empty-studio-1-scaled.jpg"],
  ["studios/empty-studio/02.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/empty-studio-6.jpg"],
  ["studios/empty-studio/03.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/empty-studio-13.jpg"],
  ["studios/empty-studio/04.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/empty-studio-18-scaled.jpg"],
  ["studios/green-screen-studio/01.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/Green-Screen-01-1.jpg"],
  ["studios/green-screen-studio/02.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/Green-Screen-04.jpg"],
  ["studios/green-screen-studio/03.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/Green-Screen-08.jpg"],
  ["studios/green-screen-studio/04.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/Green-Cyclorama-1.jpg"],
  ["studios/the-house-setup/01.jpg", "https://pinholestudio.in/wp-content/uploads/2026/06/The-House-Setup-Images.jpg"],
  ["studios/the-house-setup/02.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/Bedroom-1-1.jpg"],
  ["studios/the-house-setup/03.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/File-kitchen3.jpg"],
  ["studios/the-house-setup/04.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/223A0092.jpg"],
  ["studios/white-cyclorama/01.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/White-Cyclorama-Setup.jpeg"],
  ["studios/white-cyclorama/02.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-23-at-13.31.25.jpeg"],
  ["studios/podcast-setup/01.png", "https://pinholestudio.in/wp-content/uploads/2026/02/Pinhole-Studio-Deck-1-21.png"],
  ["studios/podcast-setup/02.png", "https://pinholestudio.in/wp-content/uploads/2026/02/Pinhole-Studio-Deck-1-22.png"],
  ["studios/podcast-setup/03.png", "https://pinholestudio.in/wp-content/uploads/2026/02/Pinhole-Studio-Deck-1-23.png"],
  ["studios/garden-area/01.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/223A0012.jpg"],
  ["studios/garden-area/02.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/223A0013.jpg"],
  ["studios/garden-area/03.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/837A0524.jpg"],
  ["studios/garden-area/04.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/837A0545.jpg"],
  ["studios/lawn-area/01.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/2C2A9342.jpg"],
  ["studios/lawn-area/02.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/2C2A9351.jpg"],
  ["studios/lawn-area/03.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/2C2A9412.jpg"],
  ["studios/lawn-area/04.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/223A0148.jpg"],
  ["portfolio/01.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/93233BAE-0C56-46D9-AFC1-079DE2028909_1_201_a.jpg"],
  ["portfolio/02.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/12CC9A8B-7239-43CF-B141-311B55283593_1_201_a.jpg"],
  ["portfolio/03.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/9A6480E4-E295-4D75-8C57-2DE3A738CF72_1_201_a.jpg"],
  ["portfolio/04.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/3DAF88E8-EC23-409F-9666-E9F326509493_1_201_a.jpg"],
  ["portfolio/05.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/18251E1D-512F-4FAD-AD6F-F165DF35656B_1_201_a.jpeg"],
  ["portfolio/06.jpg", "https://pinholestudio.in/wp-content/uploads/2026/02/7DC4E1F7-DAEE-4B06-A25A-A19349154D8D_1_201_a.jpg"],
  ["services/event-rate-card.png", "https://pinholestudio.in/wp-content/uploads/2026/02/Event-Company-Product-Launch-Rate-Card.png"],
  ["services/education-rate-card.png", "https://pinholestudio.in/wp-content/uploads/2026/02/Education-Seminar-Workshop-Rate-Card.png"],
  ["services/creator-rate-card.png", "https://pinholestudio.in/wp-content/uploads/2026/02/Content-Creator-Influencer-Rate-Card.png"],
  ["services/agency-rate-card.png", "https://pinholestudio.in/wp-content/uploads/2026/02/Agency-Production-House-Rate-Card.png"],
];

const seen = new Map();
const report = [];

for (const [relative, sourceUrl] of files) {
  const response = await fetch(sourceUrl);
  const type = response.headers.get("content-type") ?? "";
  if (!response.ok || (!type.startsWith("image/") && !type.startsWith("video/"))) {
    report.push({ relative, sourceUrl, status: "failed", detail: `${response.status} ${type}` });
    console.error("FAIL", relative, response.status, type);
    continue;
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 1000) {
    report.push({ relative, sourceUrl, status: "failed", detail: `too small ${bytes.length}` });
    continue;
  }
  const hash = createHash("sha256").update(bytes).digest("hex");
  const duplicateOf = seen.get(hash);
  seen.set(hash, relative);
  const file = path.join(destRoot, relative);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, bytes);
  report.push({
    relative,
    sourceUrl,
    status: duplicateOf ? "duplicate" : "downloaded",
    duplicateOf,
    mimeType: type.split(";")[0],
    bytes: bytes.length,
    sha256: hash,
  });
  console.log(duplicateOf ? "DUP" : "OK", relative, bytes.length);
}

await writeFile(path.join(root, "src/data/pinhole-media-report.json"), JSON.stringify({ generatedAt: new Date().toISOString(), report }, null, 2));
const failed = report.filter((item) => item.status === "failed").length;
console.log(`done ${report.length - failed} saved, ${failed} failed`);
if (failed) process.exitCode = 1;
