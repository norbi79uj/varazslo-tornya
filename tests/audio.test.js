import test from "node:test";
import assert from "node:assert/strict";
import { RetroAudio } from "../audio.js";
function installAudio(t, AudioContext) {
  const previous = globalThis.window;
  globalThis.window = { AudioContext };
  t.after(() => {
    if (previous === undefined) delete globalThis.window;
    else globalThis.window = previous;
  });
}
test("missing or rejected Web Audio remains muted without breaking the game", async (t) => {
  installAudio(t, undefined);
  const audio = new RetroAudio();
  assert.equal(await audio.toggle(), false);
  window.AudioContext = class {
    createGain() {
      return { gain: { setValueAtTime() {} }, connect() {} };
    }
    resume() {
      return Promise.reject(Error("Audio unavailable"));
    }
    close() {
      return Promise.resolve();
    }
  };
  assert.equal(await audio.toggle(), false);
  assert.equal(audio.enabled, false);
  assert.equal(audio.context, null);
});
test("a suspended audio backend times out instead of locking the sound button", async (t) => {
  let closed = false;
  installAudio(
    t,
    class {
      state = "suspended";
      createGain() {
        return { gain: { setValueAtTime() {} }, connect() {} };
      }
      resume() {
        return new Promise(() => {});
      }
      close() {
        closed = true;
        return Promise.resolve();
      }
    },
  );
  const audio = new RetroAudio();
  assert.equal(await audio.toggle(), false);
  assert.equal(closed, true);
  assert.equal(audio.context, null);
});
test("village and forest schedule distinct melodies and effects, and muting suspends playback", async (t) => {
  const frequencies = [];
  let suspended = false;
  installAudio(
    t,
    class {
      state = "running";
      currentTime = 0;
      destination = {};
      resume() {
        return Promise.resolve();
      }
      suspend() {
        suspended = true;
        return Promise.resolve();
      }
      createOscillator() {
        return {
          frequency: { setValueAtTime: (f) => frequencies.push(f) },
          connect() {},
          start() {},
          stop() {},
        };
      }
      createGain() {
        return {
          gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
          connect() {},
        };
      }
    },
  );
  const audio = new RetroAudio();
  assert.equal(await audio.toggle(), true);
  audio.tick("Smaragdvölgy falu");
  assert.deepEqual(frequencies.splice(0), [392, 130.81]);
  audio.tick("Öreg erdő");
  assert.deepEqual(frequencies.splice(0), [220, 110]);
  audio.tick("Öreg erdő", false, true);
  assert.deepEqual(frequencies.splice(0), [147, 73.42]);
  audio.setVolume(0.25);
  assert.equal(audio.volume, 0.25);
  audio.setVolume(99);
  assert.equal(audio.volume, 1);
  audio.effect("buy");
  assert.deepEqual(frequencies.splice(0), [523, 659, 784]);
  audio.effect("attack");
  assert.deepEqual(frequencies.splice(0), [220, 100]);
  assert.equal(await audio.toggle(), false);
  assert.equal(suspended, true);
  audio.effect("buy");
  assert.deepEqual(frequencies, []);
});

test("quiet ambience is local, throttled, silent during dialogue/mute, and doors have their own effect", () => {
  const a = new RetroAudio(),
    events = [];
  a.enabled = true;
  a.context = { currentTime: 0 };
  a.tone = (...args) => events.push(args);
  a.ambience("world", { x: 161, y: 190 });
  assert.deepEqual(
    events.map((e) => e[0]),
    [880, 1760],
  );
  assert.ok(events.every((e) => e[3] <= 0.006));
  events.length = 0;
  a.ambience("world", { x: 161, y: 190 });
  assert.equal(events.length, 0);
  a.context.currentTime = 3;
  a.ambience("inn", { x: 320, y: 300 }, true);
  assert.equal(events.length, 0);
  a.ambience("inn", { x: 320, y: 300 });
  assert.deepEqual(
    events.map((e) => e[0]),
    [131, 262],
  );
  events.length = 0;
  a.context.currentTime = 8;
  a.ambience("world", { x: 984, y: 220 });
  assert.deepEqual(
    events.map((e) => e[0]),
    [660, 1046, 784],
  );
  events.length = 0;
  a.context.currentTime = 12;
  a.ambience("world", { x: 1400, y: 220 });
  assert.deepEqual(
    events.map((e) => e[0]),
    [1480, 1760, 1568],
  );
  events.length = 0;
  a.enabled = false;
  a.context.currentTime = 17;
  a.ambience("world", { x: 1400, y: 220 });
  assert.equal(events.length, 0);
  a.enabled = true;
  a.effect("door");
  assert.deepEqual(
    events.map((e) => e[0]),
    [196, 98],
  );
});
