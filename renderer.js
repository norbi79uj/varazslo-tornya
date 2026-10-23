import {
  WORLD,
  BUILDINGS,
  NPCS,
  HERBS,
  OBJECTS,
  DECOR,
  STREAM,
} from "./world.js";
import {
  ENVIRONMENT_SHEETS,
  ENVIRONMENT_SPRITES,
  KENNEY_COLORS as PALETTE,
  drawEnvironmentSprite,
} from "./assets/kenney/environment.js";
import {
  CHARACTER_SHEET,
  drawKenneyActor,
} from "./assets/kenney/characters/profiles.js";
export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.camera = 0;
    this.cameraY = 0;
    const load = (url) => {
      const image = new Image();
      const ready = new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = () =>
          reject(
            Error(
              `A helyi pixelgrafika nem tölthető be: ${new URL(url).pathname}`,
            ),
          );
      });
      image.src = url;
      return { image, ready };
    };
    this.textures = {};
    const pending = Object.entries(ENVIRONMENT_SHEETS).map(
      ([pack, definition]) => {
        const texture = load(definition.url);
        this.textures[pack] = texture.image;
        return texture.ready;
      },
    );
    const characters = load(CHARACTER_SHEET.url);
    this.characters = characters.image;
    this.ready = Promise.all([...pending, characters.ready]);
  }
  rect(x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(Math.round(x), Math.round(y), w, h);
  }
  sprite(name, x, y, flip = false) {
    drawEnvironmentSprite(this.ctx, this.textures, name, x, y, { flip });
  }
  // Repetition is clipped to the old gameplay footprint; source pixels remain 2x.
  texture(name, x, y, w, h) {
    const c = this.ctx,
      a = ENVIRONMENT_SPRITES[name];
    c.save();
    c.beginPath();
    c.rect(Math.round(x), Math.round(y), w, h);
    c.clip();
    const sx = Math.floor(x / a.w) * a.w,
      sy = Math.floor(y / a.h) * a.h;
    for (let yy = sy; yy < y + h; yy += a.h)
      for (let xx = sx; xx < x + w; xx += a.w) this.sprite(name, xx, yy);
    c.restore();
  }
  roofStrip(left, right, x, y, width) {
    this.sprite(left, x, y);
    this.sprite(right, x + width - 32, y);
    // Extend the opaque inner edge between the sloped ends without rescaling art.
    const layer = ENVIRONMENT_SPRITES[left].layers[0],
      image = this.textures[layer.pack];
    for (let xx = x + 32; xx < x + width - 32; xx += 2)
      this.ctx.drawImage(
        image,
        layer.column * 17 + 15,
        layer.row * 17,
        1,
        16,
        xx,
        y,
        2,
        32,
      );
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
    this.sprite(type, x - 16, y - 48);
  }
  building(b) {
    const c = this.ctx,
      ground = b.y + b.h,
      width = Math.ceil(b.w / 2) * 2,
      x = Math.round(b.x),
      theme = {
        smith: ["Stone", "Brown"],
        inn: ["Plaster", "Brown"],
        shop: ["Timber", "Green"],
        cabin: ["Timber", "Brown"],
        house: ["Plaster", "Brown"],
        house2: ["Plaster", "Green"],
        house3: ["Timber", "Brown"],
        house4: ["Stone", "Green"],
        house5: ["Plaster", "Pale"],
        house6: ["Timber", "Green"],
      }[b.id];
    this.texture("wall" + theme[0], x, ground - 64, width, 64);
    this.texture("stoneFloor", x, ground - 8, width, 8);
    this.sprite("door", Math.round(b.x + b.w / 2 - 16), ground - 32);
    if (width >= 96) {
      this.sprite(
        theme[0] === "Stone" ? "windowPale" : "windowBrown",
        x + 4,
        ground - 64,
      );
      this.sprite("windowBrown", x + width - 36, ground - 64);
    } else
      this.sprite("windowBrown", Math.round(x + width / 2 - 16), ground - 64);
    const roofX = x - 8,
      roofW = width + 16;
    this.roofStrip(
      "roof" + theme[1] + "Left",
      "roof" + theme[1] + "Right",
      roofX,
      ground - 128,
      roofW,
    );
    this.roofStrip(
      "eave" + theme[1] + "Left",
      "eave" + theme[1] + "Right",
      roofX,
      ground - 96,
      roofW,
    );
    if (b.id === "smith" || b.id === "inn")
      this.sprite("chimney", x + 8, ground - 144);
    if (b.id === "smith") this.sprite("anvil", x + width - 18, ground + 3);
    this.text(b.name, b.x + b.w / 2, ground + 13, PALETTE.cream, 9);
  }
  person(n, time) {
    const frame = Math.floor(time * 1.5 + n.x) % 3;
    drawKenneyActor(this.ctx, this.characters, n.id, n.x - 16, n.y - 17, {
      frame,
    });
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
      drawKenneyActor(this.ctx, this.characters, "hero", p.x - 16, p.y - 17, {
        frame,
        flip: p.dx < 0,
      });
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
    drawKenneyActor(
      this.ctx,
      this.characters,
      name,
      e.x - size / 2,
      e.y - size + 17,
      { frame, scale: e.boss ? 3 : 2 },
    );
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
    const sx = Math.max(0, Math.floor(this.camera / 32) * 32),
      ex = Math.min(WORLD.width, this.camera + 672),
      sy = Math.max(0, Math.floor(this.cameraY / 32) * 32),
      ey = Math.min(WORLD.height, this.cameraY + 416);
    for (let y = sy; y < ey; y += 32)
      for (let x = sx; x < ex; x += 32) {
        const index = (x / 32 + (y / 32) * 3) % 4;
        this.tile((x >= 1280 ? "forest" : "grass") + index, x, y);
      }
    this.rect(1280, 0, WORLD.width - 1280, WORLD.height, "#203a302b");
    this.texture("path0", 28, 192, WORLD.width - 56, 64);
    this.texture("path0", 240, 48, 48, 560);
    this.texture("path0", 28, 464, 596, 48);
    this.texture("path0", 1760, 48, 48, 192);
    this.texture("path0", 1408, 128, 32, 96);
    // Each bank stays on its original side of the unchanged collision channel.
    c.save();
    c.beginPath();
    c.rect(STREAM.x, 0, STREAM.w, WORLD.height);
    c.clip();
    this.texture(
      "water" + (Math.floor(t * 2) % 2),
      STREAM.x,
      0,
      STREAM.w,
      WORLD.height,
    );
    c.restore();
    for (let y = 0; y < WORLD.height; y += 32) {
      if (y >= STREAM.bridgeY && y < STREAM.bridgeY + STREAM.bridgeH) continue;
      this.sprite("bank", STREAM.x - 18, y, true);
      this.sprite("bank", STREAM.x + STREAM.w - 14, y);
    }
    this.texture(
      "bridge",
      STREAM.x - 16,
      STREAM.bridgeY,
      STREAM.w + 32,
      STREAM.bridgeH,
    );
    for (let x = STREAM.x - 16; x < STREAM.x + STREAM.w + 16; x += 32) {
      this.sprite("fence", x, 180);
      this.sprite("fence", x, 245);
    }
    for (let y = sy; y < ey; y += 32)
      for (let x = sx; x < ex; x += 32)
        if (
          !this.path(x, y) &&
          (x < STREAM.x - 32 || x > STREAM.x + STREAM.w + 32) &&
          ((x / 32) * 11 + (y / 32) * 7) % 37 === 0 &&
          y > 54
        )
          this.sprite("flowers", x, y);
    this.sprite("well", 203, 72);
    this.sprite("table", 309, 164);
    this.sprite("barrel", 355, 171);
    for (const y of [367, 577])
      for (let x = 48; x < 200; x += 32) this.sprite("fence", x, y);
    for (const x of [64, 112, 160])
      for (const y of [403, 548]) this.sprite("flowers", x, y);
    for (const [x, y] of [
      [207, 165],
      [472, 169],
      [258, 396],
      [597, 208],
      [1410, 155],
    ]) {
      this.sprite("lamp", x - 8, y - 24);
    }
    HERBS.filter((h) => !s.collected.includes(h.id)).forEach((h) =>
      this.sprite("herb", h.x - 16, h.y - 17),
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
            d.x - ENVIRONMENT_SPRITES[d.type].w / 2,
            d.y - ENVIRONMENT_SPRITES[d.type].h + 15,
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
    this.texture(
      cellar ? "stoneFloor" : s.scene === "cabin" ? "cabinFloor" : "floor",
      112,
      80,
      416,
      256,
    );
    this.texture("wallStone", 96, 48, 448, 32);
    this.texture("wallStone", 96, 80, 16, 256);
    this.texture("wallStone", 528, 80, 16, 256);
    this.texture("wallStone", 96, 336, 204, 16);
    this.texture("wallStone", 340, 336, 204, 16);
    this.texture(cellar ? "stoneFloor" : "cabinFloor", 300, 336, 40, 16);
    if (s.scene === "cabin") {
      this.sprite("table", 160, 141);
      this.sprite("book", 196, 135);
      this.text("Napló", 211, 130, PALETTE.cream, 9);
      this.sprite("bed", 129, 235);
      if (s.flags.cupboard) this.sprite("stairs", 417, 93);
      this.sprite("wardrobe", s.flags.cupboard ? 477 : 414, 74);
    } else if (cellar) {
      OBJECTS.cellar
        .filter((o) => o.id.startsWith("rune"))
        .forEach((o, index) => {
          this.sprite("rock", o.x - 16, o.y - 17);
          this.text(
            ["NY", "D", "K"][index],
            o.x,
            o.y + 1,
            s.runes[index] ? PALETTE.cream : PALETTE.ink,
            11,
          );
        });
      if (!s.flags.amulet) this.sprite("chest", 304, 74);
      this.sprite("stairs", 304, 304);
      this.sprite("lectern", 120, 227);
      this.sprite("book", 120, 223);
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
      this.sprite("rug", 300, 236);
    } else if (s.scene === "shop") {
      this.sprite("table", 288, 128);
      this.sprite("chest", 135, 100);
      this.sprite("barrel", 177, 92);
      this.sprite("barrel", 445, 92);
      this.sprite("wardrobe", 469, 72);
    } else {
      this.sprite("bed", 130, 100);
      this.sprite("table", 343, 136);
      this.sprite("wardrobe", 470, 75);
      this.sprite("barrel", 139, 241);
    }
    for (const [x, y] of [
      [122, 100],
      [512, 100],
    ])
      this.sprite("indoorLamp", x - 16, y - 24);
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
