import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

function envValue(name: string, source: string) {
  const match = source.match(new RegExp(`^${name}=(.*)$`, "m"));
  return match?.[1]?.trim() ?? process.env[name] ?? "";
}

async function main() {
  const local = await readFile(path.join(root, ".env.local"), "utf8").catch(() => "");
  const pexels = envValue("PEXELS_API_KEY", local);
  if (!pexels) {
    console.error("PEXELS_API_KEY is missing from .env.local. Add a free key from https://www.pexels.com/api/ and run pnpm media:fetch again.");
    process.exitCode = 1;
    return;
  }

  await mkdir(path.join(root, "public/media/_raw"), { recursive: true });
  const response = await fetch("https://api.pexels.com/v1/search?query=film%20set&per_page=1&orientation=landscape", {
    headers: { Authorization: pexels },
  });
  if (!response.ok) {
    console.error(`Pexels responded ${response.status}`);
    process.exitCode = 1;
    return;
  }
  const manifest = { generatedAt: new Date().toISOString(), note: "Extend scripts/media-slots.ts queries before a full download.", slots: [] };
  await writeFile(path.join(root, "src/data/media.manifest.json"), JSON.stringify(manifest, null, 2));
  console.log("Pexels key works. Full slot download is ready to extend from docs/UPGRADE_PROMPT.md section 6.");
}

void main();
