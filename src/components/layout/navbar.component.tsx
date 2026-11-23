import { useRef, useState } from "react";
import { ArrowUpRight, Menu, Monitor, Moon, Sun } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { copy, sections, type Locale } from "@/data/profile";
import type { Theme } from "@/hooks/use-preferences";
import { useActiveSection } from "@/hooks/use-active-section";
import { studioButton } from "@/lib/studio-button";
import { cn } from "@/lib/utils";

const NEXT_THEME: Record<Theme, Theme> = {
  light: "dark",
  dark: "system",
  system: "light",
};

export function Wordmark({ label }: { label: string }) {
  return (
    <a
      href="#top"
      className="group inline-flex items-center gap-gutter-sm text-primary"
    >
      <span
        aria-hidden="true"
        className="flex size-7 items-center justify-center bg-primary font-display text-title-md text-on-primary"
      >
        t
      </span>
      <span className="sr-only inline-flex items-center font-display text-title-lg tracking-tight uppercase xs:not-sr-only">
        Teerawut
        <span className="hidden sm:inline">
          <span className="mx-gutter-xs">/</span>01
        </span>
        <span aria-hidden="true" className="ml-1 inline-block size-2 bg-accent-magenta" />
        <span className="sr-only">, {label}</span>
      </span>
    </a>
  );
}

export function Navbar({
  locale,
  setLocale,
  theme,
  setTheme,
}: {
  locale: Locale;
  setLocale: (value: Locale) => void;
  theme: Theme;
  setTheme: (value: Theme) => void;
}) {
  const t = copy[locale];
  const nextTheme = NEXT_THEME[theme];
  const [menuOpen, setMenuOpen] = useState(false);
  const destination = useRef<string | null>(null);
  const active = useActiveSection(sections);

  const links = (mobile = false) =>
    sections.map((id, i) => (
      <a
        key={id}
        href={`#${id}`}
        aria-current={active === id ? "location" : undefined}
        onClick={(event) => {
          if (!mobile) return;
          // Let the sheet close (and return focus) before jumping to the section.
          event.preventDefault();
          destination.current = id;
          setMenuOpen(false);
        }}
        className={cn(
          "font-label text-label-md text-primary uppercase transition-colors duration-100 hover:text-emphasis aria-[current=location]:underline aria-[current=location]:decoration-accent-magenta aria-[current=location]:decoration-2 aria-[current=location]:underline-offset-8",
          mobile &&
            "flex min-h-12 items-center justify-between border-b border-outline-variant text-label-lg",
        )}
      >
        {t.nav[i]}
        {mobile && <ArrowUpRight aria-hidden="true" className="size-4" />}
      </a>
    ));

  return (
    <header className="sticky top-0 z-40 border-b border-primary bg-surface-dim">
      <div className="mx-auto flex min-h-header max-w-7xl items-center justify-between gap-gutter-md px-gutter-md md:px-page-margin">
        <Wordmark label={t.home} />
        <nav
          aria-label={t.navigation}
          className="desktop-nav hidden items-center gap-gutter-lg lg:flex"
        >
          {links()}
        </nav>
        <div className="flex items-center gap-gutter-xs sm:gap-gutter-sm">
          <div
            role="group"
            aria-label={t.language}
            className="inline-flex items-center font-label text-label-sm text-on-surface-variant"
          >
            {(["en", "th"] as const).map((value, i) => (
              <span key={value} className="inline-flex items-center">
                {i > 0 && <span aria-hidden="true" className="hidden sm:inline">/</span>}
                <button
                  type="button"
                  lang={value}
                  aria-pressed={locale === value}
                  onClick={() => setLocale(value)}
                  className="min-h-11 min-w-11 px-gutter-xs uppercase lg:min-h-8 lg:min-w-8 hover:text-primary aria-pressed:font-bold aria-pressed:text-primary aria-pressed:underline aria-pressed:decoration-accent-magenta aria-pressed:decoration-2 aria-pressed:underline-offset-4"
                >
                  {value.toUpperCase()}
                </button>
              </span>
            ))}
          </div>
          <button
            type="button"
            data-theme-mode={theme}
            aria-label={`${t.theme}: ${t[theme]}. ${t.switchTo} ${t[nextTheme]}`}
            title={`${t[theme]} → ${t[nextTheme]}`}
            onClick={() => setTheme(nextTheme)}
            className={studioButton({ variant: "secondary", size: "icon" })}
          >
            {theme === "system" ? <Monitor /> : theme === "dark" ? <Moon /> : <Sun />}
          </button>
          <a
            href="#contact"
            className={cn(
              studioButton({ variant: "secondary", size: "md" }),
              "hidden sm:inline-flex",
            )}
          >
            {t.letsTalk} <span aria-hidden="true">↗</span>
          </a>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label={t.menu}
                className={cn(
                  studioButton({ variant: "secondary", size: "icon" }),
                  "lg:hidden",
                )}
              >
                <Menu />
              </button>
            </SheetTrigger>
            <SheetContent
              closeLabel={t.close}
              className="rounded-none border-l border-primary bg-surface shadow-none"
              onCloseAutoFocus={(event) => {
                const id = destination.current;
                if (!id) return;
                event.preventDefault();
                destination.current = null;
                requestAnimationFrame(() => {
                  const target = document.getElementById(id);
                  history.pushState(null, "", `#${id}`);
                  if (target && !target.hasAttribute("tabindex")) {
                    // Focusable only for this hand-off, so later taps don't refocus it.
                    target.setAttribute("tabindex", "-1");
                    target.addEventListener("blur", () => target.removeAttribute("tabindex"), {
                      once: true,
                    });
                  }
                  target?.focus({ preventScroll: true });
                  // "auto" follows the html scroll-behavior: smooth, or instant under reduced motion.
                  target?.scrollIntoView({ behavior: "auto", block: "start" });
                });
              }}
            >
              <SheetHeader className="border-b border-primary p-gutter-md">
                <SheetTitle className="font-label text-label-md text-primary uppercase">
                  {t.navigation}
                </SheetTitle>
                <SheetDescription className="text-body-sm text-on-surface-variant">
                  Teerawut Saesim · {t.role}
                </SheetDescription>
              </SheetHeader>
              <nav aria-label={t.navigation} className="flex flex-col px-gutter-md">
                {links(true)}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
