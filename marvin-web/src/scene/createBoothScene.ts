import {
  ACESFilmicToneMapping, CanvasTexture, Color, DirectionalLight, HemisphereLight, Mesh, MeshBasicMaterial,
  PCFSoftShadowMap, PerspectiveCamera, PlaneGeometry, PMREMGenerator,
  PointLight, Scene, ShadowMaterial, SRGBColorSpace, Vector3, WebGLRenderer,
} from "three";
import { studioEnvironment } from "./studioEnvironment";
import { buildBooth, boothDimensions } from "./buildBooth";
import { cameraPose, timeline } from "../lib/timeline";
import { createCurtainMotion } from "./curtainMotion";
import { createScrollMotion } from "./scrollMotion";

export function createBoothScene(host: HTMLDivElement, initialProgress: number) {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  canvas.className = "booth-canvas";
  host.appendChild(canvas);
  const scene = new Scene();
  scene.background = new Color("#ffffff");
  const camera = new PerspectiveCamera(34, 1, .025, 80);
  const target = new Vector3();
  const environmentScene = studioEnvironment();
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(environmentScene, .025, .1, 50, { size: 256 });
  scene.environment = environment.texture;
  scene.environmentIntensity = .7;
  environmentScene.dispose();
  pmrem.dispose();
  scene.add(new HemisphereLight("#fff9ef", "#929487", .55));
  const key = new DirectionalLight("#fff7e5", 2.0);
  key.position.set(-3, 6, 5);
  key.castShadow = true;
  key.shadow.mapSize.setScalar(host.clientWidth < 700 ? 1024 : 2048);
  key.shadow.camera.left = -2.5;
  key.shadow.camera.right = 2.5;
  key.shadow.camera.top = 3;
  key.shadow.camera.bottom = -2.5;
  key.shadow.normalBias = .006;
  key.shadow.bias = -.0001;
  key.shadow.radius = 3;
  scene.add(key);
  const fill = new DirectionalLight("#e6efff", .65);
  fill.position.set(4, 3, 2);
  scene.add(fill);
  const interiorLight = new PointLight("#ffe9bb", 2, 3, 2);
  interiorLight.position.set(.9, 2.8, -.15);
  scene.add(interiorLight);
  const floor = new Mesh(new PlaneGeometry(40, 40), new ShadowMaterial({ opacity: .045 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -.012;
  floor.receiveShadow = true;
  scene.add(floor);
  // Soft contact occlusion grounds the booth without a sharp theatrical shadow.
  const shadowCanvas = document.createElement("canvas");
  shadowCanvas.width = shadowCanvas.height = 128;
  const shadowContext = shadowCanvas.getContext("2d")!;
  const gradient = shadowContext.createRadialGradient(64, 64, 16, 64, 64, 64);
  gradient.addColorStop(0, "rgba(39,38,30,.28)");
  gradient.addColorStop(.5, "rgba(39,38,30,.12)");
  gradient.addColorStop(1, "rgba(39,38,30,0)");
  shadowContext.fillStyle = gradient;
  shadowContext.fillRect(0, 0, 128, 128);
  const contactTexture = new CanvasTexture(shadowCanvas);
  const contact = new Mesh(new PlaneGeometry(4.8, 3.1), new MeshBasicMaterial({
    map: contactTexture, transparent: true, depthWrite: false, toneMapped: false,
  }));
  contact.rotation.x = -Math.PI / 2;
  contact.position.set(0, -.009, .1);
  scene.add(contact);

  let progress = initialProgress;
  let scheduled = 0;
  let disposed = false;
  let lost = false;
  let frames = 0;
  let distance = 8;
  let previousTime = performance.now();
  let windTime = 0;
  let motionActive = true;
  const clothMotion = createCurtainMotion(timeline(initialProgress).curtain);
  const scrollMotion = createScrollMotion(initialProgress);
  const booth = buildBooth(schedule);
  scene.add(booth.root);
  void booth.ready.then(() => { if (!disposed) { host.dataset.textures = "loaded"; schedule(); } });
  function schedule() {
    if (!disposed && !lost && !scheduled && !document.hidden) scheduled = requestAnimationFrame(render);
  }
  function render(time: number) {
    scheduled = 0;
    if (disposed || lost || document.hidden || progress >= 1) return;
    const elapsed = (time - previousTime) / 1000;
    // Idle breeze renders at 30 fps; wheel/touch movement remains responsive.
    if (!motionActive && elapsed < 1 / 30) { schedule(); return; }
    const motion = scrollMotion.step(progress, elapsed);
    const pose = timeline(motion.progress);
    const cloth = clothMotion.step(pose.curtain, elapsed);
    previousTime = time;
    windTime += Math.max(0, Math.min(elapsed, .05));
    booth.setCurtain(pose.curtain, cloth.displacement, windTime);
    const view = cameraPose(motion.progress, distance);
    // Keep eye level fixed during travel; change position, not field of view.
    camera.position.set(view.x, view.y, view.z);
    target.set(view.lookX, view.lookY, view.lookZ);
    camera.lookAt(target);
    renderer.render(scene, camera);
    if (frames === 0) performance.mark("marvin-scene-ready");
    host.dataset.renderer = "ready";
    host.dataset.curtain = pose.curtain.toFixed(4);
    host.dataset.camera = camera.position.toArray().map(value => value.toFixed(4)).join(",");
    host.dataset.sceneMotion = motion.active ? "settling" : "settled";
    host.dataset.frames = String(++frames);
    host.dataset.clothMotion = cloth.active ? "settling" : "settled";
    host.dataset.clothDisplacement = cloth.displacement.toFixed(6);
    host.dataset.wind = "breeze";
    host.dataset.windTime = windTime.toFixed(4);
    motionActive = cloth.active || motion.active;
    schedule();
  }
  function resize() {
    const width = Math.max(1, host.clientWidth), height = Math.max(1, host.clientHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, width < 700 ? 1.25 : 1.5));
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const tangent = Math.tan(camera.fov * Math.PI / 360);
    distance = .85 + Math.max(boothDimensions.height / (2 * tangent), 3.55 / (2 * tangent * camera.aspect)) * 1.16;
    schedule();
  }
  const onContextLost = (event: Event) => {
    event.preventDefault();
    lost = true;
    cancelAnimationFrame(scheduled);
    scheduled = 0;
    host.dataset.renderer = "fallback";
  };
  const onVisibility = () => { if (!document.hidden) { previousTime = performance.now(); schedule(); } };
  canvas.addEventListener("webglcontextlost", onContextLost);
  document.addEventListener("visibilitychange", onVisibility);
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  return {
    setProgress(value: number) { progress = value; schedule(); },
    dispose() {
      disposed = true;
      cancelAnimationFrame(scheduled);
      observer.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      document.removeEventListener("visibilitychange", onVisibility);
      booth.dispose();
      floor.geometry.dispose();
      floor.material.dispose();
      contact.geometry.dispose();
      contact.material.dispose();
      contactTexture.dispose();
      environment.dispose();
      key.shadow.map?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
