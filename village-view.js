import { WORLD, BUILDINGS, STREAM } from "./world.js";
import {
  VILLAGE_PROPS,
  GARDENS,
  CHICKENS,
  BUILDING_STYLES,
  INTERIOR_PROPS,
} from "./village-layout.js";
import { DETAIL_SPRITES } from "./assets/village/draw.js";
import { ENVIRONMENT_SPRITES } from "./assets/kenney/environment.js";
import { snap, buildingPlacement, propPlacement } from "./visual-layout.js";
export function createGround(r) {
  const previous = r.ctx,
    canvas = document.createElement("canvas");
  canvas.width = WORLD.width;
  canvas.height = WORLD.height;
  r.ctx = canvas.getContext("2d");
  const c = r.ctx;
  c.imageSmoothingEnabled = false;
  try {
    r.texture("grass0", 0, 0, WORLD.width, WORLD.height);
    r.rect(0, 0, WORLD.width, WORLD.height, "#36503712");
    r.rect(1280, 0, 640, WORLD.height, "#183f3655");
    const road = (points, width, material = "path0") => {
      c.save();
      c.beginPath();
      for (let j = 1; j < points.length; j++) {
        const [a, b] = [points[j - 1], points[j]],
          length = Math.hypot(b[0] - a[0], b[1] - a[1]);
        for (let k = 0; k <= length; k += 4) {
          const f = k / (length || 1);
          c.rect(
            snap(a[0] + (b[0] - a[0]) * f - width / 2),
            snap(a[1] + (b[1] - a[1]) * f - width / 2),
            width,
            width,
          );
        }
      }
      c.clip();
      r.texture(material, 0, 0, WORLD.width, WORLD.height);
      c.restore();
    };
    road(
      [
        [32, 224],
        [640, 224],
        [800, 224],
        [920, 224],
        [1040, 224],
        [1200, 232],
        [1344, 224],
        [1568, 224],
        [1760, 216],
        [1888, 224],
      ],
      64,
    );
    road(
      [
        [264, 48],
        [264, 280],
        [256, 376],
        [272, 488],
        [264, 608],
      ],
      48,
    );
    road(
      [
        [32, 488],
        [136, 480],
        [272, 488],
        [392, 488],
        [560, 480],
        [624, 488],
      ],
      40,
    );
    road(
      [
        [1784, 48],
        [1776, 144],
        [1784, 224],
      ],
      32,
    );
    road(
      [
        [1424, 136],
        [1424, 176],
        [1424, 224],
      ],
      24,
    );
    for (const b of BUILDINGS.filter((b) => b.id !== "cabin")) {
      const v = buildingPlacement(b),
        y = snap(b.y + b.h + 16, 8);
      road(
        [
          [v.cx, v.ground],
          [v.cx, y + 8],
          [264, y + 8],
        ],
        24,
      );
    }
    // One clean plaza on the same construction grid; no noisy ellipse boundary.
    c.save();
    c.beginPath();
    c.rect(184, 128, 208, 136);
    c.rect(176, 136, 224, 120);
    c.clip();
    r.texture("cobble", 176, 128, 224, 136);
    c.restore();
    for (const g of GARDENS) {
      const x = snap(g.x, 8),
        y = snap(g.y, 8),
        w = snap(g.w, 8),
        h = snap(g.h, 8);
      r.texture("path0", x, y, w, h);
      for (let yy = y + 8; yy < y + h; yy += 16) {
        r.rect(x + 4, yy, w - 8, 2, "#886d49");
        for (let xx = x + 8; xx < x + w - 4; xx += 16)
          r.detail("tuft" + (((xx + yy) / 8) % 3), xx - 8, yy - 8);
      }
    }
    for (let y = 64; y < 608; y += 32)
      for (let x = 32; x < 1888; x += 32) {
        const plaza = x >= 160 && x <= 416 && y >= 112 && y <= 280;
        if (
          !plaza &&
          !r.path(x, y) &&
          !(x > STREAM.x - 32 && x < STREAM.x + STREAM.w + 32)
        ) {
          if (((x / 32) * 11 + (y / 32) * 7) % 5 === 0)
            r.detail("tuft" + (((x + y) / 32) % 3), x, y);
          if (((x / 32) * 7 + (y / 32) * 13) % 29 === 0)
            r.sprite("flowers", x, y);
        }
        if (x >= 1280 && ((x + y) / 32) % 3 === 0)
          r.detail("dapple", x - 16, y - 16);
      }
  } finally {
    r.ctx = previous;
  }
  return canvas;
}
function roofPiece(r, name, x, y) {
  r.detail(name, x, y, { crop: { x: 0, y: 0, w: 16, h: 16 } });
  r.detail(name, x, y + 32, { crop: { x: 0, y: 24, w: 16, h: 8 } });
}
export function drawDetailedBuilding(r, b, time) {
  const c = r.ctx,
    style = BUILDING_STYLES[b.id],
    v = buildingPlacement(b),
    { x, width, ground, roofY } = v;
  r.texture("wall" + style.wall, x, ground - 32, width, 32);
  r.texture("stoneFloor", x, ground - 4, width, 4);
  for (const bx of [x, x + width - 4]) {
    r.rect(bx, ground - 32, 4, 28, "#886544");
    r.rect(bx, ground - 32, 2, 28, "#c5a576");
  }
  r.sprite("door", v.cx - 16, ground - 32);
  for (const wx of [x + 4, x + width - 24]) {
    r.detail("dormer", wx, ground - 26, { crop: { x: 3, y: 7, w: 10, h: 9 } });
    if (b.id === "inn") {
      c.globalAlpha = 0.5 + Math.sin(time * 1.5) * 0.05;
      r.detail("windowGlow", wx, ground - 26, {
        crop: { x: 3, y: 3, w: 10, h: 9 },
      });
      c.globalAlpha = 1;
    }
  }
  const rx = x - 8,
    rw = width + 16;
  c.save();
  c.beginPath();
  c.rect(rx + 32, roofY, rw - 64, 48);
  c.clip();
  for (let xx = rx + 32; xx < rx + rw - 32; xx += 32)
    roofPiece(r, "roof" + style.roof + "Middle", xx, roofY);
  c.restore();
  roofPiece(r, "roof" + style.roof + "Left", rx, roofY);
  roofPiece(r, "roof" + style.roof + "Right", rx + rw - 32, roofY);
  r.rect(rx + 4, ground - 34, rw - 8, 2, "#665e46");
  if (style.dormer) r.detail("dormer", snap(v.cx + 8, 8), ground - 66);
  if (style.chimney) {
    const cx = x + 16,
      cy = ground - 92;
    r.detail("chimney", cx, cy, { crop: { x: 0, y: 0, w: 16, h: 8 } });
    r.detail("chimney", cx, cy + 16, { crop: { x: 0, y: 16, w: 16, h: 8 } });
    for (let j = 0; j < 2; j++) {
      const phase = (time * 0.28 + j * 0.5) % 1;
      c.globalAlpha = (1 - phase) * 0.55;
      r.detail(
        "smoke" + (Math.floor(time * 2 + j) % 3),
        cx - 4 + snap(Math.sin(time + j) * 2),
        cy - 36 - snap(phase * 12),
      );
      c.globalAlpha = 1;
    }
  }
  if (style.sign) {
    r.rect(x - 20, ground - 46, 24, 2, "#886544");
    r.detail(style.sign, x - 40, ground - 40, {
      crop: { x: 5, y: 6, w: 18, h: 12 },
    });
  }
  if (style.weathered) {
    r.rect(x + 8, ground - 20, 2, 14, "#6a6149");
    r.rect(x + width - 8, ground - 24, 2, 16, "#6a6149");
  }
}
function add(
  r,
  layers,
  art,
  cx,
  ground,
  { kenney = false, order = 0, ...options } = {},
) {
  const s = kenney ? ENVIRONMENT_SPRITES[art] : DETAIL_SPRITES[art],
    size = kenney ? s : { w: s.w * 2, h: s.h * 2 };
  const p = propPlacement(
    {
      art,
      x: cx - size.w / 2,
      y: ground - size.h,
      foot: { x: cx, y: ground, w: 0, h: 0 },
    },
    size,
  );
  layers.push({
    id: options.id || art,
    ground: p.ground,
    order,
    shadow: options.shadow === false ? null : () => r.shadow(p.cx, p.ground),
    draw: () =>
      kenney ? r.sprite(art, p.x, p.y) : r.detail(art, p.x, p.y, options),
  });
  return p;
}
export function addVillageProps(r, game, layers) {
  const time = game.life.clock;
  for (const prop of VILLAGE_PROPS) {
    // Remove loose goods from the walkway; the counter still displays its wares.
    if (["basket", "sacks", "iron", "inn-sign"].includes(prop.id)) continue;
    if (prop.id === "market") {
      const counter = VILLAGE_PROPS.find((p) => p.id === "counter"),
        cx = snap(counter.foot.x + counter.foot.w / 2),
        ground = snap(counter.foot.y + counter.foot.h),
        x = cx - 48,
        y = ground - 96;
      layers.push({
        id: "market-canopy",
        ground,
        order: 1,
        draw: () => {
          for (const sx of [2, 44])
            for (let yy = y + 40; yy < ground; yy += 24) {
              const h = Math.min(12, (ground - yy) / 2);
              r.detail("awning", x + sx * 2, yy, {
                crop: { x: sx, y: 20, w: 2, h },
              });
            }
          r.detail("awning", x, y, { crop: { x: 0, y: 0, w: 48, h: 20 } });
        },
      });
      continue;
    }
    const def = prop.kenney
        ? ENVIRONMENT_SPRITES[prop.art]
        : DETAIL_SPRITES[prop.art],
      size = prop.kenney ? def : { w: def.w * 2, h: def.h * 2 },
      p = propPlacement(prop, size);
    const art =
      prop.id === "well"
        ? "roundWell" + (Math.floor(time * 2) % 2)
        : prop.id === "forge"
          ? "forge" + (Math.floor(time * 5) % 2)
          : prop.art;
    const seated =
      prop.id === "bench-elder" &&
      game.people.some(
        (n) => n.id === "elder" && n.pose === "sit" && Math.abs(n.x - 233) < 16,
      );
    layers.push({
      id: prop.id,
      ground: seated ? p.ground - 24 : p.ground,
      order: prop.id === "counter" ? 2 : 0,
      shadow: prop.foot ? () => r.shadow(p.cx, p.ground) : null,
      draw: () => {
        if (prop.id === "counter") {
          r.detail(art, p.x, p.y + 8, { crop: { x: 0, y: 4, w: 36, h: 12 } });
          r.detail(art, p.x, p.y, { crop: { x: 0, y: 0, w: 12, h: 4 } });
          r.detail(art, p.x + 46, p.y, { crop: { x: 23, y: 0, w: 13, h: 4 } });
        } else if (prop.kenney) r.sprite(art, p.x, p.y);
        else
          r.detail(
            art,
            p.x,
            p.y,
            prop.id === "well"
              ? { crop: { x: 0, y: 0, w: 32, h: 28 } }
              : undefined,
          );
      },
    });
  }
  const inn = buildingPlacement(BUILDINGS.find((b) => b.id === "inn"));
  layers.push({
    id: "inn-sign",
    ground: inn.ground,
    draw: () => {
      r.rect(inn.x + inn.width - 2, inn.ground - 46, 36, 2, "#886544");
      r.detail("innSign", inn.x + inn.width + 8, inn.ground - 40, {
        crop: { x: 5, y: 6, w: 18, h: 12 },
      });
    },
  });
  for (const [x, y] of [
    [48, 352],
    [520, 176],
    [176, 576],
    [520, 576],
  ])
    add(r, layers, "flowerBed", x + 32, y, { shadow: false });
  for (const chicken of CHICKENS) {
    const f = time * 0.7 + chicken.phase,
      cx = snap(chicken.x + Math.sin(f) * 10),
      ground = snap(chicken.y + Math.cos(f) * 4);
    add(r, layers, "chicken" + (Math.floor(time * 4) % 2), cx, ground, {
      flip: Math.cos(f) < 0,
      shadow: false,
    });
  }
  for (const [x, y, phase] of [
    [96, 352, 0],
    [544, 112, 2],
    [824, 320, 4],
  ]) {
    const xx = snap(x + Math.sin(time + phase) * 22),
      yy = snap(y + Math.cos(time * 0.8 + phase) * 10);
    layers.push({
      ground: WORLD.height + 32,
      draw: () => r.detail("butterfly" + (Math.floor(time * 5) % 2), xx, yy),
    });
  }
}
export function addInteriorDetails(r, game, layers) {
  const time = game.life.clock;
  for (const prop of INTERIOR_PROPS.filter(
    (p) => p.scene === game.state.scene,
  )) {
    const size = ENVIRONMENT_SPRITES[prop.art],
      p = propPlacement(prop, size),
      art =
        prop.art === "fireplace"
          ? "forge" + (Math.floor(time * 4) % 2)
          : prop.art;
    layers.push({
      ground: p.ground,
      shadow: () => r.shadow(p.cx, p.ground),
      draw: () => r.sprite(art, p.x, p.y),
    });
  }
  if (game.state.scene === "inn") {
    r.sprite("shelf", 368, 64);
    r.sprite("shelf", 432, 64);
    for (const n of game.people.filter((n) => n.work === "sit")) {
      const cx = snap(n.x),
        ground = snap(n.y + 12);
      layers.push({
        ground: ground - 20,
        draw: () => r.sprite("chair", cx - 16, ground - 32),
      });
    }
  }
}
