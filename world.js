// All world coordinates, encounters and rewards live here for easy expansion.
export const WORLD = { width: 1920, height: 640 };
export const LEVEL_XP = [0, 20, 55, 110, 190];
export const WEAPONS = {
  iron: { name: "Vaskard", damage: 1 },
  tempered: { name: "Edzett vaskard", damage: 2 },
  ranger: { name: "Erdőjáró pengéje", damage: 2 },
};
export const BUILDINGS = [
  {
    id: "smith",
    x: 73,
    y: 65,
    w: 105,
    h: 77,
    name: "Kovácsműhely",
    roof: "#715b57",
  },
  {
    id: "inn",
    x: 365,
    y: 58,
    w: 128,
    h: 84,
    name: "Zöld Szarvas fogadó",
    roof: "#9b664e",
  },
  {
    id: "house",
    x: 80,
    y: 274,
    w: 92,
    h: 65,
    name: "Lakóház",
    roof: "#80654d",
  },
  {
    id: "house2",
    x: 405,
    y: 282,
    w: 91,
    h: 59,
    name: "Lakóház",
    roof: "#80654d",
  },
  {
    id: "cabin",
    x: 1370,
    y: 60,
    w: 100,
    h: 75,
    name: "Elhagyott kunyhó",
    roof: "#5e6356",
  },
];
BUILDINGS.push(
  { id: "shop", x: 317, y: 390, w: 80, h: 64, name: "Réka boltja" },
  { id: "house3", x: 70, y: 390, w: 100, h: 64, name: "Fűszerész háza" },
  { id: "house4", x: 415, y: 390, w: 100, h: 64, name: "Molnár háza" },
  { id: "house5", x: 80, y: 512, w: 100, h: 64, name: "Kertész otthona" },
  { id: "house6", x: 405, y: 512, w: 100, h: 64, name: "Favágók háza" },
);
export const NPCS = [
  { id: "smith", name: "Boros, a kovács", x: 161, y: 172, color: "#bd8164" },
  {
    id: "innkeeper",
    name: "Ilona, a fogadós",
    x: 415,
    y: 170,
    color: "#ba8db3",
  },
  {
    id: "elder",
    name: "Áron, a falusi öreg",
    x: 269,
    y: 277,
    color: "#a4ad9a",
  },
  {
    id: "lumberjack",
    name: "Márton, a favágó",
    x: 544,
    y: 267,
    color: "#bb984f",
  },
  {
    id: "merchant",
    name: "Réka, a kereskedő",
    x: 338,
    y: 225,
    color: "#85b5b4",
  },
  {
    id: "missing",
    name: "Dénes, az eltűnt favágó",
    x: 1518,
    y: 297,
    color: "#ba965e",
  },
];
NPCS.push(
  { ...NPCS.find((n) => n.id === "smith"), scene: "smithy", x: 263, y: 182 },
  { ...NPCS.find((n) => n.id === "innkeeper"), scene: "inn", x: 373, y: 185 },
  { ...NPCS.find((n) => n.id === "merchant"), scene: "shop", x: 320, y: 182 },
);
export const INTERIORS = {
  smithy: "Boros kovácsműhelye",
  inn: "Zöld Szarvas fogadó",
  shop: "Réka kereskedése",
  home1: "A fazekas otthona",
  home2: "A takács otthona",
  home3: "A fűszerész otthona",
  home4: "A molnár otthona",
  home5: "A kertész otthona",
  home6: "A favágók otthona",
};
export const ENCOUNTERS = [
  {
    id: "slime1",
    name: "Réti nyálka",
    x: 791,
    y: 188,
    hp: 3,
    damage: 1,
    speed: 32,
    xp: 8,
    gold: 5,
    range: 110,
    color: "#9cbc66",
  },
  {
    id: "slime2",
    name: "Réti nyálka",
    x: 920,
    y: 284,
    hp: 3,
    damage: 1,
    speed: 34,
    xp: 8,
    gold: 5,
    range: 110,
    color: "#9cbc66",
  },
  {
    id: "slime3",
    name: "Réti őrző",
    x: 1115,
    y: 171,
    hp: 4,
    damage: 1,
    speed: 36,
    xp: 10,
    gold: 6,
    range: 115,
    color: "#87aa67",
  },
  {
    id: "wolf1",
    name: "Árnyas erdei lény",
    x: 1335,
    y: 243,
    hp: 6,
    damage: 2,
    speed: 46,
    xp: 18,
    gold: 9,
    range: 125,
    color: "#a38db5",
  },
  {
    id: "wolf2",
    name: "Vad erdei lény",
    x: 1599,
    y: 204,
    hp: 7,
    damage: 2,
    speed: 49,
    xp: 22,
    gold: 11,
    range: 125,
    color: "#9681ab",
  },
  {
    id: "boss",
    name: "Tövisúr, a gyökerek őre",
    x: 1781,
    y: 131,
    hp: 22,
    damage: 2,
    speed: 34,
    xp: 55,
    gold: 35,
    range: 155,
    color: "#bb777c",
    boss: true,
  },
];
export const HERBS = [
  { id: "herb1", x: 690, y: 288 },
  { id: "herb2", x: 843, y: 102 },
  { id: "herb3", x: 1024, y: 306 },
  { id: "herb4", x: 1188, y: 118 },
];
export const OBJECTS = {
  world: [
    { id: "cabinDoor", x: 1420, y: 151, name: "Kunyhó ajtaja" },
    { id: "gate", x: 1780, y: 46, name: "Északi kapu" },
    { id: "sign", x: 615, y: 201, name: "Útjelző" },
  ],
  cabin: [
    { id: "journal", x: 211, y: 170, name: "Napló" },
    // Intentionally excluded from automatic proximity labels, even after reading.
    { id: "cupboard", x: 433, y: 110, name: "Szekrény", hidden: true },
    { id: "cabinExit", x: 320, y: 325, name: "Kijárat" },
  ],
  cellar: [
    { id: "rune1", x: 211, y: 163, name: "Első rúnakő" },
    { id: "rune2", x: 320, y: 163, name: "Második rúnakő" },
    { id: "rune3", x: 429, y: 163, name: "Harmadik rúnakő" },
    { id: "chest", x: 320, y: 90, name: "Régi láda" },
    { id: "cellarExit", x: 320, y: 321, name: "Lépcső felfelé" },
    { id: "inscription", x: 136, y: 253, name: "Felirat" },
  ],
};
for (const [i, b] of BUILDINGS.filter((b) => b.id !== "cabin").entries()) {
  const scene =
    b.id === "smith"
      ? "smithy"
      : b.id === "inn"
        ? "inn"
        : b.id === "shop"
          ? "shop"
          : b.id === "house"
            ? "home1"
            : b.id.replace("house", "home");
  OBJECTS.world.push({
    id: "door-" + b.id,
    name: b.name + " · bejárat",
    x: b.x + b.w / 2,
    y: b.y + b.h + 15,
    scene,
    building: b.id,
  });
  OBJECTS[scene] = [{ id: "interiorExit", name: "Kijárat", x: 320, y: 325 }];
}
export function interiorSolids(scene, flags = {}) {
  const table = { x: 160, y: 141, w: 64, h: 27 },
    bed = { x: 129, y: 235, w: 64, h: 33 };
  if (scene === "cabin")
    return [table, bed, { x: flags.cupboard ? 477 : 414, y: 75, w: 40, h: 61 }];
  if (scene === "cellar")
    return [
      { x: 199, y: 150, w: 24, h: 22 },
      { x: 308, y: 150, w: 24, h: 22 },
      { x: 417, y: 150, w: 24, h: 22 },
      { x: 304, y: 76, w: 32, h: 22 },
      { x: 111, y: 227, w: 48, h: 28 },
    ];
  if (scene === "smithy")
    return [
      { x: 209, y: 143, w: 40, h: 23 },
      { x: 370, y: 122, w: 64, h: 24 },
      { x: 135, y: 105, w: 53, h: 26 },
    ];
  if (scene === "inn")
    return [
      { x: 130, y: 95, w: 64, h: 35 },
      { x: 130, y: 146, w: 64, h: 35 },
      { x: 380, y: 127, w: 64, h: 26 },
      { x: 215, y: 227, w: 64, h: 26 },
    ];
  if (scene === "shop")
    return [
      { x: 288, y: 128, w: 64, h: 27 },
      { x: 135, y: 92, w: 66, h: 32 },
      { x: 445, y: 75, w: 60, h: 61 },
    ];
  return [
    { x: 130, y: 100, w: 64, h: 35 },
    { x: 343, y: 136, w: 64, h: 27 },
    { x: 466, y: 75, w: 40, h: 61 },
    { x: 139, y: 241, w: 24, h: 28 },
  ];
}
export function zoneAt(x) {
  return x < 640
    ? "Smaragdvölgy falu"
    : x < 1280
      ? "Faluszéli rét"
      : "Öreg erdő";
}
export function initialState() {
  return {
    version: 2,
    returnSpot: null,
    scene: "world",
    player: { x: 264, y: 210, hp: 5, dx: 1, dy: 0 },
    level: 1,
    xp: 0,
    gold: 18,
    weapon: "iron",
    armor: "linen",
    potions: 2,
    herbs: 0,
    flags: {
      quest: false,
      rescued: false,
      returned: false,
      herbsDone: false,
      journal: false,
      examined: false,
      cupboard: false,
      boss: false,
      amulet: false,
      gateVisited: false,
    },
    runes: [false, false, false],
    collected: [],
    enemies: ENCOUNTERS.map((e) => ({
      ...e,
      maxHp: e.hp,
      flash: 0,
      respawn: 0,
    })),
  };
}

export const STREAM = { x: 960, w: 48, bridgeY: 192, bridgeH: 64 };
export const DECOR = [
  ...[
    [1298, 420],
    [1340, 436],
    [1380, 440],
    [1420, 410],
    [1460, 440],
    [1540, 450],
    [1620, 415],
    [1660, 440],
    [1720, 460],
    [1760, 410],
    [1800, 450],
    [1840, 410],
    [1880, 430],
    [1300, 560],
    [1350, 580],
    [1400, 550],
    [1450, 590],
    [1520, 565],
    [1580, 600],
    [1650, 570],
    [1700, 590],
    [1770, 560],
    [1820, 590],
    [1870, 560],
    [1500, 90],
    [1540, 80],
    [1580, 100],
    [1620, 64],
    [1650, 110],
    [1680, 80],
    [1835, 120],
    [1870, 150],
  ].map(([x, y]) => ({
    x,
    y,
    type: "pine",
    solid: true,
    w: 10,
    h: 10,
    offsetY: 0,
  })),
  { x: 1200, y: 486, type: "hill", solid: true, w: 56, h: 32, offsetY: -20 },
  ...[
    [32, 100],
    [32, 156],
    [32, 300],
    [605, 104],
    [606, 319],
    [693, 65],
    [753, 331],
    [970, 67],
    [1105, 333],
    [1217, 73],
    [1298, 99],
    [1313, 333],
    [1513, 64],
    [1566, 335],
    [1634, 77],
    [1692, 320],
    [1858, 86],
    [1863, 292],
  ].map(([x, y]) => ({
    x,
    y,
    type: x >= 1280 ? "pine" : "oak",
    solid: true,
    w: 10,
    h: 10,
    offsetY: 0,
  })),
  ...[
    [728, 470],
    [1160, 468],
    [1240, 520],
    [1505, 469],
    [1580, 499],
    [1812, 453],
  ].map(([x, y]) => ({ x, y, type: "rock", solid: true })),
  ...[
    [605, 480],
    [1300, 478],
    [1380, 555],
    [1690, 553],
    [1864, 518],
    [752, 567],
    [898, 445],
    [55, 492],
  ].map(([x, y]) => ({ x, y, type: "bush", solid: true })),
];
