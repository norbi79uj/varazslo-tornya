import test from "node:test";
import assert from "node:assert/strict";
import { Game, SAVE_KEY, validateSave } from "../engine.js";
import { initialState, NPCS, OBJECTS } from "../world.js";
const make = () => {
  const g = new Game();
  g.start();
  return g;
};
const interact = (g, id) => {
  const n = NPCS.find((n) => n.id === id);
  Object.assign(g.state.player, { x: n.x, y: n.y + 27 });
  g.interact();
};
const choose = (g, text) => {
  const c = g.dialog.choices.find((c) => c.label.includes(text));
  assert.ok(c, `Missing choice: ${text}`);
  c.action();
};
const memory = () => {
  let value;
  return {
    setItem: (_, v) => {
      value = v;
    },
    getItem: () => value,
  };
};
test("original directional sword: wrong facing misses, cooldown blocks repeated hits", () => {
  const g = make(),
    p = g.state.player,
    e = g.state.enemies[0];
  Object.assign(p, { x: 750, y: 188, dx: -1, dy: 0 });
  g.attack();
  assert.equal(e.hp, 3);
  g.cooldown = 0;
  p.dx = 1;
  g.attack();
  assert.equal(e.hp, 2);
  g.attack();
  assert.equal(e.hp, 2);
});
test("enemy death awards XP/gold exactly once and respawns only away from player", () => {
  const g = make(),
    e = g.state.enemies[0];
  Object.assign(g.state.player, { x: 750, y: 188, dx: 1, dy: 0 });
  e.hp = 1;
  g.attack();
  assert.equal(e.hp, 0);
  assert.equal(g.state.xp, 8);
  assert.equal(g.state.gold, 23);
  g.cooldown = 0;
  g.attack();
  assert.equal(g.state.gold, 23);
  e.respawn = 0.01;
  g.update(0.02);
  assert.equal(e.hp, 0);
  g.state.player.x = 264;
  g.update(0.02);
  assert.equal(e.hp, 3);
});
test("level curve caps at 5, restores health and increases maximum HP", () => {
  const g = make();
  g.state.player.hp = 1;
  g.gainXP(20);
  assert.equal(g.state.level, 2);
  assert.equal(g.state.player.hp, 6);
  g.gainXP(999);
  assert.equal(g.state.level, 5);
  assert.equal(g.state.xp, 190);
  assert.equal(g.maxHp, 9);
});
test("movement respects houses, world edges and continuous zone boundary", () => {
  const g = make(),
    p = g.state.player;
  Object.assign(p, { x: 125, y: 153 });
  g.move(p, 0, -20);
  assert.equal(p.y, 153);
  p.x = 28;
  g.move(p, -10, 0);
  assert.equal(p.x, 28);
  Object.assign(p, { x: 635, y: 220 });
  g.move(p, 12, 0);
  assert.equal(g.zone, "Faluszéli rét");
  p.x = 1275;
  g.move(p, 12, 0);
  assert.equal(g.zone, "Öreg erdő");
});
test("dialog pauses movement and hostile damage; closed dialog clears held keys", () => {
  const g = make();
  g.keys.add("d");
  g.open("Áron", "Történet");
  const x = g.state.player.x;
  g.update(1);
  assert.equal(g.state.player.x, x);
  assert.equal(g.keys.size, 0);
  g.close();
  assert.equal(g.dialog, null);
});
test("smith rejects insufficient gold and charges once for modest upgraded sword", () => {
  const g = make();
  interact(g, "smith");
  choose(g, "24");
  assert.equal(g.state.gold, 18);
  assert.equal(g.state.weapon, "iron");
  g.close();
  g.state.gold = 30;
  interact(g, "smith");
  choose(g, "24");
  assert.equal(g.state.gold, 6);
  assert.equal(g.state.weapon, "tempered");
  g.close();
  interact(g, "smith");
  assert.equal(g.dialog.choices.length, 1);
  g.state.gold = 20;
  choose(g, "Bélelt");
  assert.equal(g.state.gold, 2);
  assert.equal(g.maxHp, 6);
  assert.equal(g.state.armor, "padded");
  g.close();
  interact(g, "smith");
  assert.equal(g.dialog.choices.length, 0);
});
test("merchant purchase, inn heal and potions never waste full-health resources", () => {
  const g = make();
  interact(g, "merchant");
  choose(g, "8");
  assert.equal(g.state.gold, 10);
  assert.equal(g.state.potions, 3);
  g.close();
  g.potion();
  assert.equal(g.state.potions, 3);
  g.state.player.hp = 1;
  g.potion();
  assert.equal(g.state.player.hp, 5);
  assert.equal(g.state.potions, 2);
  g.state.player.hp = 2;
  interact(g, "innkeeper");
  choose(g, "Pihenés");
  assert.equal(g.state.gold, 5);
  assert.equal(g.state.player.hp, 5);
  g.close();
  interact(g, "innkeeper");
  choose(g, "Pihenés");
  assert.equal(g.state.gold, 5);
});
test("herb collection and village reward are one-time and consume exactly three herbs", () => {
  const g = make();
  for (const [x, y] of [
    [690, 288],
    [843, 102],
    [1024, 306],
  ]) {
    Object.assign(g.state.player, { x, y });
    g.interact();
  }
  assert.equal(g.state.herbs, 3);
  g.interact();
  assert.equal(g.state.herbs, 3);
  interact(g, "innkeeper");
  choose(g, "gyógyfű");
  assert.equal(g.state.herbs, 0);
  assert.equal(g.state.flags.herbsDone, true);
  assert.equal(g.state.gold, 30);
  assert.equal(g.state.xp, 10);
  assert.equal(g.state.potions, 3);
  g.close();
  interact(g, "innkeeper");
  assert.equal(g.dialog.choices.length, 1);
});
test("rescue quest unlocks boss vulnerability only after returning to lumberjack", () => {
  const g = make();
  interact(g, "lumberjack");
  choose(g, "Elvállalom");
  assert.equal(g.state.flags.quest, true);
  interact(g, "missing");
  choose(g, "Kiszabadítom");
  assert.equal(g.state.flags.rescued, true);
  assert.equal(g.state.flags.returned, false);
  interact(g, "lumberjack");
  choose(g, "Jutalom");
  assert.equal(g.state.flags.returned, true);
  assert.equal(g.state.weapon, "ranger");
  assert.equal(g.state.gold, 33);
  assert.equal(g.state.xp, 35);
  g.close();
  interact(g, "lumberjack");
  assert.equal(g.dialog.choices.length, 0);
});
test("boss cannot be damaged before helping villagers; defeat opens the northern gate permanently", () => {
  const g = make(),
    e = g.state.enemies.find((e) => e.boss);
  Object.assign(g.state.player, { x: e.x - 40, y: e.y, dx: 1, dy: 0 });
  g.attack();
  assert.equal(e.hp, 22);
  Object.assign(g.state.flags, { quest: true, rescued: true, returned: true });
  g.cooldown = 0;
  e.hp = 1;
  g.attack();
  assert.equal(g.state.flags.boss, true);
  assert.equal(e.hp, 0);
  g.close();
  g.state.player.x = 264;
  g.update(100);
  assert.equal(e.hp, 0);
  Object.assign(g.state.player, { x: 1780, y: 65 });
  g.interact();
  assert.match(g.dialog.text, /kapu nyitva/);
});
test("cabinet has no proximity prompt; inspecting and moving are distinct manual actions", () => {
  const g = make();
  g.changeScene("cabin", 433, 148);
  g.interact();
  assert.equal(g.state.flags.examined, false);
  assert.equal(g.state.flags.cupboard, false);
  g.close();
  Object.assign(g.state.player, { x: 211, y: 195 });
  g.interact();
  g.close();
  Object.assign(g.state.player, { x: 433, y: 148 });
  assert.equal(g.nearby(), undefined);
  g.interact();
  assert.equal(g.state.flags.examined, true);
  assert.equal(g.state.flags.cupboard, false);
  assert.equal(g.dialog.choices.length, 0);
  g.close();
  g.interact();
  choose(g, "Félretolom");
  assert.equal(g.state.flags.cupboard, true);
  choose(g, "Lemegyek");
  assert.equal(g.state.scene, "cellar");
});
test("journal hints at cabinet, cellar puzzle rejects wrong order, reward is one-time", () => {
  const g = make();
  g.changeScene("cabin", 211, 195);
  g.interact();
  assert.equal(g.state.flags.journal, true);
  assert.match(g.dialog.text, /szekrény/);
  g.close();
  g.state.flags.examined = g.state.flags.cupboard = true;
  g.changeScene("cellar", 211, 195);
  g.interact();
  assert.deepEqual(g.state.runes, [false, false, false]);
  g.close();
  for (const x of [429, 320, 211]) {
    Object.assign(g.state.player, { x, y: 195 });
    g.interact();
    g.close();
  }
  assert.deepEqual(g.state.runes, [true, true, true]);
  Object.assign(g.state.player, { x: 320, y: 112 });
  g.interact();
  assert.equal(g.state.flags.amulet, true);
  assert.equal(g.maxHp, 6);
  assert.equal(g.state.gold, 33);
  g.close();
  g.interact();
  assert.equal(g.state.gold, 33);
});
test("damage has invulnerability frames; defeat can revive without losing progression", () => {
  const g = make(),
    e = g.state.enemies[0];
  Object.assign(g.state.player, { x: e.x, y: e.y, hp: 1 });
  g.update(0.02);
  assert.equal(g.dead, true);
  assert.equal(g.state.player.hp, 0);
  choose(g, "Vissza");
  assert.equal(g.state.gold, 13);
  assert.equal(g.dead, false);
  assert.equal(g.state.player.hp, 5);
  assert.equal(g.zone, "Smaragdvölgy falu");
});
test("save/load round-trips RPG, secret, puzzle and enemy state after new Game instance", () => {
  const g = make(),
    store = memory();
  Object.assign(g.state.flags, {
    examined: true,
    cupboard: true,
    journal: true,
  });
  g.state.scene = "cellar";
  Object.assign(g.state.player, { x: 320, y: 290 });
  g.state.runes = [false, false, true];
  g.state.gold = 29;
  g.state.enemies[0].hp = 1;
  assert.equal(g.save(store), true);
  const restored = new Game();
  assert.equal(restored.load(store), true);
  assert.equal(restored.started, true);
  assert.deepEqual(restored.state, g.state);
});
test("corrupt, absent, incompatible or inaccessible saves leave active game untouched", () => {
  const g = make(),
    before = structuredClone(g.state);
  for (const content of [
    "{oops",
    JSON.stringify({ ...initialState(), version: 9 }),
    JSON.stringify({ ...initialState(), level: 5 }),
    null,
  ]) {
    assert.equal(g.load({ getItem: () => content }), false);
    assert.deepEqual(g.state, before);
  }
  assert.equal(
    g.save({
      setItem: () => {
        throw Error("denied");
      },
    }),
    false,
  );
  assert.equal(
    g.load({
      getItem: () => {
        throw Error("denied");
      },
    }),
    false,
  );
  assert.equal(SAVE_KEY, "varazslo-tornya.smaragdvolgy.v1");
});
test("malformed player coordinates, enemy stats and incomplete saves are rejected", () => {
  for (const mutate of [
    (s) => (s.player.x = Infinity),
    (s) => (s.player.hp = 99),
    (s) => s.enemies.pop(),
    (s) => (s.enemies[0].hp = -1),
    (s) => (s.flags.cupboard = "yes"),
    (s) => (s.flags.boss = true),
    (s) => (s.collected = ["herb1", "herb1"]),
    (s) => Object.assign(s.player, { x: 120, y: 100 }),
    (s) => (s.weapon = "legendary"),
  ]) {
    const state = initialState();
    mutate(state);
    assert.throws(() => validateSave(state));
  }
});

test("stream blocks water outside the wooden bridge and rocks block movement", () => {
  const g = make(),
    p = g.state.player;
  Object.assign(p, { x: 940, y: 300 });
  g.move(p, 20, 0);
  assert.equal(p.x, 940);
  Object.assign(p, { x: 940, y: 220 });
  for (let i = 0; i < 20; i++) g.move(p, 5, 0);
  assert.equal(p.x, 1040);
  Object.assign(p, { x: 1480, y: 480 });
  g.move(p, 10, 0);
  assert.equal(p.x, 1480);
});
test("six homes and functional smith/inn/shop interiors have exits and save correctly", () => {
  const g = make(),
    store = memory();
  for (const b of [
    "smith",
    "inn",
    "shop",
    "house",
    "house2",
    "house3",
    "house4",
    "house5",
    "house6",
  ]) {
    const door = OBJECTS.world.find((o) => o.id === "door-" + b);
    Object.assign(g.state.player, { x: door.x, y: door.y + 8 });
    g.interact();
    assert.equal(g.state.scene, door.scene);
    assert.ok(g.state.returnSpot);
    assert.equal(g.save(store), true);
    assert.equal(g.load(store), true);
    Object.assign(g.state.player, { x: 320, y: 301 });
    g.interact();
    assert.equal(g.state.scene, "world");
    assert.equal(g.state.returnSpot, null);
    assert.equal(g.state.player.x, door.x);
  }
});
test("v1 saves migrate without losing inventory, quests or progress; old blocked coordinates relocate safely", () => {
  const old = initialState();
  old.version = 1;
  delete old.armor;
  delete old.returnSpot;
  delete old.flags.gateVisited;
  old.gold = 77;
  old.xp = 20;
  old.level = 2;
  old.player.hp = 6;
  old.player.x = 970;
  old.player.y = 300;
  const loaded = validateSave(old);
  assert.equal(loaded.version, 2);
  assert.equal(loaded.gold, 77);
  assert.equal(loaded.level, 2);
  assert.deepEqual([loaded.player.x, loaded.player.y], [264, 210]);
  assert.equal(loaded.flags.gateVisited, false);
});
test("closed gate is solid, defeated boss opens a real threshold and persists completion", () => {
  const g = make(),
    p = g.state.player;
  Object.assign(p, { x: 1780, y: 60 });
  g.move(p, 0, -20);
  assert.equal(p.y, 60);
  Object.assign(g.state.flags, {
    quest: true,
    rescued: true,
    returned: true,
    boss: true,
  });
  g.state.enemies.find((e) => e.boss).hp = 0;
  g.move(p, 0, -30);
  assert.equal(p.y, 30);
  g.update(0.01);
  assert.equal(g.state.flags.gateVisited, true);
  assert.equal(g.dialog.title, "Az északi út");
  g.close();
  const save = memory();
  assert.equal(g.save(save), true);
  assert.equal(g.load(save), true);
  assert.equal(g.state.flags.gateVisited, true);
  assert.equal(g.blocked(p.x, 0), true);
});
