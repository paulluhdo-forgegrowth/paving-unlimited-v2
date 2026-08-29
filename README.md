# Paving Unlimited — Single-Page Website

## What's included
- `index.html` — full single-page site: Header/Nav, Hero, Trust Bar, Featured Projects gallery + lightbox, Services, Why Choose Us, Process, Quote Form, Footer, sticky mobile call/WhatsApp bar. (The Testimonials section has been removed — see below.)
- `css/styles.css` — full design system (8px spacing scale, black/white/charcoal + controlled yellow accent, Montserrat + Inter type, the "measure line" signature divider)
- `js/main.js` — mobile drawer, scroll-reveal, gallery lightbox, tick-mark generation for the measure-line divider, and quote-form validation + **live submission** (vanilla JS, no dependencies, no framework)
- `functions/api/quote.js` — a real Cloudflare Pages Function that receives the quote form and sends it as an email via Resend. See **Form & deployment** below — this needs three environment variables set before it will actually send.
- `.env.example` — documents the three environment variables the function needs (not real secrets — set the real values in the Cloudflare Pages dashboard).
- `assets/` — the full approved production brand system, the Open Graph share image, and `assets/photos/` — real client project photography (see below)
- The **hero image and all 11 Featured Projects gallery photos are genuine, unretouched Paving Unlimited project photography** — not stock, not AI-generated. Three of the six Services cards (**Driveways**, **Estate Roads**, **Curbing**) now also use real photos. The remaining three Services cards (Patios, Pool Areas, Repairs & Maintenance) still use Unsplash stock as illustrative placeholders (flagged in code comments and alt text), since no matching real photo for those specific service types has been supplied yet.

## Real project photography
The hero and gallery now use 7 of the client's own completed-project photographs, selected and ordered to tell a deliberate story (residential → estate → commercial → residential → architectural detail → premium finish → craftsmanship close-up), per the brief. Processing applied to each was limited to real, conservative corrections — no content was invented, removed, or replaced:
- Mild auto white balance (gray-world method, blended at 40-55% strength so it corrects colour casts without shifting the actual paving colour)
- Mild auto-levels/contrast and a small saturation lift
- Light unsharp-mask sharpening
- Composition cropping only (e.g. trimming excess flat sky from the hero shot to get a usable landscape ratio; a tighter crop of the herringbone pattern for the "craftsmanship detail" close-up) — no objects, people, or background elements were removed from within the kept frame
- Each photo exported at two sizes (`*.jpg` ~1600px for full view/lightbox, `*-small.jpg` ~800px for the mobile `srcset` variant) and compressed for web

**Source → final file mapping**, for your records:
| Original file | Used as | Final file |
|---|---|---|
| `PU_8.JPG` | Hero + gallery #1 — Residential Driveway | `pu-grey-driveway-hero.jpg` |
| `PU_9.JPG` | Gallery #2 — Luxury Estate Entrance | `pu-charcoal-courtyard.jpg` |
| `PU_4.JPG` | Gallery #3 — Commercial Courtyard | `pu-commercial-courtyard.jpg` |
| `PU_6.JPG` | Gallery #4 — Private Residence | `pu-red-brick-driveway.jpg` |
| `PU_2.JPG` | Gallery #5 — Architectural Paving | `pu-herringbone-entrance.jpg` |
| `PU_7.JPG` | Gallery #6 — Premium Cobble Finish | `pu-grey-cobble-driveway.jpg` |
| `PU_3.JPG` | Gallery #7 — Attention to Detail | `pu-craftsmanship-detail.jpg` |

`PU_4__1_.JPG` was an exact duplicate of `PU_4.JPG` and wasn't used a second time, to avoid showing the same photo twice.

**Second batch added** (from a follow-up upload of 9 more originals — `IMG_2452.jpg`, `Isandovale_1.jpg`, `2_colour_bevels_3.jpg`, `DSC01580.JPG`, `DSC01665.JPG`/`DSC01665_1.JPG`, `IMG_2012.JPG`/`IMG_2013.JPG`, `IMG_2439.jpg`): 4 of the 9 were used, chosen either because they cleanly matched a still-stock Services card or added genuine variety not yet in the gallery. The rest were skipped as redundant with what these 4 already cover (near-duplicate frames of the same shot or the same project from a slightly different angle), not because anything was wrong with them.

| Original file | Used as | Final file |
|---|---|---|
| `DSC01580.JPG` | Services — **Driveways** card photo | `pu-charcoal-curved-driveway.jpg` |
| `IMG_2452.jpg` | Services — **Estate Roads** card photo | `pu-commercial-estate-road.jpg` |
| `IMG_2012.JPG` | Gallery #8 — Institutional Access Path | `pu-airfield-access-path.jpg` |
| `2_colour_bevels_3.jpg` | Gallery #9 — Decorative Two-Tone Finish | `pu-two-tone-bevel-detail.jpg` |

The gallery is now 9 photos rather than 7 — the two additions extend the original story with an institutional/aviation project and a decorative pattern detail, both distinct from anything already shown, rather than replacing any of the original curated 7.

**Third batch added** (`Isandovale_2.jpg`, `Isandovale_3.jpg`, `Isandovale_4.jpg` — `Isandovale_1.jpg` was skipped again, it's the same photo as one already considered redundant in the second batch):

| Original file | Used as | Final file |
|---|---|---|
| `Isandovale_4.jpg` | Services — **Curbing** card photo | `pu-curbing-edge-detail.jpg` |
| `Isandovale_2.jpg` | Gallery #10 — Commercial Development | `pu-commercial-development-progress.jpg` |
| `Isandovale_3.jpg` | Gallery #11 — Warehouse Access Walkway | `pu-terracotta-herringbone-walkway.jpg` |

The gallery is now 11 photos. Curbing was chosen for `Isandovale_4.jpg` because the grey curb/edge restraint blocks are genuinely visible bordering the paving in that shot — the same rule as always: a real photo is only used for a service card if it actually shows that service.

**Still stock, still no matching real photo supplied:** Patios, Pool Areas, and Repairs & Maintenance service cards. Driveways, Estate Roads, and Curbing are now all real photography.

## Brand identity — production assets
**Logo fix (this deployment):** `paving-unlimited-logo-dark.svg`/`.png` and the `-light` versions were replaced. The versions previously in this package had two real bugs: the paver-block icon was being clipped by the SVG's own viewBox (its bottom edge fell outside the canvas, which is why it rendered as a tiny cut-off sliver in the header/footer), and the wordmark had regressed to live `<text>` in a generic Arial/Helvetica fallback instead of the vector-outlined type. Both are fixed — verified by rendering at the actual deployed sizes (54px header, 48px footer) before shipping, not just checked at full size. The standalone icon files (`paving-unlimited-mark*.svg`) were unaffected and untouched.

The logo has been rebuilt as true vector artwork from your approved concept (geometric "P" + a 7-block perspective paving grid, one block in yellow), not cropped from the presentation image. Colours were sampled directly from your reference: black `#131414`, charcoal `#4E4F50`/`#3A3A3C`, yellow `#F1B507` — a flat, controlled accent, not gold or metallic.

**Files in `assets/`:**
| File | Purpose |
|---|---|
| `paving-unlimited-mark.svg` / `.png` | Icon alone, full brand colour, transparent background |
| `paving-unlimited-mark-white.svg` / `.png` | Icon alone, solid white — for dark or coloured backgrounds |
| `paving-unlimited-mark-black.svg` / `.png` | Icon alone, solid black — for single-colour print/engraving |
| `paving-unlimited-logo-dark.svg` / `.png` | Full horizontal lockup, dark text — **used in the site header** (light background) |
| `paving-unlimited-logo-light.svg` / `.png` | Full horizontal lockup, white text — **used in the site footer** (dark background) |
| `favicon.svg` | Vector favicon: rounded near-black tile, white P, charcoal blocks, yellow accent |
| `favicon.ico` | Real multi-resolution ICO (16/32/48/64px) |
| `favicon-16x16.png`, `favicon-32x32.png` | Browser tab icons |
| `apple-touch-icon.png` (180×180) | iOS home-screen icon |
| `android-chrome-192x192.png`, `android-chrome-512x512.png` | Android/PWA icons |
| `paving-unlimited-og.jpg` (1200×630) | Social share image, referenced in Open Graph/Twitter meta tags and JSON-LD |
| `photos/*.jpg`, `photos/*-small.jpg` | Real project photography, used in the hero and gallery (see above) |

**Notes for anyone taking this to a signwriter, embroiderer, or print shop:**
- Use `paving-unlimited-mark-black.svg` (or `-white.svg`) for single-colour vinyl, embroidery, or engraving — vinyl/thread can't reproduce the full-colour version's yellow accent block unless it's a genuine multi-colour process.
- The SVG wordmark text ("PAVING", "UNLIMITED", the tagline) is drawn as actual vector outlines, not live text — so these files are font-independent and will look identical on any machine, with no font substitution risk.
- Confirm the exact yellow Pantone/CMYK match before ordering physical signage or a vehicle wrap — the hex values above are screen colour only and can shift in print.
- Minimum recommended size: don't reproduce the full icon (P + all 7 blocks) smaller than about 32px / 8mm, or the block grid detail starts to lose definition — the 16×16 favicon already pushes this limit, which is normal for a detailed mark at that size.

## Removed for this deployment pass, later partially restored
- **Testimonials section** — previously removed entirely (three illustrative/placeholder quotes deleted along with the nav link), then **restored** with one genuine, verbatim client review (Andrew Albarn) once a real testimonial was supplied. The section now uses a single-card layout rather than the old 3-column grid, since a 3-column grid with one real card and two empty slots would look unfinished. Add more genuine reviews the same way as they come in — the CSS (`.testimonial-card--single`) currently assumes one card; ask for a multi-card layout once you have 3+.
- **Footer map placeholder** — the empty "Map — pending confirmed address" panel is gone. Add a real Google Maps embed once the address is confirmed.
- **Footer physical address and business hours** — removed from the Contact footer column; it only lists phone and email now, which are both confirmed and correct.
- **Footer "Operating Areas" column** — removed entirely (not just the one line that was tagged). All four listed areas were an assumption, not confirmed coverage, so the whole column is gone rather than shipping three "confirmed-sounding" lines next to one visibly flagged one.

## Still on the site, still placeholder
1. **Remaining Services section photography** — the Patios and Pool Areas cards still use Unsplash stock as illustrative placeholders (flagged in code comments and alt text). Driveways, Estate Roads, Curbing, and Repairs & Maintenance now use real photography, and the hero and gallery are real — see above.
2. **Facebook link** — placeholder `#` anchor in the footer; add the real profile URL or remove if inactive (per FC-011, never link an inactive profile).
3. **Repairs & Maintenance photo** — two new candidate photos were supplied but not used: one had a visible Alamy watermark, and the other shared identical suspicious thumbnail dimensions/style with it, strongly suggesting both are unlicensed stock preview images rather than real client photos. The existing genuine repairs photo was left in place. Send the real/licensed originals if you'd like this swapped.

Contact details (phone, WhatsApp, email, contact name) are already final and confirmed throughout the site and in the JSON-LD schema — no placeholder tags remain on these.

## Form & deployment — this is now a live, working submission path

The quote form (`#quoteForm`) validates full name, phone, email, area and project type **both** client-side (`js/main.js`, for instant feedback) and server-side (`functions/api/quote.js`, since client JS can always be bypassed). It includes a honeypot field (`companyWebsite`) checked on both sides too.

On submit, the browser POSTs the form (including any uploaded photos) as `multipart/form-data` to `/api/quote`. That's a **Cloudflare Pages Function** — it runs automatically once this whole folder (with `functions/` at the root, alongside `index.html`) is deployed to Cloudflare Pages. No separate backend, server, or build step is needed.

The function sends the enquiry as an email using **Resend** (https://resend.com). To make it actually send mail, three things need to happen:

1. **Verify a sending domain in Resend.** Go to Resend → Domains → Add Domain, add `pavingunlimited.co.za` (or whichever domain the business owns), and add the DNS records Resend gives you. This step is why the "from" address can't just be `pavingunlimited@gmail.com` — Resend (like all transactional email providers) requires you to prove you control the domain you're sending *from*, and won't let you send "from" a Gmail address. The "**to**" address (where the enquiry lands) can absolutely still be a Gmail inbox.
2. **Get a Resend API key.** Resend → API Keys → Create API Key.
3. **Set three environment variables in the Cloudflare Pages dashboard** (Pages project → Settings → Environment variables, set for both Production and Preview):
   - `RESEND_API_KEY` — the key from step 2
   - `RESEND_FROM` — e.g. `"Paving Unlimited <quotes@pavingunlimited.co.za>"`, using the domain verified in step 1
   - `RESEND_TO` — where quote requests should land, e.g. `pavingunlimited@gmail.com` (comma-separate multiple addresses if needed)

`.env.example` at the project root documents these three variables for reference — it's not read automatically by anything; it's just a template so nobody has to guess the variable names.

**Until those three variables are set**, the function will return a clear "the quote form isn't fully configured yet" error rather than silently failing or pretending to succeed — the person submitting the form is told to call or WhatsApp instead, and nothing is lost.

**What the function does, briefly:**
- Validates required fields and email/phone format server-side (mirrors the client-side rules, but can't be bypassed)
- Checks the honeypot field and silently fake-succeeds for bots without sending an email
- Converts any uploaded images to attachments (caps: 4MB per file, 8MB total, to stay well under Resend's per-email limit — oversized files are simply skipped, with a note added to the email body listing which ones)
- Sends one email per submission via the Resend API, with `reply_to` set to the enquirer's own email so replying goes straight back to them
- Returns a JSON `{success: true}` or `{success: false, error: "..."}`, which `js/main.js` uses to show the existing green success message or a new red error message (`.form-error`) with a call/WhatsApp fallback suggestion

**Testing it after deployment:** submit the form once with real (but harmless) test data and confirm the email arrives at the `RESEND_TO` address. Resend's dashboard (Logs tab) also shows every send attempt and any errors, which is the fastest way to debug a misconfigured domain or key.

## Design decisions worth knowing about
- **Signature element**: the yellow "measure line" divider beneath the hero, generated by `js/main.js`, is meant to evoke a surveyor's ruled measuring line — a nod to the precision of laying paving. It's the one recurring motif reused sparingly rather than a generic gradient or icon.
- **Consistent colour grade**: a single, subtle CSS filter (`saturate(0.92) contrast(1.05) brightness(0.99)`) is applied only to the remaining Services-section stock photography, so those placeholders read as one cohesive set. It's deliberately *not* applied to the hero or gallery — those are real, individually colour-corrected project photos, and layering a second generic filter on top risked exactly the "looks artificial" problem the client explicitly asked to avoid.
- **"Able to Start Soon"** in the contact reassurance row is deliberately qualified with "(material availability dependent)" rather than promised outright, since paving material lead times are outside the business's control and an unqualified promise could be a claim they can't keep.
- **Numbered process steps** are used deliberately in the Our Process section because the five steps are a genuine, ordered sequence the client follows on every project — not decoration.
- **No carousels, no video backgrounds, no autoplay** anywhere, per the brief.
- Buttons, cards and section spacing follow an 8px scale (8/16/24/32/40/48/64/80/120) for consistency.

## Performance & accessibility notes
- Single `<h1>`, semantic landmarks (`header`, `nav`, `main`, `section`, `footer`), a skip link, and visible focus states are in place.
- All interactive elements (nav, gallery, lightbox, form) are keyboard operable; the lightbox traps focus on its close button when opened.
- `prefers-reduced-motion` is respected globally.
- No JavaScript framework and no animation library — CSS transitions only, kept short and purposeful.
- The hero and gallery now use real, web-optimised photography (JPEG, responsive `srcset`, capped at 1600px/800px). The 3 remaining Services-section stock images (Patios, Pool Areas, Repairs & Maintenance) still need the same optimisation pass once real photos replace them.

## Content questions for the client
1. Confirm the physical address (if one should be publicly displayed) and business hours — these were removed from the footer rather than shown unconfirmed, so nothing is live until you confirm them.
2. Confirm the operating areas/suburbs to list in the footer, if you'd like that section back — it was removed rather than shown with an assumption.
3. Provide real project photography for the 3 remaining Services cards (Patios, Pool Areas, Repairs & Maintenance still use stock), plus a real photo to eventually replace the Open Graph share image's background.
4. Provide 3+ genuine, approved client testimonials, with permission to use first names and suburb — the Testimonials section was removed entirely and needs to be rebuilt once you have real quotes.
5. Confirm whether a Facebook page is active; if so, provide the URL for the footer link.
6. Complete the three Resend/Cloudflare setup steps above (domain verification, API key, environment variables) so the quote form actually sends email.
7. Confirm the exact legal business name and any registration/founding details for the schema markup.
8. Confirm whether a Google Maps pin/embed can be added, and the exact address to use, once the address itself is confirmed.
9. Confirm any project photography usage rights (can client names/suburbs be shown alongside images?).
10. Confirm exact yellow Pantone/CMYK values before ordering any physical signage, uniforms, or vehicle decals using the logo.

## Next phases
- **Phase 2**: none required — this is a single-page brief, so all sections are included in Phase 1.
- **Phase 3**: form integration is now code-complete (Cloudflare Pages Function + Resend) — only the three environment variables and Resend domain verification remain, both of which require the client's own Resend account and DNS access. Final contact details are already in; final photography for 3 service cards, testimonials, address/hours/areas, and SEO schema refinement (legal business name) are the remaining content gaps.
