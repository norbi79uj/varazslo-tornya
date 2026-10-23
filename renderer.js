import {
  WORLD,
  BUILDINGS,
  NPCS,
  HERBS,
  OBJECTS,
  DECOR,
  STREAM,
} from "./world.js";
import { ATLAS, PALETTE } from "./assets/atlas.js";
export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.camera = 0;
    this.cameraY = 0;
    this.image = new Image();
    this.ready = new Promise((resolve, reject) => {
      this.image.onload = resolve;
      this.image.onerror = () =>
        reject(
          Error(
            "A helyi pixelgrafika nem tölthető be: assets/smaragd-atlas.png",
          ),
        );
    });
    this.image.src = new URL(
      "./assets/smaragd-atlas.png",
      import.meta.url,
    ).href;
  }
  rect(x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(Math.round(x), Math.round(y), w, h);
  }
  sprite(name, x, y, w, h, flip = false) {
    const a = ATLAS[name];
    if (!a) throw Error(`Unknown sprite: ${name}`);
    const c = this.ctx;
    w ??= a.w;
    h ??= a.h;
    x = Math.round(x);
    y = Math.round(y);
    if (flip) {
      c.save();
      c.translate(x + w, y);
      c.scale(-1, 1);
      c.drawImage(this.image, a.x, a.y, a.w, a.h, 0, 0, w, h);
      c.restore();
    } else c.drawImage(this.image, a.x, a.y, a.w, a.h, x, y, w, h);
  }
  text(text, x, y, color = "#e6e6c6", size = 10) {
    const c = this.ctx;
    c.font = `${size}px monospace`;
    c.textAlign = "center";
    c.fillStyle = PALETTE.ink;
    c.fillText(text, Math.round(x) + 1, Math.round(y) + 1);
    c.fillStyle = color;
    c.fillText(text, Math.round(x), Math.round(y));
  }
  tree(x, y, type = "oak") {
    this.sprite(type, x - 24, y - 48);
  }
  building(b) {
    const types = {
      smith: 3,
      inn: 0,
      shop: 4,
      cabin: 2,
      house: 0,
      house2: 1,
      house3: 2,
      house4: 4,
      house5: 5,
      house6: 6,
    };
    this.sprite(`house${types[b.id]}`, b.x + b.w / 2 - 56, b.y + b.h - 105);
    this.text(b.name, b.x + b.w / 2, b.y + b.h + 13, "#f0dfab", 9);
  }
  person(n, time) {
    const frame = Math.floor(time * 1.5 + n.x) % 3;
    this.sprite(`${n.id}${frame}`, n.x - 12, n.y - 17);
    this.text(n.name.split(",")[0], n.x, n.y + 29, "#e4ddb7", 9);
  }
  player(game) {
    const p = game.state.player,
      c = this.ctx,
      moving = [
        "w",
        "a",
        "s",
        "d",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
      ].some((k) => game.keys.has(k));
    const frame =
      moving && !game.dialog ? [0, 1, 0, 2][Math.floor(game.time * 9) % 4] : 0;
    if (game.invincible <= 0 || Math.floor(game.time * 13) % 2 === 0)
      this.sprite(`hero${frame}`, p.x - 12, p.y - 17, 24, 32, p.dx < 0);
    if (game.swing > 0) {
      const a = Math.atan2(p.dy, p.dx);
      c.strokeStyle = PALETTE.cream;
      c.lineWidth = 3;
      c.beginPath();
      c.arc(p.x, p.y, 35, a - 0.95, a + 0.95);
      c.stroke();
      c.strokeStyle = PALETTE.shine;
      c.lineWidth = 1;
      c.beginPath();
      c.arc(p.x, p.y, 41, a - 0.65, a + 0.65);
      c.stroke();
    }
  }
  enemy(e, time) {
    const frame = Math.floor(time * 7) % 3,
      name = e.boss ? "boss" : e.id.startsWith("slime") ? "slime" : "wolf",
      size = e.boss ? 48 : 32,
      c = this.ctx;
    c.save();
    if (e.flash > 0) c.globalAlpha = 0.45;
    this.sprite(`${name}${frame}`, e.x - size / 2, e.y - size + 17);
    c.restore();
    this.rect(e.x - 16, e.y - size + 9, 32, 3, PALETTE.ink);
    this.rect(e.x - 16, e.y - size + 9, (32 * e.hp) / e.maxHp, 3, PALETTE.red);
    if (e.boss) this.text("TÖVISÚR", e.x, e.y - 41, PALETTE.cream, 9);
  }
  tile(name, x, y) {
    this.sprite(name, x, y);
  }
  path(x, y) {
    return (
      (y >= 192 && y < 256) ||
      (x >= 240 && x < 288 && y >= 48 && y < 608) ||
      (y >= 464 && y < 512 && x < 624) ||
      (x >= 1760 && x < 1808 && y < 240) ||
      (x >= 1408 && x < 1440 && y < 224)
    );
  }
  world(game) {
    const s = game.state,
      t = game.time,
      c = this.ctx;
    const sx = Math.max(0, Math.floor(this.camera / 16) * 16),
      ex = Math.min(WORLD.width, this.camera + 656),
      sy = Math.max(0, Math.floor(this.cameraY / 16) * 16),
      ey = Math.min(WORLD.height, this.cameraY + 400);
    for (let y = sy; y < ey; y += 16)
      for (let x = sx; x < ex; x += 16) {
        const i = (x / 16 + (y / 16) * 3) % 4,
          water = x >= STREAM.x && x < STREAM.x + STREAM.w;
        let tile = (x >= 1280 ? "forest" : "grass") + i;
        if (this.path(x, y)) tile = "path" + (i % 3);
        if (water)
          tile =
            y >= STREAM.bridgeY && y < STREAM.bridgeY + STREAM.bridgeH
              ? "bridge"
              : "water" + (Math.floor(t * 3) % 4);
        this.tile(tile, x, y);
        if (
          !water &&
          !this.path(x, y) &&
          ((x / 16) * 11 + (y / 16) * 7) % 53 === 0 &&
          y > 50
        )
          this.sprite("flowers", x, y);
      }
    // Pixel banks and bridge handrails match the collision corridor exactly.
    for (let y = sy; y < ey; y += 16) {
      if (y >= 192 && y < 256) continue;
      this.sprite("bank", STREAM.x - 16, y);
      this.sprite("bank", STREAM.x + STREAM.w, y, 16, 16, true);
    }
    for (let x = STREAM.x - 16; x < STREAM.x + STREAM.w + 16; x += 32) {
      this.sprite("fence", x, 180);
      this.sprite("fence", x, 245);
    }
    this.sprite("well", 211, 88);
    this.sprite("table", 309, 164);
    this.sprite("barrel", 355, 171);
    // Small gardens, carved fences and animated lanterns.
    for (const y of [367, 577])
      for (let x = 48; x < 200; x += 32) this.sprite("fence", x, y);
    for (const x of [64, 96, 128, 160])
      for (const y of [403, 419, 548, 564]) this.sprite("flowers", x, y);
    for (const [x, y] of [
      [207, 165],
      [472, 169],
      [258, 396],
      [597, 208],
      [1410, 155],
    ]) {
      this.sprite("lamp", x, y - 30);
      c.globalAlpha = 0.1 + Math.sin(t * 4 + x) * 0.03;
      this.rect(x + 3, y - 25, 10, 8, PALETTE.cream);
      c.globalAlpha = 1;
    }
    HERBS.filter((h) => !s.collected.includes(h.id)).forEach((h) =>
      this.sprite("herb", h.x - 8, h.y - 15),
    );
    const layers = [];
    for (let x = 24; x < WORLD.width; x += 38) {
      if (x < 1735 || x > 1825)
        layers.push({
          y: 49,
          draw: () => this.tree(x, 49, x >= 1280 ? "pine" : "oak"),
        });
      layers.push({
        y: WORLD.height + 16,
        draw: () => this.tree(x, WORLD.height + 16, x >= 1280 ? "pine" : "oak"),
      });
    }
    for (const d of DECOR)
      layers.push({
        y: d.y,
        draw: () =>
          this.sprite(
            d.type,
            d.x - ATLAS[d.type].w / 2,
            d.y - ATLAS[d.type].h + 15,
          ),
      });
    BUILDINGS.forEach((b) =>
      layers.push({ y: b.y + b.h, draw: () => this.building(b) }),
    );
    NPCS.filter(
      (n) =>
        (n.scene || "world") === "world" &&
        (n.id !== "missing" || !s.flags.rescued),
    ).forEach((n) => layers.push({ y: n.y, draw: () => this.person(n, t) }));
    s.enemies
      .filter((e) => e.hp > 0)
      .forEach((e) => layers.push({ y: e.y, draw: () => this.enemy(e, t) }));
    layers.push({ y: s.player.y, draw: () => this.player(game) });
    layers.sort((a, b) => a.y - b.y).forEach((a) => a.draw());
    // The open gate leads only to the end-of-chapter threshold, never a fake new map.
    for (const x of [1736, 1811])
      for (let y = 28; y < 76; y += 16) this.tile("stoneFloor", x, y);
    if (!s.flags.boss)
      for (let x = 1748; x < 1812; x += 32) this.sprite("fence", x, 33);
    this.text(
      s.flags.boss ? "ÉSZAKI KAPU · NYITVA" : "ÉSZAKI KAPU",
      1780,
      20,
      PALETTE.cream,
      8,
    );
    this.sprite("fence", 596, 172);
    this.text("ERDŐ →", 613, 180, PALETTE.cream, 8);
  }
  interior(game) {
    const s = game.state,
      c = this.ctx,
      cellar = s.scene === "cellar";
    this.rect(0, 0, 640, 384, PALETTE.ink);
    for (let y = 48; y < 352; y += 16)
      for (let x = 96; x < 544; x += 16)
        this.tile(
          y < 80 || x < 112 || x >= 528 || y >= 336
            ? "stoneFloor"
            : cellar
              ? "stoneFloor"
              : "floor",
          x,
          y,
        );
    // The doorway is the one gap in the southern wall.
    this.tile("floor", 304, 336);
    this.tile("floor", 320, 336);
    if (s.scene === "cabin") {
      this.sprite("table", 160, 141);
      this.text("Napló", 211, 130, PALETTE.cream, 9);
      this.sprite("bed", 129, 235);
      if (s.flags.cupboard) this.sprite("stairs", 417, 93);
      this.sprite("wardrobe", s.flags.cupboard ? 477 : 414, 72);
    } else if (cellar) {
      OBJECTS.cellar
        .filter((o) => o.id.startsWith("rune"))
        .forEach((o, i) => {
          this.sprite("rock", o.x - 20, o.y - 19);
          this.text(
            ["NY", "D", "K"][i],
            o.x,
            o.y + 1,
            s.runes[i] ? PALETTE.cream : PALETTE.ink,
            11,
          );
          if (s.runes[i]) this.rect(o.x - 6, o.y - 10, 12, 2, PALETTE.light);
        });
      if (!s.flags.amulet) this.sprite("chest", 304, 74);
      this.sprite("stairs", 304, 304);
      this.sprite("table", 111, 227, 48, 30);
      this.text("Felirat", 136, 274, PALETTE.cream, 9);
    } else if (s.scene === "smithy") {
      this.sprite("anvil", 209, 143);
      this.sprite("table", 370, 122);
      this.sprite("barrel", 135, 105);
      this.sprite("barrel", 164, 105);
      this.sprite("chest", 443, 93);
    } else if (s.scene === "inn") {
      this.sprite("bed", 130, 95);
      this.sprite("bed", 130, 146);
      this.sprite("table", 380, 127);
      this.sprite("table", 215, 227);
      this.sprite("barrel", 471, 112);
    } else if (s.scene === "shop") {
      this.sprite("table", 288, 128);
      this.sprite("chest", 135, 100);
      this.sprite("barrel", 177, 92);
      this.sprite("barrel", 445, 92);
      this.sprite("wardrobe", 465, 72);
    } else {
      this.sprite("bed", 130, 100);
      this.sprite("table", 343, 136);
      this.sprite("wardrobe", 466, 75);
      this.sprite("barrel", 139, 241);
    }
    for (const [x, y] of [
      [122, 100],
      [512, 100],
    ]) {
      this.sprite("lamp", x - 8, y - 28);
      c.globalAlpha = 0.12 + Math.sin(game.time * 5 + x) * 0.04;
      this.rect(x - 5, y - 24, 10, 12, PALETTE.cream);
      c.globalAlpha = 1;
    }
    const people = NPCS.filter((n) => n.scene === s.scene);
    people.sort((a, b) => a.y - b.y).forEach((n) => this.person(n, game.time));
    this.player(game);
    this.text(game.zone, 320, 27, PALETTE.cream, 11);
    this.text("E · Kijárat", 320, 365, PALETTE.cream, 10);
  }
  draw(game) {
    const c = this.ctx,
      s = game.state;
    this.camera =
      s.scene === "world"
        ? Math.max(0, Math.min(WORLD.width - 640, s.player.x - 320))
        : 0;
    this.cameraY =
      s.scene === "world"
        ? Math.max(0, Math.min(WORLD.height - 384, s.player.y - 192))
        : 0;
    c.save();
    c.translate(-Math.round(this.camera), -Math.round(this.cameraY));
    if (s.scene === "world") this.world(game);
    else this.interior(game);
    const near = game.nearby();
    if (game.started && !game.dialog && !game.dead && near)
      this.text(
        `E · ${near.name}`,
        s.player.x,
        s.player.y - 35,
        PALETTE.cream,
        10,
      );
    c.restore();
  }
}
