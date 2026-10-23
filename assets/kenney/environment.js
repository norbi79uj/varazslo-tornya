// All terrain, architecture and furniture below use the supplied CC0 Kenney sheets.
// Source tiles: 16x16 with a 1px separator. Render scale: exactly 2 native pixels.
export const ENVIRONMENT_SHEETS = {
  rpg: {
    url: new URL("./rpg/roguelikeSheet_transparent.png", import.meta.url).href,
    width: 968,
    height: 526,
    sha256: "808c8d734480bc949b284f3bcc252e87e1ee53b24178791a6838cce6a319c439",
  },
  indoors: {
    url: new URL("./indoors/roguelikeIndoor_transparent.png", import.meta.url)
      .href,
    width: 458,
    height: 305,
    sha256: "ade984d5cbe3f16d9e23e6dc516246649de1a7eec2540cf31d53852b690c446f",
  },
};
export const KENNEY_COLORS = {
  ink: "#303b3c",
  cream: "#f0dfb5",
  shine: "#e8e3ce",
  light: "#9cba51",
  red: "#b86b52",
};
const t = (pack, column, row, dx = 0, dy = 0) => ({
  pack,
  column,
  row,
  dx,
  dy,
});
const r = (c, y, dx = 0, dy = 0) => t("rpg", c, y, dx, dy);
const i = (c, y, dx = 0, dy = 0) => t("indoors", c, y, dx, dy);
const sprite = (w, h, ...layers) => ({ w, h, layers });
const crop = (layer, sx, sw) => ({ ...layer, sx, sw });
export const ENVIRONMENT_SPRITES = {
  grass0: sprite(32, 32, r(5, 0)),
  grass1: sprite(32, 32, r(5, 0)),
  grass2: sprite(32, 32, r(5, 0)),
  grass3: sprite(32, 32, r(5, 0)),
  forest0: sprite(32, 32, r(5, 0)),
  forest1: sprite(32, 32, r(5, 0)),
  forest2: sprite(32, 32, r(5, 0)),
  forest3: sprite(32, 32, r(5, 0)),
  path0: sprite(32, 32, r(6, 0)),
  path1: sprite(32, 32, r(6, 0)),
  path2: sprite(32, 32, r(6, 0)),
  water0: sprite(32, 32, r(0, 0)),
  water1: sprite(32, 32, r(1, 0)),
  bridge: sprite(32, 32, r(7, 4)),
  floor: sprite(32, 32, i(24, 1)),
  cabinFloor: sprite(32, 32, i(24, 1)),
  stoneFloor: sprite(32, 32, r(6, 2)),
  wallTimber: sprite(32, 32, r(35, 16)),
  wallPlaster: sprite(32, 32, r(14, 16)),
  wallStone: sprite(32, 32, r(21, 16)),
  windowBrown: sprite(32, 32, r(42, 0)),
  windowPale: sprite(32, 32, r(40, 5)),
  door: sprite(32, 32, r(46, 7)),
  roofBrownLeft: sprite(32, 32, r(48, 10)),
  roofBrownRight: sprite(32, 32, r(49, 10)),
  eaveBrownLeft: sprite(32, 32, r(48, 11)),
  eaveBrownRight: sprite(32, 32, r(49, 11)),
  roofGreenLeft: sprite(32, 32, r(46, 10)),
  roofGreenRight: sprite(32, 32, r(47, 10)),
  eaveGreenLeft: sprite(32, 32, r(46, 11)),
  eaveGreenRight: sprite(32, 32, r(47, 11)),
  roofPaleLeft: sprite(32, 32, r(48, 10)),
  roofPaleRight: sprite(32, 32, r(49, 10)),
  eavePaleLeft: sprite(32, 32, r(48, 11)),
  eavePaleRight: sprite(32, 32, r(49, 11)),
  chimney: sprite(32, 32, r(40, 9)),
  oak: sprite(32, 64, r(13, 10), r(13, 11, 0, 32)),
  pine: sprite(32, 64, r(18, 10), r(18, 11, 0, 32)),
  goldTree: sprite(32, 64, r(14, 10), r(14, 11, 0, 32)),
  bush: sprite(32, 32, r(21, 9)),
  flowers: sprite(32, 32, r(24, 10)),
  herb: sprite(32, 32, r(26, 9)),
  rock: sprite(32, 32, r(7, 17)),
  hill: sprite(
    64,
    64,
    r(6, 13),
    r(8, 13, 32),
    r(6, 15, 0, 32),
    r(8, 15, 32, 32),
  ),
  fence: sprite(32, 32, r(47, 24)),
  lamp: sprite(32, 32, r(18, 7)),
  indoorLamp: sprite(32, 32, i(18, 6)),
  // Stone basin and wooden gabled cover, composed solely from RPG tiles.
  well: sprite(
    64,
    64,
    r(2, 3, 0, 16),
    r(4, 3, 32, 16),
    r(2, 5, 0, 32),
    r(4, 5, 32, 32),
    r(48, 10),
    r(49, 10, 32),
  ),
  anvil: sprite(32, 32, r(15, 0)),
  barrel: sprite(32, 32, r(25, 0)),
  chest: sprite(32, 32, i(12, 16)),
  wardrobe: sprite(
    40,
    64,
    crop(i(12, 13), 0, 10),
    crop(i(13, 13, 20), 6, 10),
    crop(i(12, 15, 0, 32), 0, 10),
    crop(i(13, 15, 20, 32), 6, 10),
  ),
  table: sprite(64, 32, i(4, 4), i(6, 4, 32)),
  lectern: sprite(32, 32, i(0, 4)),
  book: sprite(32, 32, i(18, 0)),
  bed: sprite(64, 32, i(13, 1), i(12, 1, 32)),
  stairs: sprite(32, 32, i(21, 10)),
  bank: sprite(32, 32, r(4, 1)),
  rug: sprite(
    96,
    96,
    i(7, 9),
    i(8, 9, 32),
    i(9, 9, 64),
    i(7, 10, 0, 32),
    i(8, 10, 32, 32),
    i(9, 10, 64, 32),
    i(7, 11, 0, 64),
    i(8, 11, 32, 64),
    i(9, 11, 64, 64),
  ),
};
export function drawEnvironmentSprite(
  ctx,
  images,
  name,
  x,
  y,
  { flip = false } = {},
) {
  const definition = ENVIRONMENT_SPRITES[name];
  if (!definition) throw Error(`Ismeretlen Kenney-környezet: ${name}`);
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.translate(Math.round(x) + (flip ? definition.w : 0), Math.round(y));
  if (flip) ctx.scale(-1, 1);
  for (const layer of definition.layers) {
    const image = images[layer.pack];
    if (!image) throw Error(`Hiányzó Kenney-lap: ${layer.pack}`);
    const sx = layer.sx ?? 0,
      sw = layer.sw ?? 16;
    ctx.drawImage(
      image,
      layer.column * 17 + sx,
      layer.row * 17,
      sw,
      16,
      layer.dx,
      layer.dy,
      sw * 2,
      32,
    );
  }
  ctx.restore();
}
