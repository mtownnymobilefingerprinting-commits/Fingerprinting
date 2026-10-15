import { test } from "node:test";
import assert from "node:assert/strict";
import { reminderDue, formatAppointmentTime } from "../lib/bookingEmails.ts";

const paid = "2026-10-15T12:00:00.000Z";
const at = (min) => Date.parse(paid) + min * 60 * 1000;

test("first reminder 30 minutes after payment, not before", () => {
  const o = { paid_at: paid, last_reminder_at: null, reminder_count: 0 };
  assert.equal(reminderDue(o, at(29)), false);
  assert.equal(reminderDue(o, at(30)), true);
});

test("second reminder 24 hours after the first, then no more", () => {
  const first = new Date(at(30)).toISOString();
  const o = { paid_at: paid, last_reminder_at: first, reminder_count: 1 };
  assert.equal(reminderDue(o, at(30 + 23 * 60)), false);
  assert.equal(reminderDue(o, at(30 + 24 * 60)), true);
  assert.equal(reminderDue({ ...o, reminder_count: 2 }, at(99999)), false);
});

test("never reminds an order without a payment time", () => {
  assert.equal(reminderDue({ paid_at: null, last_reminder_at: null, reminder_count: 0 }, Date.now()), false);
});

test("appointment time is shown in New York time", () => {
  assert.equal(formatAppointmentTime("2026-10-20T14:00:00.000Z"), "Tuesday, October 20 at 10:00 AM EDT");
  assert.equal(formatAppointmentTime("2026-12-01T15:30:00.000Z"), "Tuesday, December 1 at 10:30 AM EST");
});
