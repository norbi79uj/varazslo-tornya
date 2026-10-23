// Development-only visual inspection: npm run screenshots, with the HTTP server running.
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { initialState } from "../world.js";
import { SAVE_KEY } from "../engine.js";
await mkdir("artifacts/previews", { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 1100 },
  });
  for (const [name, scene, x, y] of [
    ["village", "world", 264, 210],
    ["south", "world", 264, 520],
    ["bridge", "world", 984, 220],
    ["forest", "world", 1660, 260],
    ["hill", "world", 1200, 530],
    ["cabin", "cabin", 320, 260],
    ["cellar", "cellar", 320, 280],
    ["smithy", "smithy", 320, 250],
  ]) {
    await page.goto("http://127.0.0.1:8000");
    await page.locator("#start").click();
    const s = initialState();
    s.scene = scene;
    Object.assign(s.player, { x, y });
    if (scene === "cellar")
      Object.assign(s.flags, { journal: true, examined: true, cupboard: true });
    if (scene === "smithy") s.returnSpot = { x: 125.5, y: 160 };
    await page.evaluate(
      ({ key, s }) => localStorage.setItem(key, JSON.stringify(s)),
      { key: SAVE_KEY, s },
    );
    await page.locator("#load").click();
    await page.waitForTimeout(1100);
    await page.screenshot({
      path: `artifacts/previews/${name}.png`,
      fullPage: true,
    });
  }
} finally {
  await browser.close();
}
console.log("Captured eight actual game views under artifacts/previews/.");
