import { WORLD, BUILDINGS, NPCS, HERBS, OBJECTS } from "./world.js";
export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.camera = 0;
  }
  rect(x, y, w, h, c) {
    this.ctx.fillStyle = c;
    this.ctx.fillRect(Math.round(x), Math.round(y), w, h);
  }
  text(text, x, y, color = "#e6e6c6", size = 10) {
    const c = this.ctx;
    c.font = `${size}px monospace`;
    c.textAlign = "center";
    c.fillStyle = "#12251c";
    c.fillText(text, Math.round(x) + 1, Math.round(y) + 1);
    c.fillStyle = color;
    c.fillText(text, Math.round(x), Math.round(y));
  }
  tree(x, y) {
    this.rect(x - 5, y + 8, 10, 20, "#685037");
    this.rect(x - 22, y - 4, 44, 16, "#182e23");
    this.rect(x - 18, y - 20, 36, 24, "#254d32");
    this.rect(x - 12, y - 29, 24, 22, "#35643b");
    this.rect(x - 7, y - 28, 11, 5, "#4d7d46");
    this.rect(x - 23, y + 6, 46, 5, "#162c22");
  }
  knight(x, y, t, moving) {
    // Original game's knight sprite, with a two-frame walking animation.
    const r = this.rect.bind(this),
      step = moving ? Math.sin(t * 17) * 2 : 0;
    x = Math.round(x);
    y = Math.round(y);
    r(x - 10, y + 11, 22, 5, "#182b25");
    r(x - 7, y - 1, 14, 17, "#6f8c9a");
    r(x - 8, y + 9 + step, 6, 8, "#a3b6b0");
    r(x + 3, y + 9 - step, 6, 8, "#a3b6b0");
    r(x - 9, y - 15, 18, 17, "#c1d4ca");
    r(x - 6, y - 18, 12, 4, "#e1e6cc");
    r(x - 7, y - 8, 14, 5, "#354953");
    r(x - 5, y - 7, 3, 2, "#a3d9c4");
    r(x + 3, y - 7, 3, 2, "#a3d9c4");
    r(x - 13, y, 7, 12, "#708dba");
    r(x - 12, y + 2, 4, 7, "#9aafc5");
    r(x + 9, y - 7, 3, 18, "#d5decd");
    r(x + 6, y + 5, 9, 3, "#d4b674");
    r(x - 2, y - 20, 4, 5, "#dc7865");
  }
  npc(n, t) {
    const r = this.rect.bind(this),
      y = n.y + Math.sin(t * 2 + n.x) * 0.6;
    r(n.x - 10, n.y + 12, 20, 4, "#1d3526");
    r(n.x - 7, y - 2, 14, 15, n.color);
    r(n.x - 7, y + 11, 5, 6, "#534936");
    r(n.x + 2, y + 11, 5, 6, "#534936");
    r(n.x - 6, y - 14, 12, 12, "#d8ad83");
    r(n.x - 7, y - 17, 14, 5, n.id === "elder" ? "#b8bca5" : "#69523c");
    r(n.x - 3, y - 9, 2, 2, "#27352a");
    r(n.x + 3, y - 9, 2, 2, "#27352a");
    if (n.id === "elder") r(n.x - 4, y - 3, 9, 6, "#d1d1b7");
    this.text(n.name.split(",")[0], n.x, n.y + 30, "#d3d8b9", 9);
  }
  enemy(e, t) {
    const r = this.rect.bind(this),
      x = e.x,
      y = e.y + Math.sin(t * 5 + e.x) * 2,
      c = e.flash > 0 ? "#fff0c0" : e.color;
    r(x - 14, e.y + 13, 28, 5, "#182b25");
    if (e.id.startsWith("slime")) {
      r(x - 13, y - 3, 26, 15, c);
      r(x - 9, y - 9, 18, 10, c);
      r(x - 8, y + 10, 6, 4, "#6e8a52");
      r(x + 4, y + 10, 6, 4, "#6e8a52");
      r(x - 7, y - 2, 3, 3, "#273b2b");
      r(x + 5, y - 2, 3, 3, "#273b2b");
      r(x - 7, y - 7, 7, 2, "#d0dda1");
    } else {
      const scale = e.boss ? 1.4 : 1;
      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.scale(scale, scale);
      r(-12, -9, 24, 22, c);
      r(-8, -16, 17, 8, c);
      r(-17, -7, 6, 15, "#77588e");
      r(12, -7, 6, 15, "#77588e");
      r(-10, 10, 7, 8, "#594665");
      r(4, 10, 7, 8, "#594665");
      r(-8, -8, 5, 4, "#f3c471");
      r(4, -8, 5, 4, "#f3c471");
      r(-3, 2, 7, 4, "#49344f");
      r(-13, -19, 5, 10, "#c7bba0");
      r(8, -19, 5, 10, "#c7bba0");
      if (e.boss) {
        r(-19, -27, 5, 19, "#76654d");
        r(14, -27, 5, 19, "#76654d");
        r(-24, -24, 8, 4, "#9b9d62");
        r(17, -24, 8, 4, "#9b9d62");
      }
      this.ctx.restore();
    }
    r(x - 16, y - (e.boss ? 44 : 25), 32, 3, "#283024");
    r(x - 16, y - (e.boss ? 44 : 25), (32 * e.hp) / e.maxHp, 3, "#dc9685");
    if (e.boss) this.text("TÖVISÚR", x, y - 50, "#e3b29a", 9);
  }
  building(b) {
    const r = this.rect.bind(this),
      { x, y, w, h } = b;
    r(x - 4, y + 8, w + 9, h, "#1e3528");
    r(x, y + 15, w, h - 15, "#b3aa7a");
    r(x + 4, y + 20, w - 8, h - 22, "#a9a078");
    for (let i = 9; i < w; i += 20) r(x + i, y + 20, 3, h - 24, "#7a7355");
    r(x - 7, y, w + 14, 21, b.roof);
    r(x + 4, y - 9, w - 8, 12, b.roof);
    r(x + 15, y - 17, w - 30, 10, b.roof);
    for (let i = 0; i < 4; i++) r(x - 4, y + i * 5, w + 8, 1, "#b39b7555");
    r(x + w / 2 - 10, y + h - 27, 20, 27, "#4d4938");
    r(x + w / 2 + 4, y + h - 15, 2, 3, "#d8ba7a");
    r(x + 13, y + 32, 17, 16, "#425d54");
    r(x + 15, y + 34, 13, 4, "#b9c7a0");
    r(x + w - 31, y + 32, 17, 16, "#425d54");
    if (b.id === "smith") {
      r(x + w - 22, y - 22, 14, 26, "#666e62");
      r(x + w - 18, y - 30 + Math.sin(Date.now() / 1000) * 2, 8, 8, "#89937b");
      r(x + 64, y + h + 6, 21, 7, "#4f5d58");
      r(x + 70, y + h + 13, 8, 8, "#536257");
    }
    this.text(b.name, x + w / 2, y + h + 13, "#ded5aa", 9);
  }
  world(game) {
    const s = game.state,
      r = this.rect.bind(this),
      c = this.ctx;
    for (let y = 0; y < 384; y += 16)
      for (let x = 0; x < WORLD.width; x += 16) {
        const n = (x * 17 + y * 31) % 113;
        const forest = x >= 1280;
        r(
          x,
          y,
          16,
          16,
          forest
            ? n < 45
              ? "#284d35"
              : "#2b5036"
            : x < 640
              ? n < 45
                ? "#43653b"
                : "#3d6038"
              : n < 45
                ? "#527642"
                : "#4a6d3c",
        );
        if (n < 35) {
          r(x + 4, y + 7, 2, 3, forest ? "#466344" : "#739054");
          r(x + 8, y + 6, 2, 4, "#5e8347");
        }
      }
    r(35, 196, 1848, 49, "#8a8960");
    r(242, 54, 47, 289, "#8a8960");
    r(1762, 54, 36, 180, "#7c8156");
    r(1405, 138, 30, 90, "#7c8156");
    for (let i = 0; i < 200; i++) {
      let x = 40 + ((i * 97) % 1830),
        y = 201 + ((i * 13) % 39);
      r(x, y, 8, 2, i % 2 ? "#a19b70" : "#777e53");
    }
    // Village plaza, well, market and a stack of firewood.
    r(227, 182, 72, 70, "#9a956a");
    r(216, 103, 39, 28, "#75816c");
    r(220, 107, 31, 18, "#304c49");
    r(213, 98, 45, 7, "#b0b28d");
    r(318, 183, 43, 16, "#b4a176");
    r(315, 169, 49, 12, "#be8f5f");
    for (let x = 318; x < 360; x += 12) r(x, 169, 6, 12, "#e0c48c");
    r(320, 181, 3, 21, "#65573c");
    r(354, 181, 3, 21, "#65573c");
    for (let i = 0; i < 5; i++) {
      r(530 + i * 8, 306, 7, 16, "#80684a");
      r(531 + i * 8, 307, 5, 4, "#b99a68");
    }
    for (let x = 32; x < 1890; x += 32) {
      if (x > 1738 && x < 1820) continue;
      this.tree(x, 33);
      this.tree(x + 4, 366);
    }
    [
      [32, 95],
      [33, 155],
      [32, 298],
      [604, 104],
      [606, 319],
      [693, 65],
      [753, 331],
      [970, 67],
      [1105, 333],
      [1217, 73],
      [1298, 99],
      [1313, 333],
      [1513, 64],
      [1566, 335],
      [1634, 77],
      [1692, 320],
      [1858, 86],
      [1863, 292],
    ].forEach((p) => this.tree(...p));
    BUILDINGS.forEach((b) => this.building(b));
    // Northern gate has no traversable world beyond it yet.
    r(1736, 28, 13, 48, "#84917a");
    r(1810, 28, 13, 48, "#84917a");
    r(1745, 24, 69, 9, "#a3a88b");
    if (!s.flags.boss) {
      for (let x = 1752; x < 1810; x += 10) r(x, 35, 4, 32, "#697c5a");
      r(1749, 47, 65, 5, "#756846");
    }
    this.text(
      s.flags.boss ? "ÉSZAKI KAPU · NYITVA" : "ÉSZAKI KAPU",
      1780,
      20,
      "#c5cba8",
      8,
    );
    r(610, 182, 5, 20, "#6d5436");
    r(591, 176, 44, 12, "#b4a273");
    this.text("ERDŐ →", 613, 185, "#3d4d31", 7);
    // Flowers and collectibles are deterministic, never block navigation.
    for (let i = 0; i < 58; i++) {
      let x = 660 + ((i * 71) % 598),
        y = 67 + ((i * 97) % 270);
      if (y > 181 && y < 256) continue;
      r(x, y, 2, 5, "#83a356");
      r(x - 2, y - 2, 5, 3, i % 3 ? "#e1c68c" : "#bda8ce");
    }
    HERBS.filter((h) => !s.collected.includes(h.id)).forEach((h) => {
      r(h.x - 1, h.y - 8, 3, 14, "#d3cb79");
      r(h.x - 6, h.y - 5, 6, 4, "#a8d780");
      r(h.x + 1, h.y - 10, 6, 4, "#bee697");
    });
    const actors = [
      ...NPCS.filter((n) => n.id !== "missing" || !s.flags.rescued).map(
        (n) => ({ y: n.y, draw: () => this.npc(n, game.time) }),
      ),
      ...s.enemies
        .filter((e) => e.hp > 0)
        .map((e) => ({ y: e.y, draw: () => this.enemy(e, game.time) })),
      { y: s.player.y, draw: () => this.player(game) },
    ];
    actors.sort((a, b) => a.y - b.y).forEach((a) => a.draw());
    c.fillStyle = "#18312844";
    c.fillRect(1280, 0, 640, 384);
  }
  interior(game) {
    const s = game.state,
      r = this.rect.bind(this),
      c = this.ctx,
      cellar = s.scene === "cellar";
    r(0, 0, 640, 384, "#111f1b");
    r(94, 45, 452, 304, cellar ? "#4d5751" : "#655b43");
    r(102, 54, 436, 284, cellar ? "#73756a" : "#8c7958");
    for (let y = 58; y < 338; y += 20)
      for (let x = 106; x < 534; x += 32) {
        r(x, y, 30, 18, cellar ? (x % 3 ? "#666b60" : "#75796a") : "#95825f");
        r(x + 3, y + 3, 22, 1, cellar ? "#858878" : "#ae966d");
      }
    r(94, 44, 452, 26, cellar ? "#4a5750" : "#5a503d");
    r(94, 70, 11, 268, "#3b4034");
    r(535, 70, 11, 268, "#3b4034");
    r(105, 337, 195, 10, "#3b4034");
    r(340, 337, 195, 10, "#3b4034");
    if (!cellar) {
      r(154, 134, 77, 49, "#66503a");
      r(158, 136, 69, 8, "#b3a072");
      r(200, 152, 24, 17, "#d0c49a");
      r(211, 152, 1, 17, "#796548");
      r(204, 157, 5, 1, "#796548");
      r(215, 159, 6, 1, "#796548");
      this.text("Napló", 211, 127, "#d6c9a0", 9);
      r(126, 232, 81, 40, "#5b4c3e");
      r(129, 233, 74, 32, "#728064");
      r(133, 236, 15, 26, "#bcba94");
      if (s.flags.cupboard) {
        r(414, 91, 37, 39, "#202b27");
        for (let i = 0; i < 5; i++) r(416, 96 + i * 6, 32, 3, "#647261");
      }
      const cx = s.flags.cupboard ? 478 : 414;
      r(cx, 78, 39, 55, "#514530");
      r(cx + 3, 81, 33, 48, "#8c704b");
      r(cx + 18, 82, 2, 46, "#574833");
      r(cx + 14, 106, 3, 3, "#d6ba75");
      r(cx + 23, 106, 3, 3, "#d6ba75");
      this.text("Elhagyott kunyhó", 320, 27, "#c6c5a5", 11);
      this.text("Kijárat", 320, 364, "#c6c5a5", 10);
    } else {
      this.text("A kertész pincéje", 320, 27, "#c6c5a5", 11);
      OBJECTS.cellar
        .filter((o) => o.id.startsWith("rune"))
        .forEach((o, i) => {
          r(o.x - 15, o.y - 19, 30, 33, "#444f49");
          r(o.x - 12, o.y - 17, 24, 27, s.runes[i] ? "#8aaa78" : "#7b8270");
          this.text(
            ["NY", "D", "K"][i],
            o.x,
            o.y + 1,
            s.runes[i] ? "#edecb7" : "#c0c2a4",
            11,
          );
        });
      r(302, 77, 36, 24, s.flags.amulet ? "#4f503b" : "#a18b54");
      r(302, 85, 36, 3, "#584c31");
      r(318, 84, 5, 9, "#d4bb75");
      r(119, 231, 33, 25, "#92947b");
      r(124, 237, 22, 2, "#4b5e4b");
      r(124, 244, 22, 2, "#4b5e4b");
      this.text("Felirat", 136, 274, "#c4c5a8", 9);
      for (let i = 0; i < 4; i++) r(302, 309 + i * 7, 36, 4, "#acaa8c");
      this.text("Lépcső felfelé", 320, 365, "#c6c5a5", 10);
    }
    [
      [122, 90],
      [516, 90],
    ].forEach(([x, y]) => {
      r(x - 3, y, 6, 17, "#786140");
      r(x - 4, y - 5, 8, 10, "#e5ad56");
      r(x - 2, y - 5 + Math.sin(game.time * 10), 4, 6, "#fff0a9");
    });
    this.player(game);
    c.fillStyle = "#13211d18";
    c.fillRect(0, 0, 640, 384);
  }
  player(game) {
    const p = game.state.player,
      c = this.ctx;
    if (game.invincible <= 0 || Math.floor(game.time * 13) % 2 === 0)
      this.knight(p.x, p.y, game.time, game.keys.size > 0 && !game.dialog);
    if (game.swing > 0) {
      const a = Math.atan2(p.dy, p.dx);
      c.strokeStyle = "#f2e6b2";
      c.lineWidth = 5;
      c.beginPath();
      c.arc(p.x, p.y, 35, a - 0.95, a + 0.95);
      c.stroke();
      c.strokeStyle = "#fff6d5";
      c.lineWidth = 2;
      c.beginPath();
      c.arc(p.x, p.y, 41, a - 0.65, a + 0.65);
      c.stroke();
    }
  }
  draw(game) {
    const c = this.ctx,
      s = game.state;
    this.camera =
      s.scene === "world"
        ? Math.max(0, Math.min(WORLD.width - 640, s.player.x - 320))
        : 0;
    c.save();
    c.translate(-Math.round(this.camera), 0);
    if (s.scene === "world") this.world(game);
    else this.interior(game);
    const near = game.nearby();
    if (game.started && !game.dialog && !game.dead && near)
      this.text(`E · ${near.name}`, s.player.x, s.player.y - 36, "#fff0b5", 10);
    c.restore();
    const shade = c.createRadialGradient(320, 205, 150, 320, 205, 390);
    shade.addColorStop(0, "#061c0b00");
    shade.addColorStop(1, "#061c0b60");
    c.fillStyle = shade;
    c.fillRect(0, 0, 640, 384);
  }
}
