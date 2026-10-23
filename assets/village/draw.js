import { DETAIL_SPRITES } from "./atlas.js";
export { DETAIL_SHEET } from "./sheet.js";
export { DETAIL_SPRITES };
export function drawDetail(
  ctx,
  image,
  name,
  x,
  y,
  { flip = false, scale = 2 } = {},
) {
  const s = DETAIL_SPRITES[name];
  if (!s) throw Error("Hiányzó falusi grafika: " + name);
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.translate(Math.round(x) + (flip ? s.w * scale : 0), Math.round(y));
  if (flip) ctx.scale(-1, 1);
  ctx.drawImage(image, s.x, s.y, s.w, s.h, 0, 0, s.w * scale, s.h * scale);
  ctx.restore();
}
