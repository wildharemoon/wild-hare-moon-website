# Wild Hare Moon Website — Design

## Background

Wild Hare Moon is Heather Rougeot's small business: handmade nature-inspired
crafts, sold currently through a local store (Etsy likely later), plus
in-person classes/workshops. This site replaces having no web presence beyond
a business card. Design follows lessons learned building the Weeds band site
(`~/weeds-website/`): plain static stack, no build step, preview before
domain launch, placeholder content where real assets aren't available yet.

Brand assets: business card front/back showing the "Wild Hare Moon" wordmark,
a black leaping-hare-over-crescent-moon mark, mint/seafoam background,
black/white/cream palette. Contact: wildharemoon@gmail.com,
www.wildharemoon.com (domain status unconfirmed — assume registered, confirm
with Heather before connecting DNS), social handle @wildharemoon on
Facebook/Instagram/TikTok.

## Scope

Showcase site only — no e-commerce, no cart/checkout. The site presents her
brand, crafts, and classes, and sends interested people to her existing
channels (in-person store, social media, email) to actually buy or sign up.
An Etsy link slot is included in the Crafts section for whenever she opens a
shop there.

## Architecture

- Plain HTML + Tailwind CSS (CDN, no build step) + GSAP ScrollTrigger for
  scroll-based reveals — same stack as the Weeds site.
- Single repo at `~/wild-hare-moon-website/`. `site/` is the publish root.
  `docs/` holds planning/SDD artifacts and stays out of any deploy.
- No backend, no forms requiring a server — contact is via mailto/social
  links only (no mailing-list signup in this version; can be added later
  following the Weeds Apps Script pattern if Heather wants one).

## Page structure — single scrolling page

One page, smooth-scroll nav, sections in order:

1. **Hero** — hare-and-moon mark, "Wild Hare Moon" wordmark, short tagline
   (e.g. "Handmade nature-inspired crafts & classes").
2. **About** — Heather's story / what Wild Hare Moon is about. Placeholder
   copy until she provides her own.
3. **Crafts** — showcase grid with placeholder categories (to be replaced
   once Heather names her actual craft types — candles, jewelry, herbal
   goods, etc. are unconfirmed). Includes a note on where to find/buy her
   work in person, and a ready (but initially hidden/omitted) slot for an
   Etsy link once she has a shop.
4. **Classes** — list of workshop topics, placeholder until she sends
   specifics. No calendar/booking system — copy directs people to message
   her (email or social) to sign up, since classes are in-person/local and
   she doesn't want to maintain a schedule system.
5. **Contact / Follow** — email (wildharemoon@gmail.com), Instagram /
   Facebook / TikTok icons linking to @wildharemoon, matching the icon set
   shown on the back of her business card.
6. **Footer** — self-updating copyright year, small wordmark/mark.

## Visual design

- **Palette:** mint/seafoam background (~`#a8d5cd`), black ink for
  illustration and primary text, cream/white for text panels and reversed
  text on dark elements. Cozy, handmade, craft-fair feel — not dark or
  moody; the nature-inspired theming shows through iconography (moon, hare) and
  copy tone rather than a gothic color scheme.
- **Motif:** the leaping-hare-over-crescent-moon mark reused as a small
  section-divider / scroll accent (sparkle + crescent flourish, echoing the
  back of the business card).
- **Typography:** the business card's bold, curvy, whimsical all-caps
  wordmark font could not be identified exactly from the image. Build will
  trial free Google Font candidates with a similar folk-witchy display
  weight (e.g. Pirata One, Eagle Lake, Modak) and pick the closest visual
  match. Body copy uses a warm, readable serif or humanist sans-serif,
  distinct from the display font.

## Content strategy

Build the full section structure now with clearly-marked placeholder text
and imagery for the Crafts and Classes sections (same pattern used starting
the Weeds site before all band photography existed). Real craft categories,
class topics, photos, and About copy get swapped in once Heather provides
them — no structural rebuild required, just content replacement.

## Deployment plan

1. Build locally in `~/wild-hare-moon-website/`.
2. Push to a new GitHub repo.
3. Enable GitHub Pages for a live preview link Heather can review on any
   device — mirrors the Weeds site's pre-launch review step.
4. Once Heather approves content and confirms she controls the
   `wildharemoon.com` registrar/DNS, connect Netlify + the custom domain as
   a separate, explicitly-approved step (not automatic — domain/DNS changes
   are outward-facing and hard to reverse).

## Out of scope (this version)

- E-commerce / cart / checkout.
- Class booking calendar or scheduling system.
- Mailing list signup.
- Blog.
- Etsy integration beyond a manual link once she has a shop.
