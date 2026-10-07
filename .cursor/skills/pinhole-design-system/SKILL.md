---
name: pinhole-design-system
description: Pinhole Noir V2 design system. Use whenever building or styling any UI component, page section, form, button, menu, card, or animation in this project.
---
# Pinhole Noir, graded
Upgrade spec wins over the original tokens. Full detail: `docs/UPGRADE_PROMPT.md` sections 4 and 5.

## Look
Near-black with a cool violet tint (`#07060A`), not brown. Vivid amber `#FFB020` and ember `#FF6B35`. Teal `#19C3B1` only for badges, hotspots, and link hover. One cream section (`#F6F1E7`, near-black text) so the page is not one flat darkness.
Layered background: base, two drifting radial glows, film grain, vignette, viewfinder corner marks, light leaks at some seams.
Glass only for header, sheets, popovers, and hero cards. Cards are rounded-3xl with a 1px gradient border.

## Fonts
- Display: Bricolage Grotesque 700–800. Hero `clamp(3rem, 9vw, 8.5rem)`, line-height 0.92, tracking `-0.04em`, `text-wrap: balance`.
- Accent: Instrument Serif italic, one word per heading.
- Body: Geist 17–18px, line-height 1.65, colour `#D3CDDB` on dark.
- Labels: Geist Mono 12px, uppercase, tracking `0.18em`, amber.

## Recipes
- Button: pill, 44px min. Primary is an amber-to-ember gradient with shimmer and glow. Secondary is glass. WhatsApp uses the official glyph. Magnetic hover on desktop only.
- Input: 48px, filled muted, amber 2px focus ring, always-visible label, 16px+ font.
- Card: graded photo, fixed aspect ratio, cursor spotlight on hover devices.
- Icons: Phosphor duotone, 28px inside a 56px rounded container with a faint amber glow. Lucide only for close and chevrons.
- Section heading: mono eyebrow, H2 with one serif-italic word, one supporting sentence.

## Motion
Easing cubic-bezier(0.22,1,0.36,1). Animate only transform and opacity. Lenis and pinned scroll turn off for reduced motion. MotionConfig reducedMotion="user".

## Checks before finishing any UI task
Works at 390px and 1440px, no horizontal scroll, focus ring visible, keyboard works, contrast at least 4.5:1 for captions and 7:1 for body on the near-black background.
