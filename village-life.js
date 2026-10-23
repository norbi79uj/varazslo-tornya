// Short, deterministic routines. Presentation state is deliberately not saved.
import { NPCS } from "./world.js";
const ROUTINES = {
  "world:smith": { work: "hammer" },
  "world:innkeeper": {
    path: [
      [423, 170],
      [415, 170],
    ],
    wait: 3,
  },
  "world:elder": {
    path: [
      [233, 280],
      [269, 277],
    ],
    wait: 6,
    work: "sit",
  },
  "world:lumberjack": { work: "chop" },
  "world:merchant": {
    path: [
      [346, 225],
      [332, 225],
      [338, 225],
    ],
    wait: 2,
  },
  "smithy:smith": { work: "hammer" },
  "inn:innkeeper": {
    path: [
      [386, 185],
      [373, 185],
    ],
    wait: 3,
  },
  "shop:merchant": {
    path: [
      [328, 182],
      [312, 182],
    ],
    wait: 2,
  },
};
const LOCALS = [
  {
    id: "gardener",
    profile: "innkeeper",
    name: "Juli, a kertész",
    x: 209,
    y: 410,
    path: [
      [224, 435],
      [209, 410],
    ],
    chat: "Ilona levesébe innen kerül a kakukkfű. Ha a réten gyógyfüvet találsz, inkább neki vidd!",
  },
  {
    id: "villager",
    profile: "missing",
    name: "Pál, a molnár",
    x: 537,
    y: 351,
    path: [
      [537, 379],
      [571, 385],
      [537, 379],
      [537, 351],
    ],
    chat: "A patakon a fahíd visz át. Mostanában csak világosban merészkedünk a rétre.",
  },
  {
    id: "guest",
    profile: "missing",
    name: "Vándor",
    scene: "inn",
    x: 247,
    y: 268,
    work: "sit",
    chat: "A Zöld Szarvasban mindig akad egy meleg tányér leves. Az északi útra most nem indulnék.",
  },
  {
    id: "guest2",
    profile: "elder",
    name: "Bertalan",
    scene: "inn",
    x: 452,
    y: 246,
    work: "sit",
    chat: "Boros egész nap dolgozik. A falu most minden rendes pengének hasznát veszi.",
  },
];
export function facing(dx, dy) {
  return Math.abs(dx) > Math.abs(dy)
    ? dx < 0
      ? "left"
      : "right"
    : dy < 0
      ? "up"
      : "down";
}
export class VillageLife {
  constructor() {
    this.clock = 0;
    this.actors = [...NPCS, ...LOCALS].map((n) => {
      const scene = n.scene || "world",
        r = ROUTINES[scene + ":" + n.id] || n;
      return {
        ...n,
        scene,
        homeX: n.x,
        homeY: n.y,
        path: r.path || [],
        work: r.work || "idle",
        pause: r.wait ?? 2,
        wait: 1,
        index: 0,
        walking: false,
        direction: "down",
        pose: r.work || "idle",
      };
    });
  }
  people(state) {
    return this.actors.filter(
      (n) =>
        n.scene === state.scene && (n.id !== "missing" || !state.flags.rescued),
    );
  }
  face(actor, player) {
    actor.direction = facing(player.x - actor.x, player.y - actor.y);
    actor.walking = false;
    actor.pose = "talk";
  }
  update(dt, state, blocked) {
    this.clock += dt;
    for (const actor of this.people(state)) {
      actor.walking = false;
      if (Math.hypot(actor.x - state.player.x, actor.y - state.player.y) < 42) {
        this.face(actor, state.player);
        continue;
      }
      actor.pose = actor.work;
      if (!actor.path.length) continue;
      if (actor.wait > 0) {
        actor.wait -= dt;
        continue;
      }
      const [x, y] = actor.path[actor.index],
        dx = x - actor.x,
        dy = y - actor.y,
        d = Math.hypot(dx, dy);
      if (d < 0.5) {
        actor.index = (actor.index + 1) % actor.path.length;
        actor.wait = actor.pause;
        continue;
      }
      const step = Math.min(d, dt * 15),
        nx = actor.x + (dx / d) * step,
        ny = actor.y + (dy / d) * step;
      if (!blocked(nx, ny)) {
        actor.x = nx;
        actor.y = ny;
        actor.walking = true;
        actor.pose = "walk";
        actor.direction = facing(dx, dy);
      }
    }
  }
}
