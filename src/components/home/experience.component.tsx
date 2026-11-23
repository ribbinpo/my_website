import {
  DisplayHeading,
  SectionRule,
} from "@/components/home/section-heading.component";
import { Reveal } from "@/components/home/reveal.component";
import { copy, experiences, type Locale } from "@/data/profile";

export function Experience({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="flex min-h-screen-section flex-col justify-center border-b border-primary bg-surface-container-low"
    >
      <div className="mx-auto w-full max-w-7xl px-gutter-md py-section md:px-page-margin">
        <SectionRule label={t.expLabel} aside={t.expAside} className="mb-gutter-lg" />
        <DisplayHeading id="experience-title" className="mb-gutter-xl">
          {t.expTitle}
        </DisplayHeading>
        <ol className="flex flex-col border-t border-primary">
          {experiences.map((job, i) => (
            <Reveal
              as="li"
              key={job.company}
              index={i}
              className="experience-row grid grid-cols-1 items-start gap-gutter-md border-b border-outline-variant py-gutter-xl last:border-b-0 md:grid-cols-12"
            >
              <div className="flex flex-col gap-gutter-xs md:col-span-4">
                <p className="flex items-center gap-gutter-sm font-label text-label-md text-primary uppercase tabular-nums">
                  {job.current && (
                    <span aria-hidden="true" className="inline-block size-2 bg-accent-magenta" />
                  )}
                  {job.dates[locale]}
                </p>
                <p className="font-label text-label-sm text-on-surface-variant uppercase">
                  {`${String(i + 1).padStart(2, "0")} // ${job.focus[locale]}`}
                </p>
              </div>
              <div className="flex flex-col gap-gutter-sm md:col-span-8">
                <div className="flex flex-wrap items-center gap-gutter-sm">
                  <h3 className="font-display text-headline-md text-primary uppercase">
                    {job.role[locale]}
                  </h3>
                  {job.current && (
                    <span className="border border-primary bg-accent-cyan px-gutter-sm py-gutter-xs font-label text-label-sm text-on-accent uppercase">
                      {t.currentBadge}
                    </span>
                  )}
                </div>
                <p className="font-label text-label-md text-emphasis uppercase">
                  {job.company}
                </p>
                <p className="text-body-md font-medium text-balance text-on-surface">
                  {job.description[locale]}
                </p>
                <ul className="flex list-disc flex-col gap-gutter-xs pl-gutter-lg text-body-md text-on-surface-variant">
                  {job.points.map((point) => (
                    <li key={point.en}>{point[locale]}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
