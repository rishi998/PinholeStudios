# PINHOLE STUDIO: CURSOR PROMPT V2 ("CINEMATIC UPGRADE")

**Project:** Upgrade the existing Next.js 16 prototype (built from `docs/BUILD_PROMPT.md`) so it looks and feels like an award-level studio site.
**Agency:** Antimatter | **Client:** Pinhole Studio (Farm 57, Kapashera Estate, New Delhi) | **Ref:** AM-PHS-SA-001

This file **adds to and overrides** `docs/BUILD_PROMPT.md`. Anything not mentioned here stays as it was. Where the two files disagree, **this file wins** (especially: no more gradient placeholders, real stock media, richer design tokens, new landing page, new `/demo`, new Testimonial Globe).

---

## HOW TO USE

1. Save this file as `docs/UPGRADE_PROMPT.md`.
2. Get free API keys (2 minutes each) and add to `.env.local`:
   - `PEXELS_API_KEY` from https://www.pexels.com/api/ (images and videos, required)
   - `PIXABAY_API_KEY` from https://pixabay.com/api/docs/ (optional fallback)
3. Open Cursor, **Plan mode**, paste the launcher below, review the plan, then switch to **Agent mode** and go one phase at a time.

## LAUNCHER PROMPT (paste into Cursor)

```text
Read @docs/UPGRADE_PROMPT.md completely, then @docs/BUILD_PROMPT.md for the existing spec.

You are a senior creative developer + art director. The current build looks dull: weak typography, flat dark-brown backgrounds, useless placeholder images and videos, generic icons, and a crude box-primitive 3D scene. Upgrade it exactly as specified in UPGRADE_PROMPT.md.

Rules:
1. Plan mode first. Produce a plan for phases U0 to U8. Ask at most 3 questions, only if blocked; otherwise state assumptions and continue.
2. One phase at a time. After each phase: lint, type-check, build, run Playwright screenshots at 390 and 1440 px, LOOK at the screenshots yourself, score them against the Visual Acceptance Rubric (section 12), fix anything below 4/5, then stop and wait for my "continue".
3. Use Context7 for every API you are not sure about (React Three Fiber v9, drei, postprocessing, GSAP ScrollTrigger, Lenis, Next.js 16). Do not guess APIs.
4. NEVER copy code, text, 3D models, images or videos from the reference sites. Take layout, interaction and animation PRINCIPLES only (section 1).
5. All media must come from the media pipeline (section 6) with licence info recorded. No hotlinking.
6. Keep every enquiry going through waLink() to 918506905757.
7. Keep the Sample rule: stock photos are "sample imagery" until the client supplies real photos; the file structure must make swapping them trivial.

Begin with the plan.
```

---

# 1. WHAT WE EXTRACTED FROM THE THREE REFERENCES

I (the prompt author) opened the three links. Notes and the exact way each is to be used:

### Reference A: Archviz (https://threejs-archviz.vercel.app/), by Neotix / Anderson Mancini
**What it is:** a real-time 3D house ("Seashore House") you explore in the browser.
**Observed features:** loading screen with progress; named camera presets (Stairs, Right top view, Left top view, Main bedroom, Back view, Top living room, Right pool); a "Customize the scene" panel with Midday / Sunset toggle, sun rotation, sun elevation and sun azimuth sliders; toggle for post-processing; a warning-labelled toggle for very expensive SSAO; a music on/off toggle; an "About" panel; an "Explore" button; a back arrow to close panels.
**Use for Pinhole:** the **Demo area**. Build `/demo`, "Step inside Pinhole": an explorable 3D virtual studio with camera presets per studio, lighting presets, sun sliders, post-processing and ambience toggles (full spec in section 7). **Do not reuse their model, textures, or code.** Build our own scene.

### Reference B: Oryzo (https://oryzo.ai/), by Lusion
**What it is:** a one-product landing page that feels like a film. Dark/black, giant type, one hero object with physical weight, scroll-driven story.
**Observed structure to learn from (not copy):**
- Minimal fixed menu with 4 anchors (Intro, Features, Product, Contact) plus a Menu/Close toggle, and a "Scroll to continue" prompt.
- Hero: one huge two-line headline ("Made for mugs. Built for tables."), one short supporting sentence, a "Designed by ..." credit line, a video thumbnail with a **PLAY** label.
- Sections arrive as **big statements** (one idea per screen), each with a small label, a large heading, and one supporting line.
- Interleaved **stat blocks** (big numbers) and **sticker-like image tiles** with short captions.
- A **reviews block**: overall rating (4.9/5), count, then portrait-image **review cards** with name + a witty role line, each card with its own rating.
- **Three-tier "Choose your own" cards** (ORYZO / Pro / Pro Max) with a comparison list under them.
- A closing **brand CTA** ("We caught your attention... imagine what we can do for your brand") with a big link.
**Use for Pinhole:** (1) placement of headline, subcopy and buttons in the hero, (2) the **two-card panel** and its entrance/scroll animation (section 5, hero), (3) the 3-tier card layout for pricing, (4) the reviews card style, (5) one-statement-per-screen pacing, (6) the closing CTA pattern, (7) the "one hero object with inertia" idea. Our hero object is a **3D aperture ring** (a pinhole is a camera aperture).
**Assumption to confirm:** "2card panel" is interpreted as an overlapping pair of floating cards in the hero. If the client meant the review cards or the 3-tier cards, the same animation system is reused there as well, so nothing is wasted.

### Reference C: Becky Entertainment media page (https://www.beckyentertainment.co/media)
**Important:** this page is a client-rendered app, so only its metadata was readable (portfolio of filmography, awards and media). Its public listing on Awwwards describes it as a **Three.js 3D gallery** with artist and filmography pages.
**Use for Pinhole:** the **Testimonial Globe**. A draggable 3D sphere of testimonial cards, where every card stores a link, and clicking a card opens a **case-study view** that shows how Pinhole handled that client's shoot and what was delivered (full spec in section 8). Interpretation based on the client's description. Do not copy their code or assets.

---

# 2. WHAT IS WRONG TODAY AND WHAT MUST CHANGE

From the current screenshot of `/studios/empty-studio`:

| Problem | Required fix |
|---|---|
| Text looks bad: small hero text, grey-on-dark low contrast, weak hierarchy, flat weight | New type system (section 4.2): bigger fluid headings, tight tracking, a serif-italic accent word, higher body contrast, eyebrow labels, `text-wrap: balance` |
| Colours and background dull (flat dark brown) | New palette and layered background system (section 4.1): richer black, vivid amber + ember, teal shadow accent, glows, grain, light leaks, one cream section to break the darkness |
| Images and videos useless | Real stock media pipeline (section 6) with consistent colour grading and fixed aspect ratios |
| Icons not pretty | Phosphor **duotone** icons in glowing containers, custom aperture logomark, proper WhatsApp brand glyph (section 4.4) |
| 3D scene is two random boxes | Replace with a designed scene: HDRI lighting, soft shadows, real set pieces per studio (section 7) |

---

# 3. TECH ADDITIONS

Keep the existing stack. Add:

```bash
pnpm add three @react-three/fiber @react-three/drei @react-three/postprocessing postprocessing maath
pnpm add gsap @gsap/react lenis
pnpm add @phosphor-icons/react react-icons
pnpm add sharp use-detect-gpu
pnpm add -D @types/three tsx @gltf-transform/cli ffmpeg-static
```

Notes:
- React Three Fiber v9 pairs with React 19. Check Context7 for the current compatible versions.
- Load every 3D component with `next/dynamic` and `ssr: false`. Wrap in `<Suspense>` with a designed skeleton.
- **Lenis** smooth scroll, synced with GSAP ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)` and drive Lenis from `gsap.ticker`). Disable Lenis on `prefers-reduced-motion`.
- 3D quality tiers via `use-detect-gpu` and drei `PerformanceMonitor` (section 7.6).
- Add scripts to `package.json`: `media:fetch`, `media:optimize`, `models:fetch`.

---

# 4. DESIGN SYSTEM V2: "PINHOLE NOIR, GRADED"

## 4.1 Colour and background (replace the old tokens; convert to OKLCH if you prefer)

```css
:root {
  --bg-0: #07060A;      /* base, near-black with a cool-violet tint (NOT brown) */
  --bg-1: #0E0C12;      /* alternate section */
  --surface: #15121A;   /* cards */
  --surface-2: #1D1924;
  --amber-400: #FFC857;
  --amber-500: #FFB020; /* primary */
  --amber-600: #E8890C;
  --ember: #FF6B35;     /* secondary, used in gradients and glows */
  --teal: #19C3B1;      /* cinematic shadow accent, use sparingly (badges, hotspots, links hover) */
  --cream: #F6F1E7;     /* text-on-dark highlights AND the one light section background */
  --text: #F6F1E7;
  --text-soft: #D3CDDB; /* body on dark, contrast >= 7:1 on bg-0 */
  --text-muted: #A59FB0;/* captions only, still >= 4.5:1 */
  --line: rgba(255,255,255,.10);
  --whatsapp: #25D366;
}
```

**Background system (build as a reusable `<AmbientBackground />`):**
1. Base `--bg-0`.
2. Two large blurred radial glows (amber top-left, ember bottom-right, 40 to 60vw, 25 to 35% opacity) drifting slowly (transform only, 30 s loops).
3. **Film grain** overlay: tiled noise PNG/SVG at 4 to 6% opacity, `mix-blend-mode: overlay`, subtle stepped animation (disabled for reduced motion).
4. Soft vignette.
5. **Viewfinder motif**: thin 1 px corner brackets and crop marks on hero, video frames and cards; tiny REC dot (amber, blinking) in the header logo area.
6. Light-leak gradient strips at some section seams (amber to ember to transparent, `blur(60px)`).
7. Section rhythm: `bg-0` → `bg-1` → `bg-0` ... plus **one cream section** (`--cream` bg, near-black text) for the pricing tiers so the page is not one flat darkness.

## 4.2 Typography (self-hosted via `next/font`)
- **Display:** Bricolage Grotesque, weight 700 to 800.
- **Accent:** Instrument Serif **italic**, used for ONE word per heading (e.g. "Seven spaces. One *frame* at a time.").
- **Body/UI:** Geist, 17 to 18 px, line-height 1.65, colour `--text-soft`.
- **Mono labels:** Geist Mono, 12 px, uppercase, tracking `0.18em`, colour amber (eyebrows, numbers like `01/07`, specs).
- Hero H1: `clamp(3rem, 9vw, 8.5rem)`, line-height 0.92, tracking `-0.04em`, `text-wrap: balance`. H2: `clamp(2rem, 5vw, 4.25rem)`. Max paragraph width 60ch.
- Key words get an amber→ember gradient text; marquee words use **outline text** (1.5 px stroke, transparent fill) that fills on hover.
- Tabular numbers for counters and prices.
- Never grey-on-dark below the contrast values above. No light/thin weights under 400.

## 4.3 Component polish (on top of the earlier recipes)
- Buttons: primary = amber→ember gradient, inner top highlight, shimmer sweep, glow `0 10px 40px -10px rgba(255,176,32,.6)`; secondary = glass; WhatsApp = green with proper glyph. Magnetic hover on desktop only (6 to 10 px pull).
- Cards: gradient 1 px border, cursor-follow spotlight (desktop), image inside with fixed aspect ratio and graded overlay.
- Custom cursor on desktop over video/gallery areas: a round "PLAY" / "DRAG" follower (Oryzo-style PLAY label). Hidden on touch.
- Section heading pattern everywhere: `eyebrow (mono, amber)` → `H2 with one serif-italic word` → `one supporting sentence`.

## 4.4 Icons
- Use **Phosphor Icons, weight `duotone`**, size 28 in a 56 px rounded-2xl container with a gradient border and a faint amber glow. Primary layer amber, secondary layer 30% opacity.
- Replace every default Lucide stroke icon on marketing sections. Lucide is allowed only for tiny utility icons (close, chevrons) at stroke 1.5.
- WhatsApp: official brand glyph via `react-icons/fa6` (`FaWhatsapp`), never a generic chat bubble.
- Custom SVG **aperture logomark** (9-blade iris) used in the preloader, favicon, hero object and section dividers.

## 4.5 Imagery treatment
- Every photo/video gets the same grade: `after:` overlay with a teal-to-amber gradient at `mix-blend-mode: soft-light` (opacity .35) + bottom black gradient for text legibility.
- Fixed aspect ratios only: 16:10 (cards), 21:9 (banners), 4:5 (portrait/review), 1:1 (tiles). Rounded-3xl, 1 px border `--line`.
- Blur-up placeholders, `next/image` with real `sizes`. No empty grey boxes anywhere.

---

# 5. LANDING PAGE ("/"): EXACT LAYOUT

Build in this order. Copy is editable sample copy (keep facts to those in BUILD_PROMPT section 2; pre-wedding and short-video shoots are confirmed by the client).

### 5.0 Preloader (max 1.8 s, skippable, once per session)
Black screen, the aperture logomark opens blade by blade while a 0 to 100 counter runs (mono, amber). Then the screen "iris-wipes" open to reveal the hero. Skip if `sessionStorage` flag is set or reduced motion.

### 5.1 Header
Keep the existing glass header and mega menu. Restyle with the new tokens, the aperture logomark, and a small blinking REC dot. Add Oryzo-style scroll hint: a thin vertical "Scroll to continue" label bottom-left of the hero.

### 5.2 Hero (100 svh, the most important screen)
```
┌─────────────────────────────────────────────────────────────┐
│ [logo]   Home About Studios▾ Services▾ Work 360   [Plan my shoot] [WA] │
│                                                                         │
│  ● DELHI'S PRODUCTION-READY STUDIO FLOORS         (mono eyebrow)        │
│                                                                         │
│  SEVEN SPACES.                           ┌───────────────────────┐     │
│  ONE *frame* AT A TIME.                  │   3D APERTURE RING    │     │
│  (giant, left aligned, 2 lines)          │ (R3F, inertia, opens  │     │
│                                          │  on scroll)           │     │
│  Film, pre-wedding, podcast and brand    └───────────────────────┘     │
│  shoots, with sets, lights and crew      ┌────────┐  ┌────────┐        │
│  ready at Farm 57, Kapashera.            │ CARD A │  │ CARD B │  ← two-card panel │
│                                          └────────┘  └────────┘        │
│  [ Plan my shoot → ]  [ ▶ Watch showreel ]  [ WhatsApp ]               │
│  ☆ trust chips: 7 studios · AC · Parking · Crew on call (sample flagged)│
│                                                                         │
│  ⌄ Scroll to continue                                                   │
└─────────────────────────────────────────────────────────────┘
```
- **Background:** looping muted stock video (slot `hero-loop`: film set / camera crew), darkened with gradient + grain + amber light leak. Poster image is the LCP element. `preload="metadata"`, autoplay only on desktop and when `saveData` is off; mobile shows the poster with a subtle Ken Burns.
- **Headline placement** follows the Oryzo principle: huge, left-aligned, on top of the visual, two lines max, supporting sentence directly under, buttons directly under that. Headline reveals with a line-by-line mask (each line slides up from `translateY(110%)`, 700 ms, 90 ms stagger).
- **3D aperture ring** (right half on desktop, behind text on mobile at 60% opacity): procedural 9-blade iris + outer ring, anodised amber metal (`MeshPhysicalMaterial`, metalness 1, roughness .25, clearcoat 1), warm HDRI reflections, soft bloom. Motion: pointer tilt with **inertia** (`maath/easing damp3`, smoothing .25), idle slow rotation, and the **iris opens as the hero scrolls out** (scroll progress → blade angle). Falls back to a static SVG aperture on low-tier devices.
- **Two-card panel (Oryzo-inspired):**
  - Card A, "07 Studios": stacked mini thumbnails + "Explore spaces →".
  - Card B, "Next free date": mini availability strip (reads from `availability` data) + "Check dates →".
  - Size 280×170 desktop, overlapping by 24 px, Card A rotated −4°, Card B +3°, glass surface with gradient border.
  - **Entrance:** slide up 40 px + blur 12→0 + opacity, 700 ms, 120 ms stagger, after headline.
  - **Idle:** gentle float ±6 px, 6 s sine, offset between cards.
  - **Pointer:** parallax 12 px (desktop, `hover: hover` only).
  - **Scroll (scrubbed by GSAP ScrollTrigger over the hero):** Card A moves left and rotates to −10°, Card B moves right to +8°, both fade to 0 by the hero's end. 
  - **Hover:** lift −6 px, spotlight, rotation eases to 0°.
  - Mobile: cards become a horizontal 2-up row under the buttons, no rotation.
- **Showreel button** opens a full-screen video lightbox (slot `showreel`), custom "PLAY" cursor on desktop.

### 5.3 Use-case marquee
Two opposing rows of giant **outline text** (Ad films · Pre-wedding · Podcasts · Music videos · Product shoots · OTT · Reels · Events ...). Pauses on hover; words fill with amber on hover.

### 5.4 Studio showcase 01/07 → 07/07 (pinned horizontal scroll)
- Desktop: a pinned section where vertical scroll moves 7 full-bleed panels horizontally (GSAP ScrollTrigger `pin` + `scrub`). Each panel: stock image or video (per studio slot), a giant mono number `01 / 07`, studio name in display type, 3 trait chips, buttons "Explore studio", "360° recce", "Preview in 3D" (opens `/demo?studio=<slug>`).
- Parallax: image moves 8% slower than the frame.
- Mobile/tablet: vertical snap cards (no pinning).
- A progress line + dots at the bottom.

### 5.5 "Step inside Pinhole" (Demo teaser, from Reference A)
- Left: eyebrow, H2 "Walk the floor before you book.", one sentence, button "Open full 3D demo →".
- Right: a rounded 16:10 frame containing the live compact 3D viewer (same scene as `/demo`), with camera preset chips under it (Empty floor, Green screen, House, Cyc, Podcast, Garden, Lawn). Clicking a chip flies the camera. A "Midday / Golden hour" toggle sits on the frame.
- Lazy-load the canvas only when in view; show the poster with a "Tap to explore" button first (facade) to protect LCP and mobile data.

### 5.6 Why Pinhole bento (6 to 9 tiles)
Large tile with stock video loop, medium tiles with duotone icons and short statements (large floors, event-ready spaces, house sets, indoor/outdoor, camera/lighting/sound, AC + parking, professional crew). Sticker-style image tiles with short captions like Oryzo's social tiles. Counters inside tiles where relevant (sample flagged).

### 5.7 Testimonial Globe (from Reference C), full spec in section 8
Full-height section, dark, the globe centered and large. Heading "Trusted by creators and brands" with one serif word. Overall rating chip and count (sample flagged).

### 5.8 Work highlights
6 items (3 video facades + 3 Instagram-style cards) in a bento grid, "See all work →".

### 5.9 "Choose your space" three-tier cards (the **cream** section)
Oryzo's "Choose your own" pattern: three big cards (**Hourly / Half day / Full day**, middle one "Popular", raised 16 px). Each card: price (sample flagged), 4 included items with duotone icons, "Get my quote" and "Quote on WhatsApp". Below, a comparison list (Best for, Includes, Crew add-on, Parking). Cards tilt on hover (desktop) and stack on mobile.

### 5.10 Trust strip
Animated counters (no "0+" ever), brand-partners marquee (grayscale logos → colour on hover; use text wordmark placeholders until real logos arrive, flagged Sample).

### 5.11 Closing CTA (Oryzo pattern)
Huge statement: "You've seen the frame. *Let's shoot.*" Under it: Plan my shoot (primary), WhatsApp (green), and the contact form + map. Background: the aperture ring, large, half-visible at the bottom, with a light leak.

### 5.12 Footer
Existing footer restyled: big wordmark, ecosystem links, policy links, phones, email, social icons (Phosphor duotone), tiny line: "Stock imagery is sample content until replaced with Pinhole's own photos" **only while the Sample badge flag is on**.

---

# 6. MEDIA PIPELINE (REAL STOCK IMAGES AND VIDEOS, AUTO-DOWNLOADED)

Goal: no placeholder boxes anywhere. Cursor must create the scripts below and run them. The client's own photos replace stock later by dropping files in the same folders.

## 6.1 Sources (all free for commercial use; record attribution anyway)
| Source | Use | Access |
|---|---|---|
| **Pexels** | primary for photos and videos | API `https://api.pexels.com/v1/search` (photos) and `https://api.pexels.com/videos/search` (videos). Header `Authorization: $PEXELS_API_KEY` |
| **Pixabay** | fallback for photos and videos | `https://pixabay.com/api/` and `https://pixabay.com/api/videos/` with `key=$PIXABAY_API_KEY` |
| **Poly Haven** (CC0) | HDRI lighting maps and optional 3D models | `https://api.polyhaven.com/assets?t=hdris` and `https://api.polyhaven.com/files/<id>` (no key; send a descriptive `User-Agent`) |

Check each service's current API docs through Context7 or the docs sites before coding, and respect rate limits (add a small delay and caching so re-runs do not re-download).

## 6.2 Scripts to create
- `scripts/media-slots.ts`: the slot table below (id, kind, queries[], orientation, min size, count, output path).
- `scripts/fetch-media.ts` (`pnpm media:fetch`): for each slot, query Pexels, then Pixabay if empty; pick results that match orientation and minimum size; for videos prefer HD (1080p) MP4 with duration 6 to 25 s; download to `public/media/_raw/`; write `src/data/media.manifest.json` with `{slotId, file, width, height, alt, credit: {author, sourceUrl, licence}}`. Skip files that already exist. Never overwrite a file the client supplied (any file in `public/media/custom/` wins over stock).
- `scripts/optimize-media.ts` (`pnpm media:optimize`): images → AVIF + WebP at 640/1280/1920 px via `sharp` plus a 24 px blur data URL; videos → via `ffmpeg-static`:
  `ffmpeg -i in.mp4 -vf "scale=1920:-2,fps=24" -an -c:v libx264 -crf 28 -preset slow -movflags +faststart out.mp4`, a VP9 WebM version (`-c:v libvpx-vp9 -b:v 0 -crf 36`), and a poster (`-frames:v 1`). Budgets: hero loop ≤ 4 MB, other loops ≤ 2 MB, images ≤ 250 KB each.
- `scripts/fetch-models.ts` (`pnpm models:fetch`): downloads 1 to 2 studio-style and 1 outdoor **HDRI** (1k, `.hdr`) from Poly Haven into `public/hdri/` (choose via the API by category such as studio / outdoor / sunset; do not hardcode IDs without checking they exist) and, optionally, a handful of CC0 furniture models for the house set, then packs them to `.glb` with `gltf-transform optimize` (meshopt + WebP textures).
- `docs/MEDIA_CREDITS.md`: auto-generated from the manifest (author, source link, licence).
- `src/components/ui/StudioImage.tsx` and a new `StudioVideo.tsx` read the manifest by `slotId`; if a `custom/` file exists they use it, else stock. `alt` text comes from the manifest. Show the small "Sample" chip while `NEXT_PUBLIC_SAMPLE_DATA_BADGE=true`.

## 6.3 Slots and search queries
| Slot id | Kind | Orientation | Queries (try in order) | Count |
|---|---|---|---|---|
| `hero-loop` | video | landscape | "film set camera crew", "cinema camera lens close up", "film production behind the scenes" | 1 |
| `showreel` | video | landscape | "filmmaking behind the scenes", "movie set lighting", "director monitor on set" | 1 |
| `studio-empty` | image + video | landscape | "empty photography studio", "large empty warehouse studio floor" | 4 img, 1 vid |
| `studio-greenscreen` | image + video | landscape | "green screen studio", "chroma key studio" | 4, 1 |
| `studio-house` | image | landscape | "modern living room interior", "bedroom interior", "kitchen interior", "dining room interior" | 8 (2 per room) |
| `studio-cyclorama` | image + video | landscape | "white cyclorama studio", "white backdrop photo studio" | 4, 1 |
| `studio-podcast` | image + video | landscape | "podcast studio microphone", "podcast recording two people" | 4, 1 |
| `studio-garden` | image + video | landscape | "garden photoshoot", "green garden lawn wedding" | 4, 1 |
| `studio-lawn` | image + video | landscape | "outdoor lawn event setup", "lawn party decoration" | 4, 1 |
| `prewedding` | image + video | portrait + landscape | "pre wedding photoshoot couple", "indian wedding couple photoshoot", "couple portrait golden hour" | 8, 2 |
| `crew-gear` | image | landscape | "softbox studio lighting", "camera lens rental", "studio lighting equipment", "boom microphone sound" | 8 |
| `bts` | image | mixed | "behind the scenes film crew", "photographer working studio", "video production team" | 8 |
| `testimonial-portraits` | image | portrait 4:5 | "professional portrait businessman", "woman entrepreneur portrait", "content creator portrait", "film director portrait", "photographer portrait" | 12 |
| `case-study-*` | image + video | landscape | per testimonial theme (ad film, podcast, music video, pre-wedding, event, product shoot) | 3 img each |
| `work-*` | video + image | per category | same themes as the Work filters | 3 each |

Rules: pick visually consistent footage (similar warmth), avoid recognisable brand logos and identifiable celebrities, avoid clips with visible watermarks, prefer people photographed from behind or in profile for generic "client" tiles.

## 6.4 Generated visuals (no download needed)
- Aperture ring, light-leaks, grain, glows, floor plans, and the 3D studio scenes are **generated in code** (SVG / Three.js / CSS).
- For anything stock cannot give (e.g. a specific studio interior), optionally generate images with an AI image API **only if** a key is present in env (`REPLICATE_API_TOKEN` or similar); otherwise skip silently. Label generated images "Illustration".

## 6.5 Honesty rule
Stock images are not Pinhole's real studios. Keep them flagged as sample until replaced, never caption them as "our studio", and make the swap a one-folder operation (`public/media/custom/<slot>/`).

---

# 7. THE 3D DEMO: `/demo` (from Reference A) AND THE SHARED SCENE

## 7.1 Concept
"Step inside Pinhole": an explorable real-time 3D virtual studio. One scene component, `<StudioScene />`, used by `/demo`, the landing-page teaser (5.5), and a compact "Preview in 3D" button on every studio page (opens `/demo?studio=<slug>`).

## 7.2 Scene content (all authored by us)
Build a designed compound, not primitives dumped in a void:
- A large **Empty Studio floor** (polished concrete floor with `MeshReflectorMaterial`, black walls, ceiling light grid).
- **Green Screen** bay: green cyc wall + floor curve, tracking marks, two softbox stands.
- **House Setup**: four small rooms (bedroom, living, kitchen, dining) with simple, tasteful furniture (primitives with proper materials, or CC0 GLBs from `models:fetch`).
- **White Cyclorama**: seamless curved cove (extruded profile), two key lights and a fill.
- **Podcast** room: table, 2 mics on arms, acoustic panels (ribbed texture).
- **Garden** and **Lawn**: grass plane with instanced blades or a texture, a few trees (simple instanced low-poly), string lights.
- Light rigs: `RectAreaLight` softboxes, practical lamps, sun directional light with soft shadows.
- Lighting from an **HDRI** (Poly Haven) plus drei `ContactShadows` / `AccumulativeShadows`. Subtle fog and dust particles in light beams.
- Optional: a tiny animated camera dolly and a "REC" light that blinks for life.

## 7.3 Controls (adapted from Reference A's panels, our own UI)
- **Camera presets** (chips, bottom or side): Overview, Empty floor, Green screen, House: Bedroom, House: Living, House: Kitchen, House: Dining, Cyclorama, Podcast, Garden, Lawn. Use drei `CameraControls` with smooth `setLookAt(..., true)` transitions. Deep-link: `/demo?studio=podcast-setup`.
- **"Customize the scene" panel:** Midday / Golden hour / Studio lights / Night toggle; sliders: Sun rotation, Sun elevation, Sun azimuth; toggle Post-processing (bloom + vignette + SMAA + subtle chromatic aberration); toggle "Ultra shadows (heavy)" with a visible warning like the reference ("expensive for the GPU, proceed at your own risk"), implemented with N8AO or SSAO from `@react-three/postprocessing`.
- **Ambience toggle** (off by default): generated room-tone via WebAudio (filtered pink noise), no audio file needed.
- **About panel:** short text, "Book this space" (WhatsApp prefilled with the studio and preset), "Plan my shoot".
- **Explore** button on the intro overlay; **back arrow** closes panels. Loading screen with `useProgress` (aperture icon + percentage).
- Panels animate in as glass sheets (Motion), keyboard accessible, Esc closes.

## 7.4 Overlays
Hotspot pins (teal, pulsing) with labels ("Lighting grid", "Entry door", "Cyc curve", "Power"), using drei `Html` or `Billboard`. Clicking a pin opens a small card with the spec (Sample chips).

## 7.5 UX details
- Drag to orbit, scroll/pinch to zoom, double-click to recentre. Limit polar angle and distance so people cannot get lost.
- First-visit hint: "Drag to look around · Pick a view below".
- A 2D fallback video (stock loop) if WebGL is unavailable, `prefers-reduced-motion` is on, or the device is low tier. Offer a "Try 3D anyway" button.

## 7.6 Performance tiers
- Detect GPU with `use-detect-gpu`; tiers 0 to 3.
  - Tier 0 or WebGL fail: video/poster fallback.
  - Tier 1 (most phones): DPR ≤ 1.25, no post-processing, baked-looking lights only, no reflector floor.
  - Tier 2: DPR ≤ 1.75, bloom + vignette.
  - Tier 3: DPR ≤ 2, full post, ultra shadows allowed.
- `PerformanceMonitor` lowers DPR automatically if FPS drops below 45.
- GLBs use meshopt/Draco and WebP/KTX2 textures; scene bundle target ≤ 6 MB total; lazy-load; never block LCP.

---

# 8. THE TESTIMONIAL GLOBE (from Reference C)

## 8.1 What the client wants
A **"link globe"** where all studio testimonials are stored as links. Each card on the globe represents one client. Clicking a card opens a view that shows the **descriptive work of Pinhole for that client**: how the shoot was handled and how the work was delivered.

## 8.2 Data model (`src/data/testimonials.ts`, later movable to the DB)
```ts
// SAMPLE until the client supplies real clients, quotes and links. Do not attach invented text to the real reviewer names.
export type Testimonial = {
  slug: string;
  isSample: boolean;
  clientName: string;            // "Sample client" until real
  role: string;                  // e.g. "Ad-film director"
  portrait: string;              // slotId from manifest
  rating: 1|2|3|4|5;
  quote: string;                 // short
  category: "ad-film"|"podcast"|"music-video"|"pre-wedding"|"event"|"product"|"short-film";
  studioSlug: string;            // which studio was used
  links: { type: "google"|"instagram"|"youtube"|"vimeo"|"article"; url: string; label?: string }[]; // the "stored links"
  caseStudy: {
    brief: string;               // what the client wanted
    challenge: string;           // the hard part
    howWeHandled: { step: "Pre-production"|"Set-up"|"Shoot day"|"Delivery"; text: string }[];
    delivered: string;           // what was delivered
    numbers?: { label: string; value: string }[];  // crew size, hours, turnaround (sample flagged)
    gallery: string[];           // slotIds
    video?: { vimeoId?: string; slotId?: string };
  };
};
```
Seed **12** sample testimonials across categories. Add a clearly labelled admin path later (`/admin/testimonials`: add/edit links and case-study text) as an optional phase U8.

## 8.3 3D globe behaviour
- R3F scene: N cards (planes with portrait image, rounded corners via shader/`RoundedBox` thin, thin amber border) placed on a sphere using a **Fibonacci sphere** distribution, all facing outward. Slow auto-rotation.
- **Drag to rotate** with inertia (release keeps momentum, damping), pointer/touch support, scroll does NOT hijack (page keeps scrolling when not dragging).
- **Hover:** the card scales 1.15, glows amber, others dim to 60%, cursor becomes a "VIEW" follower; tooltip shows name + role + rating stars.
- **Click:** the camera flies toward the card (GSAP/`CameraControls`, 700 ms), the globe stops, and a **case-study panel** slides in (right side drawer on desktop, full-screen sheet on mobile). URL updates to `/stories/<slug>` (shallow routing via a parallel/intercepted route) so each case study is shareable and indexable; opening that URL directly shows the full page version.
- Category filter chips above the globe (All, Ad film, Podcast, Music video, Pre-wedding, Event, Product): non-matching cards fade to 15% and the globe rotates to bring matches forward.
- Centre of the globe: the aperture logomark and the rating summary ("4.9 · 364 reviews", sample flagged).
- Optional gentle connector lines between the clicked card and the centre.

## 8.4 Case-study panel / page (`/stories/[slug]`)
Layout (cinematic, scrolls inside the panel):
1. Hero: portrait + client name/role, category chip, studio used (link to studio page), rating, pull quote in serif italic.
2. **"The brief"** and **"The challenge"**: two columns.
3. **"How we handled it"**: a vertical timeline with four steps (Pre-production → Set-up → Shoot day → Delivery), each with an icon and 1 to 2 sentences.
4. **"What was delivered"**: text + number tiles (crew size, hours on floor, turnaround; sample flagged) + the video (Vimeo facade or local loop) + a gallery (lightbox).
5. **"Original testimonial links"**: buttons for each stored link (Google review, Instagram, YouTube, Vimeo) opening in a new tab with `rel="noopener noreferrer"`.
6. CTA: **"Book a similar shoot"** → `waLink` prefilled with category + studio; also "Plan my shoot".
7. Prev / next story arrows.

## 8.5 Fallbacks and accessibility
- **Mobile and low-tier:** replace the 3D globe with a **horizontal snap carousel / 3D-ish coverflow** of the same cards (CSS transforms), same click-to-open behaviour.
- Always render a visually-hidden, keyboard-focusable **list** of all testimonials (each a link) so screen-reader and keyboard users and search engines have full access. Arrow keys rotate the globe when it is focused; Enter opens the focused card.
- Respect reduced motion (no auto-rotate, no camera fly; instant open).
- Add `Review`/`AggregateRating` JSON-LD only when the reviews are real (not sample).

---

# 9. REST OF THE SITE (consistency)

- Studio pages: new hero (full-bleed stock video/image, large type), the 360° recce viewer, a **"Preview in 3D"** button, the spec box, gallery with real images, pricing cards in the new style.
- `/work`: filters and lightbox stay; items use real stock thumbnails and video facades.
- Policies, account, admin: new tokens and type only; no layout change.
- Apply `<AmbientBackground />` globally; reduce its intensity on content-heavy pages (policies, admin).

---

# 10. PHASES

| Phase | Work | Done when |
|---|---|---|
| **U0** | Install deps; create `docs/UPGRADE_PROMPT.md` rule file `.cursor/rules/40-upgrade.mdc` (copy sections 1, 4, 6.5, 10 rules); update `pinhole-design-system` skill to V2 tokens | Rules and skill updated, build passes |
| **U1** | Design system V2: tokens, fonts, `AmbientBackground`, grain, buttons, cards, icons, cursor follower, section-heading component | `/dev/ui` shows everything; old pages inherit new look; contrast checks pass |
| **U2** | Media pipeline: scripts, manifest, `StudioImage`/`StudioVideo`, `MEDIA_CREDITS.md`; swap ALL placeholder imagery site-wide | No placeholder gradients remain; every slot has real media; budgets met |
| **U3** | Landing page sections 5.0 to 5.4 (preloader, hero with aperture ring and two-card panel, marquee, pinned studio showcase), Lenis + ScrollTrigger | Hero matches layout; animations smooth at 60 fps desktop; mobile layout correct |
| **U4** | Shared `<StudioScene />` + `/demo` + landing teaser 5.5 + "Preview in 3D" buttons + performance tiers | All presets fly correctly; panels work; fallbacks work; Lighthouse mobile perf ≥ 85 on `/` |
| **U5** | Testimonial Globe + `/stories/[slug]` + fallbacks + seed data | Click opens case study; shareable URL; keyboard + mobile OK |
| **U6** | Landing sections 5.6 to 5.12 (bento, work highlights, cream pricing tiers, trust strip, closing CTA, footer) | Full landing page complete and consistent |
| **U7** | Apply new look to studio pages, work, studios index, services; polish motion; reduced-motion audit | Every route reviewed at 7 viewports |
| **U8** | Performance, accessibility, QA report; optional `/admin/testimonials` CRUD | Lighthouse mobile: Perf ≥ 90 Home (with facades), A11y ≥ 95, SEO ≥ 95; Playwright suite green; `docs/QA_REPORT.md` updated |

Performance reminders: the hero poster is the LCP; 3D and videos are lazy; no more than one WebGL canvas active at a time (pause or unmount off-screen canvases); animate only `transform`/`opacity` in DOM; cap pinned-section work on mobile.

---

# 11. ADDITIONAL ACCEPTANCE TESTS (Playwright)

1. `pnpm media:fetch && pnpm media:optimize` completes; `src/data/media.manifest.json` has every slot; `docs/MEDIA_CREDITS.md` exists.
2. No `<img>`/`next/image` on any page renders as a gradient placeholder (check by asserting `src` points into `/media/`).
3. Home hero: H1 visible, two cards visible, primary CTA, showreel opens a lightbox, aperture canvas present on desktop, static fallback on a throttled low-tier emulation.
4. Scrolling the hero changes the transform of both cards (scrub works).
5. `/demo`: preset chips change the camera (assert URL or a debug data attribute), lighting toggle changes the sun settings, panels open and close with Esc.
6. `/demo?studio=podcast-setup` opens on the Podcast preset.
7. Testimonial Globe: keyboard focus + Enter opens `/stories/<slug>`; the story page lists its stored links with `target="_blank"` and `rel` including `noopener`; the "Book a similar shoot" WhatsApp URL starts with `https://wa.me/918506905757?text=`.
8. Mobile (390 px): globe replaced by the carousel; no horizontal scroll at 320 to 1920.
9. `prefers-reduced-motion`: no auto-rotation, no preloader animation, no pinned horizontal scroll.
10. Lighthouse and axe targets from BUILD_PROMPT section 1 still pass.

---

# 12. VISUAL ACCEPTANCE RUBRIC (Cursor must score its own screenshots; fix anything < 4)

Score each 1 to 5 on the home page and one studio page at 390 and 1440 px:
1. **Typography:** clear hierarchy, headline dominant, body easily readable, one serif accent word per heading.
2. **Colour and depth:** rich black (not brown), visible amber/ember glow, grain, no flat empty areas, one cream section present.
3. **Imagery:** all real, consistent grade, correct aspect ratios, none blurry or stretched.
4. **Video:** loops smooth, muted, correct poster, no jank, within size budgets.
5. **Icons:** all duotone Phosphor/brand glyphs, consistent size and container.
6. **Motion:** purposeful, smooth, reduced-motion respected.
7. **3D quality:** aperture ring and demo scene look designed (materials, lighting, shadows), no z-fighting, no flat grey.
8. **Layout fidelity:** hero matches the section 5.2 diagram; two-card panel behaves as specified.
9. **Mobile:** no overflow, thumb-friendly, sticky action bar intact.
10. **Brand feel:** reads as a premium film/photo studio, not a template.

Write the scores and fixes into `docs/QA_REPORT.md` after each phase.

---

# 13. GUARDRAILS (non-negotiable)

- **Originality and IP:** the three references are inspiration only. Do not copy their code, copy text, 3D models, textures, images, videos, or brand names. Oryzo is Lusion's fictional campaign; Archviz's model is its author's; Becky Entertainment is another company's portfolio.
- **Licences:** use only Pexels, Pixabay and Poly Haven (CC0) assets through the pipeline; keep `MEDIA_CREDITS.md` current; never hotlink.
- **No fake facts:** keep the Sample rule for prices, stats, reviews, client names, logos, case-study numbers. No fake awards. No invented claims about Pinhole beyond BUILD_PROMPT section 2 and what the client has stated (pre-wedding and short-video shoots, well known across India).
- **Privacy and safety:** testimonial links open with `rel="noopener noreferrer"`; no tracking scripts added by the globe; no personal data stored for it.
- **Performance and accessibility outrank effects.** If an effect hurts Lighthouse, mobile FPS, or keyboard access, simplify it and keep the fallback.

