import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/data/profile";
import RobotGarden from "@/components/home/robot-garden.component";
import "@/components/home/robot-garden.css";

export function HeroVisual({ dark, locale }: { dark: boolean; locale: Locale }) {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const stopped = Boolean(reduced) || paused;
  return (
    <div className="hero-art studio-art robot-garden-art" data-theme={dark ? "dark" : "light"} data-paused={stopped}>
      <RobotGarden theme={dark ? "dark" : "light"} locale={locale} />
      {!reduced && (
        <Button variant="ghost" size="sm" className="animation-toggle" onClick={() => setPaused(!paused)}
          aria-label={locale === "en" ? paused ? "Resume animation" : "Pause animation" : paused ? "เล่นภาพเคลื่อนไหว" : "หยุดภาพเคลื่อนไหว"}>
          {paused ? <Play /> : <Pause />}
          {locale === "en" ? paused ? "Play" : "Pause" : paused ? "เล่น" : "หยุด"}
        </Button>
      )}
    </div>
  );
}
