import { Bot, Code2, Network, type LucideIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DisplayHeading,
  SectionRule,
} from "@/components/home/section-heading.component";
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
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="border-b border-primary bg-surface"
    >
      <div className="mx-auto max-w-7xl px-gutter-md py-section md:px-page-margin">
        <SectionRule label={t.aboutLabel} aside={t.aboutAside} />
        <Tabs
          defaultValue={expertise[0].id}
          orientation={desktop ? "vertical" : "horizontal"}
          className="grid grid-cols-1 items-start gap-gutter-xl lg:grid-cols-12"
        >
          <div className="flex flex-col gap-gutter-sm lg:col-span-5">
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
                    className="group/card flex aspect-square h-auto flex-col items-stretch justify-between gap-gutter-xs rounded-none border border-primary bg-surface-container-lowest p-gutter-sm text-left whitespace-normal text-primary shadow-none transition-colors duration-100 group-data-[orientation=vertical]/tabs:justify-between hover:bg-surface-container focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[state=active]:bg-ink data-[state=active]:text-on-ink data-[state=active]:shadow-none lg:aspect-auto lg:p-gutter-lg dark:data-[state=active]:border-primary dark:data-[state=active]:bg-ink dark:data-[state=active]:text-on-ink"
                  >
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
          </div>

          <div className="flex flex-col gap-gutter-lg lg:col-span-7">
            <DisplayHeading id="about-title">{t.aboutTitle}</DisplayHeading>
            <p className="max-w-prose text-body-lg text-on-surface">{t.aboutText}</p>
            <p className="max-w-prose text-body-md text-on-surface-variant">
              {t.aboutMore}
            </p>
            {expertise.map((item, i) => (
              <TabsContent
                key={item.id}
                value={item.id}
                data-testid="expertise-panel"
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
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
}
