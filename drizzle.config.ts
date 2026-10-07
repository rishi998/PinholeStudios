import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URL ?? "file:./local.db";
const remote = url.startsWith("libsql:") || url.startsWith("https:");

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: remote ? "turso" : "sqlite",
  dbCredentials: remote
    ? { url, authToken: process.env.DATABASE_AUTH_TOKEN }
    : { url },
});
