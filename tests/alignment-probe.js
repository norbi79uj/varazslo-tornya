// Real Canvas assertions for feet, grid and crop geometry, shared by both engines.
export async function probeVisualAlignment() {
  const { Renderer } = await import("../renderer.js");
  const { Game } = await import("../engine.js");
  const { snap, buildingPlacement } = await import("../visual-layout.js");
  const { BUILDINGS } = await import("../world.js");
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 384;
  const r = new Renderer(canvas);
  await r.ready;
  const g = new Game();
  g.start();
  Object.assign(g.state.player, { x: 338, y: 251 });
  const c = canvas.getContext("2d"),
    draw = c.drawImage.bind(c),
    feet = {},
    offGrid = [];
  let staticCalls = 0;
  c.drawImage = function (...a) {
    const m = this.getTransform(),
      src = a[0]?.src || "",
      dx = a.length === 9 ? a[5] : a[1],
      dy = a.length === 9 ? a[6] : a[2];
    if (
      src.includes("roguelikeChar_transparent.png") &&
      a[1] === 0 &&
      a[4] === 13
    ) {
      const name =
        a[2] === 187
          ? "hero"
          : a[2] === 170
            ? "merchant"
            : a[2] === 102
              ? "smith"
              : null;
      if (name)
        feet[name] = {
          cx: m.e + 16 * m.a + r.camera,
          ground: m.f + 32 * m.d + r.cameraY,
        };
    }
    if (!src.includes("roguelikeChar_transparent.png")) {
      const point = {
        x: m.e + dx * m.a + dy * m.c,
        y: m.f + dx * m.b + dy * m.d,
      };
      staticCalls++;
      if (
        Math.abs(point.x / 2 - Math.round(point.x / 2)) > 1e-8 ||
        Math.abs(point.y / 2 - Math.round(point.y / 2)) > 1e-8
      )
        offGrid.push({ src: src.split("/").at(-1), x: point.x, y: point.y });
    }
    return draw(...a);
  };
  r.draw(g);
  return {
    feet,
    expected: {
      hero: { cx: snap(g.state.player.x), ground: snap(g.state.player.y + 8) },
      merchant: { cx: snap(338), ground: snap(225 + 8) },
      smith: { cx: snap(161), ground: snap(172 + 8) },
    },
    offGrid,
    staticCalls,
    camera: { x: r.camera, y: r.cameraY },
    houses: BUILDINGS.map((b) => ({ id: b.id, ...buildingPlacement(b) })),
  };
}
export function recordLabels() {
  window.__labels = [];
  window.__labelPositions = {};
  const draw = CanvasRenderingContext2D.prototype.drawImage,
    text = CanvasRenderingContext2D.prototype.fillText;
  CanvasRenderingContext2D.prototype.drawImage = function (...a) {
    if (
      this.canvas.id === "game" &&
      a[0] instanceof HTMLCanvasElement &&
      a[0].width === 1920
    ) {
      window.__labels = [];
      window.__labelPositions = {};
    }
    return draw.apply(this, a);
  };
  CanvasRenderingContext2D.prototype.fillText = function (value, ...a) {
    if (this.canvas.id === "game") {
      window.__labels.push(String(value));
      window.__labelPositions[String(value)] = { x: a[0], y: a[1] };
    }
    return text.call(this, value, ...a);
  };
}
