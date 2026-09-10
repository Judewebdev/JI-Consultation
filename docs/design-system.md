# JI Global design system

The source of truth is `site/index.html`, in the `:root` block at the top. This file explains the reasoning so nobody has to reverse engineer it later.

Heads up on `.21st/design.json`: running `21st init --design-context --refresh` **keeps** `constraints.must` and `constraints.avoid`, but **wipes** `decisions`, `evidence` and everything the tool re-derives. The generated `DESIGN.md` header tells you to record decisions in that JSON. Do not. They get erased on the next refresh. Constraints survive, so those live in the JSON and the rationale lives here.

## Palette

Authority navy with a warm gold accent, drawn from the ui-ux-pro-max Legal Services / B2B trust palette. Gold rather than the usual corporate blue, because blue reads as generic tech and the brand is about excellence, not software.

| Token | Value | Used for |
| --- | --- | --- |
| `--ink` | `#0A1628` | Dark sections, primary buttons, logo mark |
| `--ink-2` | `#12243F` | Step cards on dark |
| `--ink-3` | `#1B3A6B` | Hover states, footer mark |
| `--gold` | `#C89B3C` | **Agency accent**, eyebrows, icons, focus rings |
| `--gold-soft` | `#E3BE6E` | Accent on dark backgrounds, stat figures |
| `--copper` | `#B4530A` | **Academy accent** |
| `--bg` | `#FBF9F6` | Page ground, warm off-white not sterile grey |
| `--surface` | `#FFFFFF` | Cards, form |
| `--surface-2` | `#F4F0EA` | Alternating section bands |
| `--fg` / `--fg-muted` | `#0A1628` / `#55606F` | Body copy |

**The arm swap.** `[data-arm="academy"]` re-points `--accent` to copper. One rule flips the whole subtree, so the tab panels, icons and hover borders change tone without duplicating a single style. Add a third arm later and it is one more line.

## Typography

Fraunces for display, Inter for body. An editorial serif signals authorship, which matters for a consultant who has published three books. Inter keeps the UI and long copy clean. Two families, no third.

- `h1`: `clamp(2.5rem, 6.2vw, 4.6rem)`, weight 900, tracking `-0.035em`
- `h2`: `clamp(1.95rem, 3.9vw, 3rem)`, weight 700
- Body: 17px, line height 1.65, dropping to 16px under 560px
- Eyebrows: 0.72rem, uppercase, `0.16em` tracking, with a short rule before the text

## Structure

The **Trust & Authority + Conversion** pattern from ui-ux-pro-max `landing.csv`:

1. Hero with mission and credibility
2. Proof strip (certifications, published work, reach)
3. Solution overview (the two arms, then the tabbed services)
4. Clear CTA path

Everything from the credential strip onward exists to close the gap between "this looks nice" and "this person is real."

## Interaction rules

- One primary CTA per section. Competing buttons split intent and convert worse.
- Hover lift is `translateY(-4px)` on `--ease` (`cubic-bezier(.22,.72,.26,1)`). Consistent everywhere.
- Scroll reveal on `.rv` via IntersectionObserver, unobserved after firing so it never re-runs.
- `prefers-reduced-motion` kills every animation and forces `.rv` visible. Not optional.
- Focus rings are gold at 2px with 3px offset, on every interactive element.

## Accessibility

- Arm switcher is a real ARIA tablist: arrow keys, Home, End, roving `tabindex`.
- FAQ uses native `details`/`summary`, so it works with JS disabled.
- Skip link, semantic landmarks, `aria-live` on the form status message.
- Body text hits WCAG AA against every background it sits on.

## Content rules

No invented proof. No fake client quotes, no made up numbers, no logo walls of companies who were never clients. The testimonial section and three of the four stat tiles ship as clearly marked placeholders precisely so nobody is tempted to launch with fiction in them.

Also: no em dashes anywhere in the copy.

## Regenerating design intel

The vendored skill answers design questions offline:

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "consulting landing page" --domain style
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "trust authority" --domain color
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "JI Global" --design-system
```
