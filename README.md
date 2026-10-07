# Modern Estimator — Next.js

Marketing site for Modern Estimator, converted from a single static HTML file to a
**Next.js 14 (App Router)** project for better SEO, performance and maintainability.

## Why Next.js (vs. plain React)

- **Server-rendered HTML** — search engines and social crawlers receive fully rendered
  content instead of an empty `<div id="root">` (the SEO weakness of a client-only
  React/Vite/CRA SPA).
- **`metadata` API** — title, description, Open Graph and Twitter tags are defined in
  `app/layout.jsx` and rendered on the server.
- **`next/image`** — automatic image optimization for the portfolio photos.
- **`next/font`** — Inter is self-hosted automatically (no render-blocking Google Fonts
  request, no layout shift).

## Requirements

- **Node.js 18.18+** (LTS recommended) — not currently installed on this machine.
  Download from https://nodejs.org and reopen your terminal afterwards.

## Getting started

```bash
npm install
cp .env.example .env.local   # then paste your Anthropic API key
npm run dev                  # http://localhost:3000
```

### Environment variables

| Variable | Used by | Notes |
|----------|---------|-------|
| `ANTHROPIC_API_KEY` | AI chatbot (`/api/chat`) | Get one at https://console.anthropic.com/. Without it the chat widget returns a friendly "not configured" message. |

Build for production:

```bash
npm run build
npm start
```

## Project structure

```
app/
  layout.jsx        # <html>, fonts, global CSS, SEO metadata, JSON-LD
  page.jsx          # composes all sections
  globals.css       # Tailwind directives + custom component CSS
  sitemap.js        # generates /sitemap.xml
  robots.js         # generates /robots.txt
  api/quote/route.js# POST endpoint that receives quote submissions
  api/chat/route.js # streaming AI chatbot endpoint (Anthropic SDK)
components/
  ChatBot.jsx       # client — floating AI chat widget ("Blue")
  JsonLd.jsx        # ProfessionalService structured data (rich results)
  Navbar.jsx        # client — sticky scroll bg + mobile menu
  Hero.jsx
  Stats.jsx
  TrustLogos.jsx
  Services.jsx
  WhyChooseUs.jsx
  Process.jsx
  Portfolio.jsx     # uses next/image
  Testimonials.jsx
  Faq.jsx           # client — accordion
  QuoteForm.jsx     # client — form + success state
  CtaBanner.jsx
  Footer.jsx
  ScrollEffects.jsx # client — reveal-on-scroll, stat counters, hero bar fills
tailwind.config.js  # brand/ink palette, shadows, hero-gradient
next.config.mjs     # allows images.unsplash.com
```

## Notes

- Replace the placeholder domain (`https://modernestimator.com`) in `app/layout.jsx`,
  `app/sitemap.js`, `app/robots.js` and `components/JsonLd.jsx` with your real domain
  before going live. Also swap the Unsplash portfolio image URLs and the NAP details
  (name/address/phone) in `JsonLd.jsx` and the footer.
- The quote form now POSTs to `/api/quote`, which validates the input and logs the lead
  on the server. To actually receive emails, plug an email service (e.g. Resend,
  SendGrid, Nodemailer) into `app/api/quote/route.js` where the `TODO` is.
- Validate the structured data with Google's
  [Rich Results Test](https://search.google.com/test/rich-results) after deploying.
- The AI chatbot ("Blue") streams from Claude **Opus 4.8** via `app/api/chat/route.js`.
  Opus is the most capable model but is billed per message — for a high-traffic public
  widget you can switch the `model` in that file to `claude-haiku-4-5` (cheapest) or
  `claude-sonnet-4-6` (balanced). The business facts Blue relies on live in the
  `SYSTEM_PROMPT` in that same file — update them when your services/pricing change.
