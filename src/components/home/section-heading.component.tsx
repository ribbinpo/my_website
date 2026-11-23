import type { ReactNode } from "react";
import { Reveal } from "@/components/home/reveal.component";
import { cn } from "@/lib/utils";

// "01 // LABEL ........ ASIDE" rule, used at the top of each section.
export function SectionRule({
  label,
  aside,
  className,
}: {
  label: string;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "mb-gutter-xl flex flex-wrap items-center justify-between gap-gutter-sm border-b border-outline-variant pb-gutter-sm",
        className,
      )}
    >
      <p className="section-label font-label text-label-md text-primary uppercase">
        {label}
      </p>
      {aside && (
        <p className="font-label text-label-sm text-on-surface-variant uppercase">
          {aside}
        </p>
      )}
    </Reveal>
  );
}

// Uppercase display headline (revealed on scroll) with the magenta square full stop.
export function DisplayHeading({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Reveal
      as="h2"
      index={1}
      id={id}
      className={cn(
        "font-display text-display-md-mobile text-primary uppercase md:text-display-md",
        className,
      )}
    >
      {children}
      <span className="headline-dot" aria-hidden="true" />
    </Reveal>
  );
}
