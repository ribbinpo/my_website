import { useEffect, useState, useSyncExternalStore } from "react";
import { copy, type Locale } from "@/data/profile";
export type Theme = "light" | "dark" | "system";
function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Preferences still work in memory. */
  }
}
const subscribe = (callback: () => void) => {
  const query = matchMedia("(prefers-color-scheme: dark)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
export function usePreferences() {
  const [locale, updateLocale] = useState<Locale>(() =>
    read("profile-language") === "th" ? "th" : "en",
  );
  const [theme, updateTheme] = useState<Theme>(() => {
    const saved = read("profile-theme");
    return saved === "dark" || saved === "light" ? saved : "system";
  });
  const systemDark = useSyncExternalStore(
    subscribe,
    () => matchMedia("(prefers-color-scheme: dark)").matches,
    () => false,
  );
  const resolvedTheme =
    theme === "system" ? (systemDark ? "dark" : "light") : theme;
  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = `Teerawut Saesim — ${copy[locale].role}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", copy[locale].heroText);
  }, [locale]);
  return {
    locale,
    theme,
    resolvedTheme,
    setLocale: (value: Locale) => {
      write("profile-language", value);
      updateLocale(value);
    },
    setTheme: (value: Theme) => {
      write("profile-theme", value);
      updateTheme(value);
    },
  };
}
