import { ArrowUpRight } from "lucide-react";
import {
  DisplayHeading,
  SectionRule,
} from "@/components/home/section-heading.component";
import { Reveal } from "@/components/home/reveal.component";
import { achievements, copy, type Locale } from "@/data/profile";
import { studioButton } from "@/lib/studio-button";
import { cn } from "@/lib/utils";

export function Recognition({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <section
      id="recognition"
      aria-labelledby="recognition-title"
      className="flex min-h-screen-section flex-col justify-center border-b border-primary bg-surface"
    >
      <div className="mx-auto w-full max-w-7xl px-gutter-md py-section md:px-page-margin">
        <SectionRule label={t.awardsLabel} aside={t.awardsAside} className="mb-gutter-lg" />
        <DisplayHeading id="recognition-title" className="mb-gutter-xl">
          {t.awardsTitle}
        </DisplayHeading>
        <ul className="divide-y divide-outline-variant border-t border-primary">
          {achievements.map((item, i) => (
            <Reveal
              as="li"
              key={item.name}
              index={i}
              className="achievement-row grid grid-cols-1 items-center gap-gutter-sm py-gutter-md md:grid-cols-12"
            >
              <p className="font-label text-label-sm text-on-surface-variant uppercase md:col-span-3">
                {item.event}
              </p>
              <div className="md:col-span-5">
                <h3 className="font-display text-title-md text-primary uppercase">
                  {item.name}
                </h3>
                <p className="text-body-sm text-on-surface-variant">
                  {item.description[locale]}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-gutter-sm md:col-span-4 md:justify-end">
                <span
                  className={cn(
                    "border px-gutter-sm py-gutter-xs font-label text-label-sm uppercase",
                    item.awarded
                      ? "border-primary text-on-accent"
                      : "border-outline bg-surface-container text-primary",
                    item.awarded && (item.placed ? "bg-accent-cyan" : "bg-accent-peach"),
                  )}
                >
                  {item.awarded ? t.award : t.participation}
                </span>
                <span
                  className={cn(
                    "text-body-sm",
                    item.awarded ? "text-primary" : "text-on-surface-variant",
                  )}
                >
                  {item.result[locale]}
                </span>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={studioButton({ variant: "secondary", size: "icon" })}
                  >
                    <ArrowUpRight aria-hidden="true" />
                    <span className="sr-only">
                      {`${t.visit}: ${item.name} ${t.newTab}`}
                    </span>
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
