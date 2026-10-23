import { test, expect } from "@playwright/test";
import { SAVE_KEY } from "../engine.js";
const close = (page) => page.locator("#close-dialog").click();
async function interact(page, title) {
  await page.locator("#game").focus();
  await page.keyboard.press("e");
  await expect(page.locator("#dialog-title")).toContainText(title);
}
async function checkpoint(page, patch) {
  await page.locator("#save").click();
  await page.evaluate(
    ({ key, patch }) => {
      const s = JSON.parse(localStorage.getItem(key));
      for (const [k, v] of Object.entries(patch)) {
        if (["player", "flags"].includes(k)) Object.assign(s[k], v);
        else s[k] = v;
      }
      localStorage.setItem(key, JSON.stringify(s));
    },
    { key: SAVE_KEY, patch },
  );
  await page.locator("#load").click();
  await expect(page.locator("#status")).toContainText("Mentés betöltve");
  await page.locator("#game").focus();
}
test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Kaland indítása" }).click();
});
test("NPCs, shops, inn, herb quest and persistent save", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await checkpoint(page, { player: { x: 161, y: 200 } });
  await interact(page, "Boros");
  await page.getByRole("button", { name: "Edzett vaskard" }).click();
  await expect(page.locator("#dialog-title")).toHaveText("Kevés arany");
  await close(page);
  await checkpoint(page, { gold: 50 });
  await interact(page, "Boros");
  await page.getByRole("button", { name: "Edzett vaskard" }).click();
  await expect(page.locator("#gold")).toHaveText("26");
  await expect(page.locator("#weapon")).toHaveText("Edzett vaskard");
  await close(page);
  await checkpoint(page, { player: { x: 338, y: 251 } });
  await interact(page, "Réka");
  await page.getByRole("button", { name: "Gyógyital · 8 arany" }).click();
  await expect(page.locator("#gold")).toHaveText("18");
  await expect(page.locator("#potions")).toHaveText("3");
  await close(page);
  await checkpoint(page, { player: { x: 415, y: 200, hp: 2 } });
  await interact(page, "Ilona");
  await page.getByRole("button", { name: "Pihenés" }).click();
  await expect(page.locator("#health")).toHaveAttribute(
    "aria-label",
    "Életerő: 5/5",
  );
  await expect(page.locator("#gold")).toHaveText("13");
  await close(page);
  await checkpoint(page, { player: { x: 269, y: 302 } });
  await interact(page, "Áron");
  await expect(page.locator("#dialog-text")).toContainText("torony mágusa");
  await close(page);
  for (const [x, y] of [
    [690, 288],
    [843, 102],
    [1024, 306],
  ]) {
    await checkpoint(page, { player: { x, y } });
    await page.keyboard.press("e");
    await expect(page.locator("#status")).toContainText("Gyógyfüvet");
  }
  await checkpoint(page, { player: { x: 415, y: 200 } });
  await interact(page, "Ilona");
  await page.getByRole("button", { name: "Három gyógyfű" }).click();
  await expect(page.locator("#gold")).toHaveText("25");
  await close(page);
  await page.locator("#save").click();
  await page.reload();
  await page.getByRole("button", { name: "Mentés folytatása" }).click();
  await expect(page.locator("#gold")).toHaveText("25");
  await expect(page.locator("#weapon")).toHaveText("Edzett vaskard");
  await expect(page.locator("#potions")).toHaveText("4");
  expect(errors).toEqual([]);
});
test("continuous boundaries in both directions, collision, combat, XP, potion and revival", async ({
  page,
}) => {
  await checkpoint(page, { player: { x: 620, y: 220 } });
  await page.keyboard.down("d");
  await expect(page.locator("#location")).toHaveText("Faluszéli rét");
  await page.keyboard.up("d");
  await page.keyboard.down("a");
  await expect(page.locator("#location")).toHaveText("Smaragdvölgy falu");
  await page.keyboard.up("a");
  await checkpoint(page, { player: { x: 1250, y: 220 } });
  await page.keyboard.down("ArrowRight");
  await expect(page.locator("#location")).toHaveText("Öreg erdő");
  await page.keyboard.up("ArrowRight");
  await page.keyboard.down("ArrowLeft");
  await expect(page.locator("#location")).toHaveText("Faluszéli rét");
  await page.keyboard.up("ArrowLeft");
  await checkpoint(page, { player: { x: 125, y: 157 } });
  await page.keyboard.down("w");
  await page.waitForTimeout(400);
  await page.keyboard.up("w");
  await page.locator("#save").click();
  const y = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)).player.y,
    SAVE_KEY,
  );
  expect(y).toBeGreaterThan(149);
  await checkpoint(page, { player: { x: 750, y: 188, dx: 1, dy: 0 } });
  await page.keyboard.down(" ");
  await expect(page.locator("#gold")).toHaveText("23", { timeout: 10000 });
  await page.keyboard.up(" ");
  await expect(page.locator("#xp")).toHaveText("8 / 20 TP");
  await checkpoint(page, { player: { x: 264, y: 210, hp: 1 } });
  await page.keyboard.press("q");
  await expect(page.locator("#health")).toHaveAttribute(
    "aria-label",
    "Életerő: 5/5",
  );
  await expect(page.locator("#potions")).toHaveText("1");
  await checkpoint(page, { player: { x: 920, y: 284, hp: 1 } });
  await expect(page.locator("#dialog-title")).toHaveText("A lovag elesett", {
    timeout: 6000,
  });
  await page.keyboard.press("Escape");
  await expect(page.locator("#dialog")).toBeVisible();
  await page.getByRole("button", { name: "Vissza a faluba" }).click();
  await expect(page.locator("#location")).toHaveText("Smaragdvölgy falu");
  await expect(page.locator("#gold")).toHaveText("18");
});
test("rescue, quest sword, boss and northern gate", async ({ page }) => {
  await checkpoint(page, { player: { x: 1780, y: 72 } });
  await interact(page, "Északi kapu");
  await expect(page.locator("#dialog-text")).toContainText("lezárják");
  await close(page);
  await checkpoint(page, { player: { x: 544, y: 293 } });
  await interact(page, "Márton");
  await page.getByRole("button", { name: "Elvállalom" }).click();
  await expect(page.locator("#quest")).toContainText("Dénest");
  await checkpoint(page, { player: { x: 1518, y: 320 } });
  await interact(page, "Dénes");
  await page.getByRole("button", { name: "Kiszabadítom" }).click();
  await checkpoint(page, { player: { x: 544, y: 293 } });
  await interact(page, "Márton");
  await page.getByRole("button", { name: "Jutalom átvétele" }).click();
  await expect(page.locator("#weapon")).toHaveText("Erdőjáró pengéje");
  await close(page);
  await expect(page.locator("#level")).toHaveText("2. SZINT");
  await checkpoint(page, { player: { x: 1738, y: 131, hp: 6, dx: 1, dy: 0 } });
  await page.keyboard.down(" ");
  await expect(page.locator("#dialog-title")).toHaveText(
    "Smaragdvölgy fellélegezhet",
    { timeout: 16000 },
  );
  await page.keyboard.up(" ");
  await close(page);
  await expect(page.locator("#quest")).toContainText("kapu nyitva");
  await checkpoint(page, { player: { x: 1780, y: 72 } });
  await interact(page, "Északi kapu");
  await expect(page.locator("#dialog-text")).toContainText("még nem járható");
  await close(page);
  await page.locator("#save").click();
  await page.reload();
  await page.locator("#load-start").click();
  await expect(page.locator("#quest")).toContainText("kapu nyitva");
});
test("cabin journal, manually discovered cabinet, optional cellar puzzle and one-time reward", async ({
  page,
}) => {
  await checkpoint(page, { player: { x: 1420, y: 160 } });
  await page.keyboard.press("e");
  await expect(page.locator("#location")).toHaveText("Elhagyott kunyhó");
  await checkpoint(page, { player: { x: 211, y: 195 } });
  await interact(page, "Megkopott napló");
  await expect(page.locator("#dialog-text")).toContainText("szekrény");
  await close(page);
  await checkpoint(page, { player: { x: 433, y: 149 } });
  await page.keyboard.press("e");
  await expect(page.locator("#dialog-title")).toHaveText("Poros szekrény");
  await expect(page.locator("#dialog-choices button")).toHaveCount(0);
  await close(page);
  await page.keyboard.press("e");
  await page.getByRole("button", { name: "Félretolom" }).click();
  await page.getByRole("button", { name: "Lemegyek" }).click();
  await expect(page.locator("#location")).toHaveText("Rejtett pince");
  await checkpoint(page, { player: { x: 136, y: 280 } });
  await interact(page, "Kőbe vésett");
  await expect(page.locator("#dialog-text")).toContainText("keleten");
  await close(page);
  await checkpoint(page, { player: { x: 320, y: 115 } });
  await interact(page, "Régi láda");
  await expect(page.locator("#dialog-text")).toContainText("zárták");
  await close(page);
  await checkpoint(page, { player: { x: 211, y: 195 } });
  await interact(page, "Rúnakő");
  await expect(page.locator("#dialog-text")).toContainText("kialszanak");
  await close(page);
  for (const x of [429, 320, 211]) {
    await checkpoint(page, { player: { x, y: 195 } });
    await interact(page, "Rúnakő");
    await close(page);
  }
  await checkpoint(page, { player: { x: 320, y: 115 } });
  await interact(page, "A kertész emléke");
  await expect(page.locator("#gold")).toHaveText("33");
  await expect(page.locator("#health")).toHaveAttribute(
    "aria-label",
    "Életerő: 6/6",
  );
  await close(page);
  await page.keyboard.press("e");
  await expect(page.locator("#dialog-text")).toContainText("üres");
  await close(page);
  await page.locator("#save").click();
  await page.reload();
  await page.locator("#load-start").click();
  await expect(page.locator("#location")).toHaveText("Rejtett pince");
  await checkpoint(page, { player: { x: 320, y: 295 } });
  await page.keyboard.press("e");
  await expect(page.locator("#location")).toHaveText("Elhagyott kunyhó");
  await checkpoint(page, { player: { x: 320, y: 301 } });
  await page.keyboard.press("e");
  await expect(page.locator("#location")).toHaveText("Öreg erdő");
});
test("audio activation, corrupt saves, restart confirmation and mobile layout", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.locator("#sound").click();
  await expect(page.locator("#sound")).toHaveAttribute("aria-pressed", "true");
  await page.locator("#sound").click();
  await expect(page.locator("#sound")).toHaveAttribute("aria-pressed", "false");
  await page.evaluate(
    (key) => localStorage.setItem(key, "invalid json"),
    SAVE_KEY,
  );
  await page.locator("#load").click();
  await expect(page.locator("#status")).toContainText("sérült");
  await expect(page.locator("#gold")).toHaveText("18");
  await page.locator("#restart").click();
  await expect(page.locator("#dialog-title")).toHaveText("Új kaland?");
  await close(page);
  await page.locator("#restart").click();
  await page.getByRole("button", { name: "Igen, új játék" }).click();
  await expect(page.locator("#gold")).toHaveText("18");
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/smaragdvolgy-mobile.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test("all local Kenney environments render at native scale; missing sheets block startup", async ({
  page,
}) => {
  const external = [],
    legacy = [];
  page.on("request", (r) => {
    if (
      !r.url().startsWith("http://127.0.0.1:8000") &&
      !r.url().startsWith("data:")
    )
      external.push(r.url());
    if (r.url().includes("smaragd-atlas")) legacy.push(r.url());
  });
  const result = await page.evaluate(async () =>
    (await import("/tests/environment-probe.js")).probeEnvironmentGraphics(),
  );
  expect(result.sheets).toEqual([
    { pack: "rpg", ok: true, type: "image/png", width: 968, height: 526 },
    { pack: "indoors", ok: true, type: "image/png", width: 458, height: 305 },
  ]);
  expect(result.sprites.length).toBeGreaterThan(50);
  for (const sprite of result.sprites) {
    expect(sprite.visible, sprite.name).toBeGreaterThan(30);
    expect(sprite.nativePixels, sprite.name).toBe(true);
  }
  expect(result.colors).toBeGreaterThan(20);
  expect(
    await page
      .locator("#game")
      .evaluate((c) => getComputedStyle(c).imageRendering),
  ).toBe("pixelated");
  for (const path of [
    "**/assets/kenney/rpg/*.png",
    "**/assets/kenney/indoors/*.png",
  ]) {
    await page.route(path, (route) => route.abort());
    await page.reload();
    await expect(page.locator("#overlay h2")).toHaveText(
      "A grafika nem tölthető be",
    );
    await expect(page.locator("#start")).toBeDisabled();
    await page.keyboard.press("r");
    await page.locator("#load").click();
    await expect(page.locator("#overlay h2")).toHaveText(
      "A grafika nem tölthető be",
    );
    await page.unroute(path);
  }
  await page.route("**/assets/smaragd-atlas.png", (route) => route.abort());
  await page.reload();
  await page.locator("#start").click();
  await expect(page.locator("#overlay")).not.toBeVisible();
  expect(legacy).toEqual([]);
  expect(external).toEqual([]);
});
test("six homes, functional interiors, door returns, interior save and furniture collision", async ({
  page,
}) => {
  const { BUILDINGS, OBJECTS } = await import("../world.js");
  for (const b of BUILDINGS.filter((b) => b.id !== "cabin")) {
    const door = OBJECTS.world.find((o) => o.id === "door-" + b.id);
    await checkpoint(page, { player: { x: door.x, y: door.y + 8 } });
    await page.keyboard.press("e");
    await expect(page.locator("#location")).not.toHaveText("Smaragdvölgy falu");
    if (b.id === "smith") {
      await checkpoint(page, { gold: 30, player: { x: 263, y: 210 } });
      await interact(page, "Boros");
      await page.getByRole("button", { name: "Edzett vaskard" }).click();
      await close(page);
      await expect(page.locator("#weapon")).toHaveText("Edzett vaskard");
      await page.locator("#save").click();
      await page.reload();
      await page.locator("#load-start").click();
      await expect(page.locator("#location")).toHaveText("Boros kovácsműhelye");
    }
    await checkpoint(page, { player: { x: 320, y: 301 } });
    await page.keyboard.press("e");
    await expect(page.locator("#location")).toHaveText("Smaragdvölgy falu");
  }
  await checkpoint(page, { player: { x: 1420, y: 160 } });
  await page.keyboard.press("e");
  await checkpoint(page, { player: { x: 433, y: 149 } });
  await page.keyboard.down("w");
  await page.waitForTimeout(500);
  await page.keyboard.up("w");
  await page.locator("#save").click();
  const pos = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)).player,
    SAVE_KEY,
  );
  expect(pos.y).toBeGreaterThanOrEqual(144);
  // No journal: the hidden furniture remains ordinary, with no movement action.
  await page.keyboard.press("e");
  await expect(page.locator("#dialog-choices button")).toHaveCount(0);
  await expect(page.locator("#dialog-text")).toContainText("írásai");
});
test("stream collision, bridge crossing, southern map, volume slider and actual open gate threshold", async ({
  page,
}) => {
  await checkpoint(page, { player: { x: 940, y: 300 } });
  await page.keyboard.down("d");
  await page.waitForTimeout(500);
  await page.keyboard.up("d");
  await page.locator("#save").click();
  const x = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)).player.x,
    SAVE_KEY,
  );
  expect(x).toBeLessThanOrEqual(952);
  await checkpoint(page, { player: { x: 940, y: 220 } });
  await page.keyboard.down("d");
  await page.waitForTimeout(900);
  await page.keyboard.up("d");
  await page.locator("#save").click();
  expect(
    await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)).player.x,
      SAVE_KEY,
    ),
  ).toBeGreaterThan(1008);
  await checkpoint(page, { player: { x: 264, y: 550 } });
  await page.screenshot({
    path: "test-results/snes-southern-village.png",
    fullPage: true,
  });
  await page.locator("#volume").fill("25");
  await expect(page.locator("#volume-value")).toHaveText("25%");
  await page.reload();
  await page.locator("#load-start").click();
  await expect(page.locator("#volume")).toHaveValue("25");
  await checkpoint(page, { player: { x: 1780, y: 64 } });
  await page.keyboard.down("w");
  await page.waitForTimeout(500);
  await page.keyboard.up("w");
  await page.locator("#save").click();
  expect(
    await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)).player.y,
      SAVE_KEY,
    ),
  ).toBeGreaterThanOrEqual(54);
  const patch = await page.evaluate((key) => {
    const s = JSON.parse(localStorage.getItem(key));
    Object.assign(s.flags, {
      quest: true,
      rescued: true,
      returned: true,
      boss: true,
    });
    s.enemies.find((e) => e.boss).hp = 0;
    return { flags: s.flags, enemies: s.enemies };
  }, SAVE_KEY);
  await checkpoint(page, { ...patch, player: { x: 1780, y: 64 } });
  await page.keyboard.down("w");
  await expect(page.locator("#dialog-title")).toHaveText("Az északi út");
  await page.keyboard.up("w");
  await close(page);
  await page.locator("#save").click();
  expect(
    await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)).flags.gateVisited,
      SAVE_KEY,
    ),
  ).toBe(true);
});

test("touch controls move and interact; maximum-level HUD fits a narrow screen", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:8000");
    await page.locator("#start").tap();
    const right = page.locator('[data-key="ArrowRight"]');
    await right.scrollIntoViewIfNeeded();
    const b = await right.boundingBox();
    const session = await context.newCDPSession(page);
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: b.x + b.width / 2, y: b.y + b.height / 2 }],
    });
    await page.waitForTimeout(400);
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await page.locator("#save").tap();
    expect(
      await page.evaluate(
        (key) => JSON.parse(localStorage.getItem(key)).player.x,
        SAVE_KEY,
      ),
    ).toBeGreaterThan(285);
    await checkpoint(page, { player: { x: 338, y: 251 } });
    await page.locator('[data-key="e"]').tap();
    await expect(page.locator("#dialog-title")).toContainText("Réka");
    await close(page);
    await checkpoint(page, {
      level: 5,
      xp: 190,
      armor: "padded",
      flags: { journal: true, examined: true, cupboard: true, amulet: true },
      player: { x: 264, y: 210, hp: 11 },
    });
    await expect(page.locator("#health")).toHaveAttribute(
      "aria-label",
      "Életerő: 11/11",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: "test-results/snes-touch-max-hp.png",
      fullPage: true,
    });
  } finally {
    await context.close();
  }
});

test("Kenney actors render all roles and animate; missing character sheet blocks startup", async ({
  page,
}) => {
  const result = await page.evaluate(async () => {
    const { CHARACTER_SHEET, CHARACTER_PROFILES, drawKenneyActor } =
      await import("/assets/kenney/characters/profiles.js");
    const image = new Image();
    image.src = CHARACTER_SHEET.url;
    await image.decode();
    const c = document.createElement("canvas");
    c.width = 80;
    c.height = 64;
    const ctx = c.getContext("2d"),
      roles = [];
    for (const name of Object.keys(CHARACTER_PROFILES)) {
      const frames = [];
      for (const frame of [0, 1]) {
        ctx.clearRect(0, 0, 80, 64);
        drawKenneyActor(ctx, image, name, 16, 16, { frame });
        frames.push([...ctx.getImageData(0, 0, 80, 64).data]);
      }
      roles.push({
        name,
        visible: frames[0].filter((v, i) => i % 4 === 3 && v > 0).length,
        animated: frames[0].some((v, i) => v !== frames[1][i]),
      });
    }
    return { width: image.naturalWidth, height: image.naturalHeight, roles };
  });
  expect(result.width).toBe(918);
  expect(result.height).toBe(203);
  expect(result.roles).toHaveLength(10);
  for (const role of result.roles) {
    expect(role.visible, role.name).toBeGreaterThan(100);
    expect(role.animated, role.name).toBe(true);
  }
  const license = await page.request.get(
    "/assets/kenney/characters/License.txt",
  );
  expect(license.ok()).toBe(true);
  expect(await license.text()).toContain("Creative Commons Zero, CC0");
  await page.route("**/roguelikeChar_transparent.png", (route) =>
    route.abort(),
  );
  await page.reload();
  await expect(page.locator("#overlay h2")).toHaveText(
    "A grafika nem tölthető be",
  );
  await expect(page.locator("#status")).toContainText(
    "roguelikeChar_transparent.png",
  );
  await expect(page.locator("#start")).toBeDisabled();
});

test("village detail sprites, four directional poses, moving merchant and dialogue pause", async ({
  page,
}) => {
  const { recordMerchant } = await import("./village-probe.js");
  const result = await page.evaluate(async () =>
    (await import("/tests/village-probe.js")).probeVillageGraphics(),
  );
  expect([result.width, result.height]).toEqual([256, 384]);
  expect(result.sprites.length).toBe(72);
  for (const sprite of result.sprites) {
    expect(sprite.visible, sprite.name).toBeGreaterThan(8);
    expect(sprite.nativePixels, sprite.name).toBe(true);
  }
  for (const role of result.roles) expect(role.directions, role.name).toBe(4);
  await checkpoint(page, { player: { x: 264, y: 300 } });
  await page.evaluate(recordMerchant);
  await page.waitForTimeout(2000);
  const positions = await page.evaluate(() =>
    window.__merchant.map((p) => p.x),
  );
  expect(
    Math.max(...positions) - Math.min(...positions),
  ).toBeGreaterThanOrEqual(4);
  await checkpoint(page, { player: { x: 338, y: 251 } });
  await interact(page, "Réka");
  await page.evaluate(() => {
    window.__merchant = [];
  });
  await page.waitForTimeout(450);
  expect(
    await page.evaluate(
      () => new Set(window.__merchant.map((p) => p.x + "," + p.y)).size,
    ),
  ).toBe(1);
  await page.waitForFunction(() => {
    const o = window.__drawOrder;
    return (
      ["merchant", "counter", "hero"].every((n) => o.includes(n)) &&
      o.indexOf("merchant") < o.indexOf("counter") &&
      o.indexOf("counter") < o.indexOf("hero")
    );
  });
  await close(page);
  await page.screenshot({
    path: "test-results/village-detail.png",
    fullPage: true,
  });
  await page.route("**/assets/village/details.png", (route) => route.abort());
  await page.reload();
  await expect(page.locator("#overlay h2")).toHaveText(
    "A grafika nem tölthető be",
  );
  await expect(page.locator("#start")).toBeDisabled();
});
test("GitHub Pages style subdirectory loads all local images and supports movement", async ({
  page,
}) => {
  const { preparePagesFixture } = await import("./pages-fixture.js");
  const prefix = await preparePagesFixture(),
    errors = [],
    png = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => {
    if (new URL(r.url()).pathname.endsWith(".png"))
      png.push(new URL(r.url()).pathname);
  });
  await page.goto(prefix);
  await page.locator("#start").click();
  await page.keyboard.down("d");
  await page.waitForTimeout(250);
  await page.keyboard.up("d");
  await page.locator("#save").click();
  expect(
    await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)).player.x,
      SAVE_KEY,
    ),
  ).toBeGreaterThan(270);
  expect(png).toHaveLength(4);
  for (const path of png) expect(path.startsWith(prefix)).toBe(true);
  expect(errors).toEqual([]);
});

test("visual alignment: shared feet and grid, compact houses and one nearby readable label", async ({
  page,
}) => {
  const { recordLabels } = await import("./alignment-probe.js");
  const result = await page.evaluate(async () =>
    (await import("/tests/alignment-probe.js")).probeVisualAlignment(),
  );
  expect(result.feet).toEqual(result.expected);
  expect(result.offGrid).toEqual([]);
  expect(result.staticCalls).toBeGreaterThan(200);
  expect(result.camera.x % 2).toBe(0);
  expect(result.camera.y % 2).toBe(0);
  for (const h of result.houses) expect(h.ground - h.top, h.id).toBe(80);
  expect(
    await page
      .locator("#game")
      .evaluate((c) => c.getBoundingClientRect().width),
  ).toBe(640);
  await page.evaluate(recordLabels);
  await checkpoint(page, { player: { x: 338, y: 251 } });
  await page.waitForTimeout(80);
  expect(
    await page.evaluate(() =>
      window.__labels.filter((t) => t.startsWith("E · ")),
    ),
  ).toEqual(["E · Réka, a kereskedő"]);
  expect(
    await page.evaluate(() =>
      window.__labels.filter((t) =>
        ["Boros", "Ilona", "Áron", "Márton", "Réka", "Dénes"].includes(t),
      ),
    ),
  ).toEqual([]);
  await checkpoint(page, { player: { x: 130, y: 608 } });
  await page.waitForTimeout(80);
  expect(
    await page.evaluate(() =>
      Object.entries(window.__labelPositions)
        .filter(([t]) => t.startsWith("E · "))
        .map(([, p]) => p.y),
    ),
  ).toEqual([23]);
  await checkpoint(page, { player: { x: 264, y: 210 } });
  await page.waitForTimeout(80);
  expect(
    await page.evaluate(() =>
      window.__labels.filter((t) => t.startsWith("E · ")),
    ),
  ).toEqual([]);
  await page.screenshot({
    path: "test-results/visual-alignment-chromium.png",
    fullPage: true,
  });
});
