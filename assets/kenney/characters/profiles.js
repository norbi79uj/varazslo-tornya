import { drawDetail } from "../../village/draw.js";
// Kenney Roguelike Characters 2.0, CC0. Coordinates are zero-based (column, row).
// 16x16 tiles, one transparent separator pixel. Original PNG is unmodified.
export const CHARACTER_SHEET = {
  url: new URL("./roguelikeChar_transparent.png", import.meta.url).href,
  width: 918,
  height: 203,
  tileSize: 16,
  margin: 1,
};
const tile = (column, row, dx = 0, dy = 0) => ({ column, row, dx, dy });
export const CHARACTER_PROFILES = {
  hero: { layers: [tile(0, 11)], equipment: [tile(44, 6, 7)] },
  smith: { layers: [tile(0, 6)] },
  innkeeper: { layers: [tile(0, 5)] },
  elder: { layers: [tile(1, 5)] },
  lumberjack: { layers: [tile(0, 8)], equipment: [tile(47, 0, 7)] },
  merchant: { layers: [tile(0, 10)] },
  missing: { layers: [tile(1, 9)] },
  // Enemies are original Kenney modular bodies, outfits and headgear combined.
  // Existing encounter IDs, names, stats and save data remain unchanged.
  slime: { layers: [tile(0, 3), tile(6, 5), tile(23, 4)] },
  wolf: {
    layers: [tile(1, 3), tile(15, 7), tile(28, 6)],
    equipment: [tile(47, 1, 7)],
  },
  boss: {
    layers: [tile(0, 3), tile(14, 9), tile(26, 4), tile(29, 6)],
    equipment: [tile(42, 4, 7)],
  },
};
export function sourceRect(layer) {
  return { x: layer.column * 17, y: layer.row * 17, w: 16, h: 16 };
}
// Animation uses the static CC0 art: alternating foot offsets and a small body bob.
// We do not label unrelated outfits as a walk-animation strip or alter PNG pixels.
export function drawKenneyActor(
  ctx,
  image,
  name,
  x,
  y,
  {
    scale = 2,
    frame = 0,
    flip = false,
    direction = "down",
    details = null,
    pose = "idle",
    hideEquipment = false,
  } = {},
) {
  const profile = CHARACTER_PROFILES[name];
  if (!profile) throw Error(`Ismeretlen Kenney-karakter: ${name}`);
  if (![2, 3].includes(scale))
    throw Error("A karakterek egész, 2x vagy 3x léptéket használnak.");
  if (direction === "left") flip = true;
  else if (direction !== "down") flip = false;
  const stride = frame === 1 ? -1 : frame === 2 ? 1 : 0,
    bob = stride === 0 ? 0 : -1;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.translate(Math.round(x) + (flip ? 16 * scale : 0), Math.round(y));
  if (flip) ctx.scale(-1, 1);
  for (const layer of profile.layers) {
    const { x: sx, y: sy } = sourceRect(layer),
      dx = layer.dx * scale,
      dy = layer.dy * scale;
    ctx.drawImage(
      image,
      sx,
      sy,
      16,
      13,
      dx,
      dy + bob * scale,
      16 * scale,
      13 * scale,
    );
    ctx.drawImage(
      image,
      sx,
      sy + 13,
      8,
      3,
      dx,
      dy + (13 + stride - (pose === "sit" ? 2 : 0)) * scale,
      8 * scale,
      3 * scale,
    );
    ctx.drawImage(
      image,
      sx + 8,
      sy + 13,
      8,
      3,
      dx + 8 * scale,
      dy + (13 - stride - (pose === "sit" ? 2 : 0)) * scale,
      8 * scale,
      3 * scale,
    );
  }
  if (details && direction !== "down")
    drawDetail(
      ctx,
      details,
      name + "-" + (direction === "up" ? "up" : "right"),
      0,
      bob * scale,
      { scale },
    );
  for (const layer of hideEquipment ? [] : profile.equipment || []) {
    const { x: sx, y: sy } = sourceRect(layer);
    ctx.drawImage(
      image,
      sx,
      sy,
      16,
      16,
      layer.dx * scale,
      layer.dy * scale + bob * scale,
      16 * scale,
      16 * scale,
    );
  }
  ctx.restore();
}
