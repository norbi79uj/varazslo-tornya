import { Game } from "./engine.js";
import { Renderer } from "./renderer.js";
import { RetroAudio } from "./audio.js";
import { LEVEL_XP, WEAPONS } from "./world.js";
const $ = (s) => document.querySelector(s),
  canvas = $("#game"),
  renderer = new Renderer(canvas),
  audio = new RetroAudio();
let assetsReady = false;
const game = new Game({
  message: (text) => {
    $("#status").textContent = text;
  },
  sound: (name) => audio.effect(name),
});
let dialogRef = null,
  last = 0,
  hadStarted = false;
function focusGame() {
  canvas.focus({ preventScroll: true });
}
function setText(selector, value) {
  const element = $(selector),
    text = String(value);
  if (element.textContent !== text) element.textContent = text;
}
function storageAction(action) {
  if (!assetsReady) return;
  try {
    game[action](window.localStorage);
  } catch {
    $("#status").textContent =
      "A böngésző tárhelye nem elérhető. A játék mentés nélkül folytatható.";
  }
  sync();
}
function sync() {
  const s = game.state;
  setText(
    "#health",
    "♥".repeat(s.player.hp) + "♡".repeat(Math.max(0, game.maxHp - s.player.hp)),
  );
  const healthLabel = `Életerő: ${s.player.hp}/${game.maxHp}`;
  if ($("#health").getAttribute("aria-label") !== healthLabel)
    $("#health").setAttribute("aria-label", healthLabel);
  setText("#location", game.zone);
  setText("#quest", game.objective);
  setText("#level", `${s.level}. SZINT`);
  setText(
    "#xp",
    s.level === 5 ? "MAX SZINT" : `${s.xp} / ${LEVEL_XP[s.level]} TP`,
  );
  $("#xp-bar").style.width =
    s.level === 5
      ? "100%"
      : `${((s.xp - LEVEL_XP[s.level - 1]) / (LEVEL_XP[s.level] - LEVEL_XP[s.level - 1])) * 100}%`;
  setText("#gold", s.gold);
  setText("#potions", s.potions);
  setText("#weapon", WEAPONS[s.weapon].name);
  $("#overlay").classList.toggle("hidden", game.started);
  if (game.started && !hadStarted) focusGame();
  hadStarted = game.started;
  const dialog = $("#dialog");
  if (game.dialog !== dialogRef) {
    dialogRef = game.dialog;
    if (game.dialog) {
      $("#dialog-title").textContent = game.dialog.title;
      $("#dialog-text").textContent = game.dialog.text;
      const choices = $("#dialog-choices");
      choices.replaceChildren();
      for (const choice of game.dialog.choices) {
        const b = document.createElement("button");
        b.textContent = choice.label;
        b.onclick = () => {
          choice.action();
          sync();
        };
        choices.append(b);
      }
      $("#close-dialog").hidden = game.dead;
      if (!dialog.open) dialog.showModal();
      (choices.querySelector("button") || $("#close-dialog")).focus();
    } else if (dialog.open) {
      dialog.close();
      focusGame();
    }
  }
}
function requestRestart() {
  if (!assetsReady) return;
  if (game.dead) {
    game.revive();
    sync();
    return;
  }
  if (!game.started) {
    game.start();
    sync();
    return;
  }
  if (game.dialog) return;
  game.open(
    "Új kaland?",
    "A jelenlegi, nem mentett előrehaladás elvész. A kézi mentésed megmarad.",
    [
      game.choice("Igen, új játék", () => {
        game.newGame();
        sync();
      }),
    ],
  );
  sync();
}
$("#start").onclick = () => {
  game.start();
  sync();
};
$("#restart").onclick = requestRestart;
$("#save").onclick = () => storageAction("save");
$("#load").onclick = () => storageAction("load");
$("#load-start").onclick = () => storageAction("load");
$("#inventory").onclick = () => {
  game.inventory();
  sync();
};
$("#potion").onclick = () => game.potion();
try {
  const saved = localStorage.getItem("smaragd.audio-volume");
  if (saved !== null && Number.isFinite(Number(saved)))
    $("#volume").value = String(Math.max(0, Math.min(100, Number(saved))));
} catch {}
function volumeChanged() {
  const value = Number($("#volume").value);
  audio.setVolume(value / 100);
  $("#volume-value").textContent = value + "%";
  try {
    localStorage.setItem("smaragd.audio-volume", String(value));
  } catch {}
}
$("#volume").addEventListener("input", volumeChanged);
volumeChanged();
$("#sound").onclick = async () => {
  $("#sound").disabled = true;
  const enabled = await audio.toggle();
  $("#sound").textContent = enabled ? "♫ Hang: be" : "♫ Hang: ki";
  $("#sound").setAttribute("aria-pressed", String(enabled));
  $("#sound").disabled = false;
  if (!enabled && !audio.context)
    $("#status").textContent =
      "A hangkimenet nem érhető el. A játék hang nélkül is folytatható.";
};
$("#close-dialog").onclick = () => {
  game.close();
  sync();
};
$("#dialog").addEventListener("cancel", (e) => {
  e.preventDefault();
  if (!game.dead) {
    game.close();
    sync();
  }
});
window.addEventListener("keydown", (e) => {
  if (
    e.target instanceof HTMLInputElement ||
    e.target instanceof HTMLTextAreaElement
  )
    return;
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (game.dialog) {
    if (k === "Escape" && !game.dead) {
      game.close();
      sync();
      e.preventDefault();
    }
    return;
  }
  if (e.target instanceof HTMLButtonElement && (k === " " || k === "Enter"))
    return;
  if ([" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(k))
    e.preventDefault();
  if (e.repeat && ["e", "q", "i", "r"].includes(k)) return;
  if (k === "r") requestRestart();
  else if (k === "e") game.interact();
  else if (k === "q") game.potion();
  else if (k === "i") game.inventory();
  else {
    game.keys.add(k);
    if (k === " ") game.attack();
  }
  sync();
});
window.addEventListener("keyup", (e) =>
  game.keys.delete(e.key.length === 1 ? e.key.toLowerCase() : e.key),
);
window.addEventListener("blur", () => game.keys.clear());
document.addEventListener("visibilitychange", () => game.keys.clear());
canvas.addEventListener("pointerdown", focusGame);
document.querySelectorAll("[data-key]").forEach((button) => {
  button.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    button.setPointerCapture(e.pointerId);
    const k = button.dataset.key;
    if (k === "e") game.interact();
    else if (k === "q") game.potion();
    else {
      game.keys.add(k);
      if (k === " ") game.attack();
    }
    sync();
  });
  for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
    button.addEventListener(event, () => game.keys.delete(button.dataset.key));
});
sync();
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.035);
  last = now;
  if (!document.hidden) {
    game.update(dt);
    renderer.draw(game);
    audio.tick(game.zone, !game.started || game.dead, game.bossNearby);
    audio.ambience(
      game.state.scene,
      game.state.player,
      !game.started || game.dead || !!game.dialog,
    );
    sync();
  }
  requestAnimationFrame(frame);
}
$("#start").disabled = true;
$("#load-start").disabled = true;
renderer.ready
  .then(() => {
    assetsReady = true;
    $("#start").disabled = false;
    $("#load-start").disabled = false;
    requestAnimationFrame(frame);
  })
  .catch((error) => {
    $("#overlay h2").textContent = "A grafika nem tölthető be";
    $("#overlay p").textContent =
      "Indítsd a játékot helyi webszerverről, és ellenőrizd az assets mappát.";
    $("#status").textContent = error.message;
  });
