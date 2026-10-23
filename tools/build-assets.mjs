// Original pixel artwork. Rebuild with node tools/build-assets.mjs (no packages).
// Every mark is snapped to the native pixel grid. This is the editable art source.
import { writeFileSync, mkdirSync } from "node:fs";
import { deflateSync } from "node:zlib";
const W = 512,
  H = 640,
  data = new Uint8Array(W * H * 4),
  atlas = {};
const P = {
  ink: "#23352f",
  deep: "#193a33",
  shadow: "#304b3d",
  pine: "#285844",
  leaf: "#40754a",
  green: "#64934e",
  light: "#91b65d",
  gold: "#c6c979",
  grass: "#668b4f",
  soil: "#a39366",
  sand: "#c0b17c",
  earth: "#776c4d",
  wood: "#72513c",
  oak: "#9b7350",
  tan: "#c6a175",
  cream: "#e8d6a0",
  roof: "#8b4e49",
  rooflight: "#bc7260",
  roofdark: "#613f3e",
  stone: "#76857b",
  silver: "#adb9a5",
  shine: "#e3e3bf",
  water: "#3c787e",
  wave: "#6aa7a5",
  foam: "#abd2c0",
  blue: "#567a9b",
  red: "#c06b66",
  purple: "#99769f",
  skin: "#d9ae83",
};
let ox = 0,
  oy = 0,
  cursorX = 0,
  cursorY = 0,
  rowH = 0;
const rgb = (c) => c.match(/\w\w/g).map((v) => parseInt(v, 16));
const pixel = (x, y, color) => {
  x += ox;
  y += oy;
  if (x < 0 || y < 0 || x >= W || y >= H || !color) return;
  const i = (Math.floor(y) * W + Math.floor(x)) * 4;
  const col = rgb(color.slice(1));
  data[i] = col[0];
  data[i + 1] = col[1];
  data[i + 2] = col[2];
  data[i + 3] = 255;
};
const rect = (x, y, w, h, c) => {
  for (let yy = y; yy < y + h; yy++)
    for (let xx = x; xx < x + w; xx++) pixel(xx, yy, c);
};
const line = (x1, y1, x2, y2, c) => {
  let dx = Math.abs(x2 - x1),
    sx = x1 < x2 ? 1 : -1,
    dy = -Math.abs(y2 - y1),
    sy = y1 < y2 ? 1 : -1,
    e = dx + dy;
  while (true) {
    pixel(x1, y1, c);
    if (x1 === x2 && y1 === y2) break;
    const e2 = 2 * e;
    if (e2 >= dy) {
      e += dy;
      x1 += sx;
    }
    if (e2 <= dx) {
      e += dx;
      y1 += sy;
    }
  }
};
const oval = (cx, cy, rx, ry, c) => {
  for (let y = Math.floor(cy - ry); y <= cy + ry; y++)
    for (let x = Math.floor(cx - rx); x <= cx + rx; x++)
      if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) pixel(x, y, c);
};
function sprite(name, w, h, draw) {
  if (cursorX + w + 2 > W) {
    cursorX = 0;
    cursorY += rowH + 2;
    rowH = 0;
  }
  if (cursorY + h > H) throw Error("Atlas overflow");
  ox = cursorX;
  oy = cursorY;
  atlas[name] = { x: ox, y: oy, w, h };
  draw();
  cursorX += w + 2;
  rowH = Math.max(rowH, h);
}
const noise = (x, y, seed = 1) => {
  let n = (x * 374761393 + y * 668265263 + seed * 982451653) >>> 0;
  n = (n ^ (n >>> 13)) * 1274126177;
  return (n >>> 0) % 100;
};
function grass(seed, forest = false) {
  rect(0, 0, 16, 16, forest ? P.pine : P.grass);
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      const n = noise(x, y, seed);
      if (n < 5) pixel(x, y, forest ? P.leaf : P.green);
      if (n > 98) {
        pixel(x, y, forest ? P.shadow : P.leaf);
        pixel(x + 1, y - 1, forest ? P.leaf : P.light);
      }
    }
}
for (let i = 0; i < 4; i++) sprite("grass" + i, 16, 16, () => grass(i));
for (let i = 0; i < 4; i++)
  sprite("forest" + i, 16, 16, () => grass(i + 6, true));
for (let i = 0; i < 3; i++)
  sprite("path" + i, 16, 16, () => {
    rect(0, 0, 16, 16, P.soil);
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) {
        const n = noise(x, y, i + 11);
        if (n < 5) pixel(x, y, P.sand);
        else if (n > 98) pixel(x, y, P.earth);
      }
    for (let j = 0; j < 3; j++) {
      let x = (j * 5 + i * 3) % 15,
        y = (j * 7 + i * 2) % 14;
      rect(x, y, 3, 2, P.earth);
      rect(x, y, 2, 1, P.sand);
    }
  });
for (let frame = 0; frame < 4; frame++)
  sprite("water" + frame, 16, 16, () => {
    rect(0, 0, 16, 16, P.water);
    for (let y = 2; y < 16; y += 6) {
      const x = (y + frame * 3) % 16;
      for (let k = 0; k < 7; k++)
        pixel(
          (x + k) % 16,
          y + (k === 0 || k === 6 ? 1 : 0),
          k < 3 ? P.wave : P.foam,
        );
    }
    rect(2, (frame * 3 + 10) % 16, 2, 1, P.wave);
  });
sprite("bank", 16, 16, () => {
  rect(0, 0, 16, 16, P.soil);
  for (let y = 0; y < 16; y++) {
    rect(10 + (y % 5 === 0 ? 1 : 0), y, 6, 1, P.earth);
    rect(13, y, 3, 1, P.water);
    if (y % 4 === 1) rect(6, y, 5, 2, P.sand);
  }
  line(9, 0, 11, 15, P.wood);
});
sprite("bridge", 16, 16, () => {
  rect(0, 0, 16, 16, P.wood);
  for (let y = 0; y < 16; y += 5) {
    rect(0, y, 16, 4, P.oak);
    line(1, y, 15, y, P.tan);
    rect(4, y + 2, 3, 1, P.wood);
    pixel(1, y + 3, P.ink);
    pixel(14, y + 3, P.ink);
  }
});
sprite("floor", 16, 16, () => {
  rect(0, 0, 16, 16, P.wood);
  for (let y = 0; y < 16; y += 8) {
    rect(0, y, 16, 7, P.oak);
    line(0, y, 15, y, P.tan);
    line(y === 0 ? 5 : 11, y, y === 0 ? 5 : 11, y + 6, P.wood);
    line(2, y + 3, 9, y + 3, P.wood);
  }
});
sprite("stoneFloor", 16, 16, () => {
  rect(0, 0, 16, 16, P.shadow);
  rect(1, 1, 14, 6, P.stone);
  rect(1, 9, 6, 6, P.stone);
  rect(9, 9, 6, 6, P.stone);
  line(2, 2, 13, 2, P.silver);
  line(2, 10, 5, 10, P.silver);
  pixel(12, 5, P.shadow);
});
// Leaf masses have irregular silhouettes, several light levels and individual leaf strokes.
for (const [name, variant] of [
  ["oak", 0],
  ["pine", 1],
  ["goldTree", 2],
])
  sprite(name, 48, 64, () => {
    oval(24, 58, 18, 4, P.shadow);
    rect(20, 32, 9, 27, P.wood);
    rect(21, 32, 3, 24, P.oak);
    line(24, 38, 25, 58, P.tan);
    line(21, 53, 15, 60, P.wood);
    line(27, 52, 33, 59, P.wood);
    const masses =
      variant === 1
        ? [
            [24, 12, 10, 11],
            [24, 23, 16, 13],
            [24, 34, 21, 14],
          ]
        : [
            [24, 12, 13, 11],
            [13, 24, 12, 14],
            [34, 23, 12, 14],
            [23, 34, 20, 13],
          ];
    for (const [cx, cy, rx, ry] of masses) {
      oval(cx, cy, rx, ry, P.ink);
      oval(cx, cy - 2, rx - 1, ry - 2, P.deep);
      oval(cx - 1, cy - 4, rx - 2, ry - 4, variant === 2 ? P.green : P.pine);
      oval(cx - 3, cy - 5, rx - 4, ry - 5, variant === 2 ? P.light : P.leaf);
    }
    for (let y = 3; y < 45; y++)
      for (let x = 3; x < 46; x++) {
        const idx = ((y + oy) * W + x + ox) * 4;
        if (data[idx + 3] && data[idx + 1] > 70) {
          let n = noise(x, y, variant + 22);
          if (n < 19) {
            pixel(x, y, variant === 2 ? P.gold : P.green);
            if (n < 8) pixel(x - 1, y - 1, variant === 2 ? P.cream : P.light);
          }
        }
      }
    line(11, 37, 18, 40, P.pine);
    line(27, 42, 37, 36, P.deep);
  });
sprite("bush", 32, 24, () => {
  oval(16, 21, 14, 3, P.shadow);
  for (const [x, y, rx, ry] of [
    [9, 13, 8, 8],
    [23, 13, 8, 9],
    [16, 9, 10, 8],
  ]) {
    oval(x, y, rx, ry, P.deep);
    oval(x - 1, y - 2, rx - 1, ry - 2, P.leaf);
    oval(x - 2, y - 3, rx - 3, ry - 3, P.green);
  }
  for (let i = 0; i < 13; i++) {
    let x = 5 + ((i * 11) % 22),
      y = 6 + ((i * 7) % 12);
    pixel(x, y, P.light);
    pixel(x + 1, y, P.green);
  }
});
sprite("flowers", 16, 16, () => {
  for (let i = 0; i < 3; i++) {
    let x = 3 + i * 5,
      y = 5 + ((i * 7) % 7);
    line(x, y, x - 1, 15, P.pine);
    pixel(x - 2, y + 5, P.green);
    rect(x - 2, y - 1, 5, 3, i === 1 ? P.purple : P.cream);
    rect(x - 1, y - 2, 3, 5, i === 1 ? P.purple : P.cream);
    pixel(x, y, P.gold);
  }
});
sprite("herb", 16, 24, () => {
  line(7, 7, 7, 22, P.wood);
  for (let i = 0; i < 4; i++) {
    let y = 5 + i * 4;
    line(7, y + 4, 3, y, P.leaf);
    line(7, y + 4, 12, y, P.leaf);
    line(3, y, 5, y, P.light);
    line(10, y, 12, y, P.light);
  }
  rect(6, 2, 3, 4, P.cream);
  pixel(7, 2, P.gold);
});
sprite("rock", 40, 32, () => {
  oval(20, 28, 19, 3, P.shadow);
  for (let y = 4; y < 29; y++) {
    const inset = y < 12 ? 14 - y : y > 24 ? (y - 24) * 2 : 2;
    rect(inset, y, 40 - inset * 2, 1, y < 13 ? P.silver : P.stone);
  }
  line(6, 18, 15, 6, P.shine);
  line(15, 6, 29, 8, P.silver);
  line(26, 9, 30, 23, P.shadow);
  line(11, 20, 21, 21, P.shadow);
  line(21, 21, 25, 26, P.shadow);
  for (let i = 0; i < 14; i++)
    pixel(7 + ((i * 7) % 24), 12 + ((i * 3) % 14), i % 3 ? P.silver : P.shadow);
});
sprite("fence", 32, 24, () => {
  for (const x of [2, 25]) {
    rect(x, 3, 5, 21, P.wood);
    rect(x, 2, 5, 3, P.tan);
    line(x + 1, 5, x + 1, 23, P.oak);
  }
  for (const y of [8, 17]) {
    rect(0, y, 32, 4, P.wood);
    rect(0, y, 32, 2, P.tan);
  }
});
sprite("lamp", 16, 40, () => {
  rect(7, 14, 3, 25, P.wood);
  rect(8, 14, 1, 24, P.oak);
  rect(3, 5, 11, 13, P.ink);
  rect(5, 7, 7, 8, P.gold);
  rect(7, 6, 3, 11, P.cream);
  rect(2, 4, 13, 3, P.wood);
  rect(5, 2, 7, 2, P.oak);
  rect(4, 17, 9, 2, P.wood);
  rect(5, 37, 7, 3, P.ink);
});
sprite("well", 48, 48, () => {
  oval(24, 42, 23, 4, P.shadow);
  oval(24, 33, 21, 11, P.stone);
  rect(3, 25, 42, 10, P.stone);
  oval(24, 25, 21, 10, P.silver);
  oval(24, 25, 15, 6, P.deep);
  oval(24, 25, 11, 3, P.water);
  for (const x of [6, 38]) {
    rect(x, 7, 4, 28, P.wood);
    rect(x, 7, 1, 27, P.tan);
  }
  rect(5, 10, 37, 3, P.oak);
  rect(23, 11, 1, 16, P.tan);
  for (let y = 0; y < 12; y++)
    rect(23 - y * 2, y, 3 + y * 4, 1, y % 3 === 0 ? P.rooflight : P.roof);
  rect(1, 12, 46, 3, P.roofdark);
  rect(20, 24, 8, 5, P.wood);
  line(5, 34, 14, 37, P.shadow);
  line(29, 35, 37, 32, P.shadow);
});
for (let variant = 0; variant < 7; variant++)
  sprite("house" + variant, 112, 112, () => {
    const roof =
        variant === 1
          ? P.pine
          : variant === 2
            ? P.earth
            : variant === 5
              ? P.water
              : variant === 6
                ? P.purple
                : P.roof,
      roofLight =
        variant === 1
          ? P.green
          : variant === 2
            ? P.tan
            : variant === 5
              ? P.wave
              : variant === 6
                ? P.skin
                : P.rooflight;
    oval(56, 106, 53, 5, P.shadow);
    rect(10, 45, 92, 59, P.wood);
    rect(13, 46, 86, 55, P.cream);
    for (let y = 49; y < 100; y += 6) line(14, y, 98, y, P.tan);
    for (const x of [12, 49, 96]) {
      rect(x, 45, 4, 56, P.wood);
      line(x, 47, x, 99, P.oak);
    }
    for (let y = 14; y < 51; y++) {
      let inset = Math.max(4, Math.floor((49 - y) * 0.65));
      rect(inset, y, 112 - inset * 2, 1, roof);
      if (y % 6 === 1) {
        rect(inset, y, 112 - inset * 2, 1, roofLight);
        for (let x = inset + (y % 12) * 2; x < 112 - inset; x += 13)
          line(x, y, x - 3, y + 5, P.roofdark);
      }
    }
    rect(3, 50, 106, 5, P.roofdark);
    rect(5, 50, 102, 2, roofLight);
    rect(21, 12, 13, 22, P.shadow);
    rect(22, 12, 11, 20, P.stone);
    rect(20, 10, 15, 4, P.silver);
    rect(24, 13, 5, 2, P.shadow);
    for (const x of [23, 76]) {
      rect(x - 2, 65, 19, 22, P.wood);
      rect(x, 67, 15, 16, P.blue);
      rect(x + 1, 68, 6, 6, P.foam);
      line(x + 7, 67, x + 7, 83, P.tan);
      line(x, 75, x + 14, 75, P.tan);
      rect(x - 3, 85, 21, 3, P.oak);
      rect(x - 2, 89, 18, 3, P.leaf);
      for (let i = 0; i < 4; i++) pixel(x + i * 5, 88, i % 2 ? P.cream : P.red);
    }
    rect(44, 76, 24, 28, P.wood);
    rect(47, 78, 18, 26, P.oak);
    for (let x = 49; x < 65; x += 5) line(x, 79, x, 102, P.wood);
    rect(61, 89, 2, 3, P.gold);
    rect(41, 103, 30, 4, P.stone);
    line(41, 103, 70, 103, P.silver);
    if (variant === 5) {
      rect(37, 31, 38, 19, P.wood);
      rect(40, 33, 32, 14, P.cream);
      rect(49, 35, 14, 12, P.blue);
      line(56, 35, 56, 46, P.tan);
    }
    if (variant === 6) {
      rect(17, 93, 24, 9, P.wood);
      rect(19, 91, 20, 3, P.green);
      for (let i = 0; i < 5; i++)
        pixel(20 + i * 4, 90, i % 2 ? P.cream : P.red);
    }
    if (variant === 3) {
      rect(72, 83, 25, 8, P.ink);
      rect(77, 90, 15, 6, P.stone);
      rect(77, 85, 22, 3, P.silver);
      rect(15, 44, 13, 12, P.wood);
      rect(17, 46, 9, 8, P.gold);
    }
    if (variant === 4) {
      rect(3, 58, 36, 7, P.wood);
      rect(5, 59, 32, 4, P.tan);
      for (let i = 0; i < 4; i++) rect(5 + i * 8, 57, 5, 7, P.green);
    }
  });
sprite("wardrobe", 40, 64, () => {
  rect(3, 2, 34, 60, P.ink);
  rect(5, 4, 30, 54, P.wood);
  rect(7, 6, 26, 49, P.oak);
  rect(9, 8, 9, 20, P.tan);
  rect(22, 8, 9, 20, P.tan);
  rect(9, 34, 9, 17, P.tan);
  rect(22, 34, 9, 17, P.tan);
  rect(19, 6, 2, 49, P.wood);
  rect(15, 29, 3, 3, P.gold);
  rect(23, 29, 3, 3, P.gold);
  rect(1, 0, 38, 5, P.oak);
  rect(5, 58, 5, 6, P.wood);
  rect(30, 58, 5, 6, P.wood);
});
sprite("table", 64, 40, () => {
  rect(8, 23, 5, 15, P.wood);
  rect(52, 23, 5, 15, P.wood);
  rect(2, 4, 60, 24, P.wood);
  rect(3, 2, 58, 23, P.oak);
  for (let y = 3; y < 25; y += 6) line(4, y, 59, y, P.tan);
  line(18, 4, 18, 22, P.wood);
  rect(38, 7, 16, 13, P.cream);
  rect(45, 7, 1, 13, P.wood);
  for (let i = 0; i < 4; i++) {
    line(39, 10 + i * 2, 43, 10 + i * 2, P.tan);
    line(47, 10 + i * 2, 52, 10 + i * 2, P.tan);
  }
  rect(10, 6, 6, 7, P.stone);
});
sprite("bed", 64, 40, () => {
  rect(2, 4, 60, 32, P.wood);
  rect(5, 6, 53, 27, P.blue);
  for (let y = 9; y < 31; y += 5) line(7, y, 56, y, P.wave);
  rect(7, 7, 14, 23, P.cream);
  rect(9, 9, 10, 19, P.shine);
  rect(2, 2, 4, 37, P.oak);
  rect(58, 2, 4, 37, P.oak);
});
sprite("chest", 32, 24, () => {
  rect(2, 6, 28, 17, P.ink);
  rect(4, 8, 24, 13, P.oak);
  oval(16, 8, 13, 7, P.wood);
  oval(16, 7, 11, 5, P.tan);
  rect(3, 10, 26, 3, P.wood);
  for (const x of [6, 23]) rect(x, 4, 3, 17, P.gold);
  rect(14, 10, 5, 7, P.gold);
  rect(16, 12, 1, 3, P.ink);
});
sprite("stairs", 32, 32, () => {
  rect(0, 0, 32, 32, P.ink);
  for (let i = 0; i < 6; i++) {
    rect(i * 2, 3 + i * 4, 32 - i * 4, 3, P.stone);
    line(i * 2, 3 + i * 4, 31 - i * 2, 3 + i * 4, P.silver);
  }
});
sprite("anvil", 40, 32, () => {
  rect(10, 25, 22, 5, P.wood);
  rect(17, 15, 10, 11, P.stone);
  rect(9, 10, 25, 8, P.ink);
  rect(3, 8, 34, 7, P.stone);
  line(2, 7, 35, 7, P.silver);
  line(7, 9, 37, 9, P.silver);
  rect(29, 5, 6, 3, P.stone);
});
sprite("barrel", 24, 32, () => {
  oval(12, 28, 10, 3, P.shadow);
  oval(12, 15, 10, 14, P.wood);
  rect(3, 6, 18, 20, P.oak);
  for (const x of [5, 10, 16]) line(x, 5, x, 27, P.wood);
  for (const y of [7, 23]) {
    rect(2, y, 20, 3, P.stone);
    line(3, y, 20, y, P.silver);
  }
  oval(12, 4, 9, 3, P.tan);
  oval(12, 4, 6, 1, P.oak);
});
// Compact hand-drawn 24x32 people. Each row has idle + two walk frames.
for (const [type, color] of [
  ["hero", P.blue],
  ["smith", P.earth],
  ["innkeeper", P.purple],
  ["elder", P.silver],
  ["lumberjack", P.gold],
  ["merchant", P.water],
  ["missing", P.oak],
])
  for (let frame = 0; frame < 3; frame++)
    sprite(`${type}${frame}`, 24, 32, () => {
      const shift = frame === 1 ? -1 : frame === 2 ? 1 : 0;
      oval(12, 29, 9, 2, P.shadow);
      rect(7, 22 + shift, 4, 7, P.wood);
      rect(14, 22 - shift, 4, 7, P.wood);
      rect(6, 28 + shift, 6, 2, P.ink);
      rect(14, 28 - shift, 6, 2, P.ink);
      rect(6, 13, 13, 12, P.ink);
      rect(7, 14, 11, 9, color);
      line(8, 15, 8, 21, P.shine);
      rect(5, 16, 3, 7, color);
      rect(18, 16, 3, 7, color);
      rect(4, 22, 4, 3, P.skin);
      rect(18, 22, 4, 3, P.skin);
      rect(7, 23, 11, 2, P.wood);
      rect(12, 23, 3, 2, P.gold);
      oval(12, 9, 6, 6, P.wood);
      rect(7, 5, 11, 9, P.skin);
      rect(8, 6, 3, 2, P.tan);
      rect(8, 9, 2, 2, P.ink);
      rect(15, 9, 2, 2, P.ink);
      pixel(13, 12, P.wood);
      rect(6, 3, 13, 4, type === "elder" ? P.silver : P.wood);
      rect(8, 2, 9, 2, type === "elder" ? P.shine : P.oak);
      if (type === "hero") {
        rect(6, 3, 13, 6, P.stone);
        rect(7, 3, 10, 3, P.silver);
        line(9, 2, 16, 2, P.shine);
        rect(6, 8, 13, 3, P.ink);
        pixel(9, 9, P.foam);
        pixel(15, 9, P.foam);
        rect(11, 0, 3, 3, P.red);
        rect(2, 15, 6, 10, P.ink);
        rect(3, 16, 4, 7, P.blue);
        pixel(4, 19, P.shine);
        rect(21, 10, 2, 16, P.silver);
        rect(20, 9, 1, 12, P.shine);
        rect(18, 24, 6, 2, P.gold);
      }
      if (type === "elder") {
        rect(8, 12, 9, 5, P.shine);
        rect(9, 17, 7, 1, P.silver);
        rect(21, 17, 1, 13, P.oak);
      }
      if (type === "lumberjack" || type === "missing") {
        rect(5, 3, 15, 3, P.green);
        rect(8, 1, 9, 3, P.leaf);
        rect(11, 15, 2, 8, P.wood);
      }
      if (type === "smith") {
        rect(9, 14, 6, 10, P.wood);
        rect(20, 15, 2, 10, P.wood);
        rect(19, 13, 5, 4, P.silver);
      }
    });
for (const type of ["slime", "wolf", "boss"])
  for (let frame = 0; frame < 3; frame++)
    sprite(
      `${type}${frame}`,
      type === "boss" ? 48 : 32,
      type === "boss" ? 48 : 32,
      () => {
        const boss = type === "boss",
          cx = boss ? 24 : 16,
          cy = boss ? 25 : 18,
          bob = frame === 1 ? 1 : 0;
        oval(cx, boss ? 43 : 29, boss ? 21 : 14, 3, P.shadow);
        if (type === "slime") {
          oval(cx, cy + bob, 13, 10, P.deep);
          oval(cx, cy - 2 + bob, 11, 9, P.leaf);
          oval(cx - 2, cy - 4 + bob, 8, 6, P.light);
          rect(cx - 7, cy, 3, 3, P.ink);
          rect(cx + 5, cy, 3, 3, P.ink);
          line(cx - 2, cy + 6, cx + 2, cy + 6, P.deep);
          rect(cx - 7, cy - 7 + bob, 4, 2, P.cream);
          return;
        }
        if (boss) {
          for (let i = 0; i < 6; i++) {
            line(cx + (i - 3) * 4, cy + 9, cx + (i - 3) * 7, 43, P.wood);
            line(cx + (i - 3) * 4 + 1, cy + 9, cx + (i - 3) * 7 + 1, 43, P.oak);
          }
          line(12, 15, 7, 2, P.oak);
          line(36, 15, 42, 2, P.oak);
          line(8, 7, 3, 9, P.wood);
          line(40, 8, 46, 10, P.wood);
        }
        oval(cx, cy - 2 + bob, boss ? 16 : 12, boss ? 17 : 12, P.deep);
        oval(
          cx,
          cy - 4 + bob,
          boss ? 14 : 10,
          boss ? 14 : 10,
          boss ? P.wood : P.purple,
        );
        for (let i = 0; i < 17; i++) {
          let x = cx - 8 + ((i * 7) % 17),
            y = cy - 13 + ((i * 11) % 21);
          pixel(x, y, boss ? P.tan : P.silver);
        }
        rect(cx - 7, cy - 5, 4, 3, P.gold);
        rect(cx + 4, cy - 5, 4, 3, P.gold);
        pixel(cx - 6, cy - 5, P.cream);
        pixel(cx + 5, cy - 5, P.cream);
        rect(cx - 3, cy + 3, 7, 3, P.ink);
        pixel(cx - 2, cy + 3, P.shine);
        pixel(cx + 2, cy + 3, P.shine);
        if (boss) {
          oval(12, 10, 8, 7, P.leaf);
          oval(36, 10, 8, 7, P.leaf);
          oval(24, 6, 12, 5, P.green);
          pixel(18, 4, P.light);
          pixel(30, 5, P.light);
        } else {
          line(8, 11, 6, 3, P.tan);
          line(23, 11, 26, 3, P.tan);
        }
      },
    );
sprite("hill", 64, 48, () => {
  for (let y = 7; y < 43; y++) {
    const inset = y < 17 ? 17 - y / 2 : y > 37 ? (y - 37) * 2 : 3;
    rect(
      Math.ceil(inset),
      y,
      64 - Math.ceil(inset) * 2,
      1,
      y < 22 ? P.leaf : P.stone,
    );
  }
  for (let y = 10; y < 23; y++)
    for (let x = 10; x < 55; x++) {
      const n = noise(x, y, 88);
      if (n < 12) pixel(x, y, P.green);
      if (n > 96) pixel(x, y, P.light);
    }
  for (let y = 24; y < 41; y += 6) {
    line(5, y, 58, y, P.shadow);
    for (let x = 8 + (y % 12); x < 58; x += 16)
      line(x, y, x - 2, y + 5, P.shadow);
    line(9, y + 1, 53, y + 1, P.silver);
  }
  for (let i = 0; i < 9; i++) {
    const x = 7 + i * 6;
    line(x, 20, x + 2, 23 + (i % 3), P.deep);
    pixel(x + 1, 22, P.green);
  }
  line(10, 9, 40, 8, P.light);
  line(40, 8, 54, 14, P.green);
  line(7, 43, 57, 43, P.shadow);
});
// PNG encoder, with standard zlib compression and CRC-32 chunks.
const crc32 = (b) => {
  let c = 0xffffffff;
  for (const x of b) {
    c ^= x;
    for (let i = 0; i < 8; i++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return (c ^ 0xffffffff) >>> 0;
};
function chunk(type, b) {
  const t = Buffer.from(type),
    len = Buffer.alloc(4),
    crc = Buffer.alloc(4);
  len.writeUInt32BE(b.length);
  crc.writeUInt32BE(crc32(Buffer.concat([t, b])));
  return Buffer.concat([len, t, b, crc]);
}
const header = Buffer.alloc(13);
header.writeUInt32BE(W);
header.writeUInt32BE(H, 4);
header[8] = 8;
header[9] = 6;
const rows = Buffer.alloc((W * 4 + 1) * H);
for (let y = 0; y < H; y++)
  Buffer.from(data.buffer, y * W * 4, W * 4).copy(rows, y * (W * 4 + 1) + 1);
mkdirSync("assets", { recursive: true });
writeFileSync(
  "assets/smaragd-atlas.png",
  Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(rows)),
    chunk("IEND", Buffer.alloc(0)),
  ]),
);
writeFileSync(
  "assets/atlas.js",
  `// Generated by tools/build-assets.mjs; edit the original artwork source.\nexport const ATLAS = ${JSON.stringify(atlas, null, 2)};\nexport const PALETTE = ${JSON.stringify(P, null, 2)};\n`,
);
console.log(
  `Wrote ${Object.keys(atlas).length} original sprites to a ${W}x${H} PNG atlas.`,
);
