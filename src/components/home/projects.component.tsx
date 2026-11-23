import { useCallback, useEffect, useRef, useState, type FocusEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/home/project-card.component";
import { DisplayHeading } from "@/components/home/section-heading.component";
import { contact, copy, type Locale } from "@/data/profile";
import { useMediaQuery } from "@/hooks/use-media-query";
import { SIDE_PROJECTS } from "@/data/side-projects";
import { studioButton } from "@/lib/studio-button";
import { cn } from "@/lib/utils";

// Desktop: a CSS scroll-snap carousel with prev/next buttons and no autoplay.
// Below lg the same cards are a plain stacked list, without carousel semantics.
export function Projects({
  locale,
  reducedMotion,
}: {
  locale: Locale;
  reducedMotion: boolean;
}) {
  const t = copy[locale];
  const desktop = useMediaQuery("(min-width: 64rem)");
  const track = useRef<HTMLDivElement>(null);
  const prevButton = useRef<HTMLButtonElement>(null);
  const nextButton = useRef<HTMLButtonElement>(null);
  // The control the keyboard/pointer user last pressed, until focus moves elsewhere.
  const pressed = useRef<"prev" | "next" | null>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdges({ start: el.scrollLeft <= 1, end: el.scrollLeft >= max - 1 });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, [measure]);

  // A button that becomes disabled loses focus to <body>. When the pressed
  // control hits an end, hand focus to the other control instead.
  useEffect(() => {
    const active = document.activeElement;
    const lost = (button: HTMLButtonElement | null) =>
      active === button || active === document.body || active === null;
    if (edges.end && pressed.current === "next" && lost(nextButton.current)) {
      pressed.current = "prev";
      prevButton.current?.focus();
    } else if (edges.start && pressed.current === "prev" && lost(prevButton.current)) {
      pressed.current = "next";
      nextButton.current?.focus();
    }
  }, [edges]);

  const forget = (event: FocusEvent) => {
    // relatedTarget is null when the browser blurs a newly disabled button.
    if (event.relatedTarget) pressed.current = null;
  };

  const step = (direction: 1 | -1) => {
    pressed.current = direction === 1 ? "next" : "prev";
    const el = track.current;
    const slide = el?.firstElementChild as HTMLElement | null;
    if (!el || !slide) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({
      left: direction * (slide.offsetWidth + gap),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  const scrollable = !(edges.start && edges.end);

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="border-b border-primary bg-surface"
    >
      <div className="mx-auto max-w-7xl px-gutter-md py-section md:px-page-margin">
        <div className="mb-gutter-xl flex flex-wrap items-end justify-between gap-gutter-md border-b border-outline-variant pb-gutter-sm">
          <div className="flex flex-col gap-gutter-xs">
            <p className="section-label font-label text-label-md text-primary uppercase">
              {t.projectsLabel}
            </p>
            <DisplayHeading id="projects-title">{t.projectsTitle}</DisplayHeading>
          </div>
          <div className="flex flex-wrap items-center gap-gutter-lg">
            <p className="hidden max-w-xs text-body-md text-on-surface-variant md:block">
              {t.projectsText}
            </p>
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-gutter-xs font-label text-label-md text-primary uppercase hover:text-emphasis"
            >
              {t.allWork} <span aria-hidden="true">↗</span>
              <span className="sr-only">{t.newTab}</span>
            </a>
            {desktop && scrollable && (
              <div className="hidden items-center gap-gutter-xs lg:flex">
                <button
                  ref={prevButton}
                  type="button"
                  onBlur={forget}
                  aria-label={t.previous}
                  aria-controls="project-track"
                  disabled={edges.start}
                  onClick={() => step(-1)}
                  className={studioButton({ variant: "secondary", size: "icon" })}
                >
                  <ArrowLeft aria-hidden="true" />
                </button>
                <button
                  ref={nextButton}
                  type="button"
                  onBlur={forget}
                  aria-label={t.next}
                  aria-controls="project-track"
                  disabled={edges.end}
                  onClick={() => step(1)}
                  className={studioButton({ variant: "secondary", size: "icon" })}
                >
                  <ArrowRight aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>

        {SIDE_PROJECTS.length === 0 ? (
          <p
            role="status"
            className="border border-dashed border-outline p-gutter-lg text-body-md text-on-surface-variant"
          >
            {t.noProjects}
          </p>
        ) : (
          <div
            id="project-track"
            ref={track}
            role={desktop ? "region" : undefined}
            aria-roledescription={desktop ? t.carouselRole : undefined}
            aria-label={desktop ? t.carousel : undefined}
            className={cn(
              "project-track flex flex-col gap-gutter-lg",
              "lg:snap-x lg:snap-mandatory lg:flex-row lg:overflow-x-auto lg:overscroll-x-contain",
            )}
          >
            {SIDE_PROJECTS.map((project, index) => (
              <div
                key={project.id}
                role={desktop ? "group" : undefined}
                aria-roledescription={desktop ? t.slideRole : undefined}
                aria-label={desktop ? `${index + 1} ${t.of} ${SIDE_PROJECTS.length}` : undefined}
                className="lg:w-2/5 lg:shrink-0 lg:snap-start"
              >
                <ProjectCard project={project} index={index} locale={locale} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
