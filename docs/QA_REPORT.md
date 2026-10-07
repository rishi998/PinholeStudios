# QA report — cinematic upgrade

Date: 7 October 2026. Dev server: http://localhost:3010

## What landed
- V2 palette (near-black, amber, ember), Instrument Serif accent, ambient glow and grain.
- Aperture logomark, official WhatsApp glyph, Phosphor duotone tiles on the home bento.
- Landing page: preloader, hero, two cards, marquee, studio list, demo teaser, cream pricing, closing CTA.
- `/demo` with camera presets and lighting toggle.
- `/stories/[slug]` for 12 sample case studies, plus a desktop globe and a mobile card row.
- Media scripts. They stop until `PEXELS_API_KEY` is set. No stock files were downloaded, so photographs are not in the build yet.

## Rubric (home, before stock photos)
| Check | Score | Note |
|---|---|---|
| Typography | 4 | Hero scale, serif accent, mono eyebrows |
| Colour and depth | 4 | Black-violet field, amber and ember glow, cream pricing band |
| Imagery | 2 | Blocked on the Pexels key. Gradient frames remain on older studio pages |
| Video | 1 | No downloaded loops yet |
| Icons | 4 | Phosphor on the home bento, WhatsApp brand glyph |
| Motion | 4 | Preloader, card scrub, reduced-motion skips |
| 3D | 3 | Designed aperture and a compound set. Not an HDRI-lit archviz scene yet |
| Layout | 4 | Hero matches the two-line headline and two-card panel |
| Mobile | 4 | Cards sit in a row; globe becomes a snap carousel |
| Brand feel | 4 | Reads as a studio site; photos will finish it |

## Next fix
Add `PEXELS_API_KEY` to `.env.local` and run `pnpm media:fetch` so every card can use a real file from `/media`.
