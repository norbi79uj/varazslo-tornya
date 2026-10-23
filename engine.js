import {
  WORLD,
  BUILDINGS,
  NPCS,
  OBJECTS,
  HERBS,
  ENCOUNTERS,
  LEVEL_XP,
  WEAPONS,
  initialState,
  zoneAt,
  INTERIORS,
  STREAM,
  DECOR,
  interiorSolids,
} from "./world.js";
export const SAVE_KEY = "varazslo-tornya.smaragdvolgy.v1";
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
export class Game {
  constructor({ message = () => {}, sound = () => {} } = {}) {
    this.message = message;
    this.sound = sound;
    this.state = initialState();
    this.keys = new Set();
    this.started = false;
    this.dialog = null;
    this.dead = false;
    this.time = 0;
    this.swing = 0;
    this.cooldown = 0;
    this.invincible = 0;
  }
  get maxHp() {
    return (
      4 +
      this.state.level +
      Number(this.state.flags.amulet) +
      Number(this.state.armor === "padded")
    );
  }
  get zone() {
    return this.state.scene === "world"
      ? zoneAt(this.state.player.x)
      : this.state.scene === "cabin"
        ? "Elhagyott kunyhó"
        : this.state.scene === "cellar"
          ? "Rejtett pince"
          : INTERIORS[this.state.scene];
  }
  get bossNearby() {
    const e = this.state.enemies.find((e) => e.boss);
    return (
      this.state.scene === "world" &&
      !this.state.flags.boss &&
      this.state.flags.returned &&
      distance(this.state.player, e) < 165
    );
  }
  get objective() {
    const f = this.state.flags;
    if (f.boss) return "Tövisúr elesett. Az északi kapu nyitva!";
    if (!f.quest) return "Beszélj Mártonnal a falu keleti szélén.";
    if (!f.rescued) return "Keresd meg Dénest az Öreg erdőben.";
    if (!f.returned) return "Térj vissza Mártonhoz a jutalomért.";
    return "Győzd le Tövisurat az erdő északi részén!";
  }
  start() {
    this.started = true;
    this.message("Smaragdvölgy vár. E: beszélgetés és vizsgálat.");
  }
  newGame() {
    this.state = initialState();
    this.clearTransient();
    this.started = true;
    this.message("Új kaland kezdődik. A korábbi kézi mentésed megmaradt.");
  }
  clearTransient() {
    this.dialog = null;
    this.dead = false;
    this.swing = this.cooldown = this.invincible = 0;
    this.keys.clear();
  }
  open(title, text, choices = []) {
    this.keys.clear();
    this.dialog = { title, text, choices };
    this.sound("talk");
  }
  close() {
    this.dialog = null;
    this.keys.clear();
  }
  choice(label, action) {
    return { label, action };
  }
  blocked(x, y) {
    return isBlocked(this.state, x, y);
  }
  move(actor, dx, dy) {
    if (!this.blocked(actor.x + dx, actor.y)) actor.x += dx;
    if (!this.blocked(actor.x, actor.y + dy)) actor.y += dy;
  }
  gainXP(amount) {
    const s = this.state;
    s.xp = Math.min(LEVEL_XP[4], s.xp + amount);
    let level = 1;
    while (level < 5 && s.xp >= LEVEL_XP[level]) level++;
    if (level > s.level) {
      s.level = level;
      s.player.hp = this.maxHp;
      this.message(`Szintlépés! ${level}. szint. Életerőd feltöltődött.`);
      this.sound("level");
    }
  }
  attack() {
    if (!this.started || this.dialog || this.dead || this.cooldown > 0) return;
    this.swing = 0.22;
    this.cooldown = 0.38;
    this.sound("attack");
    if (this.state.scene !== "world") return;
    const s = this.state,
      p = s.player;
    for (const enemy of s.enemies) {
      const d = distance(p, enemy),
        facing = ((enemy.x - p.x) * p.dx + (enemy.y - p.y) * p.dy) / (d || 1);
      if (enemy.hp <= 0 || d >= 57 || (d >= 17 && facing <= 0.25)) continue;
      if (enemy.boss && !s.flags.returned) {
        this.message(
          "A gyökérpajzs védi Tövisurat. Segíts Dénesen, majd beszélj Mártonnal!",
        );
        continue;
      }
      enemy.hp = Math.max(0, enemy.hp - WEAPONS[s.weapon].damage);
      enemy.flash = 0.18;
      this.move(enemy, p.dx * 12, p.dy * 12);
      if (enemy.hp === 0) {
        enemy.respawn = 35;
        s.gold += enemy.gold;
        this.message(
          `${enemy.name} legyőzve! +${enemy.xp} TP, +${enemy.gold} arany.`,
        );
        this.gainXP(enemy.xp);
        if (enemy.boss) {
          s.flags.boss = true;
          this.sound("level");
          this.open(
            "Smaragdvölgy fellélegezhet",
            "Tövisúr gyökerei elporladnak. Megmentetted a falut! Az északi kapu megnyílt. Az azon túli vidék egy következő kaland része lesz.",
          );
        }
      } else this.message(`${enemy.name}: ${enemy.hp}/${enemy.maxHp} életerő`);
    }
  }
  potion() {
    if (!this.started || this.dead || this.dialog) return;
    const s = this.state;
    if (!s.potions)
      return this.message("Nincs gyógyitalod. Réka árul a faluban.");
    if (s.player.hp >= this.maxHp) return this.message("Életerőd már teljes.");
    s.potions--;
    s.player.hp = Math.min(this.maxHp, s.player.hp + 4);
    this.sound("heal");
    this.message("Gyógyital: +4 életerő.");
  }
  update(dt) {
    this.time += dt;
    if (!this.started || this.dialog || this.dead) return;
    this.swing = Math.max(0, this.swing - dt);
    this.cooldown = Math.max(0, this.cooldown - dt);
    this.invincible = Math.max(0, this.invincible - dt);
    const s = this.state,
      p = s.player;
    let dx =
      Number(this.keys.has("d") || this.keys.has("ArrowRight")) -
      Number(this.keys.has("a") || this.keys.has("ArrowLeft"));
    let dy =
      Number(this.keys.has("s") || this.keys.has("ArrowDown")) -
      Number(this.keys.has("w") || this.keys.has("ArrowUp"));
    const length = Math.hypot(dx, dy);
    if (length) {
      dx /= length;
      dy /= length;
      p.dx = dx;
      p.dy = dy;
      this.move(p, dx * 112 * dt, dy * 112 * dt);
    }
    if (this.keys.has(" ")) this.attack();
    if (s.scene !== "world") return;
    if (
      s.flags.boss &&
      !s.flags.gateVisited &&
      p.x > 1758 &&
      p.x < 1800 &&
      p.y < 32
    ) {
      s.flags.gateVisited = true;
      this.open(
        "Az északi út",
        "Átléptél a felszabadított kapun. Smaragdvölgy biztonságban van. A következő vidék még nem része ennek a fejezetnek; itt most visszafordulhatsz.",
      );
      return;
    }
    for (const e of s.enemies) {
      e.flash = Math.max(0, e.flash - dt);
      if (e.hp <= 0) {
        if (e.boss) continue;
        e.respawn = Math.max(0, e.respawn - dt);
        const origin = ENCOUNTERS.find((o) => o.id === e.id);
        if (e.respawn === 0 && distance(p, origin) > 180) {
          e.x = origin.x;
          e.y = origin.y;
          e.hp = e.maxHp;
        }
        continue;
      }
      const d = distance(p, e);
      if (p.x < 655 || d > e.range || (e.boss && !s.flags.returned)) continue;
      if (d > 19)
        this.move(
          e,
          ((p.x - e.x) / d) * e.speed * dt,
          ((p.y - e.y) / d) * e.speed * dt,
        );
      if (d < 23 && this.invincible === 0) {
        p.hp = Math.max(0, p.hp - e.damage);
        this.invincible = 1.15;
        this.sound("hurt");
        this.move(
          p,
          ((p.x - e.x) / (d || 1)) * 17,
          ((p.y - e.y) / (d || 1)) * 17,
        );
        this.message(`${e.name} eltalált! Q: gyógyital.`);
        if (!p.hp) {
          this.dead = true;
          this.keys.clear();
          this.open(
            "A lovag elesett",
            "A falusiak visszavisznek a fogadóhoz. Legfeljebb 5 aranyat veszítesz; a fejlődésed és tárgyaid megmaradnak.",
            [this.choice("Vissza a faluba", () => this.revive())],
          );
          break;
        }
      }
    }
  }
  revive() {
    this.state.gold = Math.max(0, this.state.gold - 5);
    this.state.scene = "world";
    this.state.returnSpot = null;
    Object.assign(this.state.player, { x: 415, y: 211, hp: this.maxHp });
    this.clearTransient();
    this.message("Ilona ápolásának hála újra útra kelhetsz.");
  }
  nearby(includeHidden = false) {
    const s = this.state,
      p = s.player;
    const objects = [...(OBJECTS[s.scene] || [])];
    objects.push(
      ...NPCS.filter(
        (n) =>
          (n.scene || "world") === s.scene &&
          (n.id !== "missing" || !s.flags.rescued),
      ),
    );
    if (s.scene === "world") {
      objects.push(
        ...HERBS.filter((h) => !s.collected.includes(h.id)).map((h) => ({
          ...h,
          name: "Gyógyfű",
        })),
      );
    }
    return objects
      .filter((o) => (includeHidden || !o.hidden) && distance(p, o) < 49)
      .sort((a, b) => distance(p, a) - distance(p, b))[0];
  }
  changeScene(scene, x, y) {
    this.state.scene = scene;
    Object.assign(this.state.player, { x, y });
    this.close();
    this.invincible = 1;
    this.message(this.zone);
  }
  interact() {
    if (!this.started || this.dead || this.dialog) return;
    const o = this.nearby(true),
      s = this.state,
      f = s.flags;
    if (!o)
      return this.message(
        "Nincs itt semmi elérhető. Menj közelebb, majd nyomj E-t.",
      );
    if (o.id.startsWith("door-")) {
      const b = BUILDINGS.find((b) => b.id === o.building);
      s.returnSpot = { x: b.x + b.w / 2, y: b.y + b.h + 18 };
      return this.changeScene(o.scene, 320, 300);
    }
    if (o.id === "interiorExit") {
      const point = s.returnSpot || { x: 264, y: 210 };
      s.returnSpot = null;
      return this.changeScene("world", point.x, point.y);
    }
    if (o.id.startsWith("herb")) {
      s.collected.push(o.id);
      s.herbs++;
      this.sound("pickup");
      return this.message(
        "Gyógyfüvet gyűjtöttél. Ilonának háromra van szüksége.",
      );
    }
    const buy = (cost, act, success) => {
      if (s.gold < cost)
        return this.open(
          "Kevés arany",
          `Ehhez ${cost} arany kell. A réti lényekért és küldetésekért jutalom jár.`,
        );
      s.gold -= cost;
      act();
      this.sound("buy");
      this.open("Köszönöm!", success);
    };
    switch (o.id) {
      case "smith": {
        const choices = [];
        if (s.weapon === "iron")
          choices.push(
            this.choice("Edzett vaskard · 24 arany", () =>
              buy(
                24,
                () => {
                  s.weapon = "tempered";
                },
                "Edzett vaskard felszerelve. Sebzés: 2.",
              ),
            ),
          );
        if (s.armor === "linen")
          choices.push(
            this.choice("Bélelt mellény · 18 arany", () =>
              buy(
                18,
                () => {
                  s.armor = "padded";
                  s.player.hp++;
                },
                "Bélelt mellény felszerelve. +1 maximális életerő. Egyszerű falusi védelem.",
              ),
            ),
          );
        return this.open(
          o.name,
          "Az egyszerű vaskardod jó kezdet. Edzett pengém kétszer olyan erős. Bélelt mellényem egy életerővel növeli a védelmed. Mindkettő közönséges, falusi felszerelés.",
          choices,
        );
      }
      case "innkeeper": {
        const choices = [
          this.choice("Pihenés · 5 arany", () => {
            if (s.player.hp === this.maxHp)
              return this.open(
                "Ilona",
                "Már teljesen egészséges vagy. Tartsd meg az aranyad!",
              );
            buy(
              5,
              () => {
                s.player.hp = this.maxHp;
              },
              "Kipihented magad. Életerőd teljes.",
            );
          }),
        ];
        if (!f.herbsDone)
          choices.push(
            this.choice("Három gyógyfű átadása", () => {
              if (s.herbs < 3)
                return this.open(
                  "Ilona",
                  "Három gyógyfűre van szükségem a rétről. Jutalmad 12 arany, 10 TP és egy gyógyital.",
                );
              s.herbs -= 3;
              f.herbsDone = true;
              s.gold += 12;
              s.potions++;
              this.gainXP(10);
              this.open(
                "Ilona",
                "Köszönöm! Ezekkel a falusi sebesülteket is el tudom látni. Megkaptad a jutalmadat.",
              );
            }),
          );
        return this.open(
          o.name,
          "Szállj meg a Zöld Szarvasban! Öt aranyért meggyógyítalak. A réten gyógyfüvek nőnek; hozz hármat a sebesülteknek!",
          choices,
        );
      }
      case "merchant":
        return this.open(
          o.name,
          "Friss gyógyital, egyszerű útravaló! Egy üveg négy életerőt tölt vissza. Q-val ihatsz belőle.",
          [
            this.choice("Gyógyital · 8 arany", () =>
              buy(
                8,
                () => s.potions++,
                "Egy gyógyital került a tárgyaid közé.",
              ),
            ),
          ],
        );
      case "elder":
        return this.open(
          o.name,
          "Smaragdvölgyet egykor a torony mágusa védte. Tövisúr most az erdő gyökereit uszítja ránk. Márton társa odaveszett az erdőben. Segíts neki! A régi kunyhó utolsó lakója naplót hagyott maga után.",
        );
      case "lumberjack":
        if (f.returned)
          return this.open(
            o.name,
            "Dénes biztonságban van. Az erdőjáró pengéje a tiéd. Most már áttörheted Tövisúr gyökérpajzsát!",
          );
        if (f.rescued)
          return this.open(
            o.name,
            "Visszahoztad Dénest! Fogadd az erdőjáró pengéjét, 15 aranyat és 20 TP-t. Dénes elárulta: Tövisúr pajzsa csak a falusiak összefogásától törik meg.",
            [
              this.choice("Jutalom átvétele", () => {
                f.returned = true;
                s.weapon = "ranger";
                s.gold += 15;
                this.gainXP(20);
                this.sound("buy");
                this.open(
                  "Márton",
                  "A penge sebzése 2. Tövisúr az erdő északi tisztásán vár. Az északi kaput az ő gyökerei zárják.",
                );
              }),
            ],
          );
        return this.open(
          o.name,
          "Dénes nem tért vissza! Keresd az Öreg erdő délkeleti részén. A kunyhótól délkeletre láttam utoljára.",
          [
            this.choice(f.quest ? "Már keresem" : "Elvállalom", () => {
              f.quest = true;
              this.close();
              this.message(
                "Küldetés: keresd meg Dénest az erdő délkeleti részén.",
              );
            }),
          ],
        );
      case "missing":
        return this.open(
          o.name,
          "A gyökerek csapdába ejtettek! Köszönöm, hogy rám találtál. Biztonságos ösvényen hazajutok. Szólj Mártonnak, ő tud segíteni Tövisúr ellen.",
          [
            this.choice("Kiszabadítom Dénest", () => {
              f.rescued = true;
              f.quest = true;
              this.gainXP(15);
              this.close();
              this.message("Dénes megmenekült! Térj vissza Mártonhoz. +15 TP.");
            }),
          ],
        );
      case "sign":
        return this.open(
          "Útjelző",
          "← Smaragdvölgy · Faluszéli rét → Öreg erdő. A falu biztonságos; a réten gyakorolhatod a kardforgatást.",
        );
      case "gate":
        return this.open(
          "Északi kapu",
          f.boss
            ? "A gyökerek eltűntek, a kapu nyitva. Smaragdvölgy történetének első fejezete véget ért. Az északi világ még nem járható."
            : "Tövisúr gyökerei szorosan lezárják a kaput. Előbb segíts a falusiaknak, és győzd le az erdő urát!",
        );
      case "cabinDoor":
        return this.changeScene("cabin", 320, 301);
      case "cabinExit":
        return this.changeScene("world", 1420, 165);
      case "journal":
        f.journal = true;
        return this.open(
          "Megkopott napló",
          "„A pince lejáratát a magas szekrény mögé rejtettem. Előbb vizsgáld meg, aztán told félre. Odalent a felirat vezet: a nap útját kövesd, hajnaltól alkonyatig.”",
        );
      case "cupboard":
        if (!f.journal)
          return this.open(
            "Poros szekrény",
            "Régi, súlyos bútordarab. A kunyhó egykori lakójának írásai talán többet elárulnak róla.",
          );
        if (f.cupboard)
          return this.open(
            "Elmozdított szekrény",
            "A feltárt lépcső a pincébe vezet.",
            [
              this.choice("Lemegyek a pincébe", () =>
                this.changeScene("cellar", 320, 292),
              ),
            ],
          );
        if (!f.examined) {
          f.examined = true;
          return this.open(
            "Poros szekrény",
            "A padlón karcolásokat látsz, a szekrény alatt hideg levegő szivárog. Az alsó polc mögött egy rézreteszt tapintasz ki: ezt kioldva a bútor félretolható. Vizsgáld meg újra a reteszt.",
          );
        }
        return this.open(
          "Poros szekrény",
          "Megragadod a szekrény oldalát. Félretolod?",
          [
            this.choice("Félretolom a szekrényt (retesz kioldása)", () => {
              f.cupboard = true;
              this.sound("secret");
              this.open(
                "Rejtett lejárat",
                "A szekrény mögött kőlépcső vezet a mélybe.",
                [
                  this.choice("Lemegyek a pincébe", () =>
                    this.changeScene("cellar", 320, 292),
                  ),
                ],
              );
            }),
          ],
        );
      case "cellarExit":
        return this.changeScene("cabin", 412, 153);
      case "inscription":
        return this.open(
          "Kőbe vésett sorok",
          "„A nap keleten ébred, délben magasan jár, nyugaton nyugszik. Érintsd a köveket ebben a sorrendben.” A falon: NYUGAT ← · DÉL ↑ · KELET →. Egy hiba minden követ kiolt.",
        );
      case "rune1":
      case "rune2":
      case "rune3": {
        if (f.amulet)
          return this.open(
            "Rúnakő",
            "A kövek már felragyogtak. A pince titkát megoldottad.",
          );
        const index = Number(o.id.slice(-1)) - 1,
          order = [2, 1, 0],
          count = s.runes.filter(Boolean).length;
        if (count === 3)
          return this.open(
            "Rúnakő",
            "Mindhárom kő fénylik. A láda nyitva áll.",
          );
        if (index === order[count]) {
          s.runes[index] = true;
          this.sound("pickup");
          return this.open(
            "Rúnakő",
            count === 2
              ? "Mindhárom kő fénylik. A láda zárja kattan."
              : "A kő halkan felizzik.",
          );
        }
        s.runes = [false, false, false];
        this.sound("hurt");
        return this.open(
          "Rúnakő",
          "A fények kialszanak. A nap útját kövesd: kelet, dél, nyugat.",
        );
      }
      case "chest":
        if (f.amulet) return this.open("Régi láda", "A láda már üres.");
        if (!s.runes.every(Boolean))
          return this.open(
            "Régi láda",
            "A ládát három rúnával zárták le. Olvasd el a fal feliratát!",
          );
        f.amulet = true;
        s.gold += 15;
        s.potions++;
        s.player.hp = Math.min(this.maxHp, s.player.hp + 1);
        this.sound("secret");
        return this.open(
          "A kertész emléke",
          "Rézmedál: +1 maximális életerő. Találtál még 15 aranyat és egy gyógyitalt. Egyszerű, gondosan őrzött emlék; nem legendás ereklye.",
        );
    }
  }
  inventory() {
    const s = this.state;
    if (!this.started || this.dead || this.dialog) return;
    this.open(
      "Tarisznya és küldetések",
      `${WEAPONS[s.weapon].name} (sebzés: ${WEAPONS[s.weapon].damage}) · Vaspajzs · ${s.armor === "padded" ? "Bélelt mellény (+1 életerő)" : "Vászonvért"}\nGyógyital: ${s.potions} · Gyógyfű: ${s.herbs}${s.flags.amulet ? " · Rézmedál (+1 életerő)" : ""}\n${this.objective}\nIlona gyógyfüvei: ${s.flags.herbsDone ? "teljesítve" : `${s.herbs}/3`}`,
    );
  }
  save(storage) {
    if (!this.started || this.dead)
      return this.message("Előbb indulj útnak, vagy térj vissza a faluba.");
    try {
      storage.setItem(SAVE_KEY, JSON.stringify(this.state));
      this.sound("pickup");
      this.message("Játékállás elmentve ebbe a böngészőbe.");
      return true;
    } catch {
      this.message(
        "A mentés nem sikerült. Engedélyezd a böngésző helyi tárhelyét.",
      );
      return false;
    }
  }
  load(storage) {
    try {
      const raw = storage.getItem(SAVE_KEY);
      if (!raw) {
        this.message("Még nincs mentés ebben a böngészőben.");
        return false;
      }
      const saved = JSON.parse(raw);
      this.state = validateSave(saved);
      this.clearTransient();
      this.invincible = 1;
      this.started = true;
      this.message("Mentés betöltve. Folytasd a kalandot!");
      return true;
    } catch {
      this.message(
        "A mentés sérült, nem támogatott vagy a tárhely nem elérhető. Az aktuális játék változatlan.",
      );
      return false;
    }
  }
}
// Reconstruct static encounter definitions; never trust values from browser storage.
export function validateSave(s) {
  const fail = () => {
    throw new Error("Invalid save");
  };
  const integer = (n, min, max) => Number.isInteger(n) && n >= min && n <= max;
  const finite = (n, min, max) => Number.isFinite(n) && n >= min && n <= max;
  if (
    !s ||
    ![1, 2].includes(s.version) ||
    !["world", "cabin", "cellar", ...Object.keys(INTERIORS)].includes(
      s.scene,
    ) ||
    !s.player ||
    !s.flags
  )
    fail();
  if (
    !integer(s.level, 1, 5) ||
    !integer(s.xp, 0, 190) ||
    !integer(s.gold, 0, 1000000) ||
    !integer(s.potions, 0, 100000) ||
    !integer(s.herbs, 0, 4) ||
    !Object.hasOwn(WEAPONS, s.weapon) ||
    (!(s.version === 1 && s.armor === undefined) &&
      !["linen", "padded"].includes(s.armor))
  )
    fail();
  const expected = 1 + LEVEL_XP.slice(1).filter((x) => s.xp >= x).length;
  if (expected !== s.level) fail();
  if (s.version === 1) {
    s = structuredClone(s);
    s.version = 2;
    s.returnSpot = null;
    s.flags.gateVisited = false;
    s.armor = "linen";
    if (s.flags.examined || s.flags.cupboard) s.flags.journal = true;
    if (isBlocked(s, s.player.x, s.player.y)) {
      Object.assign(
        s.player,
        s.scene === "world" ? { x: 264, y: 210 } : { x: 320, y: 300 },
      );
    }
  }
  const base = initialState();
  for (const flag of Object.keys(base.flags))
    if (typeof s.flags[flag] !== "boolean") fail();
  if (
    (s.flags.returned && !s.flags.rescued) ||
    (s.flags.boss && !s.flags.returned) ||
    (s.flags.cupboard && (!s.flags.examined || !s.flags.journal)) ||
    (s.flags.amulet && !s.flags.cupboard) ||
    (s.flags.gateVisited && !s.flags.boss)
  )
    fail();
  if (
    !finite(s.player.x, 28, s.scene === "world" ? 1892 : 527) ||
    !finite(
      s.player.y,
      s.scene === "world" ? 20 : 73,
      s.scene === "world" ? WORLD.height - 28 : 327,
    ) ||
    !finite(s.player.dx, -1, 1) ||
    !finite(s.player.dy, -1, 1) ||
    !integer(
      s.player.hp,
      1,
      4 + s.level + Number(s.flags.amulet) + Number(s.armor === "padded"),
    )
  )
    fail();
  if (
    (s.scene !== "world" &&
      (s.player.x < 113 || s.player.y < 73 || s.player.y > 327)) ||
    (s.scene === "cellar" && !s.flags.cupboard)
  )
    fail();
  if (isBlocked(s, s.player.x, s.player.y)) fail();
  if (s.returnSpot !== null) {
    if (
      !s.returnSpot ||
      !Object.hasOwn(INTERIORS, s.scene) ||
      !finite(s.returnSpot.x, 28, 1892) ||
      !finite(s.returnSpot.y, 54, WORLD.height - 28) ||
      isBlocked({ ...s, scene: "world" }, s.returnSpot.x, s.returnSpot.y)
    )
      fail();
    base.returnSpot = { x: s.returnSpot.x, y: s.returnSpot.y };
  } else if (Object.hasOwn(INTERIORS, s.scene)) fail();
  if (
    !Array.isArray(s.runes) ||
    s.runes.length !== 3 ||
    s.runes.some((r) => typeof r !== "boolean") ||
    !Array.isArray(s.collected) ||
    new Set(s.collected).size !== s.collected.length ||
    s.collected.some((id) => !HERBS.some((h) => h.id === id))
  )
    fail();
  if (!Array.isArray(s.enemies) || s.enemies.length !== ENCOUNTERS.length)
    fail();
  base.scene = s.scene;
  base.player = {
    x: s.player.x,
    y: s.player.y,
    hp: s.player.hp,
    dx: s.player.dx,
    dy: s.player.dy,
  };
  for (const key of [
    "level",
    "xp",
    "gold",
    "weapon",
    "armor",
    "potions",
    "herbs",
  ])
    base[key] = s[key];
  base.flags = Object.fromEntries(
    Object.keys(base.flags).map((k) => [k, s.flags[k]]),
  );
  base.runes = [...s.runes];
  base.collected = [...s.collected];
  base.enemies = ENCOUNTERS.map((e, i) => {
    const v = s.enemies[i];
    if (
      !v ||
      v.id !== e.id ||
      !integer(v.hp, 0, e.hp) ||
      !finite(v.x, 28, 1892) ||
      !finite(v.y, 54, WORLD.height - 28) ||
      !finite(v.respawn, 0, 35)
    )
      fail();
    return {
      ...e,
      maxHp: e.hp,
      x: v.x,
      y: v.y,
      hp: v.hp,
      respawn: v.respawn,
      flash: 0,
    };
  });
  if (base.flags.boss !== (base.enemies.find((e) => e.boss).hp === 0)) fail();
  return base;
}

export function isBlocked(s, x, y) {
  const overlap = (o) =>
    x + 9 > o.x && x - 9 < o.x + o.w && y + 8 > o.y && y - 8 < o.y + o.h;
  if (s.scene !== "world")
    return (
      x < 113 ||
      x > 527 ||
      y < 73 ||
      y > 327 ||
      interiorSolids(s.scene, s.flags).some(overlap)
    );
  const gate = s.flags.boss && x > 1758 && x < 1800;
  if (
    x < 28 ||
    x > WORLD.width - 28 ||
    y < (gate ? 20 : 54) ||
    y > WORLD.height - 28
  )
    return true;
  if (BUILDINGS.some(overlap)) return true;
  if (
    x + 8 > STREAM.x &&
    x - 8 < STREAM.x + STREAM.w &&
    (y - 8 < STREAM.bridgeY + 8 || y + 8 > STREAM.bridgeY + STREAM.bridgeH - 8)
  )
    return true;
  return DECOR.filter((d) => d.solid).some((d) =>
    overlap({
      x: d.x - (d.w || 28) / 2,
      y: d.y + (d.offsetY ?? -2),
      w: d.w || 28,
      h: d.h || 12,
    }),
  );
}
