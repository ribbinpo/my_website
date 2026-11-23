import { ArrowUp } from "lucide-react";
import { copy, sections, type Locale } from "@/data/profile";
import { studioButton } from "@/lib/studio-button";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/layout/navbar.component";

export function Footer({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <footer className="site-footer bg-surface-dim">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-gutter-md px-gutter-md py-gutter-lg md:flex-row md:items-center md:px-page-margin">
        <div className="flex flex-wrap items-center gap-gutter-sm">
          <Wordmark label={t.home} />
          <p className="text-body-sm text-on-surface-variant">
            © {new Date().getFullYear()} Teerawut Saesim
          </p>
        </div>
        <nav
          aria-label={t.footerNav}
          className="flex flex-wrap items-center gap-gutter-lg font-label text-label-sm text-primary uppercase"
        >
          {sections.slice(0, 3).map((id, i) => (
            <a key={id} href={`#${id}`} className="py-gutter-sm hover:text-emphasis">
              {t.nav[i]}
            </a>
          ))}
          <a
            href="#top"
            className={cn(studioButton({ variant: "surface", size: "sm" }), "back-top")}
          >
            {t.top}
            <ArrowUp aria-hidden="true" />
          </a>
        </nav>
      </div>
    </footer>
  );
}
