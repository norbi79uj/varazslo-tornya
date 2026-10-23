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

import {
  ENVIRONMENT_SHEETS,
  ENVIRONMENT_SPRITES,
} from "../assets/kenney/environment.js";
test("both supplied environment PNGs retain original hashes, dimensions and CC0 licenses", () => {
  for (const [pack, sheet] of Object.entries(ENVIRONMENT_SHEETS)) {
    const data = readFileSync(new URL(sheet.url));
    assert.equal(
      createHash("sha256").update(data).digest("hex"),
      sheet.sha256,
      pack,
    );
    assert.equal(data.readUInt32BE(16), sheet.width, pack);
    assert.equal(data.readUInt32BE(20), sheet.height, pack);
    const license = readFileSync(
      new URL(`../assets/kenney/${pack}/License.txt`, import.meta.url),
      "utf8",
    );
    assert.match(license, /Creative Commons Zero, CC0/);
    assert.match(license, /Kenney Vleugels/);
    if (pack === "rpg") assert.match(license, /Lynn Evers/);
  }
});
test("every environment composition stays inside its source and declared footprint", () => {
  assert.ok(Object.keys(ENVIRONMENT_SPRITES).length > 50);
  for (const [name, sprite] of Object.entries(ENVIRONMENT_SPRITES)) {
    assert.ok(sprite.layers.length > 0, name);
    for (const layer of sprite.layers) {
      const sheet = ENVIRONMENT_SHEETS[layer.pack];
      assert.ok(sheet, name);
      assert.ok(
        Number.isInteger(layer.column) && Number.isInteger(layer.row),
        name,
      );
      assert.ok(
        layer.column >= 0 &&
          layer.row >= 0 &&
          layer.column * 17 + 16 <= sheet.width &&
          layer.row * 17 + 16 <= sheet.height,
        name,
      );
      assert.ok(
        (layer.sx ?? 0) >= 0 && (layer.sx ?? 0) + (layer.sw ?? 16) <= 16,
        name,
      );
      assert.ok(
        layer.dx >= 0 &&
          layer.dy >= 0 &&
          layer.dx + (layer.sw ?? 16) * 2 <= sprite.w &&
          layer.dy + 32 <= sprite.h,
        name,
      );
    }
  }
});

import { DETAIL_SPRITES } from "../assets/village/atlas.js";
import { DETAIL_SHEET } from "../assets/village/sheet.js";
test("original supplementary art is local, CC0, and all sprite regions fit the PNG", () => {
  const png = readFileSync(new URL(DETAIL_SHEET.url)),
    license = readFileSync(
      new URL("../assets/village/License.txt", import.meta.url),
      "utf8",
    );
  assert.equal(png.readUInt32BE(16), DETAIL_SHEET.width);
  assert.equal(png.readUInt32BE(20), DETAIL_SHEET.height);
  assert.match(license, /CC0 1.0 Universal/);
  assert.equal(Object.keys(DETAIL_SPRITES).length, 71);
  for (const [name, s] of Object.entries(DETAIL_SPRITES)) {
    assert.ok(
      s.x >= 0 &&
        s.y >= 0 &&
        s.w > 0 &&
        s.h > 0 &&
        s.x + s.w <= DETAIL_SHEET.width &&
        s.y + s.h <= DETAIL_SHEET.height,
      name,
    );
  }
});
