import { useEffect, useState } from "react";
import { About } from "@/components/home/about.component";
import { Contact } from "@/components/home/contact.component";
import { Education } from "@/components/home/education.component";
import { Experience } from "@/components/home/experience.component";
import { Hero } from "@/components/home/hero.component";
import { Marquee } from "@/components/home/marquee.component";
import { Projects } from "@/components/home/projects.component";
import { Recognition } from "@/components/home/recognition.component";
import type { Locale } from "@/data/profile";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function HomeView({ locale }: { locale: Locale }) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  // One control pauses all continuous motion on the page: the mascot, the ticker
  // and the project carousel autoplay.
  const [paused, setPaused] = useState(false);
  // The browser tries the URL fragment before React has rendered the sections,
  // so a deep link like /#contact needs one jump once they exist.
  useEffect(() => {
    let id: string;
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch {
      // A malformed escape such as "#%E0%A4%A" cannot name a section: stay at the top.
      return;
    }
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
  }, []);
  return (
    <div data-motion={paused || reducedMotion ? "paused" : "running"}>
      <Hero
        locale={locale}
        paused={paused}
        onTogglePaused={() => setPaused((value) => !value)}
        reducedMotion={reducedMotion}
      />
      <Marquee locale={locale} />
      <About locale={locale} />
      <Experience locale={locale} />
      <Projects locale={locale} reducedMotion={reducedMotion} paused={paused} />
      <Recognition locale={locale} />
      <Education locale={locale} />
      <Contact locale={locale} />
    </div>
  );
}
