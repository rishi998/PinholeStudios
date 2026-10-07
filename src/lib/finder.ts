import { studios, type MustHave, type ShootType, type Studio } from "@/data/studios";

export function scoreStudio(studio: Studio, shoot?: ShootType, must: MustHave[] = []) {
  let score = 40;
  if (shoot && studio.shootTypes.includes(shoot)) score += 40;
  if (must.length) {
    const hits = must.filter((item) => studio.features.includes(item)).length;
    score += Math.round((hits / must.length) * 20);
    if (hits < must.length) score -= (must.length - hits) * 15;
  }
  return Math.max(0, Math.min(100, score));
}

export function rankStudios(shoot?: ShootType, must: MustHave[] = []) {
  return studios
    .map((studio) => ({ studio, score: scoreStudio(studio, shoot, must) }))
    .filter((item) => (must.length ? item.score >= 40 : true))
    .sort((a, b) => b.score - a.score);
}

export function suggestStudio(shoot?: ShootType, must: MustHave[] = []) {
  return rankStudios(shoot, must)[0]?.studio;
}
