# JI Global design system

Source of truth is the `:root` block at the top of `site/index.html`. This file explains the reasoning.

Heads up on `.21st/design.json`: `21st init --design-context --refresh` **keeps** `constraints.must` and `constraints.avoid` but **wipes** `decisions`, `evidence` and everything the tool re-derives. The generated `DESIGN.md` tells you to record decisions in that JSON. Do not. They get erased. Constraints live in the JSON, reasoning lives here.

## Direction

**Modern Dark (cinema)** plus **Aurora UI** mesh gradients, both from the ui-ux-pro-max skill. The rules that matter from that spec, all of them implemented:

- Never pure `#000000`. Base is `#06070F` with a layered gradient, because pure black smears on OLED and kills depth.
- Two to three animated ambient blobs, `blur(96px)`, low opacity, slow oscillation.
- Frosted glass on nav and cards, hairline `rgba(255,255,255,.09)` borders.
- 16px to 32px radii.
- `cubic-bezier(.16,1,.3,1)` easing on everything (Expo-out).
- Accent glow behind primary buttons.

## Brand palette

Taken from the brand sheet, not invented.

| Token | Value | Role |
| --- | --- | --- |
| `--navy` | `#2C2D48` | Brand navy, feeds the background gradient and the second aurora blob |
| `--sky` | `#18C3F3` | **Agency accent** |
| `--gold` | `#BB7F27` | **Academy accent** |
| `--bg-deep` | `#06070F` | Page ground, navy pushed near-black |
| `--fg` / `--fg-mid` / `--fg-dim` | `#EDEEF4` / `#AEB5C7` / `#7D8497` | Three-step text ramp |
| `--glass` | `rgba(255,255,255,.038)` | Card and nav fill |

**The arm swap.** `body[data-arm="academy"]` re-points `--accent`, `--accent-lift`, `--accent-deep` and three alpha variants. One selector reskins the entire site: nav pill, aurora glow, buttons, kickers, icons, chips, focus rings, form states. The router sets that attribute, so nothing else has to know which arm is active.

## Typography

- Display: **Space Grotesk** 500 to 700. Geometric grotesque, closest match to the logo wordmark.
- Body: **Inter** 400 to 600.
- Micro-labels: **JetBrains Mono** 400 to 500, uppercase, wide tracking. This is what makes the eyebrows and status pills read as a product rather than a brochure.
- `text-wrap: balance` on all headings, so long headlines stop ragging badly.

## Routing

Single file, eight pages, no framework.

- Served over http(s): History API, clean URLs (`/agency/services`). Needs the SPA fallback in `netlify.toml`, which must be a **200, not a 301**, or deep links break.
- Opened as `file://`: falls back to hash routing automatically, so double-clicking `index.html` still works.

Every page lives in the DOM as `<div class="page" data-route="...">`, not in a `<template>`. Two reasons: the content is crawlable, and **Netlify Forms only detects forms present in the static HTML**. Forms inside a template would never be registered.

**Asset paths must be root-absolute** (`/assets/...`). A relative `assets/x.jpg` resolves against `/agency/` on a nested route and 404s. This bit us once already.

## Effects

| Effect | Where |
| --- | --- |
| Aurora blobs | Three fixed radial gradients, 26s to 32s alternating drift |
| Film grain | SVG `feTurbulence` data URI, 3.8% opacity, `overlay` blend |
| Cursor spotlight | Follows the pointer, `rAF`-throttled, desktop only |
| Card spotlight | `--mx`/`--my` custom props set per card on hover |
| Magnetic buttons | Primary buttons translate toward the cursor |
| Word-stagger headlines | `h1[data-split]` splits on load, 55ms per word, inline elements stay intact |
| Scroll progress | Top bar, `scaleX` on a `rAF` scroll handler |
| Reveal on scroll | IntersectionObserver, unobserved after firing, 70ms stagger |
| Marquee | Track duplicated in JS so the loop is seamless, pauses on hover |

All of it is gated behind `prefers-reduced-motion`, and pointer effects additionally require `(pointer: fine)`.

## Accessibility

- Arm switcher is a labelled button group with `aria-current`, not fake tabs.
- Route changes update `document.title` and push it to an `aria-live` region.
- FAQ uses native `details`/`summary`, so it works with JS off.
- Skip link, focus-visible rings in the active accent, `aria-expanded` on the drawer, Escape closes it.

## Content rules

No invented proof. No fake testimonials, no made-up client counts, no logo walls. The four stat tiles are structural facts (seven service lines, two countries, two arms, one senior lead), not performance claims.

David Albert's cards carry his real name, title and country. The bio is a marked placeholder because inventing a colleague's background is not a design decision.

No em dashes in any copy.

## Querying the design skill

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "dark glassmorphism" --domain style
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "trust authority" --domain color
```
