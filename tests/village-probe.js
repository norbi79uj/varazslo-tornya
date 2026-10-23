// Execute in a real browser: inspect the same rendering functions as the game.
export async function probeVillageGraphics() {
  const { DETAIL_SHEET, DETAIL_SPRITES, drawDetail } =
    await import("../assets/village/draw.js");
  const { CHARACTER_SHEET, CHARACTER_PROFILES, drawKenneyActor } =
    await import("../assets/kenney/characters/profiles.js");
  const details = new Image();
  details.src = DETAIL_SHEET.url;
  await details.decode();
  const characters = new Image();
  characters.src = CHARACTER_SHEET.url;
  await characters.decode();
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 96;
  const ctx = canvas.getContext("2d"),
    sprites = [];
  for (const [name, s] of Object.entries(DETAIL_SPRITES)) {
    ctx.clearRect(0, 0, 128, 96);
    drawDetail(ctx, details, name, 0, 0);
    const pixels = ctx.getImageData(0, 0, 128, 96).data;
    let visible = 0,
      nativePixels = true;
    for (let y = 0; y < s.h * 2; y += 2)
      for (let x = 0; x < s.w * 2; x += 2) {
        const at = (y * 128 + x) * 4;
        if (pixels[at + 3] > 0) visible += 4;
        for (const offset of [4, 128 * 4, 128 * 4 + 4])
          for (let channel = 0; channel < 4; channel++)
            if (pixels[at + channel] !== pixels[at + offset + channel])
              nativePixels = false;
      }
    sprites.push({ name, visible, nativePixels });
  }
  const roles = Object.keys(CHARACTER_PROFILES).map((name) => {
    const frames = [];
    for (const direction of ["down", "up", "left", "right"]) {
      ctx.clearRect(0, 0, 128, 96);
      drawKenneyActor(ctx, characters, name, 24, 24, { direction, details });
      frames.push([...ctx.getImageData(0, 0, 80, 80).data].join(","));
    }
    return { name, directions: new Set(frames).size };
  });
  return {
    width: details.naturalWidth,
    height: details.naturalHeight,
    sprites,
    roles,
  };
}
// Observe the real merchant's Canvas transform without adding debug hooks to the game.
export function recordMerchant() {
  window.__merchant = [];
  window.__drawOrder = [];
  const original = CanvasRenderingContext2D.prototype.drawImage;
  CanvasRenderingContext2D.prototype.drawImage = function (...args) {
    if (args[0] instanceof HTMLCanvasElement && args[0].width === 1920)
      window.__drawOrder = [];
    if (
      args[0]?.src?.includes("details.png") &&
      args[3] === 36 &&
      args[4] === 12
    )
      window.__drawOrder.push("counter");
    if (
      args[0]?.src?.includes("roguelikeChar_transparent.png") &&
      args[1] === 0 &&
      args[2] === 187 &&
      args[4] === 13
    )
      window.__drawOrder.push("hero");
    if (
      args[0]?.src?.includes("roguelikeChar_transparent.png") &&
      args[1] === 0 &&
      args[2] === 170 &&
      args[4] === 13
    ) {
      window.__drawOrder.push("merchant");
      const t = this.getTransform();
      window.__merchant.push({
        x: Math.round(t.e + 16 * t.a),
        y: Math.round(t.f + 16 * t.d),
      });
      if (window.__merchant.length > 400) window.__merchant.shift();
    }
    return original.apply(this, args);
  };
}
