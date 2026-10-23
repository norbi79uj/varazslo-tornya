import {
  WORLD,
  BUILDINGS,
  HERBS,
  OBJECTS,
  DECOR,
  STREAM,
  interiorSolids,
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
import { DETAIL_SHEET, drawDetail } from "./assets/village/draw.js";
import {
  createGround,
  drawDetailedBuilding,
  addVillageProps,
  addInteriorDetails,
} from "./village-view.js";
import { VILLAGE_PROPS } from "./village-layout.js";
import { facing } from "./village-life.js";
import {
  snap,
  buildingPlacement,
  actorPlacement,
  artPlacement,
  sortByGround,
} from "./visual-layout.js";
export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.camera = 0;
    this.cameraY = 0;
    const load = (url) => {
      const image = new Image(),
        ready = new Promise((resolve, reject) => {
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
        const t = load(definition.url);
        this.textures[pack] = t.image;
        return t.ready;
      },
    );
    const characters = load(CHARACTER_SHEET.url),
      details = load(DETAIL_SHEET.url);
    this.characters = characters.image;
    this.details = details.image;
    this.ready = Promise.all([
      ...pending,
      characters.ready,
      details.ready,
    ]).then(() => {
      this.ground = createGround(this);
    });
  }
  rect(x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(snap(x), snap(y), Math.round(w), Math.round(h));
  }
  sprite(name, x, y, flip = false) {
    drawEnvironmentSprite(this.ctx, this.textures, name, snap(x), snap(y), {
      flip,
    });
  }
  detail(name, x, y, options) {
    drawDetail(this.ctx, this.details, name, snap(x), snap(y), options);
  }
  texture(name, x, y, w, h) {
    const c = this.ctx,
      a = ENVIRONMENT_SPRITES[name];
    x = snap(x);
    y = snap(y);
    w = snap(w);
    h = snap(h);
    c.save();
    c.beginPath();
    c.rect(x, y, w, h);
    c.clip();
    for (let yy = Math.floor(y / a.h) * a.h; yy < y + h; yy += a.h)
      for (let xx = Math.floor(x / a.w) * a.w; xx < x + w; xx += a.w)
        this.sprite(name, xx, yy);
    c.restore();
  }
  text(text, x, y, color = PALETTE.cream, size = 10) {
    const c = this.ctx;
    c.font = `${size}px monospace`;
    c.textAlign = "center";
    c.fillStyle = PALETTE.ink;
    c.fillText(text, Math.round(x) + 1, Math.round(y) + 1);
    c.fillStyle = color;
    c.fillText(text, Math.round(x), Math.round(y));
  }
  shadow(cx, ground) {
    this.ctx.save();
    this.ctx.globalAlpha = 0.3;
    this.detail("shadow", snap(cx) - 32, snap(ground) - 16);
    this.ctx.restore();
  }
  paint(entries) {
    sortByGround(entries);
    for (const e of entries) e.shadow?.();
    for (const e of entries) e.draw();
  }
  tree(cx, ground, type = "oak") {
    cx = snap(cx);
    ground = snap(ground);
    this.sprite(type, cx - 16, ground - 64);
    if (type !== "pine")
      this.detail(
        "leafCluster",
        cx -
          20 +
          (Math.floor(this.environmentTime * 1.5 + cx) % 5 === 0 ? 2 : 0),
        ground - 62,
      );
  }
  personPlacement(n, scene) {
    const p = actorPlacement(n);
    let pose = n.pose;
    if (pose === "sit") {
      if (scene === "inn") {
        p.ground = snap(n.y + 12);
        p.y = p.ground - 28;
      } else if (
        n.id === "elder" &&
        Math.abs(n.x - 233) < 16 &&
        Math.abs(n.y - 280) < 10
      ) {
        const bench = VILLAGE_PROPS.find((p) => p.id === "bench-elder");
        p.ground = snap(bench.foot.y + bench.foot.h) - 4;
        p.y = p.ground - 28;
      } else pose = "idle";
    }
    return { ...p, pose };
  }
  person(n, game, p = this.personPlacement(n, game.state.scene)) {
    const time = game.life.clock,
      frame = n.walking ? [0, 1, 0, 2][Math.floor(time * 7) % 4] : 0;
    drawKenneyActor(this.ctx, this.characters, n.profile || n.id, p.x, p.y, {
      frame,
      direction: p.pose === "sit" ? "down" : n.direction,
      details: this.details,
      pose: p.pose,
      hideEquipment: p.pose === "chop",
    });
    if (p.pose === "hammer" || p.pose === "chop") {
      const down = Math.floor(time * 3) % 3 === 2,
        tool = p.pose === "hammer" ? "hammer" : "axe",
        inside = p.pose === "hammer" && game.state.scene === "smithy",
        handX = p.cx + (inside ? -12 : 12),
        handY = p.ground - 14;
      if (inside && down) {
        this.ctx.save();
        this.ctx.translate(handX, handY);
        this.ctx.rotate(Math.PI / 2);
        this.detail("hammerDown", -30, -10, { flip: true });
        this.ctx.restore();
      } else {
        const hand =
          tool === "axe"
            ? down
              ? [2, 8]
              : [6, 30]
            : down
              ? [2, 10]
              : [14, 28];
        this.detail(
          tool + (down ? "Down" : "Up"),
          handX - hand[0],
          handY - hand[1],
        );
      }
    }
    if (n.id === "elder") this.detail("walkingStick", p.cx + 10, p.ground - 32);
  }
  player(game, p = actorPlacement(game.state.player)) {
    const s = game.state.player,
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
      ].some((k) => game.keys.has(k)),
      frame =
        moving && !game.dialog
          ? [0, 1, 0, 2][Math.floor(game.time * 9) % 4]
          : 0;
    if (game.invincible <= 0 || Math.floor(game.time * 13) % 2 === 0)
      drawKenneyActor(c, this.characters, "hero", p.x, p.y, {
        frame,
        direction: facing(s.dx, s.dy),
        details: this.details,
      });
    if (game.swing > 0) {
      const a = Math.atan2(s.dy, s.dx);
      c.strokeStyle = PALETTE.cream;
      c.lineWidth = 3;
      c.beginPath();
      c.arc(p.cx, p.ground - 16, 35, a - 0.95, a + 0.95);
      c.stroke();
      c.strokeStyle = PALETTE.shine;
      c.lineWidth = 1;
      c.beginPath();
      c.arc(p.cx, p.ground - 16, 41, a - 0.65, a + 0.65);
      c.stroke();
    }
  }
  enemy(e, time, player, p = actorPlacement(e, e.boss ? 3 : 2)) {
    const frame = Math.floor(time * 7) % 3,
      name = e.boss ? "boss" : e.id.startsWith("slime") ? "slime" : "wolf",
      c = this.ctx;
    c.save();
    if (e.flash > 0) c.globalAlpha = 0.45;
    drawKenneyActor(c, this.characters, name, p.x, p.y, {
      frame,
      scale: e.boss ? 3 : 2,
      direction: facing(player.x - e.x, player.y - e.y),
      details: this.details,
    });
    c.restore();
    this.rect(p.x, p.y - 6, p.w, 3, PALETTE.ink);
    this.rect(p.x, p.y - 6, (p.w * e.hp) / e.maxHp, 3, PALETTE.red);
    if (e.boss) this.text("TÖVISÚR", p.cx, p.y - 11, PALETTE.cream, 9);
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
  addActors(game, entries) {
    for (const n of game.people) {
      const p = this.personPlacement(n, game.state.scene);
      entries.push({
        id: n.id,
        ground: p.ground,
        order: 10,
        shadow: () => this.shadow(p.cx, p.ground),
        draw: () => this.person(n, game, p),
      });
    }
    if (game.state.scene === "world")
      for (const e of game.state.enemies.filter((e) => e.hp > 0)) {
        const p = actorPlacement(e, e.boss ? 3 : 2);
        entries.push({
          ground: p.ground,
          order: 10,
          shadow: () => this.shadow(p.cx, p.ground),
          draw: () => this.enemy(e, game.time, game.state.player, p),
        });
      }
    const p = actorPlacement(game.state.player);
    entries.push({
      id: "hero",
      ground: p.ground,
      order: 10,
      shadow: () => this.shadow(p.cx, p.ground),
      draw: () => this.player(game, p),
    });
  }
  world(game) {
    const s = game.state,
      c = this.ctx;
    c.drawImage(this.ground, 0, 0);
    this.texture(
      "water" + (Math.floor(game.time * 2) % 2),
      STREAM.x,
      0,
      STREAM.w,
      WORLD.height,
    );
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
    for (const h of HERBS.filter((h) => !s.collected.includes(h.id)))
      this.sprite("herb", snap(h.x) - 16, snap(h.y + 8) - 32);
    const entries = [];
    addVillageProps(this, game, entries);
    for (const ground of [48, WORLD.height])
      for (let x = 32; x < WORLD.width; x += 32) {
        if (ground === 48 && x >= 1736 && x <= 1832) continue;
        if (x >= STREAM.x && x < STREAM.x + STREAM.w) continue;
        const type = x >= 1280 ? "pine" : "oak";
        entries.push({
          ground,
          shadow: () => this.shadow(x, ground),
          draw: () => this.tree(x, ground, type),
        });
      }
    for (const d of DECOR) {
      if (
        ["oak", "pine", "goldTree"].includes(d.type) &&
        d.x >= STREAM.x &&
        d.x < STREAM.x + STREAM.w
      )
        continue;
      const ground = snap(d.y + (d.offsetY ?? -2) + (d.h || 12)),
        cx = snap(d.x),
        size = ENVIRONMENT_SPRITES[d.type],
        p = artPlacement(d.type, cx, ground, size);
      entries.push({
        ground,
        shadow: () => this.shadow(cx, ground),
        draw: () => {
          if (["oak", "pine", "goldTree"].includes(d.type))
            this.tree(cx, ground, d.type);
          else if (d.type === "hill") {
            this.sprite("rock", cx - 28, ground - 30);
            this.sprite("rock", cx - 4, ground - 30);
          } else this.sprite(d.type, p.x, p.y);
        },
      });
    }
    for (const b of BUILDINGS) {
      const v = buildingPlacement(b);
      entries.push({
        ground: v.ground,
        shadow: () => {
          this.shadow(v.cx - v.width / 4, v.ground);
          this.shadow(v.cx + v.width / 4, v.ground);
        },
        draw: () => drawDetailedBuilding(this, b, game.time),
      });
    }
    for (const x of [STREAM.x - 16, STREAM.x + 16, STREAM.x + 48])
      for (const ground of [STREAM.bridgeY, STREAM.bridgeY + STREAM.bridgeH])
        entries.push({
          ground,
          draw: () => this.sprite("fence", x, ground - 32),
        });
    for (const x of [1736, 1808])
      entries.push({
        ground: 80,
        draw: () => this.texture("wallStone", x, 32, 16, 48),
      });
    if (!s.flags.boss)
      entries.push({
        ground: 56,
        draw: () => {
          this.sprite("fence", 1752, 24);
          this.sprite("fence", 1784, 24);
        },
      });
    this.addActors(game, entries);
    this.paint(entries);
  }
  interior(game) {
    const s = game.state,
      cellar = s.scene === "cellar",
      entries = [];
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
    const furniture = (art, foot, extra = () => {}) => {
      const size = ENVIRONMENT_SPRITES[art],
        p = artPlacement(art, foot.x + foot.w / 2, foot.y + foot.h, size);
      entries.push({
        ground: p.ground,
        shadow: () => this.shadow(p.cx, p.ground),
        draw: () => {
          this.sprite(art, p.x, p.y);
          extra(p);
        },
      });
      return p;
    };
    const solids = interiorSolids(s.scene, s.flags, false);
    if (s.scene === "cabin") {
      furniture("table", solids[0], (p) =>
        this.sprite("book", p.x + 32, p.y - 6),
      );
      furniture("bed", solids[1]);
      if (s.flags.cupboard) this.sprite("stairs", 416, 92);
      furniture("wardrobe", solids[2]);
    } else if (cellar) {
      OBJECTS.cellar
        .filter((o) => o.id.startsWith("rune"))
        .forEach((o, i) =>
          furniture("rock", solids[i], (p) =>
            this.text(
              ["NY", "D", "K"][i],
              p.cx,
              p.y + 20,
              s.runes[i] ? PALETTE.cream : PALETTE.ink,
              11,
            ),
          ),
        );
      if (!s.flags.amulet) furniture("chest", solids[3]);
      furniture("lectern", solids[4], (p) => this.sprite("book", p.x, p.y - 4));
      this.sprite("stairs", 304, 304);
    } else if (s.scene === "smithy") {
      furniture("anvil", solids[0]);
      furniture("table", solids[1]);
      furniture("barrel", { x: 136, y: 106, w: 24, h: 24 });
      furniture("barrel", { x: 164, y: 106, w: 24, h: 24 });
      furniture("chest", { x: 444, y: 94, w: 32, h: 24 });
    } else if (s.scene === "inn") {
      this.detail("tavernRug", 304, 240);
      furniture("bed", solids[0]);
      furniture("bed", solids[1]);
      furniture("table", solids[2]);
      furniture("table", solids[3]);
      furniture("barrel", { x: 472, y: 112, w: 24, h: 24 });
    } else if (s.scene === "shop") {
      furniture("table", solids[0]);
      furniture("chest", { x: 136, y: 94, w: 32, h: 24 });
      furniture("barrel", { x: 176, y: 94, w: 24, h: 24 });
      furniture("barrel", { x: 444, y: 94, w: 24, h: 24 });
      furniture("wardrobe", solids[2]);
    } else {
      furniture("bed", solids[0]);
      furniture("table", solids[1]);
      furniture("wardrobe", solids[2]);
      furniture("barrel", solids[3]);
    }
    for (const [x, y] of [
      [120, 100],
      [512, 100],
    ])
      this.sprite("indoorLamp", x - 16, y - 24);
    addInteriorDetails(this, game, entries);
    this.addActors(game, entries);
    this.paint(entries);
    this.text(game.zone, 320, 28, PALETTE.cream, 11);
  }
  interactionHint(game) {
    if (!game.started || game.dialog || game.dead) return;
    const near = game.nearby();
    if (!near) return;
    const c = this.ctx,
      text = "E · " + near.name;
    c.save();
    c.font = "11px monospace";
    c.textAlign = "center";
    const w = Math.min(612, Math.ceil(c.measureText(text).width) + 24),
      x = snap((640 - w) / 2),
      playerGround = actorPlacement(game.state.player).ground - this.cameraY,
      y = playerGround > 352 ? 8 : 356;
    c.fillStyle = "#14251fed";
    c.fillRect(x, y, w, 22);
    c.strokeStyle = "#829b64";
    c.lineWidth = 1;
    c.strokeRect(x + 0.5, y + 0.5, w - 1, 21);
    c.fillStyle = PALETTE.cream;
    c.fillText(text, 320, y + 15);
    c.restore();
  }
  draw(game) {
    this.environmentTime = game.time;
    const c = this.ctx,
      s = game.state;
    this.camera =
      s.scene === "world"
        ? snap(Math.max(0, Math.min(WORLD.width - 640, s.player.x - 320)))
        : 0;
    this.cameraY =
      s.scene === "world"
        ? snap(Math.max(0, Math.min(WORLD.height - 384, s.player.y - 192)))
        : 0;
    c.save();
    c.translate(-this.camera, -this.cameraY);
    if (s.scene === "world") this.world(game);
    else this.interior(game);
    c.restore();
    this.interactionHint(game);
  }
}
