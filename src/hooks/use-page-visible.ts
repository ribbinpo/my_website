import { useSyncExternalStore } from "react";

// False while the tab is in the background or the window is minimised.
export function usePageVisible() {
  return useSyncExternalStore(
    (callback) => {
      document.addEventListener("visibilitychange", callback);
      return () => document.removeEventListener("visibilitychange", callback);
    },
    () => document.visibilityState !== "hidden",
    () => true,
  );
}
