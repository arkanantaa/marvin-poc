import {
  BoxGeometry, BufferAttribute, BufferGeometry, CanvasTexture, CylinderGeometry, DoubleSide, DynamicDrawUsage, Float32BufferAttribute, Group, Mesh,
  MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, PlaneGeometry,
  RepeatWrapping, SRGBColorSpace, TextureLoader, TorusGeometry, type Material, type Texture,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { asset } from "../lib/assets";
import { curtainVertex } from "./curtainMotion";

export const boothDimensions = { width: 3.2, height: 4.04, doorLeft: .43, doorRight: 1.43, eyeHeight: 1.7 };

function surfaceGrain() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const context = canvas.getContext("2d")!;
  const pixels = context.createImageData(128, 128);
  let seed = 31;
  for (let i = 0; i < pixels.data.length; i += 4) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const shade = 100 + (seed % 54);
    pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = shade;
    pixels.data[i + 3] = 255;
  }
  context.putImageData(pixels, 0, 0);
  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(9, 22);
  return texture;
}

// A procedural mesh reconstruction of marvin_main.png. Depth and hidden
// interior surfaces are inferred from the single frontal reference image.
export function buildBooth(invalidate: () => void) {
  const root = new Group();
  root.name = "Marvin Studio — reference reconstruction";
  let disposed = false;
  const textures = new Set<Texture>();
  const textureLoads: Promise<void>[] = [];
  const loader = new TextureLoader();
  // UV crops reference the untouched user JPEGs, including their exact logo.
  function photo(path: string, crop?: [number, number, number, number, number, number]) {
    let complete!: () => void;
    textureLoads.push(new Promise<void>(resolve => { complete = resolve; }));
    const map = loader.load(asset(path), texture => {
      if (disposed) texture.dispose(); else invalidate();
      complete();
    }, undefined, () => { if (!disposed) invalidate(); complete(); });
    map.colorSpace = SRGBColorSpace;
    map.anisotropy = 4;
    if (crop) {
      const [x, y, width, height, imageWidth, imageHeight] = crop;
      map.repeat.set(width / imageWidth, height / imageHeight);
      map.offset.set(x / imageWidth, 1 - (y + height) / imageHeight);
    }
    textures.add(map);
    return map;
  }
  const grain = surfaceGrain();
  textures.add(grain);
  const cream = new MeshPhysicalMaterial({ color: "#d8d3c4", roughness: .48, metalness: .22,
    clearcoat: .16, clearcoatRoughness: .4, bumpMap: grain, bumpScale: .0008 });
  const interior = new MeshStandardMaterial({ color: "#d1c9b9", roughness: .9 });
  const chrome = new MeshPhysicalMaterial({ color: "#d2d4d0", metalness: 1, roughness: .29,
    anisotropy: .45, bumpMap: grain, bumpScale: .0004 });
  const dark = new MeshStandardMaterial({ color: "#20241f", roughness: .65 });
  const paper = new MeshStandardMaterial({ color: "#fffdf6", roughness: .92 });

  function box(name: string, width: number, height: number, depth: number,
    x: number, y: number, z: number, material: Material, rounded = false) {
    const geometry = rounded
      ? new RoundedBoxGeometry(width, height, depth, 2, Math.min(.025, width / 4, height / 4, depth / 4))
      : new BoxGeometry(width, height, depth);
    const mesh = new Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    root.add(mesh);
    return mesh;
  }
  function frame(name: string, width: number, height: number, x: number, y: number, z: number, thickness = .035) {
    box(`${name} left`, thickness, height, .07, x - width / 2, y, z, chrome, true);
    box(`${name} right`, thickness, height, .07, x + width / 2, y, z, chrome, true);
    box(`${name} top`, width, thickness, .07, x, y + height / 2, z, chrome, true);
    box(`${name} bottom`, width, thickness, .07, x, y - height / 2, z, chrome, true);
  }
  function plane(name: string, width: number, height: number, x: number, y: number, z: number, material: Material) {
    const mesh = new Mesh(new PlaneGeometry(width, height), material);
    mesh.name = name;
    mesh.position.set(x, y, z);
    root.add(mesh);
    return mesh;
  }
  function metalRim(name: string, width: number, height: number, inset: number, x: number, y: number, z: number, finish: Texture) {
    // Four mitered faces slope into the recess, unlike a flat silver border.
    const points: number[] = [];
    const outer = [[-width / 2, -height / 2], [width / 2, -height / 2], [width / 2, height / 2], [-width / 2, height / 2]];
    for (let i = 0; i < 4; i++) {
      const a = outer[i], b = outer[(i + 1) % 4];
      const innerA = [a[0] - Math.sign(a[0]) * inset, a[1] - Math.sign(a[1]) * inset, -.075];
      const innerB = [b[0] - Math.sign(b[0]) * inset, b[1] - Math.sign(b[1]) * inset, -.075];
      points.push(...a, 0, ...b, 0, ...innerB, ...a, 0, ...innerB, ...innerA);
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(points, 3));
    const uvs: number[] = [];
    for (let i = 0; i < points.length; i += 3) uvs.push(points[i] / width + .5, points[i + 1] / height + .5);
    geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();
    const metal = chrome.clone();
    // Preserve the reference's brushed finish on the actual sloping metal faces.
    metal.map = finish;
    metal.metalness = .55;
    metal.roughness = .3;
    const mesh = new Mesh(geometry, metal);
    mesh.name = name;
    mesh.position.set(x, y, z);
    mesh.castShadow = mesh.receiveShadow = true;
    root.add(mesh);
  }

  box("Interior back wall", 3.14, 3.48, .09, 0, 1.76, -.74, interior);
  box("Left side", .09, 3.5, 1.5, -1.555, 1.75, 0, cream);
  box("Right side", .09, 3.5, 1.5, 1.555, 1.75, 0, cream);
  box("Ceiling", 3.2, .08, 1.5, 0, 3.47, 0, cream);
  box("Floor", 3.2, .09, 1.5, 0, .045, 0, interior);
  // Four panels leave a real opening for the inset printer tray.
  box("Front panel above printer", 1.96, 1.98, .12, -.55, 2.47, .72, cream);
  box("Front panel below printer", 1.96, .74, .12, -.55, .41, .72, cream);
  box("Printer panel left", .25, .70, .12, -1.405, 1.13, .72, cream);
  box("Printer panel right", .61, .70, .12, .125, 1.13, .72, cream);
  box("Door right jamb", .13, 3.42, .13, 1.485, 1.75, .72, cream);
  box("Door lintel", 1.11, .45, .12, .955, 3.245, .72, cream);
  frame("Outer chrome surround", 3.15, 3.46, 0, 1.75, .8, .045);
  frame("Doorway chrome surround", 1.08, 2.91, .94, 1.565, .82, .045);
  box("Canopy", 2.78, .045, .26, 0, 3.2, .85, chrome, true);
  box("Canopy warm underside", 2.56, .015, .15, 0, 3.17, .84,
    new MeshStandardMaterial({ color: "#fff1c1", emissive: "#ffe7ac", emissiveIntensity: .4 }));

  box("Illuminated sign case", 1.43, .55, .20, 0, 3.775, .57, chrome, true);
  box("Opal sign diffuser", 1.36, .49, .018, 0, 3.775, .677,
    new MeshStandardMaterial({ color: "#faf8ef", roughness: .6, emissive: "#fff8e8", emissiveIntensity: .2 }), true);
  const logo = photo("textures/marvin-logo.jpg", [70, 145, 1140, 420, 1280, 712]);
  plane("Supplied Marvin studio logo — illuminated sign", 1.27, 1.27 * 420 / 1140, 0, 3.775, .689,
    new MeshBasicMaterial({ map: logo, toneMapped: false }));
  for (const x of [-.48, .48]) {
    const handle = new Mesh(new TorusGeometry(.055, .009, 6, 18, Math.PI), chrome);
    handle.position.set(x, 4.015, .57);
    root.add(handle);
  }

  box("Portrait display inset", .85, 1.04, .035, -.73, 2.32, .81, interior);
  frame("Portrait display frame", .87, 1.06, -.73, 2.32, .84, .025);
  const rotations = [-.12, .09, .08, -.1, -.1, .13];
  for (let index = 0; index < 6; index++) {
    const card = new Group();
    card.name = `Reference portrait ${index + 1}`;
    card.position.set(-.73 + (index % 2 === 0 ? -.185 : .185), 2.65 - Math.floor(index / 2) * .33, .87);
    card.rotation.z = rotations[index];
    const backing = new Mesh(new BoxGeometry(.29, .315, .008), paper);
    card.add(backing);
    const map = photo(`portfolio/portrait-${index + 1}.webp`);
    const image = new Mesh(new PlaneGeometry(.25, .245), new MeshBasicMaterial({ map, toneMapped: false }));
    image.position.set(0, .018, .006);
    card.add(image);
    root.add(card);
  }

  const printerPhoto = "textures/printer-reference.jpg";
  box("Printer metal label plate", 1.03, .31, .018, -.73, 1.64, .80, chrome, true);
  plane("Supplied LOVE CAPTURE printer label", .99, .99 * 178 / 598, -.73, 1.64, .811,
    new MeshStandardMaterial({ map: photo(printerPhoto, [353, 106, 598, 178, 1280, 854]), roughness: .53, metalness: .25 }));
  box("Printer recessed housing", 1.08, .69, .055, -.73, 1.13, .44, dark);
  box("Printer inner left", .025, .58, .29, -1.225, 1.13, .59, chrome);
  box("Printer inner right", .025, .58, .29, -.235, 1.13, .59, chrome);
  box("Printer lower tray", 1.0, .022, .31, -.73, .835, .59, chrome, true);
  box("Printer upper inner wall", 1.0, .022, .29, -.73, 1.425, .59, chrome);
  // The photographic insert preserves the user's actual print/product detail.
  plane("Supplied printer interior photograph", .98, .58, -.73, 1.13, .472,
    new MeshBasicMaterial({ map: photo(printerPhoto, [402, 384, 507, 306, 1280, 854]), toneMapped: false }));
  metalRim("Beveled stainless printer surround", 1.10, .72, .055, -.73, 1.13, .835,
    photo(printerPhoto, [343, 330, 628, 410, 1280, 854]));
  frame("Printer inner polished edge", .99, .61, -.73, 1.13, .76, .012);
  box("Lower brand plaque", .77, .295, .012, -.73, .53, .789, paper, true);
  plane("Supplied Marvin studio logo — lower plaque", .72, .72 * 420 / 1140, -.73, .53, .797,
    new MeshBasicMaterial({ map: logo, toneMapped: false }));

  // A small upholstered seat gives the entry an actual interior and scale.
  const seatFabric = new MeshStandardMaterial({ color: "#39422b", roughness: .97 });
  box("Interior upholstered seat", .77, .14, .49, .94, .64, -.38, seatFabric, true);
  box("Interior seat pedestal", .43, .52, .30, .94, .31, -.38, dark, true);
  box("Interior rear skirting", 3.07, .09, .04, 0, .14, -.665, chrome, true);

  const rod = new Mesh(new CylinderGeometry(.017, .017, 1.09, 12), chrome);
  rod.rotation.z = Math.PI / 2;
  rod.position.set(.94, 3.025, .86);
  root.add(rod);
  const curtainGeometry = new PlaneGeometry(1, 2.77, 120, 40);
  (curtainGeometry.attributes.position as BufferAttribute).setUsage(DynamicDrawUsage);
  const velvet = photo("textures/olive-velvet.jpg", [20, 25, 590, 1225, 640, 1280]);
  const curtain = new Mesh(curtainGeometry, new MeshPhysicalMaterial({
    color: "#ffffff", map: velvet, roughness: .95, metalness: 0,
    bumpMap: grain, bumpScale: .0018,
    sheen: .85, sheenColor: "#889064", sheenRoughness: .85, side: DoubleSide,
  }));
  curtain.name = "Supplied olive velvet — soft gathered curtain";
  curtain.castShadow = true;
  curtain.receiveShadow = true;
  root.add(curtain);
  const rings = Array.from({ length: 13 }, () => {
    const ring = new Mesh(new TorusGeometry(.027, .006, 6, 12), chrome);
    ring.position.y = 3.0;
    ring.position.z = .85;
    root.add(ring);
    return ring;
  });
  let lastOpening = -1;
  let lastSway = NaN;
  function setCurtain(opening: number, sway = 0) {
    if (opening === lastOpening && sway === lastSway) return;
    lastOpening = opening;
    lastSway = sway;
    const positions = curtainGeometry.attributes.position;
    const uv = curtainGeometry.attributes.uv;
    for (let i = 0; i < positions.count; i++) {
      const u = uv.getX(i), v = 1 - uv.getY(i);
      const point = curtainVertex(u, v, opening, sway);
      positions.setXYZ(i, point.x, point.y, point.z);
    }
    positions.needsUpdate = true;
    curtainGeometry.computeVertexNormals();
    curtainGeometry.computeBoundingSphere();
    rings.forEach((ring, i) => { ring.position.x = curtainVertex(i / 12, 0, opening).x; });
  }
  setCurtain(0);
  return {
    root, setCurtain, ready: Promise.all(textureLoads),
    dispose() {
      disposed = true;
      const materials = new Set<Material>();
      root.traverse(object => {
        if (object instanceof Mesh) {
          object.geometry.dispose();
          for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material);
        }
      });
      materials.forEach(material => material.dispose());
      textures.forEach(texture => texture.dispose());
    },
  };
}
