# Classes Schedule & Contact List — Design

## Background

Heather needs two live, Heather-editable data sources on the site, following
the exact pattern established on [[project_weeds_website]]: a public Google
Sheet, fetched client-side via the gviz JSON endpoint, with no redeploy
needed when the sheet changes.

1. A live "upcoming classes" schedule, replacing the current static
   placeholder cards in the Classes section — same mechanism as Weeds'
   Shows section.
2. A contact list signup form, similar to Weeds' mailing list, backed by a
   Google Apps Script web app that appends submissions to the sheet.

**Sheet:** "Hare Moon" — already created by Chris under
`christopher.beem@gmail.com` (same account used for the Weeds gig sheet,
since Workspace policy on chris@meridianrise.org blocks Apps Script
deployment), link-shared as viewable, confirmed reachable via the gviz
endpoint. Two tabs already created: `Classes` and `Contact List`.

## Classes tab

Columns (row 1 headers): `Class | Date | Location | Notes | Signup Link`

- `Signup Link` is optional per row (blank, or a `mailto:`/`http(s)://`
  link) — mirrors Weeds' `Ticket Link` column and its `hasTicketLink` guard,
  so a sheet edit can't inject an arbitrary URL scheme.
- Only upcoming classes are shown, soonest first. No "past classes" list —
  out of scope, not requested; can be added later following the same
  pattern as Weeds' Previous Engagements if wanted.
- Empty sheet / no valid upcoming rows → friendly empty state, matching
  existing site copy tone: "No classes currently scheduled — check back
  soon."
- A row only renders if it has both a valid `Date` and non-empty `Class`
  name (mirrors Weeds' Date+Venue-both-required rule).

## Contact List tab

Columns (row 1 headers): `Name | Email | Phone | Signed Up`

- Form fields: Name (required), Email (required), Phone (optional).
- `Signed Up` is a server-set timestamp, not a form field.
- Submission is deduplicated by email (case-insensitive) — a resubmission
  with the same email does not create a second row (matches Weeds'
  dedup-by-email behavior; existing rows are not backfilled from a later
  resubmission).
- Backed by a Google Apps Script `doPost` bound to the sheet, deployed as a
  web app under `christopher.beem@gmail.com`. Submission happens via
  `fetch` (not a full-page POST) so the visitor stays on the page, with a
  status message area matching the Weeds mailing-list pattern
  ("Signing up…" → "Thanks — you're on the list." / error state).
- A honeypot field (hidden, `bot-field`) is included in the form for
  spam mitigation, matching the Weeds form.

## Site changes

- `site/assets/js/classes.js` — pure, testable module (parseGvizDate,
  parseGvizResponse, upcomingClasses, hasSignupLink), adapted from Weeds'
  `shows.js`.
- `site/assets/js/site.js` — fetches the `Classes` tab on load and renders
  into the existing Classes section (replacing the two static placeholder
  cards); handles the Contact List form submission via `fetch`.
- `site/index.html` — Classes section gets an empty container populated by
  JS instead of the two hardcoded example cards; a small contact-list form
  (Name / Email / Phone) is added near the existing Contact/Follow section.
- `SHEET_ID` for the "Hare Moon" sheet and the Apps Script `/exec` URL are
  both hardcoded constants in `site.js`, same as Weeds' `SHEET_ID` /
  `mlForm.action`.

## Out of scope

- Past-classes list.
- Editing/removing contact-list signups from the site (Heather manages the
  sheet directly for that, same as Weeds).
- Any admin UI — Heather edits the Google Sheet directly to manage classes
  and reviews the Contact List tab directly for signups.
