// Framer Motion mirrors of the motion tokens in src/index.css (seconds and px).
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
// --ease-surface-enter
export const EASE_SURFACE_ENTER = [0.16, 1, 0.3, 1] as const;
// --ease-state-change
export const EASE_STATE_CHANGE = [0.2, 0, 0, 1] as const;
// --motion-duration-reveal
export const REVEAL_DURATION = 0.6;
// --motion-distance-reveal
export const REVEAL_DISTANCE = 24;
// --motion-stagger
export const REVEAL_STAGGER = 0.08;
// Later items in a long list never wait longer than this many steps.
export const REVEAL_MAX_STEPS = 4;
// --motion-duration-panel
export const PANEL_DURATION = 0.4;
// --motion-distance-panel
export const PANEL_DISTANCE = 24;
// --motion-duration-indicator
export const INDICATOR_DURATION = 0.35;
// --motion-carousel-interval
export const CAROUSEL_INTERVAL_MS = 4000;
