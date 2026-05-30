# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the site

No build step. Open directly in a browser:

```bash
open index.html
```

For live-reload during development, any static file server works:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Architecture

Three files, no dependencies, no bundler.

- [index.html](index.html) — all markup. Sections in DOM order: `#navbar`, `#hero`, `#menu`, `#testimonials`, `#reservations`, `#site-footer`. Anchor links in the nav target these section IDs.
- [styles.css](styles.css) — all styling. Organized top-to-bottom matching DOM order. Design tokens live in `:root` at the top; touch those first when adjusting the palette, spacing, or typography.
- [script.js](script.js) — four independent concerns in sequence: nav scroll/hamburger, `IntersectionObserver` fade-ins, carousel, form validation.

## Design tokens (styles.css `:root`)

All color, font, and spacing decisions are CSS custom properties. The key ones:

| Token | Purpose |
|---|---|
| `--color-gold` / `--color-gold-light` | Accent — used for labels, prices, hover states, borders |
| `--color-bg` / `--color-surface` | Alternating section backgrounds (`#menu` and `#reservations` use `--color-surface`) |
| `--color-card` | Dish card background |
| `--font-serif` | Cormorant Garamond — headings, quotes, dish names |
| `--font-sans` | Montserrat — body, labels, nav, buttons |
| `--section-pad` | Vertical padding for all non-hero sections (`clamp`) |
| `--inner-max` | `1200px` content width cap |

## Animation system

Two parallel systems — do not mix them:

- **Hero elements** use CSS `@keyframes fadeUp` with `animation-fill-mode: both` and staggered delays. They fire on page load, not on scroll.
- **All other `.fade-in` elements** start at `opacity:0; transform:translateY(28px)` and gain `.visible` via `IntersectionObserver` in `script.js`. The JS observer explicitly skips anything inside `#hero` (`el.closest('#hero')`).

## Adding a menu dish

1. Copy an existing `<article class="dish-card">` block inside the relevant `.dish-grid` in [index.html](index.html).
2. Update the Unsplash `src` URL (use `?auto=format&fit=crop&w=800&q=80`), the `alt` text, dish name, price, and description.
3. No CSS changes needed — the grid is `auto-fit, minmax(300px, 1fr)`.

## Form validation (script.js)

`setError(fieldKey, message)` maps a logical key to both the error `<span>` (`id="error-{key}"`) and the input (`id="{key}"`, except `'name'` → `'full-name'`). Adding a new required field requires:
- A matching `id` on the input and `id="error-{key}"` on a `.field-error` span
- A validation block in the `submit` handler
- The `input.error` / `select.error` CSS rule already covers styling

## Responsive breakpoints

| Breakpoint | Changes |
|---|---|
| ≤ 1024px | Footer collapses to 2-column grid |
| ≤ 768px | Hamburger nav, single-column dish grid and form, single-column footer, parallax disabled on hero |
| ≤ 480px | Fine-tuned typography and spacing |

## French characters

All accented characters in [index.html](index.html) use HTML entities (e.g. `&egrave;`, `&eacute;`, `&agrave;`) to avoid encoding issues when the file is served without an explicit charset header. The `<meta charset="UTF-8">` is present, but the entity convention is already established — keep it consistent.
