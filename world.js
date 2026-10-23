// All world coordinates, encounters and rewards live here for easy expansion.
export const WORLD = { width: 1920, height: 384 };
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
export function zoneAt(x) {
  return x < 640
    ? "Smaragdvölgy falu"
    : x < 1280
      ? "Faluszéli rét"
      : "Öreg erdő";
}
export function initialState() {
  return {
    version: 1,
    scene: "world",
    player: { x: 264, y: 210, hp: 5, dx: 1, dy: 0 },
    level: 1,
    xp: 0,
    gold: 18,
    weapon: "iron",
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
