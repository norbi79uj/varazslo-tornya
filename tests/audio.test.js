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
