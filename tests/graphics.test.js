import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  CHARACTER_PROFILES,
  CHARACTER_SHEET,
  sourceRect,
} from "../assets/kenney/characters/profiles.js";
const original = readFileSync(
  new URL(
    "../assets/kenney/characters/roguelikeChar_transparent.png",
    import.meta.url,
  ),
);
test("the supplied Kenney sheet is preserved byte for byte with its CC0 license", () => {
  assert.equal(
    createHash("sha256").update(original).digest("hex"),
    "771d51ca84b2c5b412027ba80c6a6b8a98bb5a983b2c58ac4f0ccf08ae4d10f2",
  );
  const license = readFileSync(
    new URL("../assets/kenney/characters/License.txt", import.meta.url),
    "utf8",
  );
  assert.match(license, /Creative Commons Zero, CC0/);
  assert.match(license, /Created\/distributed by Kenney/);
  assert.equal(original.readUInt32BE(16), CHARACTER_SHEET.width);
  assert.equal(original.readUInt32BE(20), CHARACTER_SHEET.height);
});
test("every visible character and enemy has a valid, distinct Kenney profile", () => {
  assert.deepEqual(
    Object.keys(CHARACTER_PROFILES).sort(),
    [
      "hero",
      "smith",
      "innkeeper",
      "elder",
      "lumberjack",
      "merchant",
      "missing",
      "slime",
      "wolf",
      "boss",
    ].sort(),
  );
  const profiles = new Set();
  for (const p of Object.values(CHARACTER_PROFILES)) {
    assert.ok(p.layers.length > 0);
    profiles.add(JSON.stringify(p));
    for (const layer of [...p.layers, ...(p.equipment || [])]) {
      const r = sourceRect(layer);
      assert.ok(Number.isInteger(layer.column) && Number.isInteger(layer.row));
      assert.ok(
        r.x >= 0 &&
          r.y >= 0 &&
          r.x + r.w <= CHARACTER_SHEET.width &&
          r.y + r.h <= CHARACTER_SHEET.height,
      );
    }
  }
  assert.equal(profiles.size, 10);
});
