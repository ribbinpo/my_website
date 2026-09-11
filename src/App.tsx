import {
  type Project,
  SIDE_PROJECTS,
  PROJECT_CATEGORY_LABELS,
} from "@/data/side-projects";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { HeroVisual } from "@/components/hero/hero-visual";
import { FaGithub as Github, FaLinkedinIn as Linkedin } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  Copy,
  Download,
  Mail,
  Menu,
  Moon,
  Sun,
  Monitor,
  Code2,
  Layers3,
  Sparkles,
  Workflow,
  Trophy,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/sonner";
import { usePreferences, type Theme } from "@/hooks/use-preferences";
import {
  achievements,
  contact,
  copy,
  experiences,
  skillGroups,
  type Locale,
} from "@/data/profile";
import cvUrl from "../docs/CV.pdf?url";

const sections = [
  "about",
  "experience",
  "projects",
  "expertise",
  "recognition",
  "education",
  "contact",
];
const skillIcons = [Code2, Layers3, Sparkles, Workflow];

function SectionHeading({
  label,
  title,
  description,
}: {
  label?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      {label && <p className="eyebrow">{label}</p>}
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}

function ProjectCard({
  project,
  locale,
  index,
}: {
  project: Project;
  locale: Locale;
  index: number;
}) {
  const t = copy[locale];
  const reduced = useReducedMotion();
  const artwork = project.artwork ?? "website";
  const artworkClass = {
    network: "crm",
    website: "sbm",
    payment: "transcrypt",
    wallet: "wallet",
    survey: "rabbit",
  }[artwork];
  return (
    <Dialog>
      <motion.div
        className="project-motion"
        layout={!reduced}
        initial={reduced ? false : { opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        whileHover={reduced ? undefined : { y: -8 }}
        transition={{ duration: 0.45 }}
      >
        <Card className={`project-card project-${artworkClass}`}>
          <CardContent className="p-0 flex h-full flex-col">
            <div className="project-art" aria-hidden="true">
              <span className="art-index">
                0{index + 1} / {project.company}
              </span>
              {artwork === "network" ? (
                <div className="art-network">
                  <span />
                  <span />
                  <span />
                  <span />
                  <div>
                    <Sparkles />
                  </div>
                </div>
              ) : artwork === "website" ? (
                <div className="art-window">
                  <div className="window-dots">
                    <i />
                    <i />
                    <i />
                  </div>
                  <div className="window-layout">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              ) : artwork === "payment" ? (
                <div className="art-payment">
                  <span>THB</span>
                  <ArrowRight />
                  <span>ETH</span>
                </div>
              ) : artwork === "wallet" ? (
                <div className="art-wallet">
                  <Layers3 />
                  <div>
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
              ) : (
                <div className="art-survey">
                  <div>
                    <Check />
                    <span />
                  </div>
                  <div>
                    <Check />
                    <span />
                  </div>
                  <div>
                    <Check />
                    <span />
                  </div>
                </div>
              )}
              <span className="art-category">{project.kind[locale]}</span>
            </div>
            <div className="project-body">
              <div className="flex items-start justify-between gap-4">
                <h3>{project.name}</h3>
                <ArrowUpRight
                  className="size-5 text-primary shrink-0"
                  aria-hidden="true"
                />
              </div>
              <p>{project.summary[locale]}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge variant="secondary" key={tag.en}>
                    {tag[locale]}
                  </Badge>
                ))}
              </div>
              <DialogTrigger asChild>
                <Button
                  variant="link"
                  className="project-link"
                  aria-label={`${t.details}: ${project.name}`}
                >
                  {t.details}
                  <ArrowRight aria-hidden="true" />
                </Button>
              </DialogTrigger>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <DialogContent
        closeLabel={t.close}
        className="project-dialog max-h-[85dvh] overflow-y-auto sm:max-w-2xl"
      >
        <DialogHeader>
          <p className="eyebrow">{project.company}</p>
          <DialogTitle className="text-3xl leading-tight">
            {project.name}
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            {project.summary[locale]}
          </DialogDescription>
        </DialogHeader>
        <div className="dialog-section">
          <h3>{t.problem}</h3>
          <p>{project.challenge[locale]}</p>
        </div>
        <div className="dialog-section">
          <h3>{t.contribution}</h3>
          <ul>
            {project.contributions.map((item, i) => (
              <li key={i}>{item[locale]}</li>
            ))}
          </ul>
        </div>
        <div className="dialog-outcome">
          <h3>{t.outcome}</h3>
          <p>{project.outcome[locale]}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function App() {
  const { locale, setLocale, theme, setTheme, resolvedTheme } =
    usePreferences();
  const t = copy[locale];
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 30 });
  const revealProps = {
    initial: reduced ? (false as const) : { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.05 },
    transition: { duration: 0.65 },
  };
  const projectTabs = [
    { value: "all", category: null, label: t.all },
    ...Array.from(new Set(SIDE_PROJECTS.map((project) => project.category))).map(
      (category) => ({
        value: `category:${category}`,
        category,
        label: PROJECT_CATEGORY_LABELS[category]?.[locale] ?? category,
      }),
    ),
  ];
  const mobileDestination = useRef<string | null>(null);
  const [activeSection, setActiveSection] = useState("");
  const [copyFailed, setCopyFailed] = useState(false);
  useEffect(() => {
    const updateSection = () => {
      let current = "";
      for (const id of sections) {
        if (
          (document.getElementById(id)?.getBoundingClientRect().top ??
            Infinity) <= 180
        )
          current = id;
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", updateSection, { passive: true });
    updateSection();
    return () => {
      window.removeEventListener("scroll", updateSection);
    };
  }, []);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopyFailed(false);
      toast.success(t.copied);
    } catch {
      setCopyFailed(true);
      toast.error(t.copyFailed);
    }
  }
  const navLinks = (mobile = false) =>
    sections.map((id, i) => (
      <a
        key={id}
        href={`#${id}`}
        aria-current={activeSection === id ? "location" : undefined}
        onClick={(event) => {
          if (mobile) {
            event.preventDefault();
            mobileDestination.current = id;
            setMenuOpen(false);
          }
        }}
      >
        {t.nav[i]}
        {mobile && <ArrowUpRight className="size-4" />}
      </a>
    ));
  return (
    <>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <motion.div
        className="scroll-progress"
        style={{ scaleX: reduced ? scrollYProgress : progress }}
        aria-hidden="true"
      />
      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#home" aria-label="Teerawut Saesim">
            <span className="brand-mark">
              t<span>.</span>
            </span>
            <span className="brand-name">
              teerawut<span className="brand-dot">.</span>
            </span>
          </a>
          <nav className="desktop-nav" aria-label={t.navigation}>
            {navLinks()}
          </nav>
          <div className="header-controls">
            <div
              className="language-switch"
              role="group"
              aria-label={t.language}
            >
              <button
                lang="en"
                aria-pressed={locale === "en"}
                onClick={() => setLocale("en")}
              >
                EN
              </button>
              <span aria-hidden="true">/</span>
              <button
                lang="th"
                aria-pressed={locale === "th"}
                onClick={() => setLocale("th")}
              >
                TH
              </button>
            </div>
            <div className="control-divider" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t.theme}>
                  {resolvedTheme === "dark" ? <Moon /> : <Sun />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup
                  value={theme}
                  onValueChange={(value) => setTheme(value as Theme)}
                >
                  {(["light", "dark", "system"] as const).map((value, i) => {
                    const Icon = [Sun, Moon, Monitor][i];
                    return (
                      <DropdownMenuRadioItem key={value} value={value}>
                        <Icon className="size-4 mr-2" />
                        {t[value]}
                      </DropdownMenuRadioItem>
                    );
                  })}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  className="mobile-menu-trigger"
                  variant="ghost"
                  size="icon"
                  aria-label={t.menu}
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent
                closeLabel={t.close}
                onCloseAutoFocus={(event) => {
                  const id = mobileDestination.current;
                  if (!id) return;
                  event.preventDefault();
                  mobileDestination.current = null;
                  requestAnimationFrame(() => {
                    const target = document.getElementById(id);
                    history.pushState(null, "", `#${id}`);
                    target?.setAttribute("tabindex", "-1");
                    target?.focus({ preventScroll: true });
                    target?.scrollIntoView({ behavior: "instant" });
                  });
                }}
              >
                <SheetHeader>
                  <SheetTitle>{t.navigation}</SheetTitle>
                  <SheetDescription>
                    Teerawut Saesim · {t.role}
                  </SheetDescription>
                </SheetHeader>
                <nav className="mobile-nav" aria-label={t.navigation}>
                  {navLinks(true)}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main id="main">
        <motion.section id="home" className="hero page-width">
          <motion.div
            className="hero-copy"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="hero-kicker">{t.role}</div>
            <h1>
              {t.intro}
              <br />
              <span>
                {t.intro2.map((phrase) => (
                  <span className="headline-phrase" key={phrase}>
                    {phrase}
                  </span>
                ))}
              </span>
            </h1>
            <p className="hero-description">{t.heroText}</p>
            <div className="hero-actions">
              <Button size="lg" asChild>
                <a href="#projects">
                  {t.viewProjects}
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </Button>
              <div className="cv-action">
                <Button variant="outline" size="lg" asChild>
                  <a href={cvUrl} download="Teerawut-Saesim-CV.pdf">
                    {t.download}
                    <Download aria-hidden="true" />
                  </a>
                </Button>
                <p className="cv-note">{t.cvNote}</p>
              </div>
            </div>
            <div className="hero-current">
              <span className="status-dot" />
              {t.current}
            </div>
          </motion.div>
          <HeroVisual dark={resolvedTheme === "dark"} locale={locale} />
          <div className="hero-foot">
            <span>{t.based}</span>
            <a href="#about" aria-label={t.nav[0]}>
              <ArrowDown className="size-4" />
            </a>
            <span>01 — 07</span>
          </div>
        </motion.section>
        <div className="expertise-strip">
          <div className="page-width">
            <span>{locale === "en" ? "FULL-STACK" : "ฟูลสแตก"}</span>
            <i />
            <span>
              {locale === "en"
                ? "SOFTWARE ARCHITECTURE"
                : "สถาปัตยกรรมซอฟต์แวร์"}
            </span>
            <i />
            <span>{locale === "en" ? "AI AGENTS" : "เอเจนต์ AI"}</span>
            <i />
            <span>
              {locale === "en" ? "CLOUD & DEVOPS" : "คลาวด์และ DEVOPS"}
            </span>
          </div>
        </div>
        <motion.section
          {...revealProps}
          id="about"
          className="page-width section-pad about-section reveal"
        >
          <div className="capability-stack">
            {[
              {
                Icon: Code2,
                title: t.capabilityWeb,
                detail: t.capabilityWebDetail,
              },
              {
                Icon: Layers3,
                title: t.capabilityArchitecture,
                detail: t.capabilityArchitectureDetail,
              },
              {
                Icon: Sparkles,
                title: t.capabilityAI,
                detail: t.capabilityAIDetail,
              },
            ].map(({ Icon, title, detail }, i) => (
              <motion.a
                href="#expertise"
                key={title}
                className="capability-card"
                whileHover={reduced ? undefined : { x: 8 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                <div>
                  <h3>{title}</h3>
                  <Icon />
                </div>
                <p>{detail}</p>
                <span>
                  {t.exploreExpertise}
                  <ArrowRight />
                </span>
                <small>0{i + 1}</small>
              </motion.a>
            ))}
          </div>
          <div className="about-content">
            <SectionHeading label={t.aboutLabel} title={t.aboutTitle} />
            <p className="about-lead">{t.aboutText}</p>
            <p>{t.aboutMore}</p>
            <div className="focus-list">
              <h3>{t.focus}</h3>
              {t.focusItems.map((item) => (
                <div key={item}>
                  <span>
                    <Check className="size-3" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.section>
        <motion.section
          {...revealProps}
          id="experience"
          className="section-tinted"
        >
          <div className="page-width section-pad reveal">
            <SectionHeading label={t.expLabel} title={t.expTitle} />
            <div className="experience-list">
              {experiences.map((job, index) => (
                <article className="experience-row" key={job.company}>
                  <div className="experience-date">
                    <span
                      className={
                        job.current ? "timeline-dot current" : "timeline-dot"
                      }
                    />
                    <p>{job.dates[locale]}</p>
                    <span>0{index + 1}</span>
                  </div>
                  <div>
                    <div className="experience-title">
                      <h3>{job.role[locale]}</h3>
                      {job.current && (
                        <span className="current-pill">
                          {locale === "en" ? "Current" : "ปัจจุบัน"}
                        </span>
                      )}
                    </div>
                    <p className="company-name">{job.company}</p>
                    <p className="experience-description">
                      {job.description[locale]}
                    </p>
                    <ul>
                      {job.points.map((point, i) => (
                        <li key={i}>{point[locale]}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </motion.section>
        <motion.section
          {...revealProps}
          id="projects"
          className="page-width section-pad reveal"
        >
          <SectionHeading
            label={t.projectsLabel}
            title={t.projectsTitle}
            description={t.projectsText}
          />
          <Tabs defaultValue="all" className="project-tabs">
            <TabsList aria-label={t.filters}>
              {projectTabs.map((tab) => (
                <TabsTrigger value={tab.value} key={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {projectTabs.map((tab) => (
              <TabsContent value={tab.value} key={tab.value}>
                <div className="project-grid">
                  {SIDE_PROJECTS.filter(
                    (p) => tab.category === null || p.category === tab.category,
                  ).map((p) => (
                    <ProjectCard
                      key={p.id}
                      project={p}
                      locale={locale}
                      index={SIDE_PROJECTS.indexOf(p)}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.section>
        <motion.section
          {...revealProps}
          id="expertise"
          className="expertise-section"
        >
          <div className="page-width section-pad reveal">
            <SectionHeading label={t.skillsLabel} title={t.skillsTitle} />
            <div className="skills-grid">
              {skillGroups.map((group, i) => {
                const Icon = skillIcons[i];
                return (
                  <div className="skill-group" key={i}>
                    <Icon className="skill-icon" />
                    <span className="skill-number">0{i + 1}</span>
                    <h3>{group.title[locale]}</h3>
                    <ul>
                      {group.skills.map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.section>
        <motion.section
          {...revealProps}
          id="recognition"
          className="page-width section-pad reveal"
        >
          <SectionHeading label={t.awardsLabel} title={t.awardsTitle} />
          <div className="achievement-list">
            {achievements.map((item) => (
              <article className="achievement-row" key={item.name}>
                <div
                  className={`achievement-icon ${item.awarded ? "" : "participation"}`}
                >
                  {item.awarded ? <Trophy /> : <Code2 />}
                </div>
                <div className="achievement-info">
                  <p className="achievement-event">{item.event}</p>
                  <h3>{item.name}</h3>
                  <p>{item.description[locale]}</p>
                </div>
                <div className="achievement-result">
                  <Badge variant={item.awarded ? "default" : "secondary"}>
                    {item.awarded ? t.award : t.participation}
                  </Badge>
                  <p>{item.result[locale]}</p>
                </div>
                {item.url ? (
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${t.visit}: ${item.name}`}
                    >
                      <ArrowUpRight />
                    </a>
                  </Button>
                ) : (
                  <span className="size-9" />
                )}
              </article>
            ))}
          </div>
        </motion.section>
        <motion.section
          {...revealProps}
          id="education"
          className="page-width education-section reveal"
        >
          <div className="education-box">
            <div>
              <p className="eyebrow">{t.eduLabel}</p>
              <h2>{t.eduTitle}</h2>
              <GraduationCap className="education-icon" />
            </div>
            <div className="education-details">
              <span className="education-date">{t.studyDates}</span>
              <h3>{t.university}</h3>
              <p>{t.campus}</p>
              <p className="degree">{t.degree}</p>
              <p className="courses">{t.courses}</p>
              <Badge variant="outline">GPA 3.84 / 4.00</Badge>
            </div>
          </div>
        </motion.section>
        <motion.section
          {...revealProps}
          id="contact"
          className="page-width section-pad contact-section reveal"
        >
          <p className="eyebrow">{t.contactLabel}</p>
          <h2>{t.contactTitle}</h2>
          <p className="contact-description">{t.contactText}</p>
          <div className="contact-email">
            <a href={`mailto:${contact.email}`}>
              {contact.email}
              <ArrowUpRight />
            </a>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t.copyEmail}
              onClick={copyEmail}
            >
              <Copy />
            </Button>
          </div>
          {copyFailed && (
            <p className="copy-fallback" role="status">
              {t.copyFailed}
            </p>
          )}
          <div className="contact-links">
            <Button variant="outline" asChild>
              <a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github />
                GitHub
                <ArrowUpRight />
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin />
                LinkedIn
                <ArrowUpRight />
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={`mailto:${contact.email}`}>
                <Mail />
                {t.email}
              </a>
            </Button>
          </div>
        </motion.section>
      </main>
      <footer className="page-width site-footer">
        <a className="wordmark" href="#home">
          <span className="brand-mark">
            t<span>.</span>
          </span>
          <span>© {new Date().getFullYear()} Teerawut Saesim</span>
        </a>
        <p>{t.footer}</p>
        <a href="#home" className="back-top">
          {t.top}
          <ArrowUp className="size-4" />
        </a>
      </footer>
      <Toaster
        theme={resolvedTheme}
        position="bottom-right"
        toastOptions={{ duration: 4000 }}
        containerAriaLabel={locale === "en" ? "Notifications" : "การแจ้งเตือน"}
      />
    </>
  );
}
export default App;
