# Lighthouse and LCP: preview build (http://localhost:4173), 2026-11-23

## Lighthouse (navigation)
| Run | Accessibility | Best practices | SEO | Agentic browsing |
| --- | --- | --- | --- | --- |
| mobile, light theme (round 2, after fixes) | 100 | 100 | 92 | 50 |
| desktop, light theme | 100 | 100 | 92 | 50 |

Failed audits (both runs): `robots-txt` (the SPA fallback serves index.html for /robots.txt, which predates this change), `llms-txt`, `ard-schema` (informational).

## LCP (performance trace, cold cache)
| Run | LCP | Element | Breakdown |
| --- | --- | --- | --- |
| mobile 390x844, 4x CPU, Fast 4G | 678 ms | `<h1>` hero title (text) | TTFB 166 ms, render delay 512 ms |
| desktop 1440x900, no throttling, round 1 | 126 ms | hero mascot `<img>` (896w webp) | TTFB 2 ms, load delay 98 ms, load 2 ms, render delay 25 ms |
| desktop 1440x900, no throttling, round 2 (with preload) | 116 ms | hero mascot `<img>` | TTFB 1 ms, load delay 2 ms, load 2 ms, render delay 110 ms |

CLS 0.00 in both.

## Top issues
1. Render-blocking Google Fonts stylesheet (`fonts.googleapis.com/css2...`) together with the app CSS: estimated 320 ms of FCP/LCP savings on throttled mobile. It is also a third-party request on every page view.
2. FIXED in round 2 (preload in index.html, load delay 98 ms -> 2 ms; a clean mobile session downloads only the 448w file). Round 1: desktop LCP image was not discoverable in the initial HTML: it is injected by the JS bundle, so 78% of desktop LCP is load delay. `fetchpriority="high"` is set and the image is not lazy-loaded, but a `<link rel="preload" as="image" imagesrcset=...>` in index.html would remove the delay.
3. Image delivery: mobile downloads the 448w mascot for a 144 CSS px slot at 2x DPR (288 px needed), wasting about 40 kB. Desktop wastes about 71 kB. Low priority.
