// Shared real-Canvas evidence, executed inside Chromium and Firefox.
export async function probeEnvironmentGraphics() {
  const { ENVIRONMENT_SHEETS, ENVIRONMENT_SPRITES, drawEnvironmentSprite } =
    await import("../assets/kenney/environment.js");
  const images = {},
    sheets = [];
  for (const [pack, definition] of Object.entries(ENVIRONMENT_SHEETS)) {
    const response = await fetch(definition.url);
    const image = new Image();
    image.src = definition.url;
    await image.decode();
    images[pack] = image;
    sheets.push({
      pack,
      ok: response.ok,
      type: response.headers.get("content-type"),
      width: image.naturalWidth,
      height: image.naturalHeight,
    });
  }
  const canvas = document.createElement("canvas");
  canvas.width = 96;
  canvas.height = 96;
  const ctx = canvas.getContext("2d"),
    sprites = [];
  for (const [name, definition] of Object.entries(ENVIRONMENT_SPRITES)) {
    ctx.clearRect(0, 0, 96, 96);
    drawEnvironmentSprite(ctx, images, name, 0, 0);
    const p = ctx.getImageData(0, 0, 96, 96).data;
    let visible = 0,
      nativePixels = true;
    for (let y = 0; y < definition.h; y += 2)
      for (let x = 0; x < definition.w; x += 2) {
        const at = (y * 96 + x) * 4;
        if (p[at + 3] > 0) visible += 4;
        for (const offset of [4, 96 * 4, 96 * 4 + 4])
          for (let channel = 0; channel < 4; channel++)
            if (p[at + channel] !== p[at + offset + channel])
              nativePixels = false;
      }
    sprites.push({ name, visible, nativePixels });
  }
  const pixels = document
      .querySelector("#game")
      .getContext("2d")
      .getImageData(0, 0, 640, 384).data,
    colors = new Set();
  for (let i = 0; i < pixels.length; i += 4)
    colors.add(`${pixels[i]},${pixels[i + 1]},${pixels[i + 2]}`);
  return { sheets, sprites, colors: colors.size };
}
