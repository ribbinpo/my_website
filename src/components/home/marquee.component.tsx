import { copy, type Locale } from "@/data/profile";

function TickerItems({ items }: { items: string[] }) {
  return items.map((item) => (
    <li key={item} className="inline-flex items-center gap-gutter-md pr-gutter-md">
      <span>{item}</span>
      <span aria-hidden="true" className="inline-block size-2 bg-accent-magenta" />
    </li>
  ));
}

// Continuous ticker. The track holds four copies and slides by half its width,
// so the loop is seamless even on wide screens. The extra copies are hidden from
// assistive tech; under reduced motion they are removed and the list wraps.
export function Marquee({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <div className="relative z-10 overflow-hidden border-b border-primary bg-accent-cyan py-gutter-md text-on-accent">
      <div className="mx-auto flex max-w-7xl items-center gap-gutter-md px-gutter-md md:px-page-margin">
        <div className="min-w-0 flex-1 overflow-hidden">
          <div
            data-testid="marquee-track"
            className="marquee-track animate-marquee flex w-max font-display text-title-md tracking-tight uppercase"
          >
            <ul
              aria-label={t.tickerLabel}
              className="marquee-list flex shrink-0 flex-wrap gap-y-gutter-xs"
            >
              <TickerItems items={t.ticker} />
            </ul>
            {[1, 2, 3].map((n) => (
              <ul key={n} aria-hidden="true" className="marquee-copy flex shrink-0">
                <TickerItems items={t.ticker} />
              </ul>
            ))}
          </div>
        </div>
        <p className="hidden shrink-0 bg-accent-cyan px-gutter-xs font-label text-label-sm uppercase xl:block">
          {t.tickerTagline}
        </p>
      </div>
    </div>
  );
}
