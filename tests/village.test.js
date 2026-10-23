import test from "node:test";
import assert from "node:assert/strict";
import { Game, isBlocked, validateSave, SAVE_KEY } from "../engine.js";
import { initialState, OBJECTS } from "../world.js";
import { VillageLife } from "../village-life.js";
import { VILLAGE_SOLIDS, INTERIOR_PROPS } from "../village-layout.js";
test("patrolling villagers visit their route points without crossing solid scenery or teleporting", () => {
  for (const scene of ["world", "inn", "smithy", "shop"]) {
    const s = initialState();
    s.scene = scene;
    Object.assign(
      s.player,
      scene === "world" ? { x: 620, y: 555 } : { x: 320, y: 308 },
    );
    const life = new VillageLife();
    const actors = life.people(s),
      visited = new Map(
        actors.filter((a) => a.path.length).map((a) => [a.id, new Set()]),
      );
    for (let i = 0; i < 3600; i++) {
      const before = actors.map((a) => ({ x: a.x, y: a.y }));
      life.update(1 / 60, s, (x, y) => isBlocked(s, x, y));
      actors.forEach((a, j) => {
        assert.equal(isBlocked(s, a.x, a.y), false, scene + ":" + a.id);
        assert.ok(
          Math.hypot(a.x - before[j].x, a.y - before[j].y) <= 0.251,
          a.id,
        );
        a.path.forEach(([x, y], k) => {
          if (Math.hypot(a.x - x, a.y - y) < 1) visited.get(a.id).add(k);
        });
      });
    }
    for (const a of actors.filter((a) => a.path.length))
      assert.equal(
        visited.get(a.id).size,
        a.path.length,
        scene + ":" + a.id + " must finish its patrol",
      );
  }
});
test("moving NPCs use their visible position for interaction and stop facing the player throughout dialogue", () => {
  const g = new Game();
  g.start();
  Object.assign(g.state.player, { x: 620, y: 555 });
  for (let i = 0; i < 100; i++) g.update(0.02);
  const merchant = g.people.find((n) => n.id === "merchant");
  assert.notEqual(merchant.x, merchant.homeX);
  Object.assign(g.state.player, { x: merchant.x, y: merchant.y + 26 });
  assert.equal(g.nearby(true), merchant);
  g.interact();
  assert.match(g.dialog.title, /Réka/);
  assert.equal(merchant.direction, "down");
  const before = g.people.map((n) => ({
      x: n.x,
      y: n.y,
      pose: n.pose,
      direction: n.direction,
    })),
    clock = g.life.clock;
  g.update(10);
  assert.equal(g.life.clock, clock);
  assert.deepEqual(
    g.people.map((n) => ({
      x: n.x,
      y: n.y,
      pose: n.pose,
      direction: n.direction,
    })),
    before,
  );
  g.close();
  g.update(0.02);
  assert.ok(g.life.clock > clock);
});
test("all nine door approaches remain reachable and new fences and well block movement", () => {
  const s = initialState(),
    seen = new Set(),
    queue = [[264, 210]];
  seen.add("264,210");
  for (let i = 0; i < queue.length; i++) {
    const [x, y] = queue[i];
    for (const [dx, dy] of [
      [4, 0],
      [-4, 0],
      [0, 4],
      [0, -4],
    ]) {
      const nx = x + dx,
        ny = y + dy,
        k = nx + "," + ny;
      if (
        nx < 28 ||
        nx > 632 ||
        ny < 54 ||
        ny > 612 ||
        seen.has(k) ||
        isBlocked(s, nx, ny)
      )
        continue;
      seen.add(k);
      queue.push([nx, ny]);
    }
  }
  for (const door of OBJECTS.world.filter((o) => o.id.startsWith("door-"))) {
    assert.equal(isBlocked(s, door.x, door.y + 8), false, door.id);
    assert.ok(
      queue.some(([x, y]) => Math.hypot(x - door.x, y - (door.y + 8)) < 8),
      door.id,
    );
  }
  for (const prop of VILLAGE_SOLIDS) {
    assert.equal(
      isBlocked(s, prop.x + prop.w / 2, prop.y + prop.h / 2),
      true,
      prop.id,
    );
  }
});
test("older v2 saves inside new scenery move locally while preserving progression and secrets", () => {
  for (const scene of ["world", "inn"]) {
    const s = initialState();
    s.scene = scene;
    s.gold = 67;
    s.weapon = "tempered";
    s.flags.quest = true;
    if (scene === "world") Object.assign(s.player, { x: 250, y: 150 });
    else {
      Object.assign(s.player, { x: 350, y: 119 });
      s.returnSpot = { x: 429, y: 160 };
    }
    assert.equal(
      isBlocked(s, s.player.x, s.player.y, { villageDetails: false }),
      false,
    );
    assert.equal(isBlocked(s, s.player.x, s.player.y), true);
    const loaded = validateSave(s);
    assert.equal(loaded.version, 2);
    assert.equal(loaded.gold, 67);
    assert.equal(loaded.weapon, "tempered");
    assert.equal(loaded.flags.quest, true);
    assert.equal(isBlocked(loaded, loaded.player.x, loaded.player.y), false);
    assert.ok(
      Math.hypot(loaded.player.x - s.player.x, loaded.player.y - s.player.y) <
        70,
    );
  }
});
test("ambient routines are transient, save schema stays v2 and new game/load reset routine state", () => {
  const g = new Game();
  g.start();
  g.update(2);
  let raw;
  const storage = {
    setItem: (key, s) => {
      assert.equal(key, SAVE_KEY);
      raw = s;
    },
    getItem: () => raw,
  };
  g.save(storage);
  const saved = JSON.parse(raw);
  assert.equal(saved.version, 2);
  assert.equal(saved.life, undefined);
  assert.equal(saved.people, undefined);
  g.newGame();
  assert.equal(g.life.clock, 0);
  g.update(0.1);
  assert.equal(g.load(storage), true);
  assert.equal(g.life.clock, 0);
  assert.equal(g.people.find((n) => n.id === "merchant").x, 338);
});

import {
  VISUAL_GRID,
  snap,
  buildingPlacement,
  actorPlacement,
  propPlacement,
  sortByGround,
} from "../visual-layout.js";
import { BUILDINGS } from "../world.js";
import { VILLAGE_PROPS } from "../village-layout.js";
import { ENVIRONMENT_SPRITES } from "../assets/kenney/environment.js";
import { DETAIL_SPRITES } from "../assets/village/atlas.js";
test("visual feet use the collision baseline and all static placements share one pixel grid", () => {
  assert.equal(VISUAL_GRID.tile, VISUAL_GRID.sourceTile * 2);
  for (const prop of VILLAGE_PROPS.filter((p) => p.foot)) {
    const s = prop.kenney
        ? ENVIRONMENT_SPRITES[prop.art]
        : DETAIL_SPRITES[prop.art],
      size = prop.kenney ? s : { w: s.w * 2, h: s.h * 2 },
      p = propPlacement(prop, size);
    assert.ok(Math.abs(p.ground - (prop.foot.y + prop.foot.h)) <= 1, prop.id);
    assert.ok(Math.abs(p.cx - (prop.foot.x + prop.foot.w / 2)) <= 1, prop.id);
    for (const n of [p.x, p.y, p.cx, p.ground]) assert.equal(n % 2, 0, prop.id);
  }
  for (const scale of [2, 3]) {
    const p = actorPlacement({ x: 338.4, y: 225.2 }, scale);
    assert.equal(p.y + p.h, snap(225.2 + 8));
    assert.equal(p.x + p.w / 2, snap(338.4));
  }
});
test("compact house projections leave clear space before the next row without moving doors", () => {
  const houses = BUILDINGS.filter((b) => b.id !== "cabin").map((b) => ({
    ...buildingPlacement(b),
    id: b.id,
  }));
  for (const h of houses) {
    assert.equal(h.ground - h.top, 80);
    assert.equal(h.ground - h.wallY, 32);
    assert.equal(h.width % 8, 0);
  }
  for (const a of houses)
    for (const b of houses) {
      if (
        b.ground <= a.ground ||
        a.x + a.width + 8 <= b.x - 8 ||
        b.x + b.width + 8 <= a.x - 8
      )
        continue;
      assert.ok(b.top - a.ground >= 24, a.id + " / " + b.id);
    }
});
test("painter order follows ground contacts rather than the sprite rectangle tops", () => {
  const counter = VILLAGE_PROPS.find((p) => p.id === "counter"),
    ground = snap(counter.foot.y + counter.foot.h);
  const entries = [
    { id: "front", ...actorPlacement({ x: 338, y: 251 }) },
    { id: "counter", ground },
    { id: "behind", ...actorPlacement({ x: 338, y: 225 }) },
  ];
  assert.deepEqual(
    sortByGround(entries).map((e) => e.id),
    ["behind", "counter", "front"],
  );
});
