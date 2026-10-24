# SKA DOJO Website

A static, mobile-first website for SKA DOJO (Kyokushin Karate) built with plain HTML5, CSS3 and vanilla JavaScript. No build step, no frameworks.

## Run locally

Open `index.html` in a browser, or serve the folder (recommended):

```bash
cd ska-dojo
python3 -m http.server 8000
# visit http://localhost:8000
```

## Folder structure

```
ska-dojo/
  index.html          Homepage (all 14 sections)
  privacy.html        Privacy Policy TEMPLATE (needs real legal text)
  terms.html          Terms & Conditions TEMPLATE (needs real legal text)
  robots.txt          Update the domain before launch
  sitemap.xml         Update the domain before launch
  css/styles.css      Design system and styles (CSS variables at the top)
  js/config.js        ALL editable content lives here
  js/script.js        Behaviour (nav, carousel, FAQ, form, rendering)
  assets/
    favicon.svg
    images/           Put photos here (see assets/images/README.txt)
```

## Editing content (`js/config.js`)

Edit the `SKA_CONFIG` object:

| What | Where |
| --- | --- |
| Phone, WhatsApp, email | `contact` |
| Social links (blank = hidden) | `social` |
| Hero slide 2 event | `featuredEvent` |
| Branches / addresses / timings / directions | `branches` |
| Programs, levels, instructors, schedules, plan links | `programs` |
| Instructor names, Dan ranks, titles, bios | `instructors` |
| Testimonials | `testimonials` |
| Events | `events` (empty array shows an "announced soon" card) |
| FAQ answers | `faqs` |
| Membership prices | put in `faqs` / link a pricing page via each program's `planUrl` |

Items with `placeholder: true` show a visible "Placeholder" badge. Set it to `false` (or delete it) once the details are verified. Text in `[square brackets]` is unconfirmed and must be replaced. Static copy in `index.html` (headings, values, "Why Choose" cards) can be edited directly. Also replace the `example.com` canonical/Open Graph URLs and the page `<title>`/description with the real city or area for local SEO.

## Replacing images

Drop your photos into `assets/images/` using the file names in `assets/images/README.txt`. Until a file exists, a dark placeholder frame with a label is shown. Program, instructor and event images are set per item in `config.js`. Use real SKA DOJO photos, or properly licensed images clearly treated as temporary, and never present stock photos as SKA DOJO members. Compress images before upload.

## Trial form and WhatsApp

- **The form does not submit anywhere by default.** With `trialEndpoint` empty it only validates in the browser and tells the visitor that nothing was sent. No booking is ever claimed as confirmed.
- To accept real requests, set `trialEndpoint` to a backend or form service URL that accepts a JSON `POST` (fields: `name, ageGroup, guardian, phone, email, program, branch, session, message`). The form then shows loading, success and failure states.
- Before production add real spam protection (CAPTCHA/rate limiting, server-side validation). The hidden honeypot field is only a basic filter. Also finalise the privacy policy and consent handling for children's data.
- **WhatsApp:** set `contact.whatsapp` (digits with country code, e.g. `919800000000`). The "Enquire on WhatsApp" button stays hidden until then.

## What is NOT connected

- Booking/trial submission (needs a backend or form service)
- Payments and "Buy Plan": the button is disabled until a program has a `planUrl` (your pricing/enrolment page or payment provider link). No payment is simulated.
- "Explore All Events" stays hidden until `eventsPageUrl` is added to `config.js` (for example `eventsPageUrl: "events.html"`).

## Not yet implemented (single-page prototype)

The brief lists additional pages. Only these exist: Home, Privacy (template), Terms (template). Still to build if wanted: About Us, Programs, Program Details, Instructors, Events, Event Details, Membership/Pricing, Contact. Navigation links currently point to the matching homepage sections.

## Deploy

Upload the whole folder to any static host (Netlify, Vercel static, Cloudflare Pages, GitHub Pages, S3/CloudFront). Paths are relative, so it works from a root or subfolder. Before launch: update canonical/OG URLs, `robots.txt`, `sitemap.xml`, add `assets/images/og-image.jpg`, remove `noindex` from legal pages once final, and replace all placeholders.

## Pre-launch checklist

- [ ] Real photos, contact details, branches, schedules, programs
- [ ] Verified instructor names and Dan ranks
- [ ] Genuine approved testimonials (or hide the section)
- [ ] Real events (or leave the empty state)
- [ ] Confirm "free trial" wording applies
- [ ] Form endpoint + spam protection
- [ ] Final privacy and terms text
