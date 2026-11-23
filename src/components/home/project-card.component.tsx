import {
  AppWindow,
  ArrowLeftRight,
  Bot,
  ClipboardCheck,
  Cloud,
  Network,
  Plus,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { copy, type Locale } from "@/data/profile";
import type { Project, ProjectArtwork } from "@/data/side-projects";
import { studioButton } from "@/lib/studio-button";
import { cn } from "@/lib/utils";

const ART_ICONS: Record<ProjectArtwork, LucideIcon> = {
  agents: Bot,
  assets: Wallet,
  cloud: Cloud,
  network: Network,
  website: AppWindow,
  payment: ArrowLeftRight,
  wallet: Wallet,
  survey: ClipboardCheck,
};
const ART_GROUNDS = ["bg-accent-cyan", "bg-accent-peach", "bg-surface-container-high"];

export function ProjectCard({
  project,
  index,
  locale,
}: {
  project: Project;
  index: number;
  locale: Locale;
}) {
  const t = copy[locale];
  const number = String(index + 1).padStart(2, "0");
  const Icon = ART_ICONS[project.artwork ?? "website"];
  return (
    <Dialog>
      <article className="project-card group relative flex h-full flex-col border border-primary bg-surface transition-colors duration-100 has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-4 has-[:focus-visible]:outline-ring">
        <div
          aria-hidden="true"
          className={cn(
            "relative flex aspect-[4/3] lg:aspect-video items-center justify-center overflow-hidden border-b border-primary text-on-accent",
            ART_GROUNDS[index % ART_GROUNDS.length],
            index % ART_GROUNDS.length === 2 && "text-primary",
          )}
        >
          <span className="absolute top-0 left-0 bg-primary px-gutter-sm py-gutter-xs font-label text-label-sm text-on-primary">
            {number}
          </span>
          <span className="absolute top-0 right-0 flex size-8 items-center justify-center border-b border-l border-primary bg-surface-container-lowest text-primary transition-colors duration-100 group-hover:bg-primary group-hover:text-on-primary">
            <Plus className="size-4" />
          </span>
          <span className="flex size-28 items-center justify-center rounded-full border border-primary bg-surface-container-lowest text-primary transition-transform duration-100 ease-state-change group-hover:-translate-y-1">
            <Icon className="size-12" strokeWidth={1.5} />
          </span>
          <span className="absolute bottom-gutter-sm left-gutter-sm font-label text-label-sm uppercase">
            {project.kind[locale]}
          </span>
        </div>
        <div className="flex flex-1 items-end justify-between gap-gutter-md p-gutter-md">
          <div>
            <h3 className="font-display text-title-lg text-primary uppercase">
              <DialogTrigger asChild>
                <button
                  type="button"
                  aria-label={`${t.details}: ${project.name}`}
                  className="text-left uppercase outline-none after:absolute after:inset-0 after:content-['']"
                >
                  {project.name}
                </button>
              </DialogTrigger>
            </h3>
            <p className="mt-gutter-xs font-label text-label-sm text-on-surface-variant uppercase">
              {project.tags.map((tag) => tag[locale]).join(" / ")}
            </p>
          </div>
          <span
            aria-hidden="true"
            className="font-label text-label-lg text-primary transition-transform duration-100 ease-state-change group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          >
            ↗
          </span>
        </div>
      </article>
      <DialogContent
        showCloseButton={false}
        className="max-h-[85dvh] gap-gutter-md overflow-y-auto rounded-none border-2 border-primary bg-surface p-gutter-lg text-on-surface shadow-none sm:max-w-lg"
      >
        <div className="flex items-center justify-between gap-gutter-md border-b border-outline-variant pb-gutter-sm">
          <p className="font-label text-label-sm text-primary uppercase">
            {`${number} // ${project.company ?? t.project} / ${project.kind[locale]}`}
          </p>
          <DialogClose
            aria-label={t.closeProject}
            className={cn(studioButton({ variant: "secondary", size: "icon" }), "shrink-0")}
          >
            <X aria-hidden="true" />
          </DialogClose>
        </div>
        <DialogTitle className="font-display text-headline-md text-primary uppercase">
          {project.name}
        </DialogTitle>
        <DialogDescription className="text-body-md text-on-surface-variant">
          {project.summary[locale]}
        </DialogDescription>
        {project.challenge && (
          <section className="flex flex-col gap-gutter-xs">
            <h3 className="font-label text-label-md text-primary uppercase">{t.problem}</h3>
            <p className="text-body-md">{project.challenge[locale]}</p>
          </section>
        )}
        {project.contributions && project.contributions.length > 0 && (
          <section className="flex flex-col gap-gutter-xs">
            <h3 className="font-label text-label-md text-primary uppercase">
              {t.contribution}
            </h3>
            <ul className="flex list-disc flex-col gap-gutter-xs pl-gutter-lg text-body-md">
              {project.contributions.map((item) => (
                <li key={item.en}>{item[locale]}</li>
              ))}
            </ul>
          </section>
        )}
        {project.outcome && (
          <section className="flex flex-col gap-gutter-xs border border-primary bg-surface-container-low p-gutter-md">
            <h3 className="font-label text-label-md text-primary uppercase">{t.outcome}</h3>
            <p className="text-body-md">{project.outcome[locale]}</p>
          </section>
        )}
        {project.tags.length > 0 && (
          <ul className="flex flex-wrap gap-gutter-xs">
            {project.tags.map((tag) => (
              <li
                key={tag.en}
                className="border border-primary px-gutter-sm py-gutter-xs font-label text-label-sm text-primary uppercase"
              >
                {tag[locale]}
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-end border-t border-outline-variant pt-gutter-sm">
          <DialogClose className={studioButton({ variant: "primary", size: "md" })}>
            {t.close}
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
