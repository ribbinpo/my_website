import { DisplayHeading } from "@/components/home/section-heading.component";
import { copy, type Locale } from "@/data/profile";

export function Education({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <section
      id="education"
      aria-labelledby="education-title"
      className="border-b border-primary bg-band-warm text-on-band-warm"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-gutter-xl px-gutter-md py-section md:px-page-margin lg:grid-cols-12">
        <div className="flex flex-col gap-gutter-sm lg:col-span-6">
          <p className="section-label font-label text-label-md uppercase">{t.eduLabel}</p>
          <DisplayHeading id="education-title" className="text-on-band-warm">
            {t.eduTitle}
          </DisplayHeading>
        </div>
        <div className="flex flex-col gap-gutter-sm border border-primary bg-surface-container-lowest p-gutter-lg text-on-surface lg:col-span-6">
          <div className="flex flex-wrap items-center justify-between gap-gutter-sm border-b border-outline-variant pb-gutter-xs">
            <p className="font-label text-label-sm text-on-surface-variant uppercase tabular-nums">
              {t.studyDates}
            </p>
            <p className="bg-primary px-gutter-sm py-gutter-xs font-label text-label-sm text-on-primary tabular-nums">
              {t.gpa}
            </p>
          </div>
          <h3 className="font-display text-headline-md text-primary uppercase">
            {t.university}
          </h3>
          <p className="font-label text-label-sm text-on-surface-variant uppercase">
            {`${t.campus} · ${t.degree}`}
          </p>
          <p className="text-body-md">{t.courses}</p>
        </div>
      </div>
    </section>
  );
}
