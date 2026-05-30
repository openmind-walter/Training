# Build Prompt: Modern High-Class French Restaurant Booking Website

## Goal
Build a *single-page* restaurant booking website for an upscale French restaurant. The site should feel elegant, refined, and modern — think white tablecloths, warm candlelight, and Parisian sophistication. Use *only HTML, CSS, and JavaScript* (no frameworks, no build tools).

## Tech Constraints
- One index.html, one styles.css, one script.js (or inline if you prefer a single file).
- Vanilla HTML/CSS/JS only. No React, Tailwind, Bootstrap, or external JS libraries.
- Fully responsive (mobile, tablet, desktop).
- Smooth scroll between sections via anchor links in a fixed/sticky nav.

## Brand & Visual Style
- *Restaurant name:* Maison Lumière (or invent a tasteful French name).
- *Palette:* deep charcoal/near-black, warm cream/ivory, and a single accent of gold or burgundy. Keep it minimal and luxurious.
- *Typography:* an elegant serif for headings (e.g. Playfair Display or Cormorant Garamond via Google Fonts) paired with a clean sans-serif for body text (e.g. Montserrat or Lato).
- Generous whitespace, subtle fade-in-on-scroll animations, and refined hover states.

## Sections (in order)

### 1. Hero Section
- Full-viewport background image of an elegant French dining setting (use a high-quality Unsplash photo).
- Dark overlay so text is readable.
- Restaurant name as a large serif headline, a short tagline (e.g. "Authentic French cuisine in the heart of the city"), and a prominent *"Reserve a Table"* button that scrolls to the enquiry form.
- Sticky top navigation with links: Menu, Testimonials, Reservations.

### 2. Main Menu (with Unsplash photos)
- A heading like "Our Menu" with a short intro line.
- Organize into 3 categories: *Entrées, **Plats Principaux, **Desserts*.
- For each dish: a real Unsplash photo, dish name (French + short English description), and price (in the user's local currency — default to SGD).
- Use Unsplash source images via direct URLs, for example:
  - https://images.unsplash.com/photo-... for French food, escargot, coq au vin, crème brûlée, etc.
  - Pick photos that genuinely match each dish; verify the URLs resolve.
- Lay out dishes in a clean responsive grid with subtle card hover effects (gentle lift/zoom).

### 3. Testimonials
- A heading like "What Our Guests Say".
- 3 testimonial cards: guest name, a short quote, and a 5-star rating.
- Optional: a simple auto-rotating carousel built in vanilla JS, or a static elegant grid.

### 4. Enquiry / Reservation Form (with JS form submit)
Fields:
- Full Name (required)
- Email (required, validated)
- Phone (required)
- Date (date picker)
- Time (time picker or select)
- Number of Guests (number input)
- Special Requests (textarea, optional)

Form behavior (vanilla JS):
- Validate all required fields and email format on submit.
- Prevent default form submission; instead show inline error messages for invalid fields.
- On success, display a styled confirmation message ("Thank you, {name}! Your reservation request for {guests} on {date} at {time} has been received.") and reset the form.
- No backend needed — handle everything client-side in script.js.

## Footer
- Address, phone, opening hours, and small social links (placeholder icons or text).
- Copyright line.

## Quality Bar
- Clean, well-commented, semantic HTML.
- Accessible: alt text on all images, labels on all inputs, sufficient color contrast.
- No console errors. Test the form validation and the success state.
- Make it look genuinely high-class, not a generic template.