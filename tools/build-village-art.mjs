// Original CC0 supplementary pixel art; node tools/build-village-art.mjs (no packages).
// Every mark is snapped to the native pixel grid. This is the editable art source.
import { writeFileSync, mkdirSync } from "node:fs";
import { deflateSync } from "node:zlib";
const W = 256,
  H = 384,
  data = new Uint8Array(W * H * 4),
  atlas = {};
const P = {
  ink: "#494e48",
  deep: "#354a3d",
  shadow: "#6b765d",
  wood: "#886544",
  oak: "#b58b5b",
  tan: "#d3b789",
  cream: "#e8dfc1",
  stone: "#8e9b97",
  silver: "#b6c1bd",
  shine: "#e5e6d6",
  water: "#63bdc7",
  wave: "#a0d9d3",
  leaf: "#7fa927",
  green: "#4da66c",
  light: "#b2ce57",
  grass: "#8bb82b",
  red: "#bf684d",
  blue: "#63878e",
  purple: "#927494",
  skin: "#d8ae79",
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
  data[i + 3] = col[3] ?? 255;
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
// Real roof courses, with left/middle/right pieces; each texel stays two pixels.
for (const [theme, base, light, dark] of [
  ["cedar", "#b86e4c", "#d89b67", "#874f3d"],
  ["slate", "#64828c", "#94b5bc", "#455e69"],
  ["moss", "#4b9363", "#7bbb77", "#356849"],
  ["thatch", "#b59a57", "#e0c17d", "#88753e"],
]) {
  for (const part of ["Left", "Middle", "Right"])
    sprite("roof" + theme + part, 16, 32, () => {
      for (let y = 0; y < 32; y++)
        for (let x = 0; x < 16; x++) {
          const min = part === "Left" ? Math.max(0, 15 - y) : 0,
            max = part === "Right" ? Math.min(15, y) : 15;
          if (x < min || x > max) continue;
          pixel(
            x,
            y,
            y % 5 === 0 || (x + (Math.floor(y / 5) % 2) * 4) % 8 === 0
              ? dark
              : base,
          );
          if (y % 5 === 1) pixel(x, y, light);
          if ((x * 13 + y * 7) % 31 === 0 && y % 5 > 1) pixel(x, y, light);
          if ((x === min && part === "Left") || (x === max && part === "Right"))
            pixel(x, y, light);
          if (y === 31) pixel(x, y, dark);
        }
    });
}
for (let f = 0; f < 2; f++)
  sprite("roundWell" + f, 32, 32, () => {
    oval(16, 28, 15, 3, "#263e3038");
    oval(16, 22, 12, 7, P.wood);
    rect(4, 16, 25, 7, P.stone);
    oval(16, 22, 12, 5, P.stone);
    for (let y = 16; y < 27; y += 5) {
      line(5, y, 27, y, P.shadow);
      for (let x = 6 + (y % 2) * 3; x < 28; x += 7)
        line(x, y, x, y + 3, P.shadow);
    }
    oval(16, 15, 13, 7, P.silver);
    oval(16, 14, 10, 4, P.ink);
    oval(16, 15, 9, 3, P.water);
    line(10 + f * 2, 15, 15 + f * 2, 15, P.wave);
    line(17 - f, 17, 21 - f, 17, P.wave);
    rect(4, 4, 2, 17, P.wood);
    rect(26, 4, 2, 17, P.wood);
    rect(3, 3, 26, 3, P.wood);
    rect(4, 3, 24, 1, P.tan);
    line(16, 5, 16, 14, P.cream);
    rect(23, 20, 7, 7, P.wood);
    rect(24, 21, 5, 5, P.oak);
    line(24, 18, 28, 18, P.ink);
    line(23, 19, 23, 22, P.ink);
    line(29, 19, 29, 22, P.ink);
    line(24, 23, 28, 23, P.tan);
  });
sprite("bench", 24, 16, () => {
  oval(12, 14, 11, 2, "#263e3038");
  rect(2, 2, 2, 12, P.wood);
  rect(20, 2, 2, 12, P.wood);
  rect(2, 3, 20, 3, P.oak);
  line(3, 3, 20, 3, P.tan);
  rect(1, 9, 22, 3, P.oak);
  line(1, 9, 22, 9, P.tan);
  rect(4, 12, 2, 3, P.wood);
  rect(18, 12, 2, 3, P.wood);
});
sprite("weaponRack", 16, 24, () => {
  rect(1, 3, 2, 20, P.wood);
  rect(13, 3, 2, 20, P.wood);
  rect(0, 5, 16, 2, P.oak);
  rect(0, 18, 16, 2, P.oak);
  for (const x of [5, 10]) {
    rect(x, 2, 2, 13, P.silver);
    pixel(x, 1, P.shine);
    rect(x - 2, 14, 5, 1, P.tan);
    rect(x, 15, 1, 5, P.wood);
  }
  rect(3, 21, 10, 2, P.wood);
});
sprite("woodpile", 24, 16, () => {
  oval(12, 14, 11, 2, "#263e3038");
  for (const [y, xs] of [
    [10, [5, 12, 19]],
    [5, [8, 15]],
    [1, [11]],
  ])
    for (const x of xs) {
      rect(x - 3, y, 6, 5, P.wood);
      oval(x, y + 2, 3, 2, P.tan);
      oval(x, y + 2, 1, 1, P.oak);
      pixel(x + 1, y + 1, P.wood);
    }
});
sprite("ironBars", 16, 8, () => {
  for (let y = 1; y < 7; y += 2) {
    rect(1 + (y % 3), y, 13, 2, P.ink);
    rect(2 + (y % 3), y, 11, 1, P.silver);
  }
});
sprite("stump", 16, 16, () => {
  oval(8, 14, 7, 2, "#263e3038");
  rect(2, 6, 12, 7, P.wood);
  line(4, 7, 4, 12, P.oak);
  line(11, 7, 11, 12, P.oak);
  oval(8, 6, 7, 4, P.tan);
  oval(8, 6, 4, 2, P.oak);
  oval(8, 6, 2, 1, P.tan);
  line(8, 3, 10, 5, P.wood);
});
sprite("toolbox", 16, 16, () => {
  rect(2, 8, 13, 6, P.wood);
  rect(3, 9, 11, 4, P.oak);
  rect(7, 4, 2, 10, P.tan);
  rect(3, 2, 10, 3, P.silver);
  line(11, 2, 14, 6, P.ink);
  rect(3, 6, 1, 5, P.silver);
});
sprite("basket", 16, 16, () => {
  oval(8, 12, 7, 3, P.wood);
  rect(2, 6, 12, 6, P.oak);
  oval(8, 6, 6, 3, P.tan);
  for (let x = 3; x < 14; x += 3) line(x, 8, x, 12, P.tan);
  line(2, 10, 13, 10, P.wood);
  for (const [x, y, c] of [
    [5, 5, P.red],
    [9, 4, P.red],
    [11, 6, P.light],
    [7, 7, P.red],
  ]) {
    oval(x, y, 2, 2, c);
    pixel(x, y - 2, P.deep);
  }
});
sprite("sacks", 16, 16, () => {
  for (const [x, y] of [
    [6, 9],
    [12, 10],
  ]) {
    oval(x, y, 4, 5, P.wood);
    oval(x, y - 1, 3, 4, P.tan);
    rect(x - 2, y - 6, 4, 2, P.cream);
    line(x - 2, y - 4, x + 1, y - 4, P.wood);
    pixel(x + 1, y + 1, P.oak);
  }
});
sprite("awning", 48, 32, () => {
  rect(2, 10, 2, 22, P.wood);
  rect(44, 10, 2, 22, P.wood);
  for (let y = 1; y < 16; y++) {
    const x = Math.max(0, 7 - y);
    for (let xx = x; xx < 48 - x; xx++)
      pixel(xx, y, Math.floor(xx / 6) % 2 === 0 ? P.cream : P.green);
  }
  for (let x = 0; x < 48; x += 6) {
    rect(x, 15, 6, 3, (x / 6) % 2 === 0 ? P.tan : "#357b58");
    rect(x + 1, 18, 4, 2, (x / 6) % 2 === 0 ? P.cream : P.green);
  }
  line(4, 2, 43, 2, P.shine);
});
sprite("marketCounter", 36, 16, () => {
  rect(0, 5, 36, 10, P.wood);
  rect(1, 7, 34, 7, P.oak);
  for (let x = 2; x < 35; x += 6) line(x, 8, x, 13, P.wood);
  rect(0, 4, 36, 3, P.tan);
  for (const x of [3, 10, 17]) {
    rect(x, 0, 3, 1, P.cream);
    rect(x, 1, 3, 5, "#638da2");
    pixel(x, 2, P.wave);
  }
  for (const x of [24, 28, 32]) {
    oval(x, 3, 2, 2, P.red);
    pixel(x, 1, P.leaf);
  }
});
sprite("woodShed", 32, 32, () => {
  rect(3, 12, 26, 18, P.wood);
  rect(4, 13, 24, 16, P.deep);
  for (const x of [4, 26]) rect(x, 10, 2, 21, P.oak);
  for (let y = 4; y < 15; y++) {
    const d = Math.max(0, 10 - y);
    rect(d, y, 32 - d * 2, 1, y % 3 === 0 ? P.wood : P.oak);
  }
  for (let y = 22; y < 29; y += 4)
    for (let x = 9; x < 26; x += 7) {
      oval(x, y, 3, 2, P.tan);
      pixel(x, y, P.wood);
    }
  line(4, 30, 28, 30, P.tan);
});
for (const [name, type] of [
  ["innSign", "inn"],
  ["smithSign", "smith"],
  ["gardenSign", "garden"],
  ["waypost", "way"],
])
  sprite(name, 24, 24, () => {
    rect(2, 1, 2, 22, P.wood);
    rect(2, 1, 19, 2, P.oak);
    line(7, 3, 7, 7, P.ink);
    line(20, 3, 20, 7, P.ink);
    rect(5, 6, 18, 12, P.wood);
    rect(6, 7, 16, 10, P.tan);
    line(7, 8, 20, 8, P.oak);
    if (type === "inn") {
      rect(13, 10, 4, 5, P.deep);
      line(13, 10, 10, 9, P.deep);
      line(16, 10, 18, 8, P.deep);
      line(13, 14, 12, 16, P.deep);
      line(16, 14, 17, 16, P.deep);
    }
    if (type === "smith") {
      rect(10, 11, 9, 3, P.ink);
      rect(13, 14, 3, 2, P.ink);
      rect(9, 10, 3, 2, P.silver);
    }
    if (type === "garden") {
      line(14, 10, 14, 15, P.green);
      oval(12, 11, 2, 1, P.green);
      oval(16, 12, 2, 1, P.green);
    }
    if (type === "way") {
      line(9, 12, 19, 12, P.wood);
      line(17, 10, 19, 12, P.wood);
      line(17, 14, 19, 12, P.wood);
    }
  });
sprite("hammerUp", 16, 16, () => {
  line(7, 14, 11, 4, P.wood);
  rect(7, 1, 8, 4, P.ink);
  rect(8, 1, 6, 3, P.silver);
  pixel(9, 1, P.shine);
});
sprite("hammerDown", 16, 16, () => {
  line(1, 5, 12, 10, P.wood);
  rect(10, 7, 5, 6, P.ink);
  rect(10, 8, 4, 4, P.silver);
  pixel(10, 8, P.shine);
});
sprite("axeUp", 16, 16, () => {
  line(3, 15, 10, 3, P.oak);
  rect(8, 1, 6, 4, P.silver);
  rect(7, 2, 3, 5, P.silver);
  pixel(7, 3, P.shine);
});
sprite("axeDown", 16, 16, () => {
  line(1, 4, 13, 10, P.oak);
  rect(10, 7, 5, 5, P.silver);
  rect(12, 6, 3, 8, P.silver);
  line(14, 7, 14, 12, P.shine);
});
sprite("walkingStick", 8, 16, () => {
  line(4, 3, 4, 15, P.wood);
  line(1, 2, 4, 3, P.wood);
  pixel(1, 1, P.tan);
});
for (let f = 0; f < 3; f++)
  sprite("smoke" + f, 16, 24, () => {
    oval(7 + (f % 2), 20, 3, 2, "#e5e6d648");
    oval(10 - f, 14, 4, 3, "#e5e6d638");
    oval(6 + f, 7, 5, 3, "#e5e6d628");
  });
for (let f = 0; f < 2; f++)
  sprite("chicken" + f, 16, 16, () => {
    oval(8, 13, 5, 1, "#263e3038");
    rect(6, 12 + f, 1, 2, P.tan);
    rect(10, 12 - f, 1, 2, P.tan);
    oval(8, 8, 5, 4, P.cream);
    rect(2, 6, 3, 4, P.shine);
    rect(11, 3, 3, 7, P.cream);
    rect(11, 2, 3, 2, P.red);
    pixel(12, 5, P.ink);
    rect(14, 6, 2, 1, P.tan);
    line(6, 9, 9, 10, P.tan);
  });
for (let f = 0; f < 2; f++)
  sprite("butterfly" + f, 8, 8, () => {
    rect(3, 2, 1, 4, P.wood);
    oval(1, 3, 1 + f, 2, P.cream);
    oval(5, 3, 1 + f, 2, P.red);
    pixel(2, 1, P.wood);
    pixel(4, 1, P.wood);
  });
for (let f = 0; f < 3; f++)
  sprite("tuft" + f, 16, 16, () => {
    for (const [x, y] of [
      [3, 7],
      [9, 12],
      [13, 4],
    ]) {
      line(x, y, x + (f % 2), y - 3, "#76a32b");
      line(x, y, x - 2, y - 2, "#a7c84d");
      pixel(x + 1, y - 2, "#639329");
    }
  });
sprite("leafCluster", 16, 16, () => {
  for (const [x, y] of [
    [3, 8],
    [7, 3],
    [12, 8],
    [6, 12],
    [11, 12],
  ]) {
    oval(x, y, 3, 2, P.leaf);
    line(x - 1, y - 1, x + 1, y - 1, P.light);
    pixel(x + 2, y + 1, "#6c942b");
  }
});
sprite("dapple", 32, 24, () => {
  oval(16, 12, 15, 10, "#28473314");
  oval(14, 13, 12, 7, "#28473314");
  for (const [x, y] of [
    [4, 11],
    [17, 7],
    [24, 16],
  ])
    rect(x, y, 5, 3, "#28473318");
});
sprite("shadow", 32, 16, () => {
  oval(16, 8, 15, 5, "#233f3026");
  oval(16, 8, 12, 3, "#233f3026");
});
sprite("windowGlow", 16, 16, () => {
  rect(3, 3, 10, 11, "#f9d77a48");
  rect(5, 5, 6, 8, "#ffe5a448");
});
sprite("flowerBed", 32, 16, () => {
  oval(16, 9, 15, 6, "#796642");
  oval(16, 8, 14, 5, "#a58a55");
  for (let x = 3; x < 30; x += 5) {
    line(x, 5, x, 10, P.leaf);
    oval(x, 5, 2, 2, x % 3 === 0 ? P.red : P.cream);
    pixel(x, 5, P.tan);
  }
});
sprite("dormer", 16, 16, () => {
  for (let y = 1; y < 7; y++) rect(8 - y, y, y * 2, 1, P.wood);
  rect(3, 7, 10, 9, P.tan);
  rect(5, 8, 6, 7, P.wood);
  rect(6, 9, 4, 5, P.water);
  line(8, 9, 8, 13, P.cream);
  line(6, 11, 9, 11, P.cream);
});
sprite("chimney", 16, 24, () => {
  rect(4, 3, 9, 20, P.ink);
  rect(5, 3, 7, 19, P.stone);
  for (let y = 6; y < 23; y += 4) {
    line(5, y, 11, y, P.shadow);
    pixel((y % 3) + 7, y - 2, P.silver);
  }
  rect(2, 1, 13, 4, P.silver);
  rect(4, 1, 9, 2, P.ink);
});
// Directional heads/backs supplement the front-facing CC0 Kenney art. Entirely
// original pixels; upper poses deliberately contain no front-facing eyes.
const families = {
  hero: [P.silver, P.blue],
  smith: ["#826a48", "#92754e"],
  innkeeper: ["#ab733f", "#be824c"],
  elder: [P.silver, "#6c9c9a"],
  lumberjack: ["#907645", "#bd863f"],
  merchant: ["#548d8f", "#a46c43"],
  missing: ["#a38b5a", "#8c8664"],
  slime: [P.green, P.leaf],
  wolf: [P.green, "#698575"],
  boss: [P.silver, "#4b6955"],
};
for (const [name, [hair, shirt]] of Object.entries(families))
  for (const dir of ["up", "right"])
    sprite(name + "-" + dir, 16, 16, () => {
      if (dir === "up") {
        rect(4, 1, 8, 6, P.ink);
        rect(3, 3, 10, 4, hair);
        rect(5, 1, 6, 5, hair);
        line(5, 2, 9, 2, P.cream);
        rect(4, 7, 8, 5, shirt);
        rect(3, 8, 2, 3, shirt);
        rect(11, 8, 2, 3, shirt);
        line(7, 8, 7, 11, P.wood);
      } else {
        rect(5, 1, 6, 6, hair);
        rect(4, 3, 8, 4, hair);
        rect(9, 3, 3, 4, name === "hero" ? P.ink : P.skin);
        pixel(11, 3, P.ink);
        pixel(12, 5, P.skin);
        rect(9, 7, 3, 3, shirt);
        rect(4, 7, 6, 4, shirt);
        line(5, 7, 5, 10, P.tan);
      }
      if (name === "hero") {
        rect(4, 7, 8, 5, P.silver);
        line(5, 8, 10, 8, P.shine);
        if (dir === "up") {
          rect(5, 8, 6, 5, P.blue);
          rect(7, 8, 2, 5, P.tan);
        }
      }
      if (name === "smith" && dir === "right") {
        rect(9, 6, 3, 3, hair);
        rect(5, 8, 6, 4, P.wood);
      }
    });
// A flat woven rug, rather than repurposing furniture tiles as floor fabric.
sprite("tavernRug", 48, 48, () => {
  rect(1, 1, 46, 46, "#75514a");
  rect(2, 2, 44, 44, P.tan);
  rect(4, 4, 40, 40, "#984f47");
  for (let j = 5; j < 44; j += 4) {
    pixel(j, 3, P.cream);
    pixel(j, 44, P.cream);
    pixel(3, j, P.cream);
    pixel(44, j, P.cream);
  }
  for (let y = 9; y < 42; y += 10)
    for (let x = 9; x < 42; x += 10) {
      line(x, y - 3, x + 3, y, P.tan);
      line(x + 3, y, x, y + 3, P.tan);
      line(x, y + 3, x - 3, y, P.tan);
      line(x - 3, y, x, y - 3, P.tan);
      pixel(x, y, P.cream);
    }
  for (let x = 3; x < 46; x += 3) {
    pixel(x, 0, P.cream);
    pixel(x, 47, P.cream);
  }
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
mkdirSync("assets/village", { recursive: true });
writeFileSync(
  "assets/village/details.png",
  Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(rows)),
    chunk("IEND", Buffer.alloc(0)),
  ]),
);
writeFileSync(
  "assets/village/atlas.js",
  `// Original CC0 supplemental art. Generated by tools/build-village-art.mjs; edit the original artwork source.\nexport const DETAIL_SPRITES = ${JSON.stringify(atlas, null, 2)};\nexport const DETAIL_PALETTE = ${JSON.stringify(P, null, 2)};\n`,
);
writeFileSync(
  "assets/village/sheet.js",
  `export const DETAIL_SHEET = { url:new URL('./details.png',import.meta.url).href,width:${W},height:${H} };\n`,
);
console.log(
  `Wrote ${Object.keys(atlas).length} original sprites to a ${W}x${H} PNG atlas.`,
);
