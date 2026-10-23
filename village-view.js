import { WORLD, BUILDINGS, STREAM } from "./world.js";
import {
  VILLAGE_PROPS,
  GARDENS,
  CHICKENS,
  BUILDING_STYLES,
  INTERIOR_PROPS,
} from "./village-layout.js";
import { DETAIL_SPRITES } from "./assets/village/draw.js";
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
    // Roads are clipped to unions of pixel-snapped blocks, avoiding blurred edges.
    const road = (points, width, material = "path0") => {
      c.save();
      c.beginPath();
      for (let j = 1; j < points.length; j++) {
        const [a, b] = [points[j - 1], points[j]],
          length = Math.hypot(b[0] - a[0], b[1] - a[1]);
        for (let k = 0; k <= length; k += 4) {
          const f = k / (length || 1),
            x = Math.round((a[0] + (b[0] - a[0]) * f - width / 2) / 2) * 2,
            y = Math.round((a[1] + (b[1] - a[1]) * f - width / 2) / 2) * 2;
          c.rect(x, y, width, width);
        }
      }
      c.clip();
      r.texture(material, 0, 0, WORLD.width, WORLD.height);
      c.restore();
    };
    road(
      [
        [28, 224],
        [190, 224],
        [292, 226],
        [492, 220],
        [642, 224],
        [803, 218],
        [900, 224],
        [1080, 224],
        [1210, 233],
        [1350, 224],
        [1550, 222],
        [1710, 216],
        [1892, 224],
      ],
      52,
    );
    road(
      [
        [267, 48],
        [259, 160],
        [271, 280],
        [254, 375],
        [275, 486],
        [264, 610],
      ],
      40,
    );
    road(
      [
        [28, 491],
        [135, 480],
        [270, 490],
        [388, 487],
        [560, 482],
        [624, 488],
      ],
      40,
    );
    road(
      [
        [1780, 48],
        [1775, 144],
        [1780, 224],
      ],
      32,
    );
    road(
      [
        [1420, 135],
        [1429, 172],
        [1420, 224],
      ],
      26,
    );
    for (const b of BUILDINGS.filter((b) => b.id !== "cabin")) {
      const x = b.x + b.w / 2,
        y = b.y + b.h + 15;
      road(
        [
          [x, y],
          [x + (x < 264 ? 16 : -12), y + 18],
          [264, y + 18],
        ],
        22,
      );
    }
    // A worn, irregular cobbled square and the little paved well approach.
    c.save();
    c.beginPath();
    for (let y = 130; y < 266; y += 2) {
      const d = (y - 197) / 68,
        w =
          Math.floor(
            (Math.sqrt(Math.max(0, 1 - d * d)) * 124 + (y % 10 === 0 ? 2 : 0)) /
              2,
          ) * 2;
      c.rect(268 - w, y, w * 2, 2);
    }
    c.clip();
    r.texture("cobble", 140, 130, 256, 136);
    c.restore();
    road(
      [
        [251, 153],
        [251, 171],
        [266, 194],
      ],
      24,
      "cobble",
    );
    for (const garden of GARDENS) {
      r.texture("path0", garden.x, garden.y, garden.w, garden.h);
      for (let y = garden.y + 3; y < garden.y + garden.h; y += 8) {
        r.rect(garden.x + 2, y, garden.w - 4, 2, "#886d49");
        for (let x = garden.x + 5; x < garden.x + garden.w - 3; x += 10)
          r.detail("tuft" + ((x + y) % 3), x - 8, y - 10);
      }
    }
    // Sparse grass variants, fern-like tufts, flowers and dappled forest shade.
    for (let y = 56; y < 620; y += 32)
      for (let x = 32; x < 1900; x += 32) {
        if (
          !r.path(x, y) &&
          !(x > STREAM.x - 28 && x < STREAM.x + STREAM.w + 28)
        ) {
          if (((x / 32) * 11 + (y / 32) * 7) % 5 === 0)
            r.detail("tuft" + ((x / 32 + y / 32) % 3), x, y);
          if (((x / 32) * 7 + (y / 32) * 13) % 29 === 0)
            r.sprite("flowers", x, y);
        }
        if (x >= 1280 && ((x + y) / 32) % 3 === 0)
          r.detail("dapple", x - 16, y - 12);
      }
    for (const b of BUILDINGS) {
      c.globalAlpha = 0.6;
      r.detail("shadow", b.x + 8, b.y + b.h - 12);
      r.detail("shadow", b.x + b.w - 46, b.y + b.h - 12);
      c.globalAlpha = 1;
    }
  } finally {
    r.ctx = previous;
  }
  return canvas;
}
export function drawDetailedBuilding(r, b, time) {
  const c = r.ctx,
    style = BUILDING_STYLES[b.id],
    ground = b.y + b.h,
    width = Math.ceil(b.w / 2) * 2,
    x = Math.round(b.x);
  r.texture("wall" + style.wall, x, ground - 64, width, 64);
  r.texture("stoneFloor", x, ground - 8, width, 8);
  for (const bx of [x + 2, x + width - 6]) {
    r.rect(bx, ground - 64, 4, 56, "#886544");
    r.rect(bx, ground - 64, 2, 56, "#c5a576");
  }
  r.rect(
    x,
    ground - 35,
    width,
    3,
    style.wall === "Stone" ? "#818e88" : "#aa8559",
  );
  r.sprite("door", Math.round(x + width / 2 - 16), ground - 32);
  const windows = width >= 96 ? [x + 6, x + width - 38] : [x + 8];
  for (const wx of windows) {
    r.sprite(
      style.wall === "Stone" ? "windowPale" : "windowBrown",
      wx,
      ground - 64,
    );
    if (b.id === "inn") {
      c.globalAlpha = 0.55 + Math.sin(time * 1.5) * 0.08;
      r.detail("windowGlow", wx, ground - 64);
      c.globalAlpha = 1;
    }
  }
  // Individual roof tiles, ridge and edge pieces share the same 2x grid.
  const rx = x - 8,
    rw = width + 16,
    ry = ground - 128;
  c.save();
  c.beginPath();
  c.rect(rx + 32, ry, rw - 64, 64);
  c.clip();
  for (let xx = rx + 32; xx < rx + rw - 32; xx += 32)
    r.detail("roof" + style.roof + "Middle", xx, ry);
  c.restore();
  r.detail("roof" + style.roof + "Left", rx, ry);
  r.detail("roof" + style.roof + "Right", rx + rw - 32, ry);
  r.rect(rx + 4, ground - 65, rw - 8, 2, "#665e46");
  if (style.dormer)
    r.detail("dormer", Math.round((x + width * 0.58) / 2) * 2, ground - 103);
  if (style.chimney) {
    r.detail("chimney", x + 10, ground - 129);
    for (let j = 0; j < 2; j++) {
      const phase = (time * 0.28 + j * 0.5) % 1;
      c.globalAlpha = (1 - phase) * 0.65;
      r.detail(
        "smoke" + (Math.floor(time * 2 + j) % 3),
        x + 6 + Math.round(Math.sin(time + j) * 2) * 2,
        ground - 146 - Math.floor(phase * 14) * 2,
      );
      c.globalAlpha = 1;
    }
  }
  if (style.sign) r.detail(style.sign, x - 15, ground - 42);
  if (style.weathered) {
    r.rect(x + 8, ground - 30, 3, 14, "#6a6149");
    r.rect(x + width - 9, ground - 43, 3, 21, "#6a6149");
  }
  r.text(b.name, b.x + b.w / 2, ground + 13, "#f0dfb5", 9);
}
export function addVillageProps(r, game, layers) {
  const time = game.life.clock;
  for (const p of VILLAGE_PROPS) {
    const size = p.kenney ? { h: 16 } : DETAIL_SPRITES[p.art];
    layers.push({
      y: p.foot ? p.foot.y + p.foot.h : p.y + size.h * 2,
      draw: () => {
        if (p.foot) {
          r.ctx.globalAlpha = 0.45;
          r.detail("shadow", p.x - 8, p.foot.y - 10);
          r.ctx.globalAlpha = 1;
        }
        if (p.id === "well")
          r.detail("roundWell" + (Math.floor(time * 2) % 2), p.x, p.y);
        else if (p.id === "forge")
          r.sprite("forge" + (Math.floor(time * 5) % 2), p.x, p.y);
        else if (p.kenney) r.sprite(p.art, p.x, p.y);
        else r.detail(p.art, p.x, p.y);
      },
    });
  }
  for (const [x, y] of [
    [52, 335],
    [350, 146],
    [513, 163],
    [174, 560],
    [512, 526],
  ])
    layers.push({ y: y + 20, draw: () => r.detail("flowerBed", x, y) });
  for (const chicken of CHICKENS) {
    const f = time * 0.7 + chicken.phase,
      x = chicken.x + Math.round(Math.sin(f) * 5) * 2,
      y = chicken.y + Math.round(Math.cos(f) * 2) * 2;
    layers.push({
      y: y + 15,
      draw: () =>
        r.detail("chicken" + (Math.floor(time * 4) % 2), x - 16, y - 16, {
          flip: Math.cos(f) < 0,
        }),
    });
  }
  // Foreground life stays away from the quest objects and doorway approaches.
  for (const [x, y, phase] of [
    [98, 353, 0],
    [546, 116, 2],
    [824, 321, 4],
  ]) {
    const xx = x + Math.round(Math.sin(time + phase) * 11) * 2,
      yy = y + Math.round(Math.cos(time * 0.8 + phase) * 5) * 2;
    layers.push({
      y: yy + 50,
      draw: () => r.detail("butterfly" + (Math.floor(time * 5) % 2), xx, yy),
    });
  }
}
export function drawInteriorDetails(r, game) {
  const time = game.life.clock;
  for (const p of INTERIOR_PROPS.filter((p) => p.scene === game.state.scene)) {
    if (p.art === "fireplace")
      r.sprite(Math.floor(time * 4) % 2 ? "forge1" : "forge0", p.x, p.y);
    else r.sprite(p.art, p.x, p.y);
  }
  if (game.state.scene === "inn") {
    for (const [x, y] of [
      [211, 259],
      [260, 255],
      [443, 251],
      [414, 155],
    ])
      r.sprite("chair", x, y);
    r.sprite("shelf", 371, 64);
    r.sprite("shelf", 435, 64);
    r.sprite("barrel", 473, 131);
  }
}
