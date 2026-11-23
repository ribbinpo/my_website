# Lighthouse and LCP (preview build, http://localhost:4173/), round 2

| Device  | Accessibility | Best Practices | SEO | Agentic Browsing |
| ------- | ------------- | -------------- | --- | ---------------- |
| desktop | 100           | 100            | 92  | 50               |
| mobile  | 100           | 100            | 92  | 50               |

Failed audits, at both sizes and not caused by this change: robots-txt, llms-txt and ard-schema.
The preview server's SPA fallback returns index.html for those paths.

## LCP trace (desktop 1440x900, no throttling, cold cache)

- LCP: 121 ms (156 ms in round 1). The element is the hero mascot `<img>`, which is not inside a `[data-reveal]` wrapper.
- Breakdown: TTFB 1 ms, load delay 2 ms, load duration 2 ms, render delay 116 ms. Render delay is the slowest phase and comes from the render-blocking CSS and JS plus the Google Fonts CSS.
- CLS: 0.00
- Insights: RenderBlocking (FCP saving about 57 ms), ImageDelivery (about 71 kB could be saved). These were there before this change.
