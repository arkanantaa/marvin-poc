import { useSyncExternalStore } from "react";
const query = () => matchMedia("(prefers-reduced-motion: reduce)");
const subscribe = (callback: () => void) => {
  const media = query();
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => query().matches,
    () => true,
  );
}
