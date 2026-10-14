import { test } from "node:test";
import assert from "node:assert/strict";
import { calculatePrice } from "../lib/pricing.ts";

test("within 20 miles charges $125 per person plus tax, no travel fee", () => {
  const q = calculatePrice({ people: 1, distanceMiles: 12.3 });
  assert.equal(q.baseCents, 12500);
  assert.equal(q.travelFeeCents, 0);
  assert.equal(q.taxCents, 500);
  assert.equal(q.totalCents, 13000);
});

test("exactly 20 miles has no travel fee", () => {
  assert.equal(calculatePrice({ people: 1, distanceMiles: 20 }).travelFeeCents, 0);
});

test("beyond 20 miles applies $10 per started 10 miles", () => {
  const q = calculatePrice({ people: 2, distanceMiles: 27.4 });
  assert.equal(q.baseCents, 25000);
  assert.equal(q.travelFeeCents, 3000);
  assert.equal(q.totalCents, Math.round(28000 * 1.04));
});

test("rejects invalid people counts", () => {
  assert.throws(() => calculatePrice({ people: 0, distanceMiles: 1 }));
  assert.throws(() => calculatePrice({ people: 1.5, distanceMiles: 1 }));
  assert.throws(() => calculatePrice({ people: 11, distanceMiles: 1 }));
});

test("rejects invalid distance", () => {
  assert.throws(() => calculatePrice({ people: 1, distanceMiles: -1 }));
  assert.throws(() => calculatePrice({ people: 1, distanceMiles: Number.NaN }));
});
