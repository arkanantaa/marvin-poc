import { asset } from "../lib/assets";
import type { DriftWallItem } from "../components/DriftWall";

// Pictures on the opening wall (files in `public/`). The wall repeats them to
// fill itself; tiles are portrait, 3:4, and crop to fit.
//
// The order is deliberate. The wall puts list entry `(3 * column + 5 * row) % 13`
// in each cell, so entries 5 or 1 apart end up touching. The four wedding
// pictures sit at 0, 2, 4 and 6, which keeps them from touching each other;
// the event pictures (ikea and IMG) fill the rest. Changing the number of
// pictures changes which entries touch.
export const marvelItems: DriftWallItem[] = [
  "portfolio/events/wedding-09.webp",
  "portfolio/events/ikea-09.webp",
  "portfolio/events/wedding-01.webp",
  "wall/IMG_8549.JPG",
  "portfolio/events/wedding-08.webp",
  "wall/IMG_8113.jpg",
  "portfolio/events/wedding-06.webp",
  "wall/IMG_8437.JPG",
  "portfolio/events/ikea-01.webp",
  "wall/IMG_8363.jpg",
  "wall/IMG_8467.jpg",
  "portfolio/events/ikea-06.webp",
  "wall/IMG_8410.jpg",
].map(path => ({ image: asset(path) }));
