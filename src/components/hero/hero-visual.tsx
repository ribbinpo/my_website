import { lazy, Suspense, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { SiReact, SiTypescript, SiPython } from "react-icons/si";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/data/profile";
const ThreeScene = lazy(() => import("./three-scene"));
export function HeroVisual({
  dark,
  locale,
}: {
  dark: boolean;
  locale: Locale;
}) {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const stopped = Boolean(reduced) || paused;
  return (
    <div className="hero-art studio-art">
      <div className="sculpture-stage" aria-hidden="true">
        <div className="sculpture-backdrop" />
        <div className="sculpture-fallback">
          <span />
          <span />
          <span />
        </div>
        <Suspense fallback={null}>
          <ThreeScene dark={dark} paused={stopped} />
        </Suspense>
        {[
          { Icon: SiReact, name: "React", style: "tech-react" },
          { Icon: SiTypescript, name: "TypeScript", style: "tech-typescript" },
          { Icon: SiPython, name: "Python", style: "tech-python" },
        ].map(({ Icon, name, style }, i) => (
          <motion.div
            key={name}
            className={`tech-bubble ${style}`}
            animate={
              stopped
                ? { y: 0, rotate: 0 }
                : { y: [0, -14, 0], rotate: [-3, 3, -3] }
            }
            transition={
              stopped
                ? { duration: 0 }
                : { duration: 5 + i, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <Icon />
            <span>{name}</span>
          </motion.div>
        ))}
        <div className="sculpture-caption">
          <span>&lt;ts /&gt;</span>
          <span>
            {locale === "en" ? "BUILT TO CONNECT" : "ออกแบบให้เชื่อมถึงกัน"}
          </span>
        </div>
      </div>
      {!reduced && (
        <Button
          variant="ghost"
          size="sm"
          className="animation-toggle"
          onClick={() => setPaused(!paused)}
          aria-label={
            locale === "en"
              ? paused
                ? "Resume animation"
                : "Pause animation"
              : paused
                ? "เล่นภาพเคลื่อนไหว"
                : "หยุดภาพเคลื่อนไหว"
          }
        >
          {paused ? <Play /> : <Pause />}
          {locale === "en"
            ? paused
              ? "Play"
              : "Pause"
            : paused
              ? "เล่น"
              : "หยุด"}
        </Button>
      )}
    </div>
  );
}
