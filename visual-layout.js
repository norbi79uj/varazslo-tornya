// Rendering coordinates only. Logical positions, collisions and saves stay intact.
export const VISUAL_GRID = Object.freeze({
  sourceTile: 16,
  tile: 32,
  pixel: 2,
  layout: 8,
  actorFoot: 8,
});
export const snap = (value, step = VISUAL_GRID.pixel) =>
  Math.round(value / step) * step;
export const ART_FEET = {
  roundWell0: { x: 32, y: 56 },
  roundWell1: { x: 32, y: 56 },
  weaponRack: { x: 16, y: 46 },
  woodpile: { x: 24, y: 30 },
  bench: { x: 24, y: 30 },
  marketCounter: { x: 36, y: 30 },
  stump: { x: 16, y: 26 },
  woodShed: { x: 32, y: 62 },
  anvil: { x: 16, y: 30 },
  rock: { x: 16, y: 30 },
};
export function buildingPlacement(b) {
  const width = snap(b.w, 8),
    cx = snap(b.x + b.w / 2, 8),
    ground = snap(b.y + b.h, 8);
  return {
    x: cx - width / 2,
    cx,
    width,
    ground,
    top: ground - 80,
    wallY: ground - 32,
    roofY: ground - 80,
  };
}
export function actorPlacement(actor, scale = 2) {
  const cx = snap(actor.x),
    ground = snap(actor.y + VISUAL_GRID.actorFoot);
  return {
    cx,
    ground,
    x: cx - 8 * scale,
    y: ground - 16 * scale,
    w: 16 * scale,
    h: 16 * scale,
  };
}
export function artPlacement(name, cx, ground, size) {
  const foot = ART_FEET[name] || { x: size.w / 2, y: size.h };
  return {
    cx: snap(cx),
    ground: snap(ground),
    x: snap(cx - foot.x),
    y: snap(ground - foot.y),
    w: size.w,
    h: size.h,
  };
}
export function propPlacement(prop, size) {
  const foot = prop.foot,
    cx = foot ? foot.x + foot.w / 2 : prop.x + size.w / 2;
  const ground = foot ? foot.y + foot.h : prop.y + size.h;
  return artPlacement(
    prop.art,
    snap(cx, foot ? 2 : 8),
    snap(ground, foot ? 2 : 8),
    size,
  );
}
export function sortByGround(entries) {
  return entries.sort(
    (a, b) => a.ground - b.ground || (a.order ?? 0) - (b.order ?? 0),
  );
}
