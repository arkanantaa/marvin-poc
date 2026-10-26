import { Color, Mesh, MeshBasicMaterial, PlaneGeometry } from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

// Reflection cards exist only in the environment capture. Their broad bright
// and dark bands give polished trim the contrast of photographed metal.
export function studioEnvironment() {
  const environment = new RoomEnvironment();
  for (const [x, y, z, width, height, intensity] of [
    [-3.5, 3, 5, 2.8, 8, 3],
    [.6, 2, 5, 1.5, 9, .025],
    [4, 3, 3, 1.2, 7, 2],
  ]) {
    const panel = new Mesh(new PlaneGeometry(width, height),
      new MeshBasicMaterial({ color: new Color().setRGB(intensity, intensity, intensity) }));
    panel.position.set(x, y, z);
    panel.lookAt(0, 1, 0);
    environment.add(panel);
  }
  return environment;
}
