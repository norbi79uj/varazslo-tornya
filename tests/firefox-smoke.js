// Real, stock Firefox via WebDriver BiDi. Requires a local HTTP server.
// Checkpoint positioning edits normal save data; gameplay uses DOM and keys only.
import puppeteer from "puppeteer-core";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { SAVE_KEY } from "../engine.js";
await mkdir("test-results", { recursive: true });
const browser = await puppeteer.launch({
  browser: "firefox",
  executablePath: process.env.FIREFOX_PATH || "/usr/bin/firefox-esr",
  headless: true,
  // Permit deterministic Web Audio in the automation profile, never in the game.
  extraPrefsFirefox: {
    "media.autoplay.default": 0,
    "media.autoplay.block-webaudio": false,
    ...(process.env.FIREFOX_CONTAINER_AUDIO === "1"
      ? {
          "media.cubeb.sandbox": false,
          "security.sandbox.utility.level": 0,
        }
      : {}),
  },
});
let passed = 0;
try {
  const page = (await browser.pages())[0] || (await browser.newPage());
  await page.setViewport({ width: 1280, height: 1100 });
  const errors = [],
    external = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => {
    if (
      !r.url().startsWith("http://127.0.0.1:8000") &&
      !r.url().startsWith("data:")
    )
      external.push(r.url());
  });
  await page.evaluateOnNewDocument(() => {
    window.__tones = [];
    const Original = window.AudioContext;
    window.AudioContext = class extends Original {
      createOscillator() {
        const o = super.createOscillator(),
          set = o.frequency.setValueAtTime.bind(o.frequency);
        o.frequency.setValueAtTime = (f, t) => {
          window.__tones.push(f);
          return set(f, t);
        };
        return o;
      }
    };
  });
  const click = (s) => page.click(s),
    key = (k) => page.keyboard.press(k);
  const text = (s) => page.$eval(s, (e) => e.textContent);
  async function has(s, value, timeout = 6000) {
    await page.waitForFunction(
      (s, v) => document.querySelector(s)?.textContent.includes(v),
      { timeout },
      s,
      value,
    );
  }
  async function choice(value) {
    const buttons = await page.$$("#dialog-choices button");
    for (const b of buttons) {
      if ((await b.evaluate((e) => e.textContent)).includes(value)) {
        await b.click();
        return;
      }
    }
    throw Error(`Missing choice: ${value}`);
  }
  async function close() {
    await click("#close-dialog");
  }
  async function checkpoint(patch) {
    await click("#save");
    await page.evaluate(
      ({ key, patch }) => {
        const s = JSON.parse(localStorage.getItem(key));
        for (const [k, v] of Object.entries(patch)) {
          if (k === "player" || k === "flags") Object.assign(s[k], v);
          else s[k] = v;
        }
        localStorage.setItem(key, JSON.stringify(s));
      },
      { key: SAVE_KEY, patch },
    );
    await click("#load");
    await has("#status", "Mentés betöltve");
    await page.focus("#game");
  }
  async function interact(title) {
    await page.focus("#game");
    await key("e");
    await has("#dialog-title", title);
  }
  async function scenario(name, run) {
    await page.goto("http://127.0.0.1:8000");
    await page.evaluate(() => localStorage.clear());
    await click("#start");
    await run();
    passed++;
    console.log(`PASS ${passed}: ${name}`);
  }
  await scenario(
    "NPCs, smith purchase/rejection, merchant, inn, elder, herb collection/reward, save/reload",
    async () => {
      await checkpoint({ player: { x: 161, y: 200 } });
      await interact("Boros");
      await choice("24");
      await has("#dialog-title", "Kevés arany");
      assert.equal(await text("#gold"), "18");
      await close();
      await checkpoint({ gold: 50 });
      await interact("Boros");
      await choice("24");
      await has("#weapon", "Edzett vaskard");
      assert.equal(await text("#gold"), "26");
      await close();
      await checkpoint({ player: { x: 338, y: 251 } });
      await interact("Réka");
      await choice("8 arany");
      await has("#potions", "3");
      assert.equal(await text("#gold"), "18");
      await close();
      await checkpoint({ player: { x: 415, y: 200, hp: 2 } });
      await interact("Ilona");
      await choice("Pihenés");
      await has("#health", "♥♥♥♥♥");
      assert.equal(await text("#gold"), "13");
      await close();
      await checkpoint({ player: { x: 269, y: 302 } });
      await interact("Áron");
      await has("#dialog-text", "torony mágusa");
      await close();
      for (const [x, y] of [
        [690, 288],
        [843, 102],
        [1024, 306],
      ]) {
        await checkpoint({ player: { x, y } });
        await key("e");
        await has("#status", "Gyógyfüvet");
      }
      await checkpoint({ player: { x: 415, y: 200 } });
      await interact("Ilona");
      await choice("gyógyfű");
      await has("#gold", "25");
      await close();
      await click("#save");
      await page.reload();
      await click("#load-start");
      await has("#weapon", "Edzett vaskard");
      assert.equal(await text("#potions"), "4");
      assert.equal(await text("#gold"), "25");
    },
  );
  await scenario(
    "WASD/arrows, continuous region changes, sword combat, XP, potion and defeat/revival",
    async () => {
      await checkpoint({ player: { x: 620, y: 220 } });
      await page.keyboard.down("d");
      await has("#location", "Faluszéli rét");
      await page.keyboard.up("d");
      await page.keyboard.down("a");
      await has("#location", "Smaragdvölgy falu");
      await page.keyboard.up("a");
      await checkpoint({ player: { x: 1250, y: 220 } });
      await page.keyboard.down("ArrowRight");
      await has("#location", "Öreg erdő");
      await page.keyboard.up("ArrowRight");
      await page.keyboard.down("ArrowLeft");
      await has("#location", "Faluszéli rét");
      await page.keyboard.up("ArrowLeft");
      await checkpoint({ player: { x: 750, y: 188, dx: 1, dy: 0 } });
      await page.keyboard.down(" ");
      await has("#gold", "23", 10000);
      await page.keyboard.up(" ");
      await has("#xp", "8 / 20 TP");
      await checkpoint({ player: { x: 264, y: 210, hp: 1 } });
      await key("q");
      await has("#health", "♥♥♥♥♥");
      assert.equal(await text("#potions"), "1");
      await checkpoint({ player: { x: 920, y: 284, hp: 1 } });
      await has("#dialog-title", "A lovag elesett");
      await key("Escape");
      assert.equal(await page.$eval("#dialog", (e) => e.open), true);
      await choice("Vissza");
      await has("#location", "Smaragdvölgy falu");
      assert.equal(await text("#gold"), "18");
    },
  );
  await scenario(
    "full rescue quest, modest reward sword, level up, boss combat and permanent gate unlock",
    async () => {
      await checkpoint({ player: { x: 1780, y: 72 } });
      await interact("Északi kapu");
      await has("#dialog-text", "lezárják");
      await close();
      await checkpoint({ player: { x: 544, y: 293 } });
      await interact("Márton");
      await choice("Elvállalom");
      await has("#quest", "Dénest");
      await checkpoint({ player: { x: 1518, y: 320 } });
      await interact("Dénes");
      await choice("Kiszabadítom");
      await checkpoint({ player: { x: 544, y: 293 } });
      await interact("Márton");
      await choice("Jutalom");
      await has("#weapon", "Erdőjáró pengéje");
      await close();
      await has("#level", "2. SZINT");
      await checkpoint({ player: { x: 1738, y: 131, hp: 6, dx: 1, dy: 0 } });
      await page.keyboard.down(" ");
      await has("#dialog-title", "Smaragdvölgy fellélegezhet", 16000);
      await page.keyboard.up(" ");
      await close();
      await checkpoint({ player: { x: 1780, y: 72 } });
      await interact("Északi kapu");
      await has("#dialog-text", "még nem járható");
      await close();
      await click("#save");
      await page.reload();
      await click("#load-start");
      await has("#quest", "kapu nyitva");
    },
  );
  await scenario(
    "cabin transitions, journal, manual cabinet inspection/move, cellar puzzle and one-time treasure",
    async () => {
      await checkpoint({ player: { x: 1420, y: 160 } });
      await key("e");
      await has("#location", "Elhagyott kunyhó");
      await checkpoint({ player: { x: 211, y: 195 } });
      await interact("Megkopott napló");
      await has("#dialog-text", "szekrény");
      await close();
      await checkpoint({ player: { x: 433, y: 149 } });
      await interact("Poros szekrény");
      assert.equal((await page.$$("#dialog-choices button")).length, 0);
      await close();
      await key("e");
      await choice("Félretolom");
      await choice("Lemegyek");
      await has("#location", "Rejtett pince");
      await checkpoint({ player: { x: 136, y: 280 } });
      await interact("Kőbe vésett");
      await has("#dialog-text", "keleten");
      await close();
      await checkpoint({ player: { x: 320, y: 115 } });
      await interact("Régi láda");
      await has("#dialog-text", "zárták");
      await close();
      await checkpoint({ player: { x: 211, y: 195 } });
      await interact("Rúnakő");
      await has("#dialog-text", "kialszanak");
      await close();
      for (const x of [429, 320, 211]) {
        await checkpoint({ player: { x, y: 195 } });
        await interact("Rúnakő");
        await close();
      }
      await checkpoint({ player: { x: 320, y: 115 } });
      await interact("A kertész emléke");
      assert.equal(await text("#gold"), "33");
      assert.equal(
        await page.$eval("#health", (e) => e.getAttribute("aria-label")),
        "Életerő: 6/6",
      );
      await close();
      await key("e");
      await has("#dialog-text", "üres");
      await close();
      await click("#save");
      await page.reload();
      await click("#load-start");
      await has("#location", "Rejtett pince");
      await checkpoint({ player: { x: 320, y: 295 } });
      await key("e");
      await has("#location", "Elhagyott kunyhó");
      await checkpoint({ player: { x: 320, y: 301 } });
      await key("e");
      await has("#location", "Öreg erdő");
    },
  );
  await scenario(
    "distinct synthesized music, audio toggle, malformed save, restart confirmation and mobile layout",
    async () => {
      await click("#sound");
      await page.waitForFunction(() => window.__tones.includes(392));
      await checkpoint({ player: { x: 1450, y: 220 } });
      await page.evaluate(() => {
        window.__tones = [];
      });
      await page.waitForFunction(() => window.__tones.includes(220));
      await click("#sound");
      assert.equal(
        await page.$eval("#sound", (e) => e.getAttribute("aria-pressed")),
        "false",
      );
      await page.evaluate(
        (key) => localStorage.setItem(key, "invalid JSON"),
        SAVE_KEY,
      );
      await click("#load");
      await has("#status", "sérült");
      await click("#restart");
      await has("#dialog-title", "Új kaland?");
      await close();
      await click("#restart");
      await choice("Igen, új játék");
      await has("#gold", "18");
      await page.setViewport({ width: 390, height: 844 });
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
      );
      await page.screenshot({
        path: "test-results/smaragdvolgy-firefox-mobile.png",
        fullPage: true,
      });
    },
  );
  assert.deepEqual(errors, []);
  assert.deepEqual(external, []);
  console.log(
    `${passed}/5 scenarios passed on ${await browser.version()}; no JavaScript errors or external asset requests.`,
  );
} finally {
  await browser.close();
}
