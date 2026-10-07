import { relations, sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const now = sql`(cast(unixepoch('subsecond') * 1000 as integer))`;

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false).notNull(),
  image: text("image"),
  role: text("role").default("user").notNull(),
  phone: text("phone"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).default(now).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).default(now).$onUpdate(() => new Date()).notNull(),
});

export const session = sqliteTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).default(now).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).default(now).$onUpdate(() => new Date()).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = sqliteTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp_ms" }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp_ms" }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).default(now).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).default(now).$onUpdate(() => new Date()).notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = sqliteTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).default(now).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).default(now).$onUpdate(() => new Date()).notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const enquiry = sqliteTable("enquiry", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  message: text("message").notNull(),
  sourcePage: text("source_page").notNull(),
  status: text("status").default("new").notNull(),
  notes: text("notes").default("").notNull(),
  userId: text("user_id"),
  payload: text("payload"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).default(now).notNull(),
});

export const bookingRequest = sqliteTable("booking_request", {
  id: text("id").primaryKey(),
  studioSlug: text("studio_slug").notNull(),
  date: text("date").notNull(),
  slot: text("slot").notNull(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  message: text("message").notNull(),
  status: text("status").default("pending").notNull(),
  userId: text("user_id"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).default(now).notNull(),
});

export const availability = sqliteTable(
  "availability",
  {
    id: text("id").primaryKey(),
    studioSlug: text("studio_slug").notNull(),
    date: text("date").notNull(),
    slot: text("slot").notNull(),
    state: text("state").notNull(),
  },
  (table) => [uniqueIndex("availability_studio_date_slot").on(table.studioSlug, table.date, table.slot)],
);

export const shortlist = sqliteTable(
  "shortlist",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    studioSlug: text("studio_slug").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).default(now).notNull(),
  },
  (table) => [uniqueIndex("shortlist_user_studio").on(table.userId, table.studioSlug)],
);

export const eventLog = sqliteTable("event_log", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  page: text("page"),
  studio: text("studio"),
  payload: text("payload"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).default(now).notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "requirement_confirmed",
  "quotation",
  "negotiation",
  "booked",
  "lost",
] as const;
