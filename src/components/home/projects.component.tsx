import { useCallback, useEffect, useRef, useState, type FocusEvent } from "react";
import { useInView } from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { ProjectCard } from "@/components/home/project-card.component";
import { Reveal } from "@/components/home/reveal.component";
import { DisplayHeading } from "@/components/home/section-heading.component";
import { CAROUSEL_INTERVAL_MS } from "@/constants/motion.constant";
import { contact, copy, type Locale } from "@/data/profile";
import { SIDE_PROJECTS } from "@/data/side-projects";
import { usePageVisible } from "@/hooks/use-page-visible";
import { studioButton } from "@/lib/studio-button";

// Distinct scroll offsets the track can rest on: each slide's start, clamped to
// the end. On desktop several cards share the view, so there are fewer stops
// than slides; on mobile one card fills the view and every slide is a stop.
// `slides[i]` is the first slide shown at stop i, for the position announcement.
function measureStops(el: HTMLElement) {
  const max = el.scrollWidth - el.clientWidth;
  const stops: number[] = [];
  const slides: number[] = [];
  [...el.children].forEach((slide, index) => {
    const left = Math.round(Math.min((slide as HTMLElement).offsetLeft, max));
    if (stops.length === 0 || left - stops[stops.length - 1] > 1) {
      stops.push(left);
      slides.push(index);
    }
  });
  return stops.length > 0 ? { stops, slides } : { stops: [0], slides: [0] };
}

const nearest = (stops: number[], left: number) =>
  stops.reduce(
    (best, stop, i) => (Math.abs(stop - left) < Math.abs(stops[best] - left) ? i : best),
    0,
  );

// A scroll-snap carousel at every size. Prev/next step one card and wrap at the
// ends. Autoplay advances every few seconds, but never under reduced motion,
// and it waits while hovered, while keyboard focus is on the slides or arrows,
// while a project dialog is open, offscreen, in a hidden tab, when the
// page-level motion control is paused, or after the user pauses it.
export function Projects({
  locale,
  reducedMotion,
  paused,
}: {
  locale: Locale;
  reducedMotion: boolean;
  paused: boolean;
}) {
  const t = copy[locale];
  const track = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const stopsRef = useRef<number[]>([0]);
  // The stop a programmatic scroll is heading for, until it arrives.
  const targetRef = useRef<number | null>(null);
  const [stopSlides, setStopSlides] = useState<number[]>([0]);
  const [current, setCurrent] = useState(0);
  const [stopped, setStopped] = useState(paused);
  // The page-level pause control also stops (and restarts) the carousel.
  const [pagePaused, setPagePaused] = useState(paused);
  if (paused !== pagePaused) {
    setPagePaused(paused);
    setStopped(paused);
  }
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const inView = useInView(track, { amount: 0.25 });
  const pageVisible = usePageVisible();

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const measured = measureStops(el);
    stopsRef.current = measured.stops;
    setStopSlides((previous) =>
      previous.join() === measured.slides.join() ? previous : measured.slides,
    );
    const target = targetRef.current;
    if (target !== null && Math.abs(stopsRef.current[target] - el.scrollLeft) <= 1) {
      targetRef.current = null;
    }
    setCurrent(nearest(stopsRef.current, el.scrollLeft));
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    // A swipe or an interrupted scroll settles somewhere else: forget the target.
    const settle = () => {
      targetRef.current = null;
      measure();
    };
    el.addEventListener("scroll", measure, { passive: true });
    el.addEventListener("scrollend", settle);
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", measure);
      el.removeEventListener("scrollend", settle);
    };
  }, [measure]);

  // Steps from where the track is heading (or resting) right now, not from the
  // last rendered position, so quick repeated presses never skip or repeat a card.
  const step = useCallback(
    (direction: 1 | -1) => {
      const el = track.current;
      if (!el) return;
      const stops = stopsRef.current;
      const from = targetRef.current ?? nearest(stops, el.scrollLeft);
      const index = (from + direction + stops.length) % stops.length;
      targetRef.current = index;
      el.scrollTo({ left: stops[index], behavior: reducedMotion ? "auto" : "smooth" });
    },
    [reducedMotion],
  );

  const scrollable = stopSlides.length > 1;
  const autoplay = scrollable && !reducedMotion;
  const rotating = autoplay && !stopped && !hovered && !focused && inView && pageVisible;

  // Every move, manual or automatic, restarts the countdown.
  useEffect(() => {
    if (!rotating) return;
    const timer = window.setTimeout(() => step(1), CAROUSEL_INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [rotating, current, step]);

  // Keyboard focus on a slide or arrow holds the carousel still, and so does an
  // open project dialog (React focus events bubble out of its portal). A mouse
  // click leaves focus without :focus-visible, and the move it made restarts the
  // countdown instead. The play/pause toggle never holds it.
  const holdOnFocus = (event: FocusEvent<HTMLElement>) => {
    const target = event.target;
    setFocused(
      target !== toggle.current &&
        (target.matches(":focus-visible") || target.closest('[role="dialog"]') !== null),
    );
  };
  const release = () => setFocused(false);
  const slide = (stopSlides[current] ?? 0) + 1;

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="flex min-h-screen-section flex-col justify-center border-b border-primary bg-surface"
    >
      <div className="mx-auto w-full max-w-7xl px-gutter-md py-section md:px-page-margin">
        <Reveal className="mb-gutter-xl flex flex-wrap items-end justify-between gap-gutter-md border-b border-outline-variant pb-gutter-sm">
          <div className="flex flex-col gap-gutter-xs">
            <p className="section-label font-label text-label-md text-primary uppercase">
              {t.projectsLabel}
            </p>
            <DisplayHeading id="projects-title">{t.projectsTitle}</DisplayHeading>
          </div>
          <div className="flex flex-wrap items-center gap-gutter-md lg:gap-gutter-lg">
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
            {scrollable && (
              <div
                className="flex items-center gap-gutter-xs"
                onFocus={holdOnFocus}
                onBlur={release}
              >
                {autoplay && (
                  <button
                    ref={toggle}
                    type="button"
                    aria-label={stopped ? t.playSlides : t.pauseSlides}
                    aria-controls="project-track"
                    onClick={() => setStopped((value) => !value)}
                    className={studioButton({ variant: "secondary", size: "md" })}
                  >
                    {stopped ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
                    {stopped ? t.play : t.pause}
                  </button>
                )}
                <button
                  type="button"
                  aria-label={t.previous}
                  aria-controls="project-track"
                  onClick={() => step(-1)}
                  className={studioButton({ variant: "secondary", size: "icon" })}
                >
                  <ArrowLeft aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label={t.next}
                  aria-controls="project-track"
                  onClick={() => step(1)}
                  className={studioButton({ variant: "secondary", size: "icon" })}
                >
                  <ArrowRight aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </Reveal>

        {SIDE_PROJECTS.length === 0 ? (
          <p
            role="status"
            className="border border-dashed border-outline p-gutter-lg text-body-md text-on-surface-variant"
          >
            {t.noProjects}
          </p>
        ) : (
          <Reveal index={1}>
            {/* Announces the position after manual moves; silent while rotating. Kept
                outside the track so a modal's hideOthers can still hide the slides. */}
            <p
              data-testid="carousel-status"
              aria-live={rotating ? "off" : "polite"}
              aria-atomic="true"
              className="sr-only"
            >
              {`${t.slide} ${slide} ${t.of} ${SIDE_PROJECTS.length}`}
            </p>
            <div
              id="project-track"
              ref={track}
              role="region"
              aria-roledescription={t.carouselRole}
              aria-label={t.carousel}
              onFocus={holdOnFocus}
              onBlur={release}
              onPointerEnter={(event) => event.pointerType !== "touch" && setHovered(true)}
              onPointerLeave={() => setHovered(false)}
              className="project-track relative flex snap-x snap-mandatory gap-gutter-lg overflow-x-auto overscroll-x-contain"
            >
              {SIDE_PROJECTS.map((project, index) => (
                <div
                  key={project.id}
                  role="group"
                  aria-roledescription={t.slideRole}
                  aria-label={`${index + 1} ${t.of} ${SIDE_PROJECTS.length}`}
                  className="w-full shrink-0 snap-start lg:w-2/5"
                >
                  <ProjectCard project={project} index={index} locale={locale} />
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
