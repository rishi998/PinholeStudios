import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

const dir = mkdtempSync(path.join(tmpdir(), "pinhole-lead-"));
const file = path.join(dir, "lead.db").replaceAll("\\", "/");
process.env.DATABASE_URL = `file:${file}`;
delete process.env.DATABASE_AUTH_TOKEN;

test("normalizes Indian mobile numbers and rejects everything else", async () => {
  const { normalizePhone } = await import("./lead");
  assert.equal(normalizePhone("85069 05757"), "+918506905757");
  assert.equal(normalizePhone("+91 8506905757"), "+918506905757");
  assert.equal(normalizePhone("0918506905757"), "+918506905757");
  assert.equal(normalizePhone("12345"), null);
  assert.equal(normalizePhone("1234567890"), null);
});

test("WhatsApp links use the shared helper and keep the enquiry text", async () => {
  const { waLink, WHATSAPP_NUMBER } = await import("./whatsapp");
  const { finalizeEnquiryMessage } = await import("./lead");
  const message = finalizeEnquiryMessage({
    message: "Hi Pinhole Studio, I'd like to request a booking.\nStudio: Empty Studio Space\nPreferred date: 2026-11-02\nPreferred duration: Full day",
    name: "Asha Verma",
    phone: "+918506905757",
    email: "asha@example.com",
    id: "ref-1",
  });
  const href = waLink(message);
  const text = decodeURIComponent(new URL(href).searchParams.get("text") ?? "");
  assert.equal(new URL(href).host, "wa.me");
  assert.equal(new URL(href).pathname, `/${WHATSAPP_NUMBER}`);
  assert.match(text, /Empty Studio Space/);
  assert.match(text, /2026-11-02/);
  assert.match(text, /Full day/);
  assert.match(text, /Reference: ref-1/);
  assert.match(text, /not a confirmed booking/);
  assert.equal(text.includes("918506905757?text"), false);
});

test("a missing table is a failure, then a valid lead is stored once", async () => {
  const { saveEnquiry, saveBookingRequest } = await import("./lead");
  const { client } = await import("../db");

  const failed = await saveEnquiry({
    type: "contact",
    name: "Asha Verma",
    email: "asha@example.com",
    phone: "8506905757",
    message: "Need the empty floor next month.",
    sourcePage: "/contact",
  });
  assert.equal(failed.ok, false);

  await client.execute(`
    CREATE TABLE enquiry (
      id text PRIMARY KEY,
      type text NOT NULL,
      name text NOT NULL,
      email text,
      phone text,
      message text NOT NULL,
      source_page text NOT NULL,
      status text NOT NULL DEFAULT 'new',
      notes text NOT NULL DEFAULT '',
      user_id text,
      payload text,
      created_at integer NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer))
    )
  `);
  await client.execute(`
    CREATE TABLE booking_request (
      id text PRIMARY KEY,
      studio_slug text NOT NULL,
      date text NOT NULL,
      slot text NOT NULL,
      name text NOT NULL,
      phone text NOT NULL,
      email text,
      message text NOT NULL,
      status text NOT NULL DEFAULT 'pending',
      user_id text,
      created_at integer NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer))
    )
  `);
  await client.execute(`
    CREATE TABLE event_log (
      id text PRIMARY KEY,
      name text NOT NULL,
      page text,
      studio text,
      payload text,
      created_at integer NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer))
    )
  `);

  const invalid = await saveEnquiry({
    type: "contact",
    name: "A",
    email: "not-an-email",
    phone: "8506905757",
    message: "Hello there",
    sourcePage: "/contact",
  });
  assert.equal(invalid.ok, false);

  const saved = await saveEnquiry({
    type: "contact",
    name: "Asha Verma",
    email: "asha@example.com",
    phone: "8506905757",
    message: "Need the empty floor next month.",
    sourcePage: "/contact",
  });
  assert.equal(saved.ok, true);
  if (!saved.ok) return;
  const rows = await client.execute("SELECT id, phone, message, status FROM enquiry");
  assert.equal(rows.rows.length, 1);
  assert.equal(rows.rows[0]?.id, saved.id);
  assert.equal(rows.rows[0]?.phone, "+918506905757");
  assert.equal(rows.rows[0]?.status, "new");
  assert.match(String(rows.rows[0]?.message), new RegExp(`Reference: ${saved.id}`));
  assert.match(saved.href, /wa\.me\/918506905757/);

  const again = await saveEnquiry({
    type: "contact",
    name: "Asha Verma",
    email: "asha@example.com",
    phone: "+91 8506905757",
    message: "Need the empty floor next month.",
    sourcePage: "/contact",
  });
  assert.equal(again.ok, true);
  if (!again.ok) return;
  assert.equal(again.id, saved.id);
  assert.equal(again.duplicate, true);
  const after = await client.execute("SELECT id FROM enquiry");
  assert.equal(after.rows.length, 1);

  const booking = await saveBookingRequest({
    studioSlug: "empty-studio",
    studioName: "Empty Studio Space",
    date: "2026-11-02",
    slot: "full-day",
    name: "Asha Verma",
    phone: "8506905757",
    email: "asha@example.com",
  });
  assert.equal(booking.ok, true);
  if (!booking.ok) return;
  const text = decodeURIComponent(new URL(booking.href).searchParams.get("text") ?? "");
  assert.match(text, /Empty Studio Space/);
  assert.match(text, /2026-11-02/);
  assert.match(text, /Full day/);
  assert.match(text, /not a confirmed booking/);
  assert.equal(booking.href.includes("wa.me/918506905757"), true);
});
