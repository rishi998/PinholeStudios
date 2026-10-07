This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The app is a single Next.js project. Vercel cannot store `file:./local.db`, so production uses [Turso](https://turso.tech) (libSQL).

1. Create a Turso database and run `pnpm db:push` then `pnpm db:seed` against it.
2. Import the Git repo in Vercel. Framework preset: Next.js. Install command: `pnpm install`. Node 20 or newer.
3. Set these environment variables for Production and Preview:

| Name | Value |
|---|---|
| `DATABASE_URL` | `libsql://...turso.io` |
| `DATABASE_AUTH_TOKEN` | Turso token |
| `BETTER_AUTH_SECRET` | long random string |
| `BETTER_AUTH_URL` | `https://your-domain.vercel.app` |
| `NEXT_PUBLIC_SITE_URL` | same public URL |
| `ADMIN_EMAIL` | the address that should become admin on sign-up |

Preview deployments pick up their own `https://*.vercel.app` host automatically. Do not set `DATABASE_URL` to `file:./local.db` on Vercel. Google and AI keys stay optional.
