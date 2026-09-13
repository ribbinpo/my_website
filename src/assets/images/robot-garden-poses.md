# Robot garden asset

`robot-garden-poses.png` was generated with the built-in imagegen tool from the user's `output/imagegen/robot-idle-walk-run.png` reference. The original is unchanged. The two poses share one transparent sheet; SVG viewports isolate them in `robot-garden.component.tsx`. CSS animates the poses, water, plants, sky, and theme transitions.

## Generation prompt

Use case: identity-preserve. Asset type: transparent robot pose sheet for a website animation. Input image is character identity reference. Create exactly TWO poses of this same cute white pixel-art robot with navy face, cyan lights and antenna. On a wide 1536x1024 genuinely transparent RGBA canvas (no checkerboard drawn), left half: full body standing robot facing slightly right, smiling, right arm extended holding a small sage green watering can tilted pouring toward right (NO water drops, those are animated in code). Right half: same full body robot seated sleeping peacefully, eyes closed cyan horizontal lines, arms relaxed, antenna lowered slightly. Both characters fully contained separately in their own equal-width half with generous clear margin; feet baseline at same y around 850. Preserve original pixel art look, proportions, white armor, dark outlines, cyan antenna. Only robot and watering can, no scenery, no ground, no text, no shadows beyond character, no additional poses. Background must be truly transparent.

## Final transparency edit prompt

Use case: background-extraction. Edit target: supplied two-pose robot sheet. Remove ALL gray and white checkerboard background, replacing with actual transparent alpha channel. Preserve robots exactly, position and resolution. This is a transparent PNG asset, checkerboard must NOT be drawn into RGB pixels. Transparent background output with alpha=0 outside the two robots and watering can, including gaps around limbs and handles. No other changes.
