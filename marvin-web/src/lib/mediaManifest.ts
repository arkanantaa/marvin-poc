// Enable only after a complete opening + entry clip passes docs/media-manifest.md.
export const mediaManifest = {
  approved: import.meta.env.DEV && import.meta.env.VITE_REVIEW_MEDIA === "true",
  source: "media/entrance.mp4",
  poster: "media/booth.webp",
  width: 1920,
  height: 1080,
  stallDeadline: 5000,
};
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
