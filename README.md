# Restaurant Showcase — Fine Dining Websites

A collection of sophisticated, fully responsive single-page restaurant booking websites demonstrating modern web design principles. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools.

**Live Site:** https://openmind-walter.github.io/Training/  
**Repository:** https://github.com/openmind-walter/Training

## 🍽 Projects

### 1. Maison Lumière — French Fine Dining
Classic European elegance with a dark luxe palette of charcoal, cream, and gold.

**Files:** `index.html`, `styles.css`, `script.js`

### 2. Dynasty — Chinese Fine Dining
Luxury Asian dining experience with traditional red and gold accents.

**Files:** `dynasty-index.html`, `dynasty-styles.css`, `dynasty-script.js`

![Dynasty Website](dynasty-hero.png)

## About

Maison Lumière is a demonstration of modern web design principles applied to a fine dining context. The site showcases a fully functional, single-page restaurant booking experience with no dependencies — just pure HTML, CSS, and vanilla JavaScript.

**Visit the live site:** [https://openmind-walter.github.io/Training/](https://openmind-walter.github.io/Training/)

![Maison Lumière Website](screenshot.png)

This project demonstrates:
- Clean, semantic markup with full accessibility
- Responsive design without frameworks
- Client-side form validation and UX patterns
- Animation and interaction design
- Production-ready code organization

## 🎯 Features

### Maison Lumière
- **Elegant hero section** with Unsplash background, animated text entrance, and smooth scroll navigation
- **Dynamic menu** with 9 dishes across 3 categories (Entrées, Plats Principaux, Desserts)
- **Auto-rotating testimonials carousel** with manual navigation and dot indicators
- **Fully functional reservation form** with client-side validation
- **Dark luxe palette** — deep charcoal, warm cream, and gold accents

### Dynasty
- **Dramatic hero section** with layered overlay, floating lantern animations, and Chinese imagery
- **Premium menu showcase** with 3 categories (Appetizers, Main Courses, Seafood Delicacies)
- **Chef's Specialties section** with specialty cards and emoji icons
- **Auto-rotating testimonials carousel** with 5-star ratings
- **Sophisticated reservation form** with real-time validation feedback
- **Traditional Chinese elements** — calligraphy characters, red & gold accents, lantern motifs
- **Responsive design** — optimized for mobile (480px), tablet (768px), and desktop (1024px+)
- **Production-ready** — semantic HTML, smooth animations, complete accessibility

## 🚀 Quick Start

No build step required. Run a local server:

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .
```

Then visit:
- **Maison Lumière:** `http://localhost:8080`
- **Dynasty:** `http://localhost:8080/dynasty-index.html`

Or open files directly:
```bash
open index.html              # Maison Lumière
open dynasty-index.html      # Dynasty
```

## 📋 Project Structure

### Maison Lumière
```
├── index.html          # French restaurant markup
├── styles.css          # Charcoal, cream & gold theme
├── script.js           # Navigation, carousel, validation
└── screenshot.png      # Website preview
```

### Dynasty
```
├── dynasty-index.html       # Chinese restaurant markup
├── dynasty-styles.css       # Crimson, gold & black theme
├── dynasty-script.js        # Navigation, carousel, validation
└── dynasty-hero.png         # Website preview
```

Both projects share architecture patterns but showcase different aesthetic directions.

## 🎨 Design & Styling

### Maison Lumière Palette
- **Typography**: Cormorant Garamond (headings) + Montserrat (body) via Google Fonts
- **Color palette**:
  - Background: `#0e0e0e` (deep charcoal)
  - Text: `#f5efe6` (warm cream)
  - Accent: `#c9a84c` (gold)

### Dynasty Palette
- **Typography**: Playfair Display (luxury headings) + Montserrat (body)
- **Color palette**:
  - Background: `#0D0D0D` (near black)
  - Primary: `#8B0000` (deep crimson red)
  - Accent: `#D4AF37` (gold)
  - Text: `#F5EFE6` (warm cream)

Both use CSS custom properties, responsive CSS Grid/Flexbox with `clamp()`, and smooth animations with IntersectionObserver for scroll effects.

## 📝 Form Validation

The reservation form validates all required fields client-side:

- **Name**: non-empty
- **Email**: valid email format
- **Phone**: non-empty
- **Date**: today or future only
- **Time**: must be selected
- **Guests**: 1–20 range

On success, displays: *"Thank you, {name}! Your reservation request for {guests} guest(s) on {date} at {time} has been received."*

## 📱 Responsive Breakpoints

| Breakpoint | Changes |
|---|---|
| Desktop (1024px+) | 4-column footer, 3-column dish grid, parallax hero |
| Tablet (768px) | Hamburger nav, 2-column footer, 1-column dish grid |
| Mobile (480px) | Fine-tuned typography and spacing |

## 🌐 Deployment

Deployed via **GitHub Actions** to GitHub Pages:

```
https://openmind-walter.github.io/Training/
```

The workflow (`.github/workflows/deploy.yml`) automatically deploys on every push to `main`. No manual steps required after initial Pages setup.

## 🛠 Development

All changes made to `index.html`, `styles.css`, or `script.js` are reflected immediately in the browser (refresh required). No compilation or build tools.

**Common tasks:**
- Add a dish: Copy a `<article class="dish-card">` block in [index.html](index.html)
- Change colors: Edit `:root` in [styles.css](styles.css)
- Add form field: Update HTML label + input, then add validation in [script.js](script.js)

See [CLAUDE.md](CLAUDE.md) for detailed guidance.

## ✅ Quality

- ✓ No console errors
- ✓ Full keyboard navigation support
- ✓ WCAG AA color contrast
- ✓ Semantic HTML with ARIA labels
- ✓ Mobile-tested at 375px, 768px, 1200px viewports
- ✓ Form validation tested (empty, invalid email, past date, etc.)

## 📄 License

Open source. Free to modify and use.
