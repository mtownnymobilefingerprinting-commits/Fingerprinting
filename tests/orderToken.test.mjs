import { test } from "node:test";
import assert from "node:assert/strict";
import { createOrderToken, verifyOrderToken } from "../lib/orderToken.ts";

const id = "3f1c2b6e-8a4d-4f7e-9b1a-2c3d4e5f6a7b";
const secret = "test-secret";

test("round-trips a valid token", () => {
  assert.equal(verifyOrderToken(createOrderToken(id, secret), secret), id);
});

test("a bare order id is not authorization", () => {
  assert.equal(verifyOrderToken(id, secret), null);
});

test("rejects tampered or foreign tokens", () => {
  const token = createOrderToken(id, secret);
  const otherId = "00000000-0000-4000-8000-000000000000";
  assert.equal(verifyOrderToken(`${otherId}.${token.split(".")[1]}`, secret), null);
  assert.equal(verifyOrderToken(token, "other-secret"), null);
  assert.equal(verifyOrderToken(`${token}x`, secret), null);
  assert.equal(verifyOrderToken("", secret), null);
});

import { createBookingTag, bookingTagMatches, referenceFromBookingTag } from "../lib/orderToken.ts";

test("booking tag starts with the readable reference and can't be forged from it", () => {
  const tag = createBookingTag(id, "MF-3F1C2B6E", secret);
  assert.ok(tag.startsWith("MF-3F1C2B6E."));
  assert.equal(referenceFromBookingTag(tag), "MF-3F1C2B6E");
  assert.ok(bookingTagMatches(tag, id, "MF-3F1C2B6E", secret));
  assert.ok(!bookingTagMatches("MF-3F1C2B6E", id, "MF-3F1C2B6E", secret));
  assert.ok(!bookingTagMatches(`MF-3F1C2B6E.${"A".repeat(16)}`, id, "MF-3F1C2B6E", secret));
  assert.ok(!bookingTagMatches(tag, id, "MF-3F1C2B6E", "other-secret"));
  assert.equal(referenceFromBookingTag("not-a-tag"), null);
});
