import { DETAIL_SPRITES } from "./atlas.js";
export { DETAIL_SHEET } from "./sheet.js";
export { DETAIL_SPRITES };
export function drawDetail(
  ctx,
  image,
  name,
  x,
  y,
  { flip = false, scale = 2, crop = null } = {},
) {
  const s = DETAIL_SPRITES[name];
  if (!s) throw Error("Hiányzó falusi grafika: " + name);
  const region = crop || { x: 0, y: 0, w: s.w, h: s.h };
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.translate(Math.round(x) + (flip ? region.w * scale : 0), Math.round(y));
  if (flip) ctx.scale(-1, 1);
  ctx.drawImage(
    image,
    s.x + region.x,
    s.y + region.y,
    region.w,
    region.h,
    0,
    0,
    region.w * scale,
    region.h * scale,
  );
  ctx.restore();
}
