import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  EASE_SURFACE_ENTER,
  REDUCED_MOTION_QUERY,
  REVEAL_DISTANCE,
  REVEAL_DURATION,
  REVEAL_MAX_STEPS,
  REVEAL_STAGGER,
} from "@/constants/motion.constant";
import { useMediaQuery } from "@/hooks/use-media-query";

const ELEMENTS = { div: motion.div, li: motion.li, h2: motion.h2 } as const;

// Fades and lifts its content in the first time it scrolls into view.
// `index` staggers siblings in a list. Under reduced motion the element renders
// at full opacity with no transform; print styles in index.css force it visible.
export function Reveal({
  as = "div",
  index = 0,
  id,
  className,
  children,
}: {
  as?: keyof typeof ELEMENTS;
  index?: number;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const Element = ELEMENTS[as];
  // Without IntersectionObserver whileInView could never fire: render static.
  if (reducedMotion || typeof IntersectionObserver === "undefined") {
    return (
      <Element id={id} className={className}>
        {children}
      </Element>
    );
  }
  return (
    <Element
      id={id}
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: REVEAL_DISTANCE }}
      whileInView={{ opacity: 1, y: 0 }}
      // "some" plus a bottom inset fires for elements taller than the viewport too.
      viewport={{ once: true, amount: "some", margin: "0px 0px -10% 0px" }}
      transition={{
        duration: REVEAL_DURATION,
        ease: EASE_SURFACE_ENTER,
        delay: Math.min(index, REVEAL_MAX_STEPS) * REVEAL_STAGGER,
      }}
    >
      {children}
    </Element>
  );
}
