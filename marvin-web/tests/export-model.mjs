import { chromium } from "@playwright/test";
import fs from "node:fs/promises";

// Run against the Vite development server. Export the same geometry/textures
// used on the website; this GLB is a reusable handoff, not a second runtime asset.
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHROMIUM_CHANNEL || "chromium" });
try {
  const page = await browser.newPage();
  await page.goto(process.argv[2] || "http://127.0.0.1:5173/#work");
  const bytes = await page.evaluate(async () => {
    const { buildBooth } = await import("/src/scene/buildBooth.ts");
    const { GLTFExporter } = await import("/node_modules/three/examples/jsm/exporters/GLTFExporter.js");
    const model = buildBooth(() => {});
    await model.ready;
    try {
      const result = await new GLTFExporter().parseAsync(model.root, { binary: true });
      return Array.from(new Uint8Array(result));
    } finally { model.dispose(); }
  });
  const output = new URL("../../docs/models/marvin-booth.glb", import.meta.url);
  await fs.mkdir(new URL(".", output), { recursive: true });
  const buffer = Buffer.from(bytes);
  if (buffer.toString("utf8", 0, 4) !== "glTF") throw new Error("Export did not produce a GLB.");
  await fs.writeFile(output, buffer);
  const validation = await page.evaluate(async bytes => {
    const { GLTFLoader } = await import("/node_modules/three/examples/jsm/loaders/GLTFLoader.js");
    const { Box3 } = await import("/node_modules/three/build/three.module.js");
    const model = await new GLTFLoader().parseAsync(new Uint8Array(bytes).buffer, "");
    let meshes = 0, triangles = 0;
    const namedParts = [];
    model.scene.traverse(object => {
      if (object.isMesh) {
        meshes++;
        triangles += (object.geometry.index?.count || object.geometry.attributes.position.count) / 3;
        if (/Supplied|printer/i.test(object.name)) namedParts.push(object.name);
      }
    });
    const bounds = new Box3().setFromObject(model.scene);
    return { meshes, triangles, min: bounds.min.toArray(), max: bounds.max.toArray(), namedParts };
  }, bytes);
  if (!validation.namedParts.some(name => /olive_velvet|olive velvet/i.test(name))) throw new Error("Export lost the supplied curtain.");
  await fs.writeFile(new URL("../../docs/models/validation.json", import.meta.url), JSON.stringify({ bytes: buffer.length, ...validation }, null, 2));
  console.log(`Exported reference booth GLB: ${buffer.length.toLocaleString()} bytes.`);
} finally { await browser.close(); }
