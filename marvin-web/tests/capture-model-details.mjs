import { chromium, expect } from "@playwright/test";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHROMIUM_CHANNEL || "chrome" });
const output = new URL("../../docs/qa/realism-2026-10-22/", import.meta.url);
await fs.mkdir(output, { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto("http://127.0.0.1:5173/");
  await expect(page.locator(".booth-renderer")).toHaveAttribute("data-textures", "loaded");
  await expect(page.locator(".booth-renderer")).toHaveAttribute("data-renderer", "ready");
  await page.waitForTimeout(150);
  const canvas = page.locator("canvas");
  const size = await canvas.boundingBox();
  await canvas.screenshot({ type: "jpeg", quality: 90,
    path: fileURLToPath(new URL("../public/media/booth-realistic.jpg", import.meta.url)) });
  await fs.writeFile(new URL("poster-size.json", output), JSON.stringify(size, null, 2));

  await page.goto("http://127.0.0.1:5173/#work");
  const rendered = await page.evaluate(async () => {
    const T = await import("/node_modules/three/build/three.module.js");
    const { RoomEnvironment } = await import("/node_modules/three/examples/jsm/environments/RoomEnvironment.js");
    const { buildBooth } = await import("/src/scene/buildBooth.ts");
    const model = buildBooth(() => {});
    await model.ready;
    const renderer = new T.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(1100, 1000);
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    const scene = new T.Scene();
    scene.background = new T.Color("#f6f5f1");
    const environment = new RoomEnvironment();
    const pmrem = new T.PMREMGenerator(renderer);
    const target = pmrem.fromScene(environment, .05, .1, 50, { size: 128 });
    scene.environment = target.texture;
    scene.environmentIntensity = .7;
    scene.add(model.root, new T.HemisphereLight("#fff9ef", "#929487", .55));
    const key = new T.DirectionalLight("#fff7e5", 2);
    key.position.set(-3, 6, 5); scene.add(key);
    const fill = new T.DirectionalLight("#e6efff", .65);
    fill.position.set(4, 3, 2); scene.add(fill);
    const camera = new T.PerspectiveCamera(32, 1.1, .02, 30);
    const images = [];
    for (const [name, position, look, opening, sway] of [
      ["printer-detail", [.1, 1.5, 2.8], [-.73, 1.18, .7], 0, 0],
      ["logo-detail", [.25, 3.85, 3.4], [0, 3.775, .65], 0, 0],
      ["velvet-detail", [1.25, 2.0, 3.2], [.94, 1.7, .85], 0, 0],
      ["velvet-moving", [1.25, 2.0, 3.2], [.94, 1.7, .85], .5, .09],
      ["velvet-settled", [1.25, 2.0, 3.2], [.94, 1.7, .85], .5, 0],
    ]) {
      model.setCurtain(opening, sway);
      camera.position.set(...position); camera.lookAt(...look);
      renderer.render(scene, camera);
      images.push({ name, data: renderer.domElement.toDataURL("image/png").split(",")[1] });
    }
    model.dispose(); target.dispose(); environment.dispose(); pmrem.dispose(); renderer.dispose(); renderer.forceContextLoss();
    return images;
  });
  for (const item of rendered) await fs.writeFile(new URL(`${item.name}.png`, output), Buffer.from(item.data, "base64"));
  console.log(`Captured model details and matching fallback poster (${size.width} × ${size.height}).`);
} finally { await browser.close(); }
