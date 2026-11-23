import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer.component";
import { Navbar } from "@/components/layout/navbar.component";
import { copy, type Locale } from "@/data/profile";
import type { Theme } from "@/hooks/use-preferences";

interface MainLayoutProps {
  children: ReactNode;
  locale: Locale;
  setLocale: (value: Locale) => void;
  theme: Theme;
  setTheme: (value: Theme) => void;
}

const MainLayout = ({ children, locale, setLocale, theme, setTheme }: MainLayoutProps) => {
  const t = copy[locale];
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 border border-primary bg-surface px-gutter-md py-gutter-sm font-label text-label-md text-primary uppercase focus:not-sr-only focus:fixed focus:top-gutter-sm focus:left-gutter-sm"
      >
        {t.skip}
      </a>
      <Navbar locale={locale} setLocale={setLocale} theme={theme} setTheme={setTheme} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer locale={locale} />
    </>
  );
};

export default MainLayout;
