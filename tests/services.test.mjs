import { test } from "node:test";
import assert from "node:assert/strict";
import { services, findService, legacyServicePaths } from "../config/services.ts";

test("slugs and ids are unique", () => {
  assert.equal(new Set(services.map((s) => s.slug)).size, services.length);
  assert.equal(new Set(services.map((s) => s.id)).size, services.length);
});

test("old public URLs and checkout values still resolve", () => {
  for (const key of ["mobileInk", "mobile-ink", "immigration", "adoption", "personal-record-review", "personalRecordReview", "fbiCard"]) {
    assert.ok(findService(key), key);
  }
  assert.equal(findService("mobileInk").slug, "mobile-ink");
  assert.equal(findService("nope"), undefined);
  assert.equal(findService(null), undefined);
});

test("legacy redirects never point to themselves or collide with a canonical slug", () => {
  const slugs = new Set(services.map((s) => s.slug));
  for (const { from, to } of legacyServicePaths()) {
    assert.notEqual(from, to);
    assert.ok(!slugs.has(from), from);
    assert.ok(slugs.has(to), to);
  }
});

test("next.config redirects cover every legacy service path", async () => {
  const { default: config } = await import("../next.config.mjs");
  const redirects = await config.redirects();
  for (const { from, to } of legacyServicePaths()) {
    const match = redirects.find((r) => r.source === `/services/${from}`);
    assert.ok(match, `missing redirect for /services/${from}`);
    assert.equal(match.destination, `/services/${to}`);
    assert.equal(match.permanent, true);
  }
});
