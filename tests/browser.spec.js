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
