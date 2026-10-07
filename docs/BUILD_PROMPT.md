# PINHOLE STUDIO — CURSOR BUILD PROMPT (Next.js 16 prototype)

**Project:** Redevelopment of https://pinholestudio.in/ as a modern, conversion-focused, app-like website
**Agency:** Antimatter  |  **Client:** Pinhole Studio (Farm 57, Kapashera Estate, New Delhi)
**Ref:** AM-PHS-SA-001  |  **Date:** 06 October 2026

---

## HOW TO USE THIS FILE

This file has three parts.

| Part | What it is | Who does it |
|---|---|---|
| **A. 10-minute Cursor setup** | MCP servers, skills and rules that make Cursor build a *real-looking* app instead of a generic template | You (once) |
| **B. Launcher prompt** | The short message you paste into Cursor Agent | You |
| **C. Master Build Spec** | The full, detailed specification Cursor reads and executes phase by phase | Cursor |

**Workflow (recommended by Cursor best practice): plan first, then build.**
1. Save this whole file in your project as `docs/BUILD_PROMPT.md`.
2. Do Part A.
3. Open Cursor, switch to **Plan mode**, paste the Part B launcher prompt, review the plan.
4. Switch to **Agent mode** and let it build one phase at a time. Commit after every phase.

---

# PART A — CURSOR SETUP (DO THIS FIRST)

Cursor does not have a feature literally called "Powers". The equivalents are **Rules**, **Skills**, **MCP servers**, **Subagents** and **Hooks**. Use the setup below.

## A1. Create the project

```bash
npx create-next-app@latest pinhole-studio --typescript --tailwind --eslint --app --src-dir --turbopack --import-alias "@/*"
cd pinhole-studio
mkdir -p docs .cursor/rules .cursor/skills
# put this file at docs/BUILD_PROMPT.md
```

Use **pnpm** or **npm**, your choice. Be consistent.

## A2. Add MCP servers (`.cursor/mcp.json`)

Keep this to **four servers only**. Cursor has a ceiling of roughly 40 active tools across all servers, so more servers means worse results.

```json
{
  "mcpServers": {
    "context7": { "url": "https://mcp.context7.com/mcp" },
    "playwright": { "command": "npx", "args": ["@playwright/mcp@latest"] },
    "next-devtools": { "command": "npx", "args": ["-y", "next-devtools-mcp@latest"] },
    "shadcn": { "command": "npx", "args": ["shadcn@latest", "mcp"] }
  }
}
```

| Server | Why it matters for this project |
|---|---|
| **Context7** | Injects up-to-date docs for Next.js 16, Better Auth, Tailwind v4, shadcn, Motion and AI SDK v6, so Cursor stops writing outdated code. Highest-value server. |
| **Playwright MCP** | Lets Cursor open the site in a real browser, click through flows, take screenshots at mobile/tablet/desktop sizes and fix its own UI bugs. |
| **Next.js DevTools MCP** | Gives Cursor live access to Next.js errors, routes and logs during development. |
| **shadcn MCP** | Installs real shadcn/ui components with correct props instead of guessed code. |

> Verify the exact command for the `next-devtools` and `shadcn` servers in their current docs. Package names and flags can change. If one fails, ask Cursor: "Use Context7 to find the current install command for the X MCP server."

## A3. Skills

Cursor discovers skills from `.cursor/skills/<skill-name>/SKILL.md` (project) or `~/.cursor/skills/` (global). Each skill is a folder with a `SKILL.md` that has YAML frontmatter (`name`, `description`). The agent loads a skill when its description matches the task, or you can call it with `/skill-name`.

**Custom skills (Cursor creates these for you in Phase 0)** — full contents are in Appendix B:
- `pinhole-design-system`: the UI theme, tokens and component recipes
- `visual-qa-playwright`: screenshots at 6 device sizes, overflow and console checks
- `feature-traceability`: proves every original feature and the 10 new features exist

**Optional third-party skills** (install only after you read their `SKILL.md`; skills and MCP servers are third-party instructions, and security audits have found issues in a large share of public MCP servers):
- A **Next.js 16 skill** (App Router, `proxy.ts`, Cache Components)
- An **AI SDK v6 skill** (streaming chat, tool calling)
- A **frontend-design skill** (pushes distinctive visual choices over generic AI styling)
- The built-in `/create-rule`, `/create-skill` and `/migrate-to-skills` skills already ship with Cursor

## A4. Rules

Cursor project rules are `.mdc` files in `.cursor/rules/` with frontmatter (`alwaysApply`, `globs`, `description`). Keep them short. Phase 0 creates the rule files whose full text is in **Appendix A**.

## A5. Environment

Create `.env.local`:

```bash
# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SAMPLE_DATA_BADGE=true      # shows a small "Sample" tag on placeholder prices/specs/stats/reviews

# Auth (Better Auth)
BETTER_AUTH_SECRET=generate-a-long-random-string
BETTER_AUTH_URL=http://localhost:3000
ADMIN_EMAIL=owner@example.com           # this email becomes the admin on first sign-up
GOOGLE_CLIENT_ID=                       # optional
GOOGLE_CLIENT_SECRET=                   # optional

# Database
DATABASE_URL=file:./local.db

# AI assistant (optional; app falls back to a built-in rule-based assistant if empty)
ANTHROPIC_API_KEY=
# or OPENAI_API_KEY=

# 360 virtual recce (the existing CloudPano URL from pinholestudio.in)
NEXT_PUBLIC_RECCE_URL=

# Analytics (optional)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_META_PIXEL_ID=
```

---

# PART B — LAUNCHER PROMPT (PASTE INTO CURSOR, PLAN MODE FIRST)

```text
Read @docs/BUILD_PROMPT.md completely, especially Part C (Master Build Spec) and the Appendices.

You are a senior full-stack Next.js engineer and product designer. Build the Pinhole Studio website prototype exactly as specified.

Rules of engagement:
1. Start in Plan mode. Produce a phase-by-phase plan that maps to Part C phases 0 to 8. Ask me at most 3 questions, only if something blocks you. Otherwise state your assumption and continue.
2. Execute ONE phase at a time. At the end of each phase: run lint, type-check and build, fix everything, run the Playwright checks for that phase, then summarize what was done and stop for my "continue".
3. Use Context7 for every library API you are not 100% sure about (Next.js 16, Better Auth, Tailwind v4, shadcn, Motion, AI SDK v6, Drizzle). Do not guess APIs.
4. Use the shadcn MCP to install components. Use Playwright MCP to look at your own UI at 360, 390, 768, 1024, 1440 and 1920 px widths and fix visual bugs before reporting done.
5. Phase 0 must create the rule and skill files from Appendix A and B before any app code is written.
6. Never invent facts about the business. Use only the facts in Part C section 2. Anything unknown becomes clearly flagged sample data.
7. All enquiries go to WhatsApp 918506905757 via the shared helper. No other enquiry channel.

Begin with the plan.
```

---

# PART C — MASTER BUILD SPEC

## 1. Goal and success criteria

Build a **production-quality prototype** of the new Pinhole Studio website that feels like a real, polished product (not a template), with:

1. **Every feature of the current website** (section 3)
2. **The 10 features promised to the client** (section 4)
3. **User authentication** (section 5)
4. **A modern, mobile-first, all-device design** (section 7)

The website's single business goal: **turn visitors into WhatsApp enquiries**. Every conversion path ends in a WhatsApp chat with **+91 85069 05757**.

**Prototype is "done" when:**
- All routes in section 6 exist and work on mobile, tablet and desktop
- Every feature in sections 3 and 4 is implemented and listed in `docs/FEATURE_TRACEABILITY.md`
- Auth works end to end (sign up, sign in, sign out, protected pages, admin role)
- Lighthouse (mobile): Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 on Home and a Studio page
- No horizontal scroll at any width from 320 px to 1920 px
- Zero console errors, `pnpm build` passes, Playwright suite passes

## 2. Business facts (the ONLY facts you may state as real)

**Business:** Pinhole Studio, a professional studio and production space with ready-to-use locations and production infrastructure for shoots, content creation and events.
**Address:** Pinhole Studio Farm 57, Kapashera Estate, New Delhi, Delhi, 110097
**Phones (tel links):** +91 85069 05757, +91 99997 63457, +91 98186 37485
**Email:** pinholestudioz@gmail.com
**WhatsApp (all enquiries):** `8506905757` → international format **`918506905757`** (India country code 91, assumed). Link format: `https://wa.me/918506905757?text=<url-encoded message>`
**Brand ecosystem links:** Pinhole Filmcity, Pinhole Media, Pinhole Studio (Filmcity site not ready; link to a "Coming soon" anchor or external URL from config)
**Social:** Instagram, Facebook (URLs from `site.config.ts`, placeholders if unknown)
**Brand look:** black and amber/yellow (logo is a yellow "P" mark with the word PINHOLE and "studio" below)

**7 studio spaces:**
| # | Name | Slug | Key traits |
|---|---|---|---|
| 1 | Empty Studio Space | `empty-studio` | Large blank production floor |
| 2 | Green Screen Studio | `green-screen-studio` | Chroma key |
| 3 | The House Setup | `the-house-setup` | Bedroom, living room, kitchen, dining area environments |
| 4 | White Cyclorama Setup | `white-cyclorama` | Seamless white cyc |
| 5 | Podcast Setup | `podcast-setup` | Podcast/interview |
| 6 | Garden Area | `garden-area` | Outdoor |
| 7 | Lawn Area | `lawn-area` | Outdoor |

**5 service categories ("Service For"):**
1. Film & Commercial Production (`film-commercial-production`)
2. Event & Corporate Production Space (`event-corporate-space`)
3. Education, Seminar & Workshop Space (`education-seminar-workshop`)
4. Content Creator & Influencer Studio (`creator-influencer-studio`)
5. Agency & Production House Support (`agency-production-support`)

**Use cases:** Ad films, documentaries, short films, news shows, training videos, product shoots, songs, interviews, cultural shoots, TVC/DVC, OTT production, music videos, corporate production, podcasts, influencer content, YouTube, Reels, events, workshops, seminars, brand campaigns.

**Equipment and support (About page):** Camera and lens rental, lighting and grip, sound equipment, recording, professional crew, technicians, art direction, set customisation, on-ground coordination, logistics.

**Advantages:** Large studio floors, event-ready spaces, house setups, indoor/outdoor sets, podcast/content spaces, camera/lighting/sound availability, air conditioning, parking, production access, hygiene, professional management.

**Existing reviewers (names only, no review text available):** Laksh Sharma, Yashasvi Sharan, Sachin Goel, Anil Sansanwal, Rohit Rawat.

**Footer legal links:** Booking T&C, Events T&C, Shoot / Production P&P, Event P&P.

### Sample-data rule (important)
We do **not** have: real specs (size, height, power), real prices, real review text, real stats, real partner logos, real photos, the CloudPano URL, policy text.
- Put all such data in `src/data/*.ts` with `// SAMPLE` comments.
- Use realistic-looking sample values, and show a subtle **"Sample"** chip next to them when `NEXT_PUBLIC_SAMPLE_DATA_BADGE=true`.
- Never attribute invented review text to the real reviewer names above. Use "Sample reviewer" until real text is supplied.
- Photos: generate rich gradient/SVG placeholders (cinematic, per studio colour) via a `<StudioImage />` component that accepts a real `src` later. Folder convention for real photos: `public/images/studios/<slug>/01.jpg ...`. Do not hotlink or scrape images from the live site.

## 3. ORIGINAL FEATURES (all must exist)

| # | Original feature | Where it lives |
|---|---|---|
| 1 | Global navigation: Home, About Us, Studios menu, Service For menu, Work, 360° Reccee, mobile + desktop | Header |
| 2 | Studios menu listing all 7 studios, each with its own page | `/studios`, `/studios/[slug]` |
| 3 | Service For menu listing 5 services, each with its own page | `/services`, `/services/[slug]` |
| 4 | Home: numbered studio showcase 01/07 to 07/07 with link to each | Home |
| 5 | Studio detail: name, description, suitability, dimensions/specs, facilities, use cases, photo gallery, setups, equipment/support, amenities, links to related services and other studios, contact CTA | Studio page |
| 6 | The House Setup: environment tabs for Bedroom, Living room, Kitchen, Dining area with imagery and suitable production types | `/studios/the-house-setup` |
| 7 | Service detail pages (5), each with detail content, related studios, CTA | Service page |
| 8 | Use-case discovery (ad films ... brand campaigns) | Home marquee + service pages |
| 9 | Equipment and support listing | About + service pages |
| 10 | About: positioning, ecosystem, studio types, mission, vision, who it serves, equipment/crew, industry experience, "Book Pinhole Studio today" CTA | `/about` |
| 11 | Brand ecosystem links (Filmcity, Media, Studio) | Home + footer |
| 12 | Work / portfolio with categories: All, Events, Empty Studio, Green Screen, House Setup, Cyclorama, Podcast, Garden, Lawn | `/work` |
| 13 | Working category filter | `/work` |
| 14 | Video content (Vimeo embeds) | `/work` |
| 15 | Instagram content cards | `/work` + home |
| 16 | Studio photo galleries with lightbox | Studio page |
| 17 | "Behind the Scenes" gallery | Home |
| 18 | Customer reviews | Home + studio pages |
| 19 | Studio advantages section | Home |
| 20 | Statistics: Hours Booking Done, Customer Satisfaction, Awards & Recognition, Clients Served (animated counters, sample values flagged) | Home |
| 21 | Brand Partners section (logo marquee, sample logos flagged) | Home |
| 22 | Contact form: Name, Email, Phone, Message, Submit | Home, About, `/contact` |
| 23 | Lead/inquiry capture (stored in DB, then WhatsApp) | Contact form |
| 24 | Phone links (3 numbers) | Contact, footer, mobile action bar |
| 25 | Email link | Contact, footer |
| 26 | Google Maps embed + address + "Get directions" link | `/contact`, footer |
| 27 | 360° Reccee | `/recce` + studio pages |
| 28 | Booking T&C | `/policies/booking-terms` |
| 29 | Events T&C | `/policies/events-terms` |
| 30 | Shoot / Production P&P | `/policies/shoot-production-policy` |
| 31 | Event P&P | `/policies/event-policy` |
| 32 | Studio ↔ Service ↔ Home cross-linking | All |
| 33 | "Which studio do I need?" decision support | Smart Studio Finder |
| 34 | "Which service matches my project?" | Services index with "I am a..." picker |
| 35 | Policy content readable before booking (shoot duration, overtime, payment, cancellation, equipment, property damage, events, licensing, special effects, technical requirements) | Policy pages as sectioned accordions with sample text flagged "Replace with official text" |

## 4. THE 10 NEW FEATURES (all must work)

Create a shared helper first (used by every feature):

```ts
// src/lib/whatsapp.ts
export const WHATSAPP_NUMBER = "918506905757"; // +91 85069 05757
export const waLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
```

**Universal enquiry behaviour:** whenever a form is submitted or a CTA is pressed, (1) validate, (2) save to the `enquiry` table, (3) fire the analytics event, (4) show a success state with a 3-second countdown **and** a big "Continue to WhatsApp" button, then open `waLink(message)` in a new tab. Never rely only on automatic `window.open` (popup blockers). On mobile use the same link (it opens the WhatsApp app). Pre-fill the message with the studio, date and details so the team has context.

### Feature 01 — One-Tap WhatsApp Enquiry (also original "WhatsApp icon" request)
- Floating **WhatsApp button** (bottom right, WhatsApp green `#25D366`, official-style glyph, soft pulse ring, tooltip "Chat on WhatsApp") on **every page**. Opens `waLink` with a message that **knows the current page**:
  - On a studio page: "Hi Pinhole Studio, I'm interested in the {Studio name}. Please share availability and rates."
  - On a service page: "Hi, I'm looking for {Service}..."
  - Elsewhere: "Hi Pinhole Studio, I'd like to know more about your studios."
- A **"Chat on WhatsApp"** button also sits in the header (desktop), in the mobile menu, in every CTA section and in the footer.
- **Mobile sticky action bar** (below 768 px): Call · WhatsApp (primary) · Enquire. Respect `env(safe-area-inset-bottom)`.
- Track `whatsapp_click` with `{page, studio?, placement}`.

### Feature 02 — "Plan My Shoot" Enquiry Form
- Route `/plan-my-shoot` plus an in-page dialog/drawer launched from CTAs.
- **5-step wizard** with an animated progress stepper and slide transitions:
  1. Shoot type (chips: Ad film, Podcast, Product shoot, Interview, Music video, Event, Short film, Reels/Content, Workshop, Other)
  2. Studio (visual cards, multi-select allowed, "Not sure, suggest one" option → uses the finder logic)
  3. Date and time (calendar, reads availability, slot chips)
  4. Hours (slider 2 to 12+) and crew size
  5. Extras (camera, lights, sound, crew, art direction, set customisation, parking needs) + name, phone, email (optional), notes
- Validate each step with `react-hook-form` + `zod`. Save progress to `localStorage` so a refresh does not lose it. Back/Next with keyboard support. Final step shows a summary card, then the universal enquiry behaviour with a nicely formatted multi-line WhatsApp message.
- Track `form_start` on first interaction, `form_submit` on completion.

### Feature 03 — Smart Studio Finder
- Section on `/studios` (and a compact version on Home).
- "I'm shooting a…" chips (Podcast, Ad film, Product, Interview, Event, Music video, Workshop, Reels) + "Must have" toggles (AC, Indoor, Outdoor, Green screen, Cyclorama, Parking, Sound-treated).
- Filtering is **instant and animated** (Motion `layout` + `AnimatePresence`), state kept in the URL (`?shoot=podcast&must=ac,indoor`) so results are shareable. Show a "match %" or "Best for your shoot" badge, sort by best match, and an empty state with a WhatsApp "Tell us what you need" button.
- Data-driven from `studios.ts` suitability and feature tags.

### Feature 04 — Studio Spec Sheets and Floor Plans
- On every studio page: a **spec box** (size, ceiling height, power, door/entry width, floor type, AC, parking, soundproofing, Wi-Fi) with Sample chips where values are sample.
- **Floor plan:** an SVG generated from the studio's dimensions (scaled rectangle, entry door gap, labelled dimension lines, studio-specific features like cyc curve or green wall). Hover/tap to highlight zones.
- **"Download spec sheet (PDF)"**: a route `GET /api/studios/[slug]/spec-sheet` that returns a branded PDF (black/amber header, studio name, specs table, floor plan, contact and WhatsApp number). Use `pdf-lib` (pure JS). Set `Content-Disposition` and `application/pdf`.
- Track `spec_download`.

### Feature 05 — Clear Pricing and Quick Quote
- Per-studio **pricing cards**: Hourly / Half day / Full day with "starting from" labels, "Popular" badge on one, includes list (AC, power, parking, Wi-Fi).
- Config flag `site.config.ts → pricing.mode`: `"exact"` (shows numbers) or `"range"` (shows "Typically ₹X to ₹Y"). Default `"exact"`.
- **"Get my quote" button** opens a **Quote Builder** drawer: pick studio, duration (hourly/half/full + hours), add-ons (camera & lens, lighting & grip, sound, crew, art direction, set customisation), live **estimate** with an "Estimate only, final quote on WhatsApp" note. Button "Send quote request on WhatsApp" → universal enquiry behaviour with the full breakdown in the message.
- Also a `/pricing` overview page comparing all studios.
- Track `quote_click` and `quote_submit`.

### Feature 06 — Availability Calendar and Request to Book
- Shared `<AvailabilityCalendar studio />` with day states: **Free** (green tint), **Booked** (red tint, disabled), **Limited** (amber), **Your pick** (solid amber). Legend underneath. Past dates disabled.
- After choosing a date: slot chips **Morning / Afternoon / Evening / Full day** (slot availability from DB).
- **"Send booking request"** saves a `booking_request` (status `pending`) then the universal enquiry behaviour. Microcopy: "You'll get confirmation on WhatsApp. No online payment needed."
- Public availability is **read-only**. The owner **approves/declines** requests in `/admin` (approve sets that date/slot to booked). Logged-in users see their request statuses in `/account`.
- Studio page + `/availability` (studio selector at top). Seed some booked dates around "today" so the calendar looks alive.

### Feature 07 — 360° Virtual Recce on every studio page
- `<RecceViewer />`: if `NEXT_PUBLIC_RECCE_URL` is set, embed it in a rounded, responsive 16:9 iframe with a "360° Recce" badge, "Fullscreen" and "Open in new tab" buttons, lazy-loaded behind a "Tap to explore" poster (facade) so it does not slow the page.
- If the URL is missing, show an illustrated placeholder (SVG room with hotspot pins "Lighting grid", "Entry door") and an obvious dev note "Add NEXT_PUBLIC_RECCE_URL".
- Dedicated `/recce` page with studio-by-studio recce cards. `recce_click` event.

### Feature 08 — Portfolio with working filters
- `/work`: sticky, horizontally scrollable **filter tabs** (All, Events, Empty Studio, Green Screen, House Setup, Cyclorama, Podcast, Garden, Lawn) with an animated pill indicator; selection in the URL (`?cat=podcast`).
- Responsive masonry/bento grid; items animate in/out on filter change.
- **Video items:** Vimeo **facade** (poster + play button) that loads the iframe only on click. **Instagram items:** styled cards with "View on Instagram" (no heavy embed script). Click opens a **lightbox** with keyboard navigation (←/→/Esc), swipe on mobile, and a "Book a similar shoot" WhatsApp button prefilled with the project category.

### Feature 09 — Reviews, Client Logos and Real Numbers
- Home trust section: **animated counters** (Hours Booked, Customer Satisfaction %, Awards & Recognition, Clients Served) from `siteStats` config, **review carousel** (embla, drag + arrows + dots, auto-play pauses on hover), **Google rating** summary chip (sample flagged) linking to `site.config.googleReviewsUrl`, **brand partners marquee** (grayscale logos that colour on hover; sample placeholders flagged).
- Studio pages show 2 to 3 reviews relevant to that studio.
- Absolutely no "0+" counters anywhere.

### Feature 10 — AI Chat Assistant
- Floating chat bubble (above the WhatsApp button, desktop: right panel 380×560; mobile: full-height bottom sheet using the shadcn Drawer). Opening shows a greeting, 4 suggestion chips ("Which studio for a podcast?", "Do you have parking?", "How do I book?", "Get a quote"), typing indicator and streaming replies with basic markdown.
- Backend `src/app/api/chat/route.ts` using **Vercel AI SDK v6** (`streamText`, `useChat` from `@ai-sdk/react`). Provider chosen by env (Anthropic if `ANTHROPIC_API_KEY`, else OpenAI if `OPENAI_API_KEY`).
- **Grounding:** system prompt contains only the facts in section 2 plus `studios.ts`, `services.ts`, `pricing` and `policies` data. Rules: answer only about Pinhole; never invent prices/specs/availability beyond data; if unsure or the user wants a quote/booking → call the `startEnquiry` tool which returns a **WhatsApp handoff button** with a prefilled message summarising the chat.
- **Tools:** `recommendStudio(shootType, needs[])`, `getStudioSpecs(slug)`, `checkAvailability(slug, date)`, `startEnquiry(summary)`.
- **No-key fallback:** a deterministic rule-based assistant (keyword/intent matching using the same data) so the demo works offline with no API key. Same UI.
- Guardrails: input length cap, simple rate limit (in-memory, 20 req/10 min per IP), no PII storage, "AI assistant, may make mistakes. For confirmed details, chat on WhatsApp" footer line.
- Track `chat_open`, `chat_message`, `chat_handoff`.

### Bonus (small, supports authentication value)
- **Shortlist:** heart button on studio cards. Guests: `localStorage`. Logged-in: saved to DB and merged on login. `/account/shortlist` with "Send my shortlist on WhatsApp" and "Share link".

## 5. AUTHENTICATION (Better Auth, inside Next.js)

Use **Better Auth** (TypeScript-first, runs inside the Next.js app, stores users in our own database). Verify setup against current docs via Context7.

- **Methods:** email + password (required), Google OAuth (only enabled if env keys exist). Email verification and password reset: in development, print the email link to the server console (no mail provider needed); structure the code so a provider (Resend, etc.) can be added by env.
- **Database:** Drizzle ORM + SQLite (libSQL) via `DATABASE_URL=file:./local.db`; schema in `src/db/schema.ts`; Better Auth tables generated with its CLI; migrations scripted (`pnpm db:push`, `pnpm db:seed`). Easy to swap to Postgres/Turso later.
- **Roles:** `user` (default) and `admin`. The user whose email equals `ADMIN_EMAIL` becomes `admin`.
- **Public vs protected:**
  - Public (no login): browsing everything, finder, calendar view, quote builder, chat, **all WhatsApp enquiries** (guest enquiries must always be frictionless)
  - Login adds: saved shortlist across devices, request history and statuses, saved contact details auto-fill, and admin tools
  - Protected routes: `/account/*` (logged in), `/admin/*` (admin only)
- **Pages:** `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/account` (overview, my enquiries, my booking requests, shortlist, profile), `/admin`.
- **Security (non-negotiable):**
  - `proxy.ts` (Next.js 16 replaces `middleware.ts`) does a fast optimistic redirect for protected paths based on the session cookie.
  - **Always re-verify the session and role on the server** inside every protected page, server action and route handler. Do not rely on `proxy.ts` alone.
  - Zod-validate all inputs, honeypot field on public forms, rate-limit `/api/enquiries` and `/api/chat`, secure/HttpOnly cookies, never expose secrets to the client.
- **Admin panel (`/admin`):**
  - **Leads table:** all enquiries with type, source page, message, created time. Status pipeline **New → Contacted → Qualified → Requirement Confirmed → Quotation → Negotiation → Booked → Lost**, notes, filter/search, CSV export.
  - **Booking requests:** approve/decline (approve marks calendar).
  - **Availability manager:** block/unblock dates and slots per studio.
  - **Stats cards:** enquiries this week by type, top studios, WhatsApp clicks (from stored events).

**DB tables (beyond Better Auth's):** `enquiry`, `booking_request`, `availability`, `shortlist`, `event_log` (lightweight analytics).

## 6. ROUTES

```
/                          Home
/about
/studios                   Studio list + Smart Studio Finder
/studios/[slug]            Studio detail (7)
/services                  Service list + "I am a..." picker
/services/[slug]           Service detail (5)
/work                      Portfolio with filters
/recce                     360° Reccee
/pricing                   Pricing overview
/availability              Availability calendar
/plan-my-shoot             Wizard
/contact                   Contact form, phones, email, map
/policies/[slug]           4 policy pages
/login /signup /forgot-password /reset-password
/account /account/enquiries /account/bookings /account/shortlist /account/profile
/admin /admin/leads /admin/bookings /admin/availability
/api/auth/[...all]  /api/chat  /api/enquiries  /api/studios/[slug]/spec-sheet
not-found.tsx  error.tsx  loading.tsx  sitemap.ts  robots.ts  manifest.ts  opengraph-image.tsx
```

## 7. DESIGN SYSTEM — "PINHOLE NOIR" (cinematic, dark-first, amber accent)

**Design direction (from 2026 trend research):** dark-first design with one confident accent colour, **bento-grid** feature sections (6 to 9 tiles), **glassmorphism used with purpose** (sticky blurred header, sheets, popovers), **micro-interactions as a system** (every button, input, card and toggle has a defined motion), kinetic but restrained typography, and accessible contrast built in from the start. Aim: it should feel like a premium studio-booking app, not a brochure.

### 7.1 Stack for UI
Tailwind CSS v4 (CSS-first `@theme`), **shadcn/ui** (primitives; install through the shadcn MCP), **Motion** (`motion/react`, formerly Framer Motion), **Magic UI** components copied in as needed (Shimmer Button, Marquee, Number Ticker, Border Beam, Blur Fade, Bento Grid), `lucide-react` icons, `sonner` toasts, `vaul` drawers (via shadcn Drawer), `embla-carousel-react`, `react-day-picker` (shadcn Calendar), `react-hook-form` + `zod`, `next-themes`, `class-variance-authority`, `clsx`, `tailwind-merge`. Use Aceternity-style effects (spotlight, 3D tilt) **sparingly**, only on 1 or 2 hero elements.

### 7.2 Tokens (OKLCH, in `globals.css`)
```css
:root {            /* LIGHT (warm white) */
  --background: oklch(0.985 0.003 90);
  --foreground: oklch(0.18 0 0);
  --card: oklch(1 0 0);
  --muted: oklch(0.955 0.004 90);
  --muted-foreground: oklch(0.48 0.01 80);
  --primary: oklch(0.79 0.165 76);          /* Pinhole amber */
  --primary-foreground: oklch(0.17 0 0);    /* dark text on amber (high contrast) */
  --border: oklch(0.9 0.004 90);
  --ring: oklch(0.79 0.165 76);
  --radius: 1rem;
}
.dark {            /* DARK (default) */
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.97 0.003 90);
  --card: oklch(0.185 0.003 80);
  --muted: oklch(0.235 0.004 80);
  --muted-foreground: oklch(0.72 0.01 80);
  --primary: oklch(0.79 0.165 76);
  --primary-foreground: oklch(0.17 0 0);
  --border: oklch(1 0 0 / 10%);
  --ring: oklch(0.79 0.165 76);
}
```
Extra tokens: `--success` (oklch 0.72 0.17 150), `--danger` (oklch 0.65 0.22 25), `--whatsapp: #25D366` (only on WhatsApp elements), `--glass-bg`, `--glass-border`. Default theme **dark**, with a light/dark/system toggle (`next-themes`) and no flash on load.

### 7.3 Typography (via `next/font`, self-hosted)
- **Display:** *Bricolage Grotesque* (characterful, cinematic), tight tracking, weights 600 to 800
- **Body/UI:** *Geist* (clean, very legible)
- **Fluid scale** with `clamp()`: hero `clamp(2.5rem, 7vw, 5.5rem)`, h2 `clamp(1.75rem, 4vw, 3rem)`, body 16 to 18 px, line-height 1.6
- Never go below 16 px for form inputs (prevents iOS zoom).

### 7.4 Component recipes (build each once in `src/components/ui`, reuse everywhere)

| Element | Spec |
|---|---|
| **Buttons** | Pill (`rounded-full`). Sizes: sm 36 / md 44 / lg 52 px height (min touch target 44). **Primary:** amber with subtle top inner highlight, shimmer sweep on hover, amber glow shadow, `active:scale-[0.97]`. **Secondary (glass):** `bg-white/5 backdrop-blur border-white/10`. **Outline**, **Ghost**, **WhatsApp** (green). Loading state with spinner, disabled state with reduced opacity. Optional arrow icon that nudges right on hover. |
| **Inputs / Textarea** | 48 px high, `rounded-xl`, filled `bg-muted/50`, 1 px border, **amber 2 px focus ring with offset**, leading icon slot, floating or top label (always visible, never placeholder-only), inline validation with `aria-describedby`, success tick, autosizing textarea with character count. Phone input with +91 prefix. |
| **Select / Dropdown** | shadcn Select/DropdownMenu with **glass popover** (blurred, rounded-2xl, subtle shadow, item hover = amber/10 background), check icon on selected. On mobile, long lists open as a **bottom Drawer**. Studio picker = Command/Combobox with search. |
| **Chips / ToggleGroup** | Rounded-full, outline when off, solid amber when on, spring scale on press, multi-select with check icon. |
| **Tabs** | Sliding pill indicator using Motion `layoutId`; horizontally scrollable with edge fade on mobile. |
| **Cards** | `rounded-3xl`, 1 px gradient border, subtle inner glow; **spotlight follows cursor on desktop**; lift (−4 px) + shadow on hover; bento layout for feature sections. |
| **Accordion** | Smooth height animation, plus/minus rotation, used for FAQs and policies. |
| **Dialog / Sheet / Drawer** | Blurred backdrop, spring-in, focus trap, close on Esc, swipe-down to close on mobile. |
| **Calendar** | shadcn Calendar styled with availability states and legend. |
| **Toasts** | `sonner`, bottom-center on mobile, top-right on desktop. |
| **Skeletons / loading** | Shimmer skeletons for lists, images blur-up. Never a blank flash. |
| **Badges** | "Popular", "Best match", "Sample", status pills with dot. |
| **Marquee / counters** | Pauses on hover; counters animate once when scrolled into view. |

### 7.5 Navigation, hamburger and header
- **Header:** sticky, glass (`backdrop-blur-xl`), **hides on scroll down and reappears on scroll up**, shrinks slightly after 24 px scroll, 1 px bottom border fades in. Logo left. Desktop links: Home, About, **Studios ▾**, **Services ▾**, Work, 360° Recce, + primary "Plan my shoot" button and a green WhatsApp icon button, theme toggle, user avatar menu (or "Sign in").
- **Mega menus (desktop):** Studios (7 cards with mini previews, 2-column), Services (5 items with one-line descriptions). Open on hover with a short delay and on click/keyboard; close on Esc; focus managed.
- **Hamburger (mobile/tablet < 1024 px):** animated 3-bar → ✕ morph (Motion), opens a **full-screen glass sheet** with staggered link reveal (60 ms stagger), Studios and Services as expandable accordions, large tap targets (56 px), WhatsApp + Call buttons pinned at the bottom, locks body scroll, closes on route change, Esc, and swipe.
- **Mobile sticky action bar** (Call · WhatsApp · Enquire) fixed at the bottom, hides while the keyboard is open or when the menu is open.
- Skip-to-content link, `aria-current` on active link, visible focus rings.

### 7.6 Motion system
- Easing `cubic-bezier(0.22, 1, 0.36, 1)`; durations 150 ms (micro), 250 ms (UI), 450 ms (reveal); springs `{ stiffness: 300, damping: 30 }`.
- Scroll reveal (`BlurFade`/`whileInView`, once), staggered children, page-level fade between routes, hero text split-reveal, subtle parallax on hero media (desktop only), animated gradient glow behind hero.
- Wrap the app in `<MotionConfig reducedMotion="user">` and also honour `prefers-reduced-motion` in CSS. **Animate only `transform` and `opacity`.**
- Pause heavy effects on mobile and when `saveData` is on.

### 7.7 Layout patterns
- **Home sections in order:** Hero (headline, subcopy, dual CTA "Plan my shoot" + "Chat on WhatsApp", media collage, trust chips) → Brand ecosystem strip → Studio showcase **01/07 → 07/07** (sticky horizontal scroll or bento) → Smart Studio Finder (compact) → Use cases marquee → "Why Pinhole" bento (advantages) → Equipment and support → Work highlights → Behind the scenes gallery → Trust (stats, reviews, partners) → 360° Recce teaser → FAQ → Contact CTA + form + map → Footer.
- Content max-width 1280 px, generous whitespace, 8 px spacing grid, consistent section rhythm (`py-20 md:py-28`).

### 7.8 All-device requirements (mobile and every screen)
- **Mobile-first.** Breakpoints: 360, 390, 640, 768, 1024, 1280, 1536+. Test viewports: **320×568, 360×640, 390×844, 768×1024, 1024×768, 1440×900, 1920×1080**.
- No horizontal overflow at any width; use `min-w-0`, `overflow-x-clip` on the root; wide content (tables, tabs, chips) scrolls inside its own container.
- Use `dvh` / `svh` (not `vh`) for full-height sections; `env(safe-area-inset-*)` for notches and home bars; `viewport-fit=cover`.
- Touch targets ≥ 44×44 px; hover effects wrapped in `@media (hover: hover)`; no hover-only information.
- Fluid images with `next/image` and correct `sizes`; container queries for cards; horizontal snap carousels on mobile (`scroll-snap`), grids on desktop.
- Forms: correct `inputMode`, `autocomplete`, and `type` (tel, email) for mobile keyboards.
- Landscape phones, tablets, foldables, ultra-wide (cap content width), print stylesheet for policy pages.
- **Accessibility: WCAG 2.2 AA.** Contrast ≥ 4.5:1, focus-visible, keyboard-complete, ARIA only where needed, labelled form controls, `alt` text, reduced motion, screen-reader tested dialogs and menus.

### 7.9 Real-app polish checklist
Loading skeletons, empty states with helpful CTAs, friendly error pages, 404 with studio suggestions, optimistic UI on shortlist, toast feedback on every action, form drafts auto-saved, a **PWA manifest** + theme-color + app icons (installable on phones), favicon set, OG images per studio, custom text selection colour (amber), custom scrollbar styling, subtle noise/grain texture on dark backgrounds, consistent 404/500 branding.

## 8. TECH, QUALITY AND PERFORMANCE RULES

- **Next.js 16**, App Router, React 19, TypeScript strict, Turbopack, `src/` directory. `proxy.ts` instead of `middleware.ts`. `params` and `searchParams` are **async** (await them). Server Components by default; add `"use client"` only for interactivity. Consider Cache Components (`'use cache'`) for static content sections; keep personalised/auth data dynamic inside `<Suspense>`.
- **Single Next.js app only.** No separate backend server. Use Route Handlers and Server Actions.
- **Data:** Drizzle + SQLite for dynamic data. Static content in typed files in `src/data/`.
- **Folder structure:**
```
src/
  app/ (routes)   components/ (ui, layout, sections, features)   data/   db/
  lib/ (whatsapp, analytics, auth, utils, ai)   hooks/   styles/
docs/ (BUILD_PROMPT.md, FEATURE_TRACEABILITY.md, QA_REPORT.md)
.cursor/ (rules, skills, mcp.json)   tests/e2e/
```
- **Performance budgets:** LCP < 2.5 s, CLS < 0.1, INP < 200 ms. Priority-load only the hero image, `next/font` with `display: swap`, dynamic-import heavy widgets (chat, calendar, recce, lightbox, PDF), Vimeo/360 facades, no layout shift (reserve image/embed space).
- **SEO:** metadata API per page, canonical URLs, `LocalBusiness` + `FAQPage` + `BreadcrumbList` JSON-LD, `sitemap.ts`, `robots.ts`, semantic HTML, one `h1` per page.
- **Analytics (stubbed but real):** a `track(event, params)` util pushing to `window.dataLayer` and Meta Pixel when IDs are set. Events: `whatsapp_click`, `phone_click`, `email_click`, `form_start`, `form_submit`, `quote_click`, `quote_submit`, `booking_request`, `spec_download`, `recce_click`, `chat_open`, `chat_handoff`, `studio_view`, `finder_use`. Also write key ones to `event_log` for the admin stats.
- **Testing:** Playwright e2e in `tests/e2e/` (see Phase 8). Unit tests for `waLink`, price estimator, finder scoring.

---

## 9. BUILD PHASES (execute one at a time; stop after each)

### Phase 0 — Cursor setup
Create the rule files (Appendix A) and skill folders (Appendix B). Confirm MCP servers are reachable (Context7, Playwright, Next DevTools, shadcn). Output a short checklist.
**Done when:** files exist, `AGENTS.md`/rules load, and you can list the installed skills.

### Phase 1 — Foundation
Scaffold app, install dependencies, shadcn init, tokens, fonts, `next-themes`, `MotionConfig`, base UI components (Button, Input, Textarea, Select, Tabs, Accordion, Dialog, Sheet, Drawer, Calendar, Toaster, Badge, Skeleton, Card), **Header (mega menu, animated hamburger, scroll behaviour), Footer, FloatingWhatsApp, MobileActionBar, ThemeToggle**, `waLink` helper and analytics util. A `/dev/ui` page (dev only) showing every component in light and dark.
**Done when:** layout renders on all 7 viewports, hamburger works, WhatsApp button opens `https://wa.me/918506905757?...`.

### Phase 2 — Data, DB and Auth
Drizzle schema, seed script, Better Auth (email/password, optional Google), `proxy.ts`, server-side session helpers, login/signup/forgot/reset pages, avatar menu, `/account` shell, `/admin` shell with role guard.
**Done when:** a user can sign up, sign in, sign out; `/account` and `/admin` redirect correctly; admin email gets admin role.

### Phase 3 — Content pages (all original features)
Home (all sections), About, Studios index, **7 studio pages** (hero, description, gallery + lightbox, house-setup tabs, amenities, related services/studios, reviews, FAQ), Services index + **5 service pages**, Work (static first), Contact (form, phones, email, map embed using `https://www.google.com/maps?q=Pinhole+Studio+Farm+57+Kapashera+Estate+New+Delhi&output=embed`, directions link), 4 policy pages, Recce page shell, 404/error/loading, SEO files, manifest.
**Done when:** features 1 to 35 in section 3 all exist.

### Phase 4 — The 10 new features
Implement Features 01 to 10 in order (section 4), then the Shortlist bonus. After **each** feature: a Playwright check and a screenshot at 390 and 1440 px.
**Done when:** each feature's acceptance criteria are met.

### Phase 5 — Account and Admin
Account pages (enquiries, bookings, shortlist, profile), Admin leads table with status pipeline and CSV export, booking approvals, availability manager, stats cards.
**Done when:** a guest enquiry appears in `/admin/leads`; approving a booking request marks the calendar.

### Phase 6 — Design polish and motion
Apply the full design system: spotlight cards, bento sections, hero motion, counters, marquees, page transitions, micro-interactions on every control, skeletons, empty states, PWA, grain texture. Verify reduced-motion behaviour.

### Phase 7 — Performance, SEO, accessibility
Lighthouse mobile on Home and one studio page; fix to targets. Axe accessibility scan; keyboard-only walkthrough of nav, wizard, calendar, chat, dialogs.

### Phase 8 — QA, traceability, handover
Run the full Playwright suite. Generate `docs/FEATURE_TRACEABILITY.md` (every item from sections 3 and 4 → file path → status) and `docs/QA_REPORT.md` (screenshots per viewport, Lighthouse scores, known gaps). Write a README with run instructions, env vars, how to replace sample data/photos/recce URL, and a "Going to production" list (Postgres/Turso, email provider, domain, analytics IDs).

---

## 10. ACCEPTANCE TESTS (Playwright, must pass)

1. Every page in section 6 returns 200 and has one `h1`.
2. On every public page the floating WhatsApp link `href` starts with `https://wa.me/918506905757?text=`.
3. Mobile menu opens/closes; Studios and Services lists contain 7 and 5 items.
4. Contact form: invalid input shows errors; valid submit creates an `enquiry` row and offers the WhatsApp link with name and message inside.
5. Plan My Shoot: complete 5 steps → summary → WhatsApp URL contains shoot type, studio, date, hours.
6. Finder: choosing "Podcast" ranks Podcast Setup first and updates the URL.
7. Spec sheet: `GET /api/studios/green-screen-studio/spec-sheet` returns `application/pdf`.
8. Quote builder: changing hours/add-ons updates the estimate; "Send" produces a WhatsApp URL with the breakdown.
9. Calendar: booked dates are disabled; a request creates a `pending` booking; admin approval marks the date booked.
10. Recce: placeholder shows when env is empty; iframe loads when set.
11. Work filters: selecting "Podcast" shows only podcast items; URL updated; lightbox keyboard works.
12. Home shows no "0+" and counters animate to configured values.
13. Chat (no API key): answers "Which studio for a podcast?" with Podcast Setup and shows a WhatsApp handoff button.
14. Auth: sign up → sign in → `/account` visible → sign out; `/admin` blocked for normal users, allowed for admin.
15. No horizontal scroll at 320, 360, 390, 768, 1024, 1440, 1920.
16. No console errors on any page; `pnpm build` succeeds.

---

# APPENDIX A — RULE FILES TO CREATE IN PHASE 0

### `.cursor/rules/00-project.mdc`
```md
---
description: Core project facts and non-negotiables for Pinhole Studio
alwaysApply: true
---
- Project: Pinhole Studio website prototype. Stack: Next.js 16 (App Router, React 19, TypeScript strict), Tailwind v4, shadcn/ui, Motion, Better Auth, Drizzle + SQLite, Vercel AI SDK v6. Single Next.js app, no separate backend.
- Full spec lives in @docs/BUILD_PROMPT.md. Follow its phases. Never skip a phase's "Done when".
- ALL enquiries go to WhatsApp +91 85069 05757 through `waLink()` in src/lib/whatsapp.ts (number 918506905757). Never hardcode the number elsewhere.
- Never invent business facts. Unknown data = flagged sample data in src/data with `// SAMPLE`.
- Use Context7 for any API you are unsure about. Do not guess library APIs.
- After each task run: lint, type-check, build. Fix before moving on.
```

### `.cursor/rules/10-nextjs16.mdc`
```md
---
description: Next.js 16 conventions
globs: ["src/app/**/*", "src/lib/**/*", "proxy.ts", "next.config.ts"]
alwaysApply: false
---
- Use `proxy.ts` with `export function proxy`, not `middleware.ts`.
- `params` and `searchParams` are Promises: always `await` them.
- Server Components by default. Add "use client" only for state, effects, browser APIs, or Motion.
- Always verify session and role on the server in pages, server actions and route handlers. proxy.ts is only an optimistic redirect.
- Use next/image with correct `sizes`; use next/font; dynamic import heavy widgets (chat, calendar, lightbox, recce).
- Validate every input with zod. Never expose secrets in client code.
```

### `.cursor/rules/20-ui.mdc`
```md
---
description: UI, styling and responsive rules
globs: ["src/components/**/*.tsx", "src/app/**/*.tsx", "src/app/globals.css"]
alwaysApply: false
---
- Follow the `pinhole-design-system` skill. Use tokens (bg-background, text-foreground, bg-primary) not raw hex.
- Mobile-first. Min touch target 44px. Inputs 16px+ font. Use dvh not vh. Respect safe-area insets.
- Animate only transform and opacity. Honour prefers-reduced-motion. Wrap hover effects in @media (hover: hover).
- Reuse components from src/components/ui. Do not create one-off buttons, inputs or cards.
- Every interactive element needs a visible focus ring, accessible name, and keyboard support.
```

### `.cursor/rules/30-data-sample.mdc`
```md
---
description: Sample data handling
globs: ["src/data/**/*"]
alwaysApply: false
---
- Every unverified value (specs, prices, stats, reviews, logos, policies) is marked `// SAMPLE` and exposes `isSample: true`.
- Render a small "Sample" chip when NEXT_PUBLIC_SAMPLE_DATA_BADGE=true.
- Do not attach invented review text to the real reviewer names.
```

---

# APPENDIX B — SKILLS TO CREATE IN PHASE 0

### `.cursor/skills/pinhole-design-system/SKILL.md`
```md
---
name: pinhole-design-system
description: Pinhole Noir design system. Use whenever building or styling any UI component, page section, form, button, menu, card, or animation in this project.
---
# Pinhole Noir Design System
## Look
Dark-first, cinematic, one amber accent (oklch(0.79 0.165 76)). Glass only for header, sheets, popovers. Bento grids for feature sections (6-9 tiles). Rounded: buttons full, inputs xl, cards 3xl.
## Fonts
Display: Bricolage Grotesque. Body: Geist. Fluid type with clamp().
## Recipes
- Button: pill, 44px min, amber primary with shimmer + glow, active:scale-[0.97], loading + disabled states.
- Input: 48px, filled muted, amber 2px focus ring, always-visible label, inline error with aria-describedby, 16px+ font.
- Select/Dropdown: glass popover, rounded-2xl, selected check; on mobile use a bottom Drawer for long lists.
- Tabs: sliding pill with layoutId; scrollable with edge fade on mobile.
- Card: gradient 1px border, cursor spotlight on hover devices, lift on hover.
- Hamburger: 3 bars morph to X; full-screen glass sheet; staggered links; accordions for Studios/Services; pinned WhatsApp + Call.
## Motion
Easing cubic-bezier(0.22,1,0.36,1); 150/250/450ms; spring {300,30}. Only transform/opacity. MotionConfig reducedMotion="user".
## Checks before finishing any UI task
Works at 360px and 1440px, no horizontal scroll, focus ring visible, keyboard works, dark and light both fine.
```

### `.cursor/skills/visual-qa-playwright/SKILL.md`
```md
---
name: visual-qa-playwright
description: Visual and functional QA with Playwright MCP. Use at the end of every phase or feature to screenshot the UI at all device sizes and detect overflow, console errors and broken flows.
---
# Visual QA
1. Start the dev server.
2. For each viewport (320x568, 360x640, 390x844, 768x1024, 1024x768, 1440x900, 1920x1080) open the page(s) changed.
3. Check: no horizontal scroll (document.scrollingElement.scrollWidth <= innerWidth), no console errors, no overlapped/clipped elements, tap targets >= 44px, readable contrast.
4. Exercise the feature (click, type, submit) and confirm the expected WhatsApp URL starts with https://wa.me/918506905757?text=
5. Save screenshots to docs/qa/<phase>/<viewport>.png.
6. Fix every issue found, then re-run. Report a short table: page | viewport | result.
```

### `.cursor/skills/feature-traceability/SKILL.md`
```md
---
name: feature-traceability
description: Proves every required feature exists. Use at Phase 8 or whenever asked to verify completeness against the spec.
---
# Feature Traceability
1. Read sections 3 (35 original features) and 4 (10 new features + Shortlist) of @docs/BUILD_PROMPT.md.
2. Create docs/FEATURE_TRACEABILITY.md with a table: # | Feature | Route/Component path | Test name | Status (Done/Partial/Missing).
3. Verify each item by opening the route or running its test. Do not mark Done without evidence.
4. List every Partial/Missing item and fix it, or explain why it is blocked.
```
