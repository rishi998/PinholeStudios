<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Pinhole Studio

Prototype of pinholestudio.in. Full specification: `docs/BUILD_PROMPT.md`.

- Stack: Next.js 16, React 19, TypeScript, Tailwind v4, shadcn/ui, Motion, Better Auth, Drizzle + SQLite, Vercel AI SDK v6.
- Execute one build phase at a time. Stop when that phase's "Done when" is met.
- All enquiries use `waLink()` in `src/lib/whatsapp.ts` (`918506905757`). Do not hardcode that number elsewhere.
- Unknown business data is sample data in `src/data`, marked `// SAMPLE`.
- Project rules: `.cursor/rules/`. Project skills: `pinhole-design-system`, `visual-qa-playwright`, `feature-traceability`.
