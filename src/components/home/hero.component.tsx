import { Download, Pause, Play } from "lucide-react";
import mascot448 from "@/assets/images/hero-mascot-448.webp";
import mascot896 from "@/assets/images/hero-mascot-896.webp";
import { copy, type Locale } from "@/data/profile";
import { studioButton } from "@/lib/studio-button";
import { cn } from "@/lib/utils";
import cvUrl from "../../../docs/CV.pdf?url";

export function Hero({
  locale,
  paused,
  onTogglePaused,
  reducedMotion,
}: {
  locale: Locale;
  paused: boolean;
  onTogglePaused: () => void;
  reducedMotion: boolean;
}) {
  const t = copy[locale];
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative z-20 flex min-h-screen-section flex-col justify-center border-b border-primary bg-surface-dim"
    >
      <div className="relative mx-auto w-full max-w-7xl overflow-x-clip px-gutter-md pt-gutter-lg pb-gutter-lg md:px-page-margin lg:py-gutter-xl">
        {/* Desktop halo and technical callouts */}
        <div
          aria-hidden="true"
          className="animate-halo-pulse pointer-events-none absolute top-1/2 right-6 z-0 hidden -translate-y-1/2 size-halo rounded-full border border-primary bg-accent-peach lg:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-6 right-8 z-10 hidden flex-col items-end gap-gutter-xs border-r-2 border-primary pr-gutter-sm font-label text-label-sm uppercase lg:flex"
        >
          <span className="text-primary">Teerawut / 01</span>
          <span className="text-on-surface-variant">{t.heroCallout}</span>
        </div>

        <div className="hero-grid relative">
          <p className="relative z-30 [grid-area:kicker] inline-flex w-fit border-l-2 border-primary pl-gutter-sm font-label text-label-sm text-primary uppercase md:text-label-md">
            {t.heroKicker}
          </p>
          <h1
            id="hero-title"
            className="relative z-30 [grid-area:title] font-display text-display-lg-mobile text-primary uppercase md:text-display-lg"
          >
            {t.heroTitle}
            <span className="headline-dot" aria-hidden="true" />
          </h1>

          <div className="relative z-30 [grid-area:copy] flex flex-col gap-gutter-md lg:gap-gutter-lg">
            <p className="max-w-xl text-body-sm text-on-surface sm:text-body-md lg:text-body-lg">
              {t.heroText}
            </p>
            <div className="flex flex-col items-stretch gap-gutter-sm lg:flex-row lg:items-start lg:gap-gutter-md">
              <a
                href="#projects"
                className={cn(
                  studioButton({ variant: "primary", size: "lg" }),
                  "max-lg:px-gutter-sm max-lg:py-gutter-sm max-lg:text-label-sm",
                )}
              >
                {t.viewProjects} <span aria-hidden="true">↗</span>
              </a>
              <div className="flex flex-col items-stretch gap-gutter-xs lg:items-start">
                <a
                  href={cvUrl}
                  download="Teerawut-Saesim-CV.pdf"
                  className={cn(
                    studioButton({ variant: "secondary", size: "lg" }),
                    "max-lg:px-gutter-sm max-lg:py-gutter-sm max-lg:text-label-sm",
                  )}
                >
                  {t.download}
                  <Download aria-hidden="true" />
                </a>
                <p className="font-label text-label-sm text-on-surface-variant uppercase max-lg:text-center">
                  {t.cvNote}
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-20 [grid-area:mascot] self-start lg:self-center">
            <div
              aria-hidden="true"
              className="animate-halo-pulse absolute top-3 right-0 z-0 size-halo-mobile rounded-full border border-primary bg-accent-peach lg:hidden"
            />
            <img
              src={mascot896}
              srcSet={`${mascot448} 448w, ${mascot896} 896w`}
              sizes="(min-width: 1024px) 540px, 144px"
              width={896}
              height={1200}
              alt={t.mascotAlt}
              fetchPriority="high"
              data-testid="hero-mascot"
              className="animate-mascot-float relative z-20 h-auto w-full select-none lg:-mt-6 lg:-mb-16 lg:-ml-[8%] lg:w-[108%] lg:max-w-none"
            />
            {!reducedMotion && (
              <button
                type="button"
                onClick={onTogglePaused}
                aria-label={paused ? t.playAnimation : t.pauseAnimation}
                className={cn(
                  studioButton({ variant: "surface", size: "sm" }),
                  "relative z-30 mt-gutter-sm w-full px-gutter-sm lg:absolute lg:right-0 lg:bottom-0 lg:mt-0 lg:w-auto",
                )}
              >
                {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
                {paused ? t.play : t.pause}
              </button>
            )}
          </div>

          <div className="relative z-30 [grid-area:status] flex w-full flex-wrap items-center justify-between gap-gutter-sm border-t border-outline-variant pt-gutter-sm lg:justify-start lg:gap-gutter-md lg:pt-gutter-md">
            <p className="inline-flex items-center gap-gutter-sm border border-primary bg-surface-container-lowest px-gutter-sm py-gutter-xs font-label text-label-sm text-primary uppercase">
              <span aria-hidden="true" className="inline-block size-2 bg-accent-magenta" />
              {t.current}
            </p>
            <p className="font-label text-label-sm text-on-surface uppercase">
              {t.heroTags}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
