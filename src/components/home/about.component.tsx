import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Code2, Network, type LucideIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DisplayHeading,
  SectionRule,
} from "@/components/home/section-heading.component";
import { Reveal } from "@/components/home/reveal.component";
import {
  EASE_STATE_CHANGE,
  EASE_SURFACE_ENTER,
  INDICATOR_DURATION,
  PANEL_DISTANCE,
  PANEL_DURATION,
  REDUCED_MOTION_QUERY,
} from "@/constants/motion.constant";
import {
  copy,
  expertise,
  type ExpertiseIcon,
  type Locale,
} from "@/data/profile";
import { useMediaQuery } from "@/hooks/use-media-query";

const ICONS: Record<ExpertiseIcon, LucideIcon> = {
  code: Code2,
  architecture: Network,
  ai: Bot,
};
const pad = (n: number) => String(n).padStart(2, "0");

export function About({ locale }: { locale: Locale }) {
  const t = copy[locale];
  // Cards stack vertically on desktop and sit in a row on mobile; arrow keys follow.
  const desktop = useMediaQuery("(min-width: 64rem)");
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const [selected, setSelected] = useState<string>(expertise[0].id);
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="flex min-h-screen-section flex-col justify-center border-b border-primary bg-surface"
    >
      <div className="mx-auto w-full max-w-7xl px-gutter-md py-section md:px-page-margin">
        <SectionRule label={t.aboutLabel} aside={t.aboutAside} />
        <Tabs
          value={selected}
          onValueChange={setSelected}
          orientation={desktop ? "vertical" : "horizontal"}
          className="grid grid-cols-1 items-start gap-gutter-xl lg:grid-cols-12"
        >
          <Reveal className="flex flex-col gap-gutter-sm lg:col-span-5">
            <p
              id="expertise-list-label"
              className="font-label text-label-sm text-on-surface-variant uppercase"
            >
              {t.expertiseList}
            </p>
            <TabsList
              aria-labelledby="expertise-list-label"
              className="grid h-auto w-full grid-cols-3 items-stretch gap-gutter-xs rounded-none bg-transparent p-0 group-data-[orientation=horizontal]/tabs:h-auto lg:grid-cols-1 lg:gap-gutter-md"
            >
              {expertise.map((item, i) => {
                const Icon = ICONS[item.icon];
                return (
                  <TabsTrigger
                    key={item.id}
                    value={item.id}
                    className="group/card flex aspect-square h-auto flex-col items-stretch justify-between gap-gutter-xs rounded-none border border-primary bg-surface-container-lowest p-gutter-sm text-left whitespace-normal text-primary shadow-none transition-colors duration-200 ease-state-change group-data-[orientation=vertical]/tabs:justify-between hover:bg-surface-container focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[state=active]:bg-ink data-[state=active]:text-on-ink data-[state=active]:shadow-none lg:aspect-auto lg:p-gutter-lg dark:data-[state=active]:border-primary dark:data-[state=active]:bg-ink dark:data-[state=active]:text-on-ink"
                  >
                    {selected === item.id && (
                      // One accent bar glides between cards as the selection changes. The card
                      // inverts on its own, so text contrast never depends on this animation.
                      <motion.span
                        layoutId="expertise-indicator"
                        aria-hidden="true"
                        data-testid="expertise-indicator"
                        className="absolute bottom-0 left-0 h-1 w-full bg-accent-magenta lg:top-0 lg:h-full lg:w-1"
                        transition={
                          reducedMotion
                            ? { duration: 0 }
                            : { duration: INDICATOR_DURATION, ease: EASE_STATE_CHANGE }
                        }
                      />
                    )}
                    <span className="flex w-full items-center justify-between">
                      <span className="font-label text-label-sm uppercase opacity-80 group-data-[state=active]/card:text-ink-accent group-data-[state=active]/card:opacity-100 dark:group-data-[state=active]/card:text-on-ink">
                        {pad(i + 1)}
                        <span className="hidden lg:inline">{` // ${t.expertise}`}</span>
                      </span>
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <span className="flex flex-col gap-gutter-xs">
                      <span className="font-display text-label-sm text-balance uppercase lg:text-title-lg">
                        {item.title[locale]}
                      </span>
                      <span className="hidden text-body-sm text-on-surface-variant group-data-[state=active]/card:text-on-ink lg:block">
                        {item.summary[locale]}
                      </span>
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Reveal>

          <div className="flex flex-col gap-gutter-lg lg:col-span-7">
            <DisplayHeading id="about-title">{t.aboutTitle}</DisplayHeading>
            <Reveal index={2} className="flex flex-col gap-gutter-lg">
              <p className="max-w-prose text-body-lg text-on-surface">{t.aboutText}</p>
              <p className="max-w-prose text-body-md text-on-surface-variant">
                {t.aboutMore}
              </p>
            </Reveal>
            <Reveal index={3}>
              {expertise.map((item, i) => (
                <TabsContent
                  key={item.id}
                  value={item.id}
                  data-testid="expertise-panel"
                  asChild
                >
                  {/* Radix mounts only the selected panel, so each selection plays this entrance. */}
                  <motion.div
                    initial={reducedMotion ? false : { opacity: 0, x: PANEL_DISTANCE }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: PANEL_DURATION, ease: EASE_SURFACE_ENTER }}
                    className="flex flex-col gap-gutter-md border-t border-primary pt-gutter-lg focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    <div className="flex flex-col gap-gutter-xs">
                      <p className="font-label text-label-sm text-on-surface-variant uppercase">
                        {`${pad(i + 1)} // ${t.expertise}`}
                      </p>
                      <h3 className="font-display text-headline-md text-primary uppercase">
                        {item.title[locale]}
                      </h3>
                      <p className="max-w-prose text-body-md text-on-surface">
                        {item.description[locale]}
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-gutter-md font-label text-label-md text-primary uppercase">
                        {t.focus}
                      </h4>
                      <ul className="grid grid-cols-1 gap-gutter-md sm:grid-cols-3">
                        {item.points.map((point, n) => (
                          <li
                            key={point.en}
                            className="border border-outline-variant bg-surface-container-low p-gutter-md"
                          >
                            <span className="mb-gutter-xs flex items-center gap-gutter-xs font-label text-label-sm text-primary">
                              <span
                                aria-hidden="true"
                                className="inline-block size-2 bg-accent-magenta"
                              />
                              {pad(n + 1)}
                            </span>
                            <span className="text-body-md font-semibold text-primary">
                              {point[locale]}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-gutter-sm font-label text-label-md text-primary uppercase">
                        {t.toolkit}
                      </h4>
                      <ul className="flex flex-wrap gap-gutter-xs">
                        {item.skills.map((skill) => (
                          <li
                            key={skill}
                            className="border border-primary px-gutter-sm py-gutter-xs font-label text-label-sm text-primary"
                          >
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </TabsContent>
              ))}
            </Reveal>
          </div>
        </Tabs>
      </div>
    </section>
  );
}
