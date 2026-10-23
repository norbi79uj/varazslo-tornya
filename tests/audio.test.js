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
  audio.effect("buy");
  assert.deepEqual(frequencies.splice(0), [523, 659, 784]);
  audio.effect("attack");
  assert.deepEqual(frequencies.splice(0), [220, 100]);
  assert.equal(await audio.toggle(), false);
  assert.equal(suspended, true);
  audio.effect("buy");
  assert.deepEqual(frequencies, []);
});
