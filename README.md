# Ironclad Steel — WordPress Site

Marketing / lead-gen WordPress site for a steel building company, modeled
after buildsupreme.com. Custom theme (`wp-content/themes/ironclad-steel`) —
no page builder, no premium theme license, styled with Tailwind CSS.

## Running it locally (XAMPP)

This project runs on a local **XAMPP** install (Apache + PHP + MariaDB) —
no Docker required. This repo (`wp-content/`) is linked into XAMPP's
`htdocs` via a Windows directory junction, so editing files here is
editing the live site directly; there's nothing to sync or redeploy
between the two locations.

Already set up on this machine:
- WordPress core lives at `C:\xampp\htdocs\ironclad-steel\`
- `C:\xampp\htdocs\ironclad-steel\wp-content` is a directory junction
  pointing at this repo's `wp-content/` folder
- Database: MariaDB on **port 3307** (XAMPP's bundled MySQL, kept on a
  non-default port to avoid clashing with any other MySQL server already
  running on this machine), database name `ironclad_steel`
- Site URL: **http://localhost/ironclad-steel/**

To start it after a reboot, open the **XAMPP Control Panel**
(`C:\xampp\xampp-control.exe`) and click **Start** next to Apache and
MySQL. Then visit http://localhost/ironclad-steel/.

Setting this up on a *different* machine (e.g. a teammate's laptop, or
this same theme deployed on someone else's local XAMPP):
1. Install XAMPP, download WordPress core into `htdocs/your-folder-name`.
2. Point `htdocs/your-folder-name/wp-content` at this repo's `wp-content/`
   folder — either a directory junction (`mklink /J`, no admin rights
   needed on Windows) or just copy it in.
3. Create a database and matching `wp-config.php` (see
   `wp-config-sample.php` in WordPress core for the constants to set).
4. Visit the site, finish the install wizard (site title, admin user),
   then go to **Appearance → Themes** and activate **Ironclad Steel**.
   Activating the theme automatically seeds demo content (6 products, 4
   testimonials, 6 FAQs, and the Financing/FAQs/About/Contact/Terms/
   Privacy pages) so the site is immediately viewable instead of blank.

**Local email**: XAMPP doesn't send real email out of the box, so
`wp_mail()` calls (like the quote form's notification email) won't
actually deliver locally — that's expected. Every quote submission is
still saved as a **Quote Request** post regardless (see below), so no
lead is ever lost to this. See "Quote form → email delivery" for what
production needs.

## Editing content (no code required)

| What | Where in wp-admin |
|---|---|
| Business name, phone, email, hours, address, warranty years, states served, social links | **Appearance → Customize → Business Info** |
| Brand colors | **Appearance → Customize → Brand Colors** (live preview, no rebuild needed) |
| "Why Choose Us" 4 items | **Appearance → Customize → Why Choose Us** |
| Purchase options (Financing/Outright/Rent-to-Own) text | **Appearance → Customize → Purchase Options** |
| Products (Garages, Barns, etc.) — description, features, sizes/prices, images | **Products** in the left admin menu |
| Testimonials | **Testimonials** in the left admin menu |
| FAQs | **FAQs** in the left admin menu |
| Financing / FAQs / About / Contact / Terms / Privacy page copy | **Pages** in the left admin menu (edit the matching page) |
| Incoming quote requests (leads) | **Quote Requests** in the left admin menu — every form submission lands here even if the email fails to send |

Editing a **Product**: the "Product Details" box below the content editor
holds Features (one per line) and Popular Sizes (one per line, format
`Name | Size | Starting Price`). The featured image becomes that product's
hero banner; the "Card image URL" field (optional) overrides the thumbnail
used in grids if you want a different crop than the featured image.

## Replacing placeholder images

All images currently in `wp-content/themes/ironclad-steel/assets/images/`
are placeholder SVGs clearly labeled with what they represent. For real
photos, the cleanest path is to upload them through **Media** in wp-admin
and set them as each Product/Testimonial's Featured Image — no code or
file replacement needed. The homepage hero background
(`assets/images/hero/hero-placeholder.svg`) is the one image still
referenced directly from the theme; replace that file (keep the same
filename, or update the path in `front-page.php`) to swap it.

## Quote form → email delivery

The form on the Contact page posts to a small custom handler
(`inc/quote-form.php`) — no third-party form plugin. Every submission is:

1. Saved as a **Quote Request** post (so a lead is never lost).
2. Emailed via `wp_mail()` to the address set in Customize → Business Info.

**Locally (XAMPP)**, `wp_mail()` won't actually send — XAMPP has no mail
server configured out of the box. This is expected and harmless: the lead
is still saved under **Quote Requests** every time, so nothing is lost,
you just won't see a real email land anywhere while developing locally.

**In production**, `wp_mail()` reliability depends entirely on the host's
mail setup, and most hosts don't reliably deliver plain PHP mail. Before
launch, install a free SMTP plugin — **WP Mail SMTP** is the standard
choice — and connect it to a real transactional email provider (e.g. your
hosting company's SMTP, Gmail/Workspace SMTP, or a service like Brevo/
SendGrid's free tier). Leads will still be visible under **Quote Requests**
even if email delivery is ever misconfigured.

## Editing the design (Tailwind CSS)

The compiled stylesheet is `assets/css/main.css` — don't hand-edit it. Its
source is `assets/css/src/input.css`, with Tailwind classes written
directly in the theme's `.php` template files. To change styles:

```bash
cd wp-content/themes/ironclad-steel
npm install        # first time only
npm run watch:css   # recompiles main.css automatically while you edit
```

Run `npm run build:css` once before deploying to produce the final
minified stylesheet.

## Homepage hero background animation

The homepage hero has an animated WebGL "nebula" shader behind the text
(`assets/js/shader-hero.js`), tinted blue to match the brand rather than
its original orange palette (see the `mix-blend-luminosity` canvas + the
strengthened gradient overlay in `front-page.php`). It's plain
Canvas/WebGL2 — no React or build step involved — and degrades gracefully:
if a browser doesn't support WebGL2, or the user has "reduce motion"
enabled at the OS level, the canvas simply stays hidden and the static
`hero-placeholder.svg` + blue overlay show instead (the same look the
hero had before this effect was added). To remove the effect entirely,
delete the `<canvas id="ironclad-hero-shader">` element from
`front-page.php` and drop the `wp_enqueue_script` call for
`ironclad-hero-shader` in `functions.php`.

## Homepage motion design (scroll reveals, counters, parallax)

`assets/js/motion.js` adds restrained, "premium but professional" motion —
no custom cursor, no 3D/WebGL set pieces, no glassmorphism overload, per
direction to keep this feeling trustworthy rather than like a creative
agency showcase. It's CDN-loaded (GSAP + ScrollTrigger + Lenis smooth
scroll, no bundler) and currently scoped to the homepage only:

- **Hero**: eyebrow/heading/subtitle/buttons fade up in sequence on load,
  a subtle (~10px) mouse parallax on the hero content, and a bouncing
  scroll indicator that fades as you scroll past the hero.
- **Trust badges**: BBB rating, completed-projects counter, and Google
  rating cards under the hero CTAs (editable under **Appearance →
  Customize → Trust Badges (hero)** — placeholder numbers by default,
  see `inc/customizer.php`). These animate in as part of the same hero
  entrance sequence.
- **Stat counters**: the "4,200+ Buildings Delivered" style numbers count
  up from 0 when scrolled into view. The real number is always in the
  server-rendered HTML (`data-counter="4200"`) — JS only resets to 0 and
  re-counts at the moment it enters the viewport, so nothing breaks if
  the script fails to load.
- **Card reveals**: Top Picks, Our Products, and Why Choose Us cards fade
  up with a stagger via `ScrollTrigger.batch`. Any element with
  `class="js-reveal-card" data-reveal-group="some-name"` gets this for
  free; group cards that should stagger together under the same group name.
- **Section headings**: `ironclad_section_heading()` (in
  `inc/template-tags.php`) has `data-reveal` on its wrapper, so every
  section heading across the site fades in on scroll automatically —
  though the script itself only loads on the homepage for now (see below).

Respects `prefers-reduced-motion` (bails out entirely, leaving all
content in its normal, immediately-visible state) and fails safe if the
CDN scripts don't load for any reason.

**Not yet extended to inner pages** (`/products/[slug]/`, `/contact/`,
etc.) — those still use plain CSS transitions only. The `data-reveal` /
`.js-reveal-card` conventions are already in place on those templates'
shared partials, so extending motion.js's `wp_enqueue_script` calls
beyond `is_front_page()` in `functions.php` is the main remaining step
when ready to roll this out site-wide.

## What's out of scope for v1

- **3D building configurator** — buildsupreme.com links out to a
  third-party tool (sensei3d.com) for this; the homepage has a "Coming
  Soon" placeholder section instead. Building one in-house is a
  substantial separate project.
- **Blog** — the theme supports posts (`index.php`) but no blog page/menu
  link is wired up yet; add one under Pages/Settings → Reading if wanted.
- **Online payments ("Pay Now")** — requires a payment processor.
- **Terms & Privacy Policy** — placeholder legal text. Replace with real,
  attorney-reviewed policies before going live.

## Deploying to real hosting

1. Point your hosting's WordPress install at this same
   `wp-content/themes/ironclad-steel` theme (upload via SFTP or your
   host's file manager, or zip the theme folder and upload it under
   **Appearance → Themes → Add New → Upload Theme**).
2. Activate the theme — this seeds the same demo content as local, ready
   to edit through wp-admin.
3. Set up a real SMTP plugin as described above so quote emails deliver.
4. Run `npm run build:css` in the theme folder before uploading it, so
   `main.css` reflects any style changes you made.

## Project structure

```
wp-content/
  mu-plugins/               (empty — add site-wide must-use plugins here if needed)
  themes/ironclad-steel/
    functions.php            Theme bootstrap — loads everything under inc/
    inc/
      cpt-product.php        Products custom post type + meta box
      cpt-testimonial.php    Testimonials custom post type
      cpt-faq.php             FAQs custom post type
      cpt-quote-request.php  Leads inbox custom post type
      customizer.php         Appearance > Customize settings (brand info/colors)
      quote-form.php         Quote form submission handler
      demo-content.php       One-time seeder run on theme activation
      template-tags.php      Shared template partials (section heading, CTA banner, product card)
    front-page.php           Homepage
    single-product.php       Product category page template (all 6 categories)
    page-{financing,faqs,about,contact,terms,privacy}.php   Matching Pages' templates
    assets/                  Images, compiled CSS, JS
```
