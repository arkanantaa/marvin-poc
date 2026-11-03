import {
  BoxGeometry, CanvasTexture, Color, CylinderGeometry, DoubleSide, Group, IcosahedronGeometry, InstancedMesh, Matrix4,
  Mesh, MeshStandardMaterial, Object3D, PlaneGeometry, Quaternion, SRGBColorSpace, TorusGeometry, Vector3,
  type BufferGeometry, type Material, type Texture,
} from "three";

// The backdrop the booth stood in front of at an event, as a small 3D set piece
// next to the booth in the portfolio's 3D view.
// - "repeat": a step-and-repeat wall with the event name and the Marvin wordmark
// - "greenery": a leaf wall with a neon sign
// - "floral": a draped fabric wall with a round flower arch (e.g. a wedding)
export type BackdropStyle = "repeat" | "greenery" | "floral";
export type Backdrop = {
  style: BackdropStyle;
  // Who provided it: the client (their own wedding decor, say) or Marvin.
  by: "marvin" | "client";
  // Main colour, accent colour and a third detail colour.
  colors: readonly [string, string, string];
  // Text on the wall (step-and-repeat or neon sign).
  title?: string;
};

export const backdropSize = { width: 2.7, height: 2.9 };

// The wall surface, drawn once into a canvas.
function wallTexture(backdrop: Backdrop) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024; canvas.height = 1100;
  const g = canvas.getContext("2d")!;
  const [main, accent, detail] = backdrop.colors;
  const font = (weight: number, size: number) => `${weight} ${size}px Helvetica, Arial, sans-serif`;
  g.textAlign = "center"; g.textBaseline = "middle";
  if (backdrop.style === "repeat") {
    g.fillStyle = main; g.fillRect(0, 0, 1024, 1100);
    // Alternating event name and wordmark, offset every other row.
    for (let row = 0; row < 9; row++) {
      for (let column = -1; column < 5; column++) {
        const x = column * 250 + (row % 2 ? 125 : 0) + 125, y = 70 + row * 125;
        const brand = (row + column) % 2 === 0;
        g.fillStyle = brand ? detail : accent;
        g.font = brand ? font(800, 50) : font(900, 58);
        g.fillText(brand ? "marvin" : (backdrop.title ?? "").toUpperCase(), x, y);
      }
    }
  } else if (backdrop.style === "greenery") {
    g.fillStyle = main; g.fillRect(0, 0, 1024, 1100);
    // Many overlapping leaves in a few greens.
    let seed = 7;
    const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const greens = [main, accent, "#2f5a2a", "#5f8f45", "#86b061", "#3d6e33"];
    for (let i = 0; i < 2600; i++) {
      const x = random() * 1024, y = random() * 1100, size = 16 + random() * 24;
      g.save();
      g.translate(x, y); g.rotate(random() * Math.PI * 2);
      g.fillStyle = greens[Math.floor(random() * greens.length)];
      g.beginPath(); g.ellipse(0, 0, size, size * .45, 0, 0, Math.PI * 2); g.fill();
      g.strokeStyle = "rgba(20, 40, 15, .35)"; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(-size, 0); g.lineTo(size, 0); g.stroke();
      g.restore();
    }
    // Soft darker edges, as a hedge recedes at its sides.
    const shade = g.createRadialGradient(512, 520, 200, 512, 560, 760);
    shade.addColorStop(0, "rgba(0,0,0,0)"); shade.addColorStop(1, "rgba(10,25,8,.45)");
    g.fillStyle = shade; g.fillRect(0, 0, 1024, 1100);
    // Neon sign in script-like italic lettering.
    g.font = `italic ${font(800, 132)}`;
    g.shadowColor = detail; g.shadowBlur = 38;
    g.lineWidth = 10; g.strokeStyle = detail;
    g.strokeText(backdrop.title ?? "", 512, 420);
    g.shadowBlur = 16; g.fillStyle = "#ffffff";
    g.fillText(backdrop.title ?? "", 512, 420);
    g.shadowBlur = 0;
  } else {
    // Soft draped fabric: vertical folds of light and shade.
    const folds = g.createLinearGradient(0, 0, 1024, 0);
    for (let i = 0; i <= 16; i++) folds.addColorStop(i / 16, i % 2 ? main : detail);
    g.fillStyle = folds; g.fillRect(0, 0, 1024, 1100);
    const glow = g.createRadialGradient(512, 460, 80, 512, 520, 720);
    glow.addColorStop(0, "rgba(255,250,240,.65)"); glow.addColorStop(1, "rgba(255,250,240,0)");
    g.fillStyle = glow; g.fillRect(0, 0, 1024, 1100);
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function buildBackdrop(backdrop: Backdrop) {
  const root = new Group();
  root.name = `Event backdrop (${backdrop.style})`;
  const geometries: BufferGeometry[] = [];
  const materials: Material[] = [];
  const textures: Texture[] = [];
  const keep = <T extends BufferGeometry>(geometry: T) => { geometries.push(geometry); return geometry; };
  const material = (options: ConstructorParameters<typeof MeshStandardMaterial>[0]) => {
    const created = new MeshStandardMaterial(options);
    materials.push(created);
    return created;
  };
  const add = (mesh: Mesh | InstancedMesh, shadows = true) => {
    mesh.castShadow = shadows; mesh.receiveShadow = true;
    root.add(mesh);
    return mesh;
  };
  const { width, height } = backdropSize;
  const metal = material({ color: "#d9cfb8", metalness: .85, roughness: .28 });
  const wall = wallTexture(backdrop);
  textures.push(wall);

  if (backdrop.style === "floral") {
    // A tall fabric wall: a plane with real folds, so it catches the light.
    const fabric = keep(new PlaneGeometry(width, height, 64, 8));
    const position = fabric.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i), y = position.getY(i);
      position.setZ(i, .035 * Math.sin(x * 23) + .012 * Math.sin(x * 61 + y * 2));
    }
    fabric.computeVertexNormals();
    const drape = add(new Mesh(fabric, material({ map: wall, roughness: .9, side: DoubleSide })));
    drape.position.set(0, height / 2 + .02, -.05);
    // Round gold arch in front of the fabric, standing on two small feet.
    const radius = 1.08;
    const ring = add(new Mesh(keep(new TorusGeometry(radius, .03, 12, 96)), metal));
    ring.position.set(0, radius + .32, .12);
    for (const side of [-1, 1]) {
      const leg = add(new Mesh(keep(new CylinderGeometry(.022, .022, .34, 10)), metal));
      leg.position.set(side * .25, .17, .12);
    }
    const base = add(new Mesh(keep(new BoxGeometry(.9, .05, .32)), metal));
    base.position.set(0, .025, .12);
    // Flower clusters on the arch: lower left and upper right, as wedding arches do.
    const [, accent, detail] = backdrop.colors;
    const petals = [accent, detail, "#ffffff", "#f6dfe4", "#e8a7b6"];
    const flower = keep(new IcosahedronGeometry(.1, 1));
    const leaf = keep(new IcosahedronGeometry(.07, 0));
    const blooms = new InstancedMesh(flower, material({ color: "#ffffff", roughness: .75 }), 190);
    const leaves = new InstancedMesh(leaf, material({ color: "#6f8f5a", roughness: .8 }), 110);
    const matrix = new Matrix4(), place = new Object3D();
    let seed = 11;
    const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const cluster = (from: number, to: number, count: number, mesh: InstancedMesh, offset: number, scale: number, colors?: string[]) => {
      for (let i = 0; i < count; i++) {
        const angle = from + (to - from) * Math.pow(random(), .8);
        const spread = .1 + .12 * random();
        place.position.set(
          Math.cos(angle) * (radius + (random() - .5) * spread),
          radius + .32 + Math.sin(angle) * (radius + (random() - .5) * spread),
          .12 + (random() - .3) * .16);
        place.scale.setScalar(scale * (.7 + random() * .6));
        place.quaternion.copy(new Quaternion().setFromAxisAngle(new Vector3(random(), random(), random()).normalize(), random() * Math.PI));
        place.updateMatrix();
        matrix.copy(place.matrix);
        mesh.setMatrixAt(offset + i, matrix);
        if (colors) mesh.setColorAt(offset + i, new Color(colors[Math.floor(random() * colors.length)]));
      }
    };
    cluster(Math.PI * .95, Math.PI * 1.62, 110, blooms, 0, 1, petals);
    cluster(Math.PI * .02, Math.PI * .45, 80, blooms, 110, .95, petals);
    cluster(Math.PI * .9, Math.PI * 1.7, 60, leaves, 0, 1.2);
    cluster(Math.PI * -.05, Math.PI * .52, 50, leaves, 60, 1.2);
    blooms.instanceMatrix.needsUpdate = true;
    if (blooms.instanceColor) blooms.instanceColor.needsUpdate = true;
    leaves.instanceMatrix.needsUpdate = true;
    add(blooms); add(leaves);
  } else {
    // A flat printed or greenery wall in a slim metal frame on two feet.
    const panel = add(new Mesh(keep(new BoxGeometry(width, height, .06)), [
      metal, metal, metal, metal,
      material({ map: wall, roughness: backdrop.style === "greenery" ? .95 : .55 }),
      material({ color: "#cfc6b4", roughness: .8 }),
    ]));
    panel.position.set(0, height / 2 + .06, 0);
    const edge = .035;
    for (const [w, h, x, y] of [
      [width + edge * 2, edge, 0, height + .06 + edge / 2], [width + edge * 2, edge, 0, .06 - edge / 2],
      [edge, height, -width / 2 - edge / 2, height / 2 + .06], [edge, height, width / 2 + edge / 2, height / 2 + .06],
    ] as const) {
      const bar = add(new Mesh(keep(new BoxGeometry(w, h, .08)), metal));
      bar.position.set(x, y, 0);
    }
    for (const side of [-1, 1]) {
      const foot = add(new Mesh(keep(new BoxGeometry(.08, .04, .6)), metal));
      foot.position.set(side * (width / 2 - .1), .02, 0);
    }
  }
  return {
    root,
    dispose() {
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(item => item.dispose());
      textures.forEach(texture => texture.dispose());
    },
  };
}
