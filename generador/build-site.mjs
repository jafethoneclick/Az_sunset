// Genera el sitio estático (HTML/CSS/JS/PHP) a partir del contenido del
// tema WordPress ironclad-steel, con una carpeta por página.
import { mkdirSync, writeFileSync, cpSync } from "node:fs";
import { join, dirname } from "node:path";

const OUT = "C:/Users/Jafeth/Desktop/html_diseño/sitio-html";
const THEME = "C:/Users/Jafeth/Desktop/html_diseño/wp-content/themes/ironclad-steel";

// ---------------------------------------------------------------- datos
const site = {
  name: "AZ Sunset Steel Structures & Carports",
  shortName: "AZ Sunset",
  tagline: "Giving Life to Your Projects",
  shortTagline: "Custom-built steel structures, delivered and installed",
  phone: "(800) 555-0142",
  phoneHref: "+18005550142",
  email: "quotes@azsunsetsteel.example",
  address1: "123 Industrial Pkwy",
  city: "Dallas",
  state: "TX",
  zip: "75201",
  hoursWeekday: "8:00 AM – 8:00 PM",
  hoursSaturday: "9:00 AM – 5:00 PM",
  hoursSunday: "Closed",
  states: ["TX", "OK", "LA", "AR", "NM", "MS", "AL", "GA", "TN", "MO"],
  warrantyYears: "20",
  completedCount: 4200,
  bbbRating: "5.0",
  bbbReviews: "239",
  googleRating: "4.9",
  googleReviews: "418",
  facebook: "https://facebook.com/",
  instagram: "https://instagram.com/",
  linkedin: "https://linkedin.com/",
};

const products = [
  {
    slug: "garages",
    title: "Metal Garages",
    excerpt: "Protect your vehicles and equipment with a rugged steel garage.",
    content:
      "Our metal garages are built to protect cars, trucks and work equipment from the weather year-round. Fully customizable in size, height, doors and windows.",
    features: [
      "12 or 14 gauge steel framing",
      "Roll-up or traditional garage doors",
      "Certified wind and snow load reinforcement",
      "Widths from 12' to 50'",
    ],
    models: [
      { name: "Standard Garage", size: "20' x 20'", price: "starting at $6,995" },
      { name: "Double Garage", size: "24' x 30'", price: "starting at $9,995" },
      { name: "Extra-Large Garage", size: "30' x 40'", price: "starting at $15,995" },
    ],
  },
  {
    slug: "barns",
    title: "Barns",
    excerpt: "Rugged space for agricultural storage, livestock or a workshop.",
    content:
      "Steel barns are ideal for agricultural storage, stables, or large workshops. They combine structural strength with wide, column-free interior space.",
    features: [
      "Gambrel or A-frame roof styles",
      "Wide column-free spans",
      "Great for farm equipment and livestock",
      "Widths from 30' to 60'",
    ],
    models: [
      { name: "Classic Barn", size: "30' x 40'", price: "starting at $12,995" },
      { name: "Livestock Barn", size: "36' x 50'", price: "starting at $18,995" },
    ],
  },
  {
    slug: "carports",
    title: "Carports",
    excerpt: "Open or enclosed coverage, fast to install and budget-friendly.",
    content:
      "Carports are the most affordable way to protect vehicles, boats or equipment. Available fully open, with partial walls, or fully enclosed.",
    features: [
      "Fast installation (days, not weeks)",
      "Open, partially enclosed or fully enclosed",
      "Boxed-eave, A-frame or regular roof styles",
      "Widths from 12' to 30'",
    ],
    models: [
      { name: "Single Carport", size: "12' x 20'", price: "starting at $2,995" },
      { name: "Double Carport", size: "20' x 20'", price: "starting at $4,495" },
    ],
  },
  {
    slug: "rv-covers",
    title: "RV Covers",
    excerpt: "Custom-fit protection for your RV, motorhome or boat.",
    content:
      "Built with the extra height and depth RVs, campers and large boats need, our RV covers protect your investment from sun, hail and rain.",
    features: [
      "Heights up to 16'",
      "Optional partial walls",
      "Extra reinforcement for high winds",
      "Lengths up to 50'",
    ],
    models: [
      { name: "Standard RV Cover", size: "14' x 40'", price: "starting at $7,495" },
      { name: "Tall RV Cover", size: "16' x 45'", price: "starting at $9,995" },
    ],
  },
  {
    slug: "combo-units",
    title: "Combo Units",
    excerpt: "An enclosed garage and storage or living space in one structure.",
    content:
      "Combo units pair an enclosed garage with extra storage, a workshop, or even a livable space (barndominium), making the most of every square foot.",
    features: [
      "Customizable interior partitions",
      "Great for workshop + storage combos",
      "Insulation and barndominium-ready",
      "Widths from 20' to 60'",
    ],
    models: [
      { name: "Basic Combo", size: "20' x 40'", price: "starting at $13,995" },
      { name: "Barndominium Combo", size: "40' x 60'", price: "starting at $34,995" },
    ],
  },
  {
    slug: "commercial",
    title: "Commercial Buildings",
    excerpt: "Large-scale steel structures for business, industry and agriculture.",
    content:
      "We design commercial and industrial steel buildings for warehouses, manufacturing plants, distribution centers and more, engineered to meet local building codes.",
    features: [
      "State-certified engineering",
      "Large column-free clear spans",
      "Optional built-in office space",
      "Widths from 40' to 100'+",
    ],
    models: [
      { name: "Commercial Warehouse", size: "60' x 100'", price: "custom quote" },
      { name: "Industrial Plant", size: "80' x 150'", price: "custom quote" },
    ],
  },
];

products.push(
  {
    slug: "utility-units",
    title: "Utility Units",
    excerpt: "Enclosed steel storage for tools, equipment and everything in between.",
    content:
      "Utility units are fully enclosed steel storage buildings — perfect for tools, lawn equipment, ATVs and workshop overflow. Compact footprints and lockable doors keep everything secure and dry year-round.",
    features: [
      "Fully enclosed and lockable",
      "Walk-in or roll-up door options",
      "Weather-tight steel panels",
      "Widths from 12' to 24'",
    ],
    models: [
      { name: "Standard Utility Unit", size: "12' x 20'", price: "starting at $4,495" },
      { name: "Large Utility Unit", size: "20' x 25'", price: "starting at $6,495" },
    ],
  },
  {
    slug: "lean-tos",
    title: "Lean-Tos",
    excerpt: "Add covered space to any building with a steel lean-to.",
    content:
      "A lean-to attaches to an existing structure to add covered storage, equipment parking or shade — the most affordable way to expand your usable space without building a whole new structure.",
    features: [
      "Attaches to any existing building",
      "Ideal for equipment and hay storage",
      "Matches your main structure's roof style",
      "Widths from 6' to 20'",
    ],
    models: [
      { name: "Single Lean-To", size: "12' x 20'", price: "starting at $1,995" },
      { name: "Double Lean-To", size: "20' x 30'", price: "starting at $3,495" },
    ],
  }
);

// Orden del menú/las grillas (combo-units queda al final: sigue teniendo
// página pero no aparece en el mega-menú, igual que en la referencia).
const productOrder = ["garages", "carports", "barns", "commercial", "utility-units", "rv-covers", "lean-tos", "combo-units"];
products.sort((a, b) => productOrder.indexOf(a.slug) - productOrder.indexOf(b.slug));

// Etiquetas cortas del mega-menú (la página conserva su título completo).
const menuLabels = {
  garages: "Garages",
  carports: "Carports",
  barns: "Barns",
  commercial: "Commercial Structures",
  "utility-units": "Utility Units",
  "rv-covers": "RV Covers",
  "lean-tos": "Lean-Tos",
};
const menuProducts = productOrder.filter((s) => menuLabels[s]).map((s) => products.find((p) => p.slug === s));

const testimonials = [
  {
    name: "Kenny R.",
    location: "Tyler, TX",
    quote:
      "From the first call to the final install, the team walked us through every option. Our garage went up in under a week and it looks better than we imagined.",
  },
  {
    name: "Matt D.",
    location: "Shreveport, LA",
    quote:
      "Great price, great communication, and the crew that installed our barn was fast and professional. Would recommend to anyone in the area.",
  },
  {
    name: "Dusty H.",
    location: "Norman, OK",
    quote:
      "The financing options made it easy to get exactly the size building we needed without waiting years to save up. Couldn't be happier.",
  },
  {
    name: "Dakota S.",
    location: "Little Rock, AR",
    quote:
      "Our RV cover has held up through two hail storms already without a scratch. Solid steel, solid company.",
  },
];

const faqs = [
  {
    q: "How long does it take to get my building installed?",
    a: "Most standard structures are delivered and installed within 4-8 weeks of your order, depending on your location and customization. Larger commercial buildings may take longer.",
  },
  {
    q: "Do I need a permit for my metal building?",
    a: "Permit requirements vary by city and county. We can provide engineered drawings and stamped plans to help with your permit application, but the homeowner or business is responsible for pulling permits locally.",
  },
  {
    q: "What areas do you service?",
    a: "We currently deliver and install across the states listed on our homepage. Contact us to confirm availability in your area.",
  },
  {
    q: "Can I customize the size, color and features of my building?",
    a: "Yes. Every building is fully customizable — width, length, height, roof style, color, doors, windows and insulation can all be tailored to your project.",
  },
  {
    q: "What financing options are available?",
    a: "We offer traditional financing up to $100,000, outright purchase pricing, and rent-to-own plans up to $20,000 with no credit check required. See our Financing page for details.",
  },
  {
    q: "Do your buildings come with a warranty?",
    a: "Yes, every structure includes our industry-leading structural warranty against rust-through and manufacturer defects.",
  },
];

const whyUs = [
  {
    title: "Industry-leading warranty",
    desc: "20-year structural warranty on every steel building we install.",
  },
  {
    title: "Delivery & installation included",
    desc: "We coordinate delivery and setup on your property, no surprises.",
  },
  {
    title: "100% customizable",
    desc: "Choose size, color, doors, windows and reinforcement for your project.",
  },
  {
    title: "In-house support",
    desc: "One team with you from your first quote through final installation.",
  },
];

const purchaseOptions = [
  {
    title: "Financing",
    desc: "Flexible financing plans up to $100,000 with fast approval, even with limited credit.",
  },
  {
    title: "Outright Purchase",
    desc: "Pay the full price upfront and get the best available price on your structure.",
  },
  {
    title: "Rent-to-Own",
    desc: "No credit check, affordable monthly payments up to $20,000, with the option to buy out anytime.",
  },
];

// ------------------------------------------------------------- helpers
const singularize = (name) => name.replace(/^Metal\s+/, "").replace(/s$/, "");
const compactSize = (size) => size.replace(/['\s]/g, "").replace("x", "×");
const productHref = (prefix, p) => `${prefix}products/${p.slug}/${p.slug}.html`;

function starRow(classes = "text-accent") {
  const star =
    '<svg class="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M10 1.5l2.6 5.4 5.9.7-4.3 4.1 1.1 5.9L10 14.7l-5.3 2.9 1.1-5.9L1.5 7.6l5.9-.7z"/></svg>';
  return `<span class="inline-flex ${classes}" aria-hidden="true">${star.repeat(5)}</span>`;
}

// Íconos azules del mega-menú (trazos en currentColor, tamaño 24).
const navIcons = {
  product:
    '<svg class="mega-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21V9l9-6 9 6v12"/><path d="M7 21v-8h10v8"/><path d="M7 16h10"/></svg>',
  financing:
    '<svg class="mega-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 6.5v11M14.7 8.8c-.6-.8-1.6-1.3-2.7-1.3-1.7 0-3 .9-3 2.2s1.3 1.8 3 2.3 3 1 3 2.3-1.3 2.2-3 2.2c-1.1 0-2.1-.5-2.7-1.3"/></svg>',
  pricing:
    '<svg class="mega-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
  dealers:
    '<svg class="mega-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.2 2.7-5.2 6-5.2s6 2 6 5.2"/><circle cx="17" cy="9" r="2.5"/><path d="M17.5 14.6c2.1.3 3.5 1.7 3.5 3.9"/></svg>',
  about:
    '<svg class="mega-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M12 11.5V16"/></svg>',
};

// Columnas del mega-menú, en el orden pedido:
// PRODUCT · FINANCING · PRICING · DEALERS · ABOUT US.
function navColumns(prefix) {
  return [
    {
      label: "Product",
      icon: navIcons.product,
      href: `${prefix}index.html#our-products`,
      links: menuProducts.map((p) => ({ label: menuLabels[p.slug], href: productHref(prefix, p) })),
    },
    {
      label: "Financing",
      icon: navIcons.financing,
      href: `${prefix}financing/financing.html`,
      links: [
        { label: "Heartland Capital RTO", href: `${prefix}financing/financing.html#heartland-capital-rto` },
        { label: "HSF Portal", href: `${prefix}financing/financing.html#hsf-portal` },
        { label: "RTO National", href: `${prefix}financing/financing.html#rto-national` },
      ],
    },
    {
      label: "Pricing",
      icon: navIcons.pricing,
      href: `${prefix}pricing/pricing.html`,
      links: [],
    },
    {
      label: "Dealers",
      icon: navIcons.dealers,
      href: `${prefix}dealers/apply/apply.html`,
      links: [
        { label: "Apply", href: `${prefix}dealers/apply/apply.html` },
        { label: "Portal", href: `${prefix}dealers/portal/portal.html` },
      ],
    },
    {
      label: "About Us",
      icon: navIcons.about,
      href: `${prefix}about/about.html`,
      links: [
        { label: "Area", href: `${prefix}index.html#where-we-build` },
        { label: "Staff", href: `${prefix}about/about.html` },
        { label: "Reviews", href: `${prefix}index.html#customer-stories` },
      ],
    },
  ];
}

function header(prefix) {
  const columns = navColumns(prefix);

  // Cada ítem del menú despliega SOLO su propia columna de enlaces al
  // pasar el mouse; los que no tienen sub-enlaces (Pricing) son un
  // enlace directo sin flecha.
  const navItems = columns
    .map((c) => {
      if (!c.links.length) {
        return `\t\t\t<a href="${c.href}" class="text-sm font-semibold text-dark hover:text-primary">${c.label}</a>`;
      }
      const links = c.links
        .map(
          (l) =>
            `\t\t\t\t\t<a href="${l.href}" class="block rounded px-3 py-2 text-sm text-dark hover:bg-gray-50 hover:text-primary">${l.label}</a>`
        )
        .join("\n");
      return `\t\t\t<div class="group relative">
				<a href="${c.href}" class="flex h-20 items-center gap-1 text-sm font-semibold text-dark hover:text-primary" aria-haspopup="true">
					${c.label}
					<svg class="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5"/></svg>
				</a>
				<div class="invisible absolute left-0 top-full w-56 rounded-md border border-gray-100 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
${links}
				</div>
			</div>`;
    })
    .join("\n");

  const mobileGroups = columns
    .map((c) => {
      const links = (c.links.length ? c.links : [{ label: c.label, href: c.href }])
        .map(
          (l) =>
            `\t\t\t\t<a href="${l.href}" class="rounded px-2 py-2.5 text-sm font-medium text-dark hover:bg-gray-50">${l.label}</a>`
        )
        .join("\n");
      return `\t\t<p class="mt-4 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">${c.label}</p>
		<div class="flex flex-col">
${links}
		</div>`;
    })
    .join("\n");

  return `<header class="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
	<div class="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
		<a href="${prefix}index.html" class="flex items-center gap-2 text-xl font-bold text-primary">
			<img src="${prefix}assets/images/logo/logo-header.png" alt="${site.name}" class="site-logo">
			<span class="sr-only">${site.name}</span>
		</a>

		<nav class="site-nav hidden h-20 items-center gap-8 lg:flex" aria-label="Main">
${navItems}
		</nav>

		<div class="hidden items-center gap-4 lg:flex">
			<a href="tel:${site.phoneHref}" class="text-sm font-semibold text-dark hover:text-primary">${site.phone}</a>
			<a href="${prefix}contact/contact.html" class="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90">
				Get a Free Quote
			</a>
		</div>

		<div class="lg:hidden">
			<button type="button" id="ironclad-mobile-nav-toggle" aria-label="Toggle menu" aria-expanded="false" class="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-dark">
				<svg class="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
			</button>
		</div>
	</div>

	<div id="ironclad-mobile-nav" class="hidden absolute left-0 right-0 top-20 max-h-[calc(100vh-5rem)] overflow-y-auto border-b border-gray-200 bg-white px-4 pb-6 shadow-lg lg:hidden">
${mobileGroups}
		<div class="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4">
			<a href="tel:${site.phoneHref}" class="text-sm font-semibold text-dark">${site.phone}</a>
			<a href="${prefix}contact/contact.html" class="rounded-md bg-accent px-5 py-2.5 text-center text-sm font-semibold text-white shadow-sm">Get a Free Quote</a>
		</div>
	</div>
</header>`;
}

function footer(prefix) {
  const footProducts = products
    .map(
      (p) =>
        `\t\t\t\t\t<li><a href="${productHref(prefix, p)}" class="hover:text-white">${p.title}</a></li>`
    )
    .join("\n");

  return `<footer class="mt-auto bg-dark text-gray-300">
	<div class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
		<div>
			<img src="${prefix}assets/images/logo/logo-header.png" alt="" class="footer-logo">
			<p class="mt-4 text-lg font-bold text-white">${site.name}</p>
			<p class="mt-3 text-sm text-gray-400">${site.shortTagline}</p>
			<div class="mt-4 space-y-1 text-sm">
				<p><span class="text-gray-400">Monday – Friday:</span> ${site.hoursWeekday}</p>
				<p><span class="text-gray-400">Saturday:</span> ${site.hoursSaturday}</p>
				<p><span class="text-gray-400">Sunday:</span> ${site.hoursSunday}</p>
			</div>
			<div class="mt-4 flex gap-4">
				<a href="${site.facebook}" class="text-gray-400 hover:text-white">Facebook</a>
				<a href="${site.instagram}" class="text-gray-400 hover:text-white">Instagram</a>
				<a href="${site.linkedin}" class="text-gray-400 hover:text-white">LinkedIn</a>
			</div>
		</div>

		<div>
			<p class="text-sm font-semibold uppercase tracking-wide text-white">Products</p>
			<ul class="mt-4 space-y-2 text-sm">
${footProducts}
			</ul>
		</div>

		<div>
			<p class="text-sm font-semibold uppercase tracking-wide text-white">Quick Links</p>
			<ul class="mt-4 space-y-2 text-sm">
				<li><a href="${prefix}financing/financing.html" class="hover:text-white">Financing</a></li>
				<li><a href="${prefix}faqs/faqs.html" class="hover:text-white">FAQs</a></li>
				<li><a href="${prefix}about/about.html" class="hover:text-white">About Us</a></li>
				<li><a href="${prefix}contact/contact.html" class="hover:text-white">Contact</a></li>
			</ul>
		</div>

		<div>
			<p class="text-sm font-semibold uppercase tracking-wide text-white">Company</p>
			<ul class="mt-4 space-y-2 text-sm">
				<li><a href="${prefix}contact/contact.html" class="hover:text-white">Get a Quote</a></li>
				<li><a href="${prefix}terms/terms.html" class="hover:text-white">Terms &amp; Conditions</a></li>
				<li><a href="${prefix}privacy/privacy.html" class="hover:text-white">Privacy Policy</a></li>
			</ul>
			<p class="mt-6 text-sm"><a href="tel:${site.phoneHref}" class="hover:text-white">${site.phone}</a></p>
			<p class="text-sm"><a href="mailto:${site.email}" class="hover:text-white">${site.email}</a></p>
		</div>
	</div>

	<div class="border-t border-white/10 py-6">
		<div class="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs text-gray-400 sm:flex-row sm:px-6 lg:px-8">
			<p>&copy; 2026 ${site.name}. All rights reserved.</p>
			<p>${site.address1}, ${site.city}, ${site.state} ${site.zip}</p>
		</div>
	</div>
</footer>`;
}

function sectionHeading(eyebrow, title, subtitle = "", light = false) {
  const eyebrowClass = light ? "text-blue-200" : "eyebrow-red";
  const titleClass = light ? "text-white" : "text-dark";
  const subtitleClass = light ? "text-blue-100" : "text-gray-600";
  return `<div class="max-w-2xl mx-auto text-center" data-reveal>
${eyebrow ? `\t\t\t<p class="text-sm font-semibold uppercase tracking-wide ${eyebrowClass}">${eyebrow}</p>` : ""}
			<h2 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl ${titleClass}">${title}</h2>
${subtitle ? `\t\t\t<p class="mt-4 text-lg ${subtitleClass}">${subtitle}</p>` : ""}
		</div>`;
}

function ctaBanner(prefix, heading, subtext, buttonLabel) {
  return `<section class="bg-primary">
	<div class="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 lg:px-8">
		<h2 class="text-3xl font-bold text-white sm:text-4xl">${heading}</h2>
${subtext ? `\t\t<p class="max-w-xl text-lg text-blue-100">${subtext}</p>` : ""}
		<a href="${prefix}contact/contact.html" class="inline-flex items-center justify-center rounded-md bg-accent px-8 py-3 text-base font-semibold text-white shadow-sm transition hover:opacity-90">
			${buttonLabel}
		</a>
	</div>
</section>`;
}

function productCard(prefix, p) {
  return `<a href="${productHref(prefix, p)}" class="js-reveal-card group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl" data-reveal-group="products">
					<div class="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
						<img src="${prefix}assets/images/products/${p.slug}/card-placeholder.svg" alt="${p.title}" class="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy">
					</div>
					<div class="flex flex-1 flex-col p-5">
						<h3 class="text-lg font-bold text-dark">${p.title}</h3>
						<p class="mt-2 flex-1 text-sm text-gray-600">${p.excerpt}</p>
						<span class="mt-4 text-sm font-semibold text-primary group-hover:underline">View ${p.title} →</span>
					</div>
				</a>`;
}

function page({ title, description, prefix, main, extraHead = "", extraScripts = "", cssFile, jsFile }) {
  return `<!DOCTYPE html>
<html lang="en" class="h-full antialiased">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>${title}</title>
	<meta name="description" content="${description}">
	<link rel="icon" type="image/png" href="${prefix}assets/images/logo/logo-header.png">
	<link rel="stylesheet" href="${prefix}assets/css/main.css">
	<link rel="stylesheet" href="${prefix}assets/css/site.css">
	<link rel="stylesheet" href="${cssFile}">
${extraHead}</head>
<body class="flex min-h-full flex-col">

${header(prefix)}

<main class="flex-1">
${main}
</main>

${footer(prefix)}

<script src="${prefix}assets/js/main.js"></script>
${jsFile ? `<script src="${jsFile}"></script>\n` : ""}${extraScripts}</body>
</html>
`;
}

// -------------------------------------------------------------- páginas
const files = {};

// CSS compartido propio (no Tailwind): complementos del menú del header.
files["assets/css/site.css"] = `/* Estilos compartidos propios del sitio (se cargan en todas las páginas,
   después de main.css). El menú del header usa clases Tailwind de
   main.css; aquí solo va lo que Tailwind compilado no cubre. */

/* ============ Paleta de marca AZ Sunset ============
   Oscuros: #121212 · #2A2F35 · #5E666E · #B8BEC4
   Cálidos: #D89A1F (dorado) · #F4B400 (sol) · #D66C1D (naranja) · #98291E (rojo)
   Claro:   #F5F5F5
   Estas variables pisan las de main.css (este archivo carga después). */
:root {
	--color-primary: #2a2f35;       /* acero oscuro: fondos de heros/CTA, rellenos hover */
	--color-primary-dark: #121212;  /* extremo oscuro del degradado del hero */
	--color-primary-light: #5e666e; /* acero medio */
	--color-accent: #d89a1f;        /* dorado: botones CTA, estrellas, enlaces destacados */
	--color-brand-red: #98291e;     /* rojo del logo: errores de formulario */
	--color-brand-orange: #d66c1d;  /* naranja: rótulos de sección, hovers */

	/* TEMA OSCURO — el sitio entero usa fondo negro. Estas variables
	   remapean los grises del tema (que asumían fondo blanco). */
	--color-dark: #f5f5f5;          /* "text-dark" (títulos) ahora es claro */
	--color-blue-100: #f5f5f5;      /* subtítulos sobre heros oscuros */
	--color-blue-200: #b8bec4;
	--color-gray-50: #191d22;       /* secciones alternas y hover de menús */
	--color-gray-100: #23282e;      /* bordes suaves, fondos de imagen */
	--color-gray-200: #2f353c;      /* bordes de tarjetas y divisores */
	--color-gray-300: #3d444d;      /* bordes de inputs */
	--color-gray-400: #8a929a;      /* rótulos apagados */
	--color-gray-500: #9aa2aa;      /* texto terciario */
	--color-gray-600: #b8bec4;      /* texto secundario */
	--color-gray-700: #cdd2d6;      /* texto de párrafos largos */
}

/* ---- Superficies oscuras (clases que asumían fondo blanco) ---- */
body {
	background-color: #121212;
	color: #f5f5f5;
}

.bg-white {
	background-color: #1c2127; /* tarjetas y paneles */
}

.bg-white\\/95 {
	background-color: rgba(18, 18, 18, 0.92); /* barra del header */
}

.bg-dark {
	background-color: #0d0f12; /* footer, un paso más oscuro que el body */
}

.text-gray-300 {
	color: #b8bec4; /* texto del footer (el var gray-300 ahora es un borde) */
}

/* ---- Acentos que eran azul primario sobre blanco ---- */
.text-primary {
	color: var(--color-accent); /* precios, contadores, enlaces "View →" */
}

.border-primary {
	border-color: var(--color-accent);
}

.bg-primary\\/10 {
	background-color: rgba(216, 154, 31, 0.12); /* círculos numerados */
}

.focus\\:border-primary:focus {
	border-color: var(--color-accent);
}

.focus\\:ring-primary:focus {
	--tw-ring-color: var(--color-accent);
}

/* Hover de los enlaces del menú y textos que iban al azul primario:
   ahora van al dorado (el primario oscuro no se vería sobre negro). */
.hover\\:text-primary:hover {
	color: var(--color-accent);
}

/* Campos de formulario con relleno propio sobre el fondo negro. */
form input:not([type="hidden"]),
form select,
form textarea {
	background-color: #191d22;
}

/* Los botones dorados aclaran a #F4B400 (amarillo sol) al pasar el
   mouse, en vez del efecto genérico de transparencia. */
a.bg-accent:hover,
button.bg-accent:hover {
	background-color: #f4b400;
	opacity: 1;
}

/* En las tarjetas de producto, el enlace dorado pasa a naranja al
   hacer hover sobre la tarjeta. */
.group:hover span.text-accent {
	color: var(--color-brand-orange);
}

/* Rótulos de sección en naranja (el rojo del logo no contrasta
   suficiente sobre fondo negro; queda para errores). */
.eyebrow-red {
	color: var(--color-brand-orange);
}

/* Permite abrir los desplegables del menú también con teclado (Tab),
   no solo con el mouse. */
.site-nav .group:focus-within > div {
	visibility: visible;
	opacity: 1;
}

/* Logo (assets/images/logo/logo-header.png). */
.site-logo {
	height: 3.5rem;
	width: auto;
	border-radius: 0.375rem;
}

.footer-logo {
	height: 4.5rem;
	width: auto;
	border-radius: 0.375rem;
}

.portal-logo {
	height: 5rem;
	width: auto;
	margin-inline: auto;
	border-radius: 0.375rem;
}

/* Texto solo para lectores de pantalla (el logo ya muestra el nombre). */
.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}
`;

// ---- Home (index.html, en la raíz) ----
{
  const prefix = "";
  const statesCount = site.states.length;
  const count = site.completedCount.toLocaleString("en-US");

  const topPicks = products
    .map((p) => {
      const model = p.models[0];
      const compact = `${compactSize(model.size)} ${singularize(p.title)}`;
      return `\t\t\t<a href="${productHref(prefix, p)}" class="js-reveal-card group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl" data-reveal-group="top-picks">
				<div class="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
					<img src="${prefix}assets/images/products/${p.slug}/card-placeholder.svg" alt="${compact}" class="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy">
				</div>
				<div class="flex items-center justify-between p-5">
					<h3 class="text-lg font-bold text-dark">${compact}</h3>
					<span class="inline-flex items-center gap-1 text-sm font-semibold text-accent group-hover:underline">View Details ↗</span>
				</div>
			</a>`;
    })
    .join("\n");

  const productGrid = products.map((p) => `\t\t\t\t${productCard(prefix, p)}`).join("\n");

  const whyUsCards = whyUs
    .map(
      (item, i) => `\t\t\t\t<div class="js-reveal-card rounded-xl bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg" data-reveal-group="why-us">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">${i + 1}</div>
					<h3 class="mt-4 text-base font-bold text-dark">${item.title}</h3>
					<p class="mt-2 text-sm text-gray-600">${item.desc}</p>
				</div>`
    )
    .join("\n");

  const purchaseCards = purchaseOptions
    .map(
      (opt) => `\t\t\t\t<div class="flex flex-col rounded-xl border border-gray-200 p-8 text-center">
					<h3 class="text-xl font-bold text-dark">${opt.title}</h3>
					<p class="mt-3 flex-1 text-sm text-gray-600">${opt.desc}</p>
					<a href="${prefix}financing/financing.html" class="mt-6 inline-flex items-center justify-center rounded-md border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white">See options</a>
				</div>`
    )
    .join("\n");

  const stateChips = site.states
    .map(
      (s) =>
        `\t\t\t\t<span class="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white">${s}</span>`
    )
    .join("\n");

  const testimonialCards = testimonials
    .map(
      (t) => `\t\t\t\t<figure class="flex flex-col rounded-xl border border-gray-200 p-6">
					<blockquote class="flex-1 text-sm text-gray-600">&ldquo;${t.quote}&rdquo;</blockquote>
					<figcaption class="mt-4 flex items-center gap-3">
						<span class="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
							<img src="${prefix}assets/images/testimonials/avatar-placeholder.svg" alt="" class="h-full w-full object-cover">
						</span>
						<div>
							<p class="text-sm font-semibold text-dark">${t.name}</p>
							<p class="text-xs text-gray-500">${t.location}</p>
						</div>
					</figcaption>
				</figure>`
    )
    .join("\n");

  const main = `
<section class="relative overflow-hidden bg-primary" data-hero>
	<div class="absolute inset-0">
		<img src="${prefix}assets/images/hero/hero-placeholder.svg" alt="" class="h-full w-full object-cover opacity-30">
		<canvas id="ironclad-hero-shader" class="hidden absolute inset-0 h-full w-full touch-none mix-blend-luminosity opacity-70" aria-hidden="true"></canvas>
		<div class="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary/90 to-primary/80"></div>
	</div>

	<div class="relative mx-auto flex min-h-[560px] w-full max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8" data-hero-parallax>
		<p class="text-sm font-semibold uppercase tracking-widest text-blue-200" data-hero-eyebrow>
			${count}+ Buildings Delivered
		</p>
		<h1 class="mt-4 max-w-2xl text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl" data-hero-heading>
			${site.tagline}
		</h1>
		<p class="mt-6 max-w-xl text-lg text-blue-100" data-hero-subtitle>
			Custom steel garages, barns, carports and commercial buildings — engineered to last, priced to fit your budget, and backed by a ${site.warrantyYears}-year warranty.
		</p>
		<div class="mt-8 flex flex-col gap-4 sm:flex-row" data-hero-actions>
			<a href="${prefix}contact/contact.html" class="inline-flex items-center justify-center rounded-md bg-accent px-8 py-3.5 text-base font-semibold text-white shadow-sm transition hover:opacity-90">Get a Free Quote</a>
			<a href="${productHref(prefix, products[0])}" class="inline-flex items-center justify-center rounded-md border border-white/40 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:bg-white/20">View Products</a>
		</div>

		<div class="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3" data-hero-trust>
			<div class="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
				<span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xs font-extrabold text-primary">BBB</span>
				<div>
					<p class="text-xs font-semibold text-blue-100">BBB Rating</p>
					<div class="flex items-center gap-1.5">
						<span class="text-sm font-bold text-white">${site.bbbRating}</span>
						${starRow()}
					</div>
					<p class="text-[11px] text-blue-200">${site.bbbReviews} reviews</p>
				</div>
			</div>

			<div class="flex flex-col items-center justify-center rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-center backdrop-blur">
				<p class="text-2xl font-extrabold text-accent" data-counter="${site.completedCount}">${count}</p>
				<p class="text-[11px] font-semibold uppercase tracking-wide text-blue-100">Completed Projects</p>
			</div>

			<div class="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
				<svg class="h-9 w-9 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
					<path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.6H24v9.1h11.9c-.5 2.8-2.1 5.1-4.4 6.7v5.5h7.1c4.2-3.8 6.5-9.4 6.5-16.7z"/>
					<path fill="#34A853" d="M24 46c6 0 11-2 14.6-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.5 2.1-5.8 0-10.7-3.9-12.4-9.1H4.3v5.7C7.9 41.1 15.3 46 24 46z"/>
					<path fill="#FBBC05" d="M11.6 28.2c-.4-1.3-.7-2.7-.7-4.2s.2-2.9.7-4.2v-5.7H4.3C2.8 17 2 20.4 2 24s.8 7 2.3 9.9z"/>
					<path fill="#EA4335" d="M24 10.7c3.3 0 6.2 1.1 8.5 3.3l6.3-6.3C34.9 4.2 29.9 2 24 2 15.3 2 7.9 6.9 4.3 14.1l7.3 5.7c1.7-5.2 6.6-9.1 12.4-9.1z"/>
				</svg>
				<div>
					<p class="text-xs font-semibold text-blue-100">Google Rating</p>
					<div class="flex items-center gap-1.5">
						<span class="text-sm font-bold text-white">${site.googleRating}</span>
						${starRow()}
					</div>
					<p class="text-[11px] text-blue-200">${site.googleReviews} reviews</p>
				</div>
			</div>
		</div>
	</div>

	<div class="absolute inset-x-0 bottom-6 flex justify-center" data-scroll-indicator>
		<svg class="h-6 w-6 text-white/70" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path d="M12 5v14M12 19l-6-6M12 19l6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
	</div>
</section>

<section class="border-y border-gray-100 bg-gray-50 py-12">
	<div class="mx-auto grid w-full max-w-7xl grid-cols-2 gap-8 px-4 text-center sm:grid-cols-4 sm:px-6 lg:px-8">
		<div class="js-reveal-card" data-reveal-group="stats">
			<p class="text-3xl font-extrabold text-primary sm:text-4xl" data-counter="${site.completedCount}" data-suffix="+">${count}+</p>
			<p class="mt-1 text-sm text-gray-600">Buildings Delivered</p>
		</div>
		<div class="js-reveal-card" data-reveal-group="stats">
			<p class="text-3xl font-extrabold text-primary sm:text-4xl" data-counter="${site.warrantyYears}">${site.warrantyYears}</p>
			<p class="mt-1 text-sm text-gray-600">Years of Warranty</p>
		</div>
		<div class="js-reveal-card" data-reveal-group="stats">
			<p class="text-3xl font-extrabold text-primary sm:text-4xl" data-counter="${statesCount}">${statesCount}</p>
			<p class="mt-1 text-sm text-gray-600">States Served</p>
		</div>
		<div class="js-reveal-card" data-reveal-group="stats">
			<p class="text-3xl font-extrabold text-primary sm:text-4xl">4-8 wks</p>
			<p class="mt-1 text-sm text-gray-600">Avg. Install Time</p>
		</div>
	</div>
</section>

<section class="py-20">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" data-reveal>
			<h2 class="text-3xl font-bold tracking-tight text-dark sm:text-4xl">
				<span class="text-accent">Top Picks:</span> Best-Selling Structures
			</h2>
			<a href="#our-products" class="inline-flex shrink-0 items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 sm:self-start">View All Products</a>
		</div>
		<div class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
${topPicks}
		</div>
	</div>
</section>

<section id="our-products" class="scroll-mt-24 bg-gray-50 py-20">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		${sectionHeading("Our Products", "Built for Every Project", "From a single-car garage to a full commercial warehouse, we've got a structure for it.")}
		<div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
${productGrid}
		</div>
	</div>
</section>

<section class="bg-gray-50 py-20">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		${sectionHeading("Why Choose Us", `Why ${site.shortName}?`)}
		<div class="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
${whyUsCards}
		</div>
	</div>
</section>

<section class="py-20">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		${sectionHeading("Purchase Options", "Flexible Ways to Get Your Building", "Pick the payment path that works best for your budget and timeline.")}
		<div class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
${purchaseCards}
		</div>
	</div>
</section>

<section id="where-we-build" class="scroll-mt-24 bg-primary py-20">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		${sectionHeading("Where We Build", "Proudly Serving Your Region", "We currently deliver and install in the following states.", true)}
		<div class="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
${stateChips}
		</div>
	</div>
</section>

<section id="customer-stories" class="scroll-mt-24 py-20">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		${sectionHeading("Customer Stories", "What Our Customers Say")}
		<div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
${testimonialCards}
		</div>
	</div>
</section>

<section class="bg-gray-50 py-16">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
			<p class="text-sm font-semibold uppercase tracking-wide text-accent">Coming Soon</p>
			<h2 class="text-2xl font-bold text-dark">Design Your Building in 3D</h2>
			<p class="max-w-xl text-sm text-gray-600">We're working on an interactive 3D builder so you can customize size, color and features before you request a quote. In the meantime, our team will walk you through every option by phone or email.</p>
		</div>
	</div>
</section>

${ctaBanner(prefix, "Ready to Build?", "Get a free, no-obligation quote from our team today.", "Get a Free Quote")}
`;

  files["index.html"] = page({
    title: `${site.name} — ${site.tagline}`,
    description: site.shortTagline,
    prefix,
    main,
    cssFile: "index.css",
    extraScripts: `<script src="${prefix}assets/js/shader-hero.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>
<script src="${prefix}assets/js/motion.js"></script>
`,
  });

  files["index.css"] = `/* Estilos específicos de la portada (index.html).
   El diseño base compartido vive en assets/css/main.css. */
`;
}

// ---- Páginas de producto (products/{slug}/{slug}.html) ----
for (const p of products) {
  const prefix = "../../";
  const related = products.filter((x) => x.slug !== p.slug).slice(0, 3);

  const featureItems = p.features
    .map(
      (f) => `\t\t\t\t\t<li class="flex gap-3 text-sm text-gray-700">
						<span class="mt-0.5 text-primary">&#10003;</span>
						${f}
					</li>`
    )
    .join("\n");

  const modelItems = p.models
    .map(
      (m) => `\t\t\t\t\t<div class="flex items-center justify-between rounded-lg border border-gray-200 p-4">
						<div>
							<p class="font-semibold text-dark">${m.name}</p>
							<p class="text-sm text-gray-500">${m.size}</p>
						</div>
						<p class="text-sm font-semibold text-primary">${m.price}</p>
					</div>`
    )
    .join("\n");

  const relatedCards = related.map((r) => `\t\t\t\t${productCard(prefix, r)}`).join("\n");

  const main = `
<section class="relative bg-primary">
	<div class="absolute inset-0">
		<img src="${prefix}assets/images/products/${p.slug}/hero-placeholder.svg" alt="" class="h-full w-full object-cover opacity-30">
		<div class="absolute inset-0 bg-primary/70"></div>
	</div>
	<div class="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
		<p class="text-sm font-semibold uppercase tracking-widest text-blue-200">Products</p>
		<h1 class="mt-2 max-w-2xl text-4xl font-extrabold text-white sm:text-5xl">${p.title}</h1>
		<p class="mt-4 max-w-xl text-lg text-blue-100">${p.excerpt}</p>
		<a href="${prefix}contact/contact.html" class="mt-8 inline-flex items-center justify-center rounded-md bg-accent px-8 py-3.5 text-base font-semibold text-white shadow-sm transition hover:opacity-90">Get a Free Quote</a>
	</div>
</section>

<section class="py-20">
	<div class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
		<div>
			<h2 class="text-2xl font-bold text-dark">Overview</h2>
			<div class="mt-4 text-sm text-gray-700"><p>${p.content}</p></div>

			<h2 class="mt-8 text-2xl font-bold text-dark">Features</h2>
			<ul class="mt-6 space-y-3">
${featureItems}
			</ul>
		</div>

		<div>
			<h2 class="text-2xl font-bold text-dark">Popular Sizes</h2>
			<div class="mt-6 space-y-4">
${modelItems}
			</div>
		</div>
	</div>
</section>

<section class="bg-gray-50 py-20">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="text-2xl font-bold text-dark">You Might Also Like</h2>
		<div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
${relatedCards}
		</div>
	</div>
</section>

${ctaBanner(prefix, `Ready for Your New ${p.title.replace(/s$/, "")}?`, "Request a free, no-obligation quote and we'll get back to you fast.", "Get a Free Quote")}
`;

  files[`products/${p.slug}/${p.slug}.html`] = page({
    title: `${p.title} — ${site.name}`,
    description: p.excerpt,
    prefix,
    main,
    cssFile: `${p.slug}.css`,
  });

  files[`products/${p.slug}/${p.slug}.css`] = `/* Estilos específicos de la página ${p.title}.
   El diseño base compartido vive en ../../assets/css/main.css. */
`;
}

// ---- About ----
{
  const prefix = "../";
  const main = `
<section class="bg-primary py-16">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		${sectionHeading("Our Story", `About ${site.name}`, "", true)}
	</div>
</section>

<section class="py-20">
	<div class="mx-auto w-full max-w-3xl space-y-6 px-4 text-gray-700 sm:px-6 lg:px-8">
		<p>${site.name} was built on a simple idea: every home and business deserves a durable, affordable steel structure without the hassle. From our first garage to hundreds of buildings delivered across ${site.states.length} states, our team handles design, engineering, delivery and installation in-house — so you get one point of contact from quote to completion.</p>
		<p>We stand behind every build with a ${site.warrantyYears}-year structural warranty and a support team that's with you from your first quote through final installation.</p>
	</div>
</section>

${ctaBanner(prefix, "Let's build something together", "", "Get a Free Quote")}
`;
  files["about/about.html"] = page({
    title: `About Us — ${site.name}`,
    description: `Learn about ${site.name} — design, engineering, delivery and installation handled in-house.`,
    prefix,
    main,
    cssFile: "about.css",
  });
  files["about/about.css"] = `/* Estilos específicos de la página About.
   El diseño base compartido vive en ../assets/css/main.css. */
`;
}

// ---- Financing ----
{
  const prefix = "../";
  const cards = purchaseOptions
    .map(
      (opt) => `\t\t\t<div class="rounded-xl border border-gray-200 p-8">
				<h2 class="text-xl font-bold text-dark">${opt.title}</h2>
				<p class="mt-3 text-sm text-gray-600">${opt.desc}</p>
			</div>`
    )
    .join("\n");

  const main = `
<section class="bg-primary py-16">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		${sectionHeading("Payment Options", "Flexible Ways to Own Your Building", "Whatever your budget or credit situation, we have a payment path that fits.", true)}
	</div>
</section>

<section class="py-20">
	<div class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
${cards}
	</div>
</section>

<section class="bg-gray-50 py-20">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		${sectionHeading("Our Partners", "Financing Partners", "We work with trusted rent-to-own and financing partners to make your building affordable.")}
		<div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
			<div id="heartland-capital-rto" class="scroll-mt-24 rounded-xl bg-white p-8 shadow-sm">
				<h2 class="text-xl font-bold text-dark">Heartland Capital RTO</h2>
				<p class="mt-3 text-sm text-gray-600">Rent-to-own plans up to $20,000 with no credit check and affordable monthly payments — with the option to buy out anytime.</p>
				<a href="${prefix}contact/contact.html" class="mt-6 inline-flex items-center justify-center rounded-md border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white">Ask about RTO</a>
			</div>
			<div id="hsf-portal" class="scroll-mt-24 rounded-xl bg-white p-8 shadow-sm">
				<h2 class="text-xl font-bold text-dark">HSF Portal</h2>
				<p class="mt-3 text-sm text-gray-600">Apply for traditional financing up to $100,000 through our HSF partner portal, with fast approval even with limited credit.</p>
				<a href="${prefix}contact/contact.html" class="mt-6 inline-flex items-center justify-center rounded-md border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white">Request access</a>
			</div>
			<div id="rto-national" class="scroll-mt-24 rounded-xl bg-white p-8 shadow-sm">
				<h2 class="text-xl font-bold text-dark">RTO National</h2>
				<p class="mt-3 text-sm text-gray-600">A nationwide rent-to-own program with flexible terms and early purchase options, available in most of the states we serve.</p>
				<a href="${prefix}contact/contact.html" class="mt-6 inline-flex items-center justify-center rounded-md border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white">Learn more</a>
			</div>
		</div>
	</div>
</section>

${ctaBanner(prefix, "Have questions about financing?", "Talk to our team and we'll help you find the right plan.", "Contact Us")}
`;
  files["financing/financing.html"] = page({
    title: `Financing — ${site.name}`,
    description: "Financing, outright purchase and rent-to-own options for your steel building.",
    prefix,
    main,
    cssFile: "financing.css",
  });
  files["financing/financing.css"] = `/* Estilos específicos de la página Financing.
   El diseño base compartido vive en ../assets/css/main.css. */
`;
}

// ---- FAQs ----
{
  const prefix = "../";
  const items = faqs
    .map(
      (f) => `\t\t\t\t<details class="group p-6">
					<summary class="flex cursor-pointer list-none items-center justify-between text-base font-semibold text-dark">
						${f.q}
						<span class="ml-4 shrink-0 text-primary transition group-open:rotate-45">+</span>
					</summary>
					<p class="mt-3 text-sm text-gray-600">${f.a}</p>
				</details>`
    )
    .join("\n");

  const main = `
<section class="bg-primary py-16">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		${sectionHeading("Support", "Frequently Asked Questions", "", true)}
	</div>
</section>

<section class="py-20">
	<div class="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
		<div class="divide-y divide-gray-200 rounded-xl border border-gray-200">
${items}
		</div>
	</div>
</section>

${ctaBanner(prefix, "Still have questions?", "Our team is happy to walk you through every detail.", "Contact Us")}
`;
  files["faqs/faqs.html"] = page({
    title: `FAQs — ${site.name}`,
    description: "Frequently asked questions about our steel buildings, permits, delivery and warranty.",
    prefix,
    main,
    cssFile: "faqs.css",
  });
  files["faqs/faqs.css"] = `/* Estilos específicos de la página FAQs.
   El diseño base compartido vive en ../assets/css/main.css. */
`;
}

// ---- Contact (html + css + js + php) ----
{
  const prefix = "../";
  const options = products
    .map((p) => `\t\t\t\t\t\t\t<option value="${p.title}">${p.title}</option>`)
    .join("\n");

  const main = `
<section class="bg-primary py-16">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		${sectionHeading("Get in Touch", "Request Your Free Quote", "Fill out the form and our team will get back to you with pricing and availability.", true)}
	</div>
</section>

<section class="py-20">
	<div class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
		<div class="lg:col-span-2">
			<div id="quote-success" class="hidden rounded-xl border border-green-200 bg-green-50 p-8 text-center">
				<h3 class="text-lg font-bold text-green-800">Thanks — we got your request!</h3>
				<p class="mt-2 text-sm text-green-700">A member of our team will reach out shortly with your free quote.</p>
			</div>

			<p id="quote-error" class="hidden mb-5 text-sm text-red-600">Please fill in all required fields and try again.</p>

			<form id="quote-form" method="post" action="contact.php" class="space-y-5">
				<div class="hidden" aria-hidden="true">
					<label for="website">Website</label>
					<input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
				</div>

				<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
					<div>
						<label for="name" class="text-sm font-semibold text-dark">Full Name</label>
						<input id="name" name="name" type="text" required class="mt-1.5 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
					</div>
					<div>
						<label for="phone" class="text-sm font-semibold text-dark">Phone Number</label>
						<input id="phone" name="phone" type="tel" required class="mt-1.5 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
					</div>
				</div>

				<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
					<div>
						<label for="email" class="text-sm font-semibold text-dark">Email Address</label>
						<input id="email" name="email" type="email" required class="mt-1.5 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
					</div>
					<div>
						<label for="zip" class="text-sm font-semibold text-dark">ZIP / State</label>
						<input id="zip" name="zip" type="text" required class="mt-1.5 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
					</div>
				</div>

				<div>
					<label for="building_type" class="text-sm font-semibold text-dark">Building Type</label>
					<select id="building_type" name="building_type" required class="mt-1.5 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
						<option value="" disabled selected>Select a building type</option>
${options}
					</select>
				</div>

				<div>
					<label for="message" class="text-sm font-semibold text-dark">Tell us about your project (optional)</label>
					<textarea id="message" name="message" rows="4" class="mt-1.5 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Size, color preferences, timeline, etc."></textarea>
				</div>

				<button type="submit" class="w-full rounded-md bg-accent px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:opacity-90">Get My Free Quote</button>
			</form>
		</div>

		<div class="space-y-6">
			<div>
				<h3 class="text-sm font-semibold uppercase tracking-wide text-gray-400">Phone</h3>
				<a href="tel:${site.phoneHref}" class="mt-1 block text-lg font-semibold text-dark">${site.phone}</a>
			</div>
			<div>
				<h3 class="text-sm font-semibold uppercase tracking-wide text-gray-400">Email</h3>
				<a href="mailto:${site.email}" class="mt-1 block text-lg font-semibold text-dark">${site.email}</a>
			</div>
			<div>
				<h3 class="text-sm font-semibold uppercase tracking-wide text-gray-400">Hours</h3>
				<div class="mt-1 space-y-1 text-sm text-gray-600">
					<p>Monday – Friday: ${site.hoursWeekday}</p>
					<p>Saturday: ${site.hoursSaturday}</p>
					<p>Sunday: ${site.hoursSunday}</p>
				</div>
			</div>
			<div>
				<h3 class="text-sm font-semibold uppercase tracking-wide text-gray-400">Address</h3>
				<p class="mt-1 text-sm text-gray-600">
					${site.address1}<br>
					${site.city}, ${site.state} ${site.zip}
				</p>
			</div>
		</div>
	</div>
</section>
`;

  files["contact/contact.html"] = page({
    title: `Contact Us — ${site.name}`,
    description: "Request your free steel building quote — our team will get back to you with pricing and availability.",
    prefix,
    main,
    cssFile: "contact.css",
    jsFile: "contact.js",
  });

  files["contact/contact.css"] = `/* Estilos específicos de la página Contact.
   El diseño base compartido vive en ../assets/css/main.css. */

/* Marca en rojo los campos requeridos que quedaron inválidos tras
   intentar enviar (la clase la agrega contact.js). */
#quote-form.was-validated input:invalid,
#quote-form.was-validated select:invalid {
	border-color: #98291e;
}
`;

  files["contact/contact.js"] = `// Lógica de la página Contact:
// 1. Muestra el aviso de éxito/error según ?quote=success|error
//    (contact.php redirige de vuelta aquí con ese parámetro).
// 2. Validación ligera en el cliente antes de enviar.
(function () {
	var params = new URLSearchParams(window.location.search);
	var status = params.get("quote");
	var form = document.getElementById("quote-form");
	var success = document.getElementById("quote-success");
	var error = document.getElementById("quote-error");

	if (status === "success" && success && form) {
		success.classList.remove("hidden");
		form.classList.add("hidden");
	} else if (status === "error" && error) {
		error.classList.remove("hidden");
	}

	if (form) {
		form.addEventListener("submit", function (event) {
			if (!form.checkValidity()) {
				event.preventDefault();
				form.classList.add("was-validated");
				if (error) error.classList.remove("hidden");
			}
		});
	}
})();
`;

  const php = [
    "<?php",
    "/**",
    " * Manejador del formulario de cotización (versión estática, sin WordPress).",
    " * Requiere un servidor con PHP (por ejemplo XAMPP). Cada envío:",
    " *   1. Se guarda como una fila en leads.csv (junto a este archivo),",
    " *      para que ningún lead se pierda aunque el correo falle.",
    " *   2. Se intenta enviar por correo con mail() — en XAMPP local no hay",
    " *      servidor de correo, así que ese paso fallará silenciosamente.",
    " * Al terminar redirige a contact.html?quote=success|error.",
    " */",
    "",
    "$to            = '" + site.email + "';",
    "$business_name = '" + site.name.replace(/'/g, "\\'") + "';",
    "",
    "function redirect_with($status) {",
    "\theader('Location: contact.html?quote=' . $status);",
    "\texit;",
    "}",
    "",
    "if ($_SERVER['REQUEST_METHOD'] !== 'POST') {",
    "\tredirect_with('error');",
    "}",
    "",
    "// Honeypot: los visitantes reales nunca llenan este campo oculto.",
    "if (!empty($_POST['website'])) {",
    "\tredirect_with('success');",
    "}",
    "",
    "$name          = trim($_POST['name'] ?? '');",
    "$phone         = trim($_POST['phone'] ?? '');",
    "$email         = trim($_POST['email'] ?? '');",
    "$zip           = trim($_POST['zip'] ?? '');",
    "$building_type = trim($_POST['building_type'] ?? '');",
    "$message       = trim($_POST['message'] ?? '');",
    "",
    "if ($name === '' || $phone === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $zip === '' || $building_type === '') {",
    "\tredirect_with('error');",
    "}",
    "",
    "// 1. Guardar el lead en leads.csv (protegido por el .htaccess de esta carpeta).",
    "$csv = fopen(__DIR__ . '/leads.csv', 'a');",
    "if ($csv) {",
    "\tfputcsv($csv, array(date('Y-m-d H:i:s'), $name, $phone, $email, $zip, $building_type, $message));",
    "\tfclose($csv);",
    "}",
    "",
    "// 2. Intentar enviar el correo de aviso.",
    "$subject = '[' . $business_name . '] New quote request from ' . $name;",
    "$body    = \"New quote request:\\n\\n\"",
    "\t. 'Name: ' . $name . \"\\n\"",
    "\t. 'Phone: ' . $phone . \"\\n\"",
    "\t. 'Email: ' . $email . \"\\n\"",
    "\t. 'ZIP/State: ' . $zip . \"\\n\"",
    "\t. 'Building type: ' . $building_type . \"\\n\"",
    "\t. 'Message: ' . $message . \"\\n\";",
    "$headers = 'Reply-To: ' . $name . ' <' . $email . '>';",
    "",
    "@mail($to, $subject, $body, $headers);",
    "",
    "redirect_with('success');",
  ].join("\n") + "\n";
  files["contact/contact.php"] = php;

  files["contact/.htaccess"] = `# Impide descargar la lista de leads desde el navegador.
<Files "leads.csv">
	Require all denied
</Files>
`;
}

// ---- Pricing ----
{
  const prefix = "../";
  const blocks = products
    .map((p) => {
      const rows = p.models
        .map(
          (m) => `\t\t\t\t\t<div class="flex items-center justify-between rounded-lg border border-gray-200 p-4">
						<div>
							<p class="font-semibold text-dark">${m.name}</p>
							<p class="text-sm text-gray-500">${m.size}</p>
						</div>
						<p class="text-sm font-semibold text-primary">${m.price}</p>
					</div>`
        )
        .join("\n");
      return `\t\t\t<div class="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="text-xl font-bold text-dark">${p.title}</h2>
				<p class="mt-2 text-sm text-gray-600">${p.excerpt}</p>
				<div class="mt-5 flex-1 space-y-4">
${rows}
				</div>
				<a href="${productHref(prefix, p)}" class="mt-6 text-sm font-semibold text-primary hover:underline">View ${p.title} →</a>
			</div>`;
    })
    .join("\n");

  const main = `
<section class="bg-primary py-16">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		${sectionHeading("Pricing", "Transparent Starting Prices", "Every building is custom — these starting prices give you a baseline for planning your project.", true)}
	</div>
</section>

<section class="py-20">
	<div class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
${blocks}
	</div>
	<p class="mx-auto mt-10 w-full max-w-7xl px-4 text-sm text-gray-500 sm:px-6 lg:px-8">Prices vary by state, roof style, gauge and customization. Request a free quote for exact pricing in your area.</p>
</section>

${ctaBanner(prefix, "Want exact pricing for your project?", "Tell us what you need and we'll send you a free, no-obligation quote.", "Get a Free Quote")}
`;
  files["pricing/pricing.html"] = page({
    title: `Pricing — ${site.name}`,
    description: "Starting prices for steel garages, barns, carports, RV covers and commercial buildings.",
    prefix,
    main,
    cssFile: "pricing.css",
  });
  files["pricing/pricing.css"] = `/* Estilos específicos de la página Pricing.
   El diseño base compartido vive en ../assets/css/main.css. */
`;
}

// ---- Dealers / Apply (html + css + js + php) ----
{
  const prefix = "../../";
  const main = `
<section class="bg-primary py-16">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		${sectionHeading("Dealers", "Become an Authorized Dealer", "Join our dealer network and offer steel structures to customers in your area.", true)}
	</div>
</section>

<section class="py-20">
	<div class="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
		<div id="apply-success" class="hidden rounded-xl border border-green-200 bg-green-50 p-8 text-center">
			<h3 class="text-lg font-bold text-green-800">Application received!</h3>
			<p class="mt-2 text-sm text-green-700">Our dealer team will review your application and reach out shortly.</p>
		</div>

		<p id="apply-error" class="hidden mb-5 text-sm text-red-600">Please fill in all required fields and try again.</p>

		<form id="apply-form" method="post" action="apply.php" class="space-y-5">
			<div class="hidden" aria-hidden="true">
				<label for="website">Website</label>
				<input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
			</div>

			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
				<div>
					<label for="name" class="text-sm font-semibold text-dark">Full Name</label>
					<input id="name" name="name" type="text" required class="mt-1.5 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
				</div>
				<div>
					<label for="company" class="text-sm font-semibold text-dark">Company</label>
					<input id="company" name="company" type="text" required class="mt-1.5 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
				</div>
			</div>

			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
				<div>
					<label for="email" class="text-sm font-semibold text-dark">Email Address</label>
					<input id="email" name="email" type="email" required class="mt-1.5 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
				</div>
				<div>
					<label for="phone" class="text-sm font-semibold text-dark">Phone Number</label>
					<input id="phone" name="phone" type="tel" required class="mt-1.5 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
				</div>
			</div>

			<div>
				<label for="state" class="text-sm font-semibold text-dark">State / Coverage Area</label>
				<input id="state" name="state" type="text" required class="mt-1.5 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
			</div>

			<div>
				<label for="message" class="text-sm font-semibold text-dark">Tell us about your business (optional)</label>
				<textarea id="message" name="message" rows="4" class="mt-1.5 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Years in business, current products, sales volume, etc."></textarea>
			</div>

			<button type="submit" class="w-full rounded-md bg-accent px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:opacity-90">Submit Application</button>
		</form>
	</div>
</section>

${ctaBanner(prefix, "Already a dealer?", "Sign in to the dealer portal to manage your orders and quotes.", "Go to Dealer Portal")}
`;

  // El banner final debe llevar al portal, no a contact: se ajusta el href.
  files["dealers/apply/apply.html"] = page({
    title: `Dealer Application — ${site.name}`,
    description: "Apply to become an authorized dealer and offer our steel structures in your area.",
    prefix,
    main,
    cssFile: "apply.css",
    jsFile: "apply.js",
  }).replace(
    `<a href="${prefix}contact/contact.html" class="inline-flex items-center justify-center rounded-md bg-accent px-8 py-3 text-base font-semibold text-white shadow-sm transition hover:opacity-90">\n\t\t\tGo to Dealer Portal\n\t\t</a>`,
    `<a href="../portal/portal.html" class="inline-flex items-center justify-center rounded-md bg-accent px-8 py-3 text-base font-semibold text-white shadow-sm transition hover:opacity-90">\n\t\t\tGo to Dealer Portal\n\t\t</a>`
  );

  files["dealers/apply/apply.css"] = `/* Estilos específicos de la página Dealer Application.
   El diseño base compartido vive en ../../assets/css/main.css. */

#apply-form.was-validated input:invalid,
#apply-form.was-validated select:invalid {
	border-color: #98291e;
}
`;

  files["dealers/apply/apply.js"] = `// Lógica de la página Dealer Application:
// muestra éxito/error según ?apply=success|error (apply.php redirige aquí)
// y valida en el cliente antes de enviar.
(function () {
	var params = new URLSearchParams(window.location.search);
	var status = params.get("apply");
	var form = document.getElementById("apply-form");
	var success = document.getElementById("apply-success");
	var error = document.getElementById("apply-error");

	if (status === "success" && success && form) {
		success.classList.remove("hidden");
		form.classList.add("hidden");
	} else if (status === "error" && error) {
		error.classList.remove("hidden");
	}

	if (form) {
		form.addEventListener("submit", function (event) {
			if (!form.checkValidity()) {
				event.preventDefault();
				form.classList.add("was-validated");
				if (error) error.classList.remove("hidden");
			}
		});
	}
})();
`;

  files["dealers/apply/apply.php"] = [
    "<?php",
    "/**",
    " * Manejador del formulario de solicitud de dealers.",
    " * Igual que contact/contact.php: guarda cada solicitud en",
    " * dealer-leads.csv (protegido por el .htaccess de esta carpeta),",
    " * intenta avisar por correo y redirige a apply.html?apply=success|error.",
    " */",
    "",
    "$to            = '" + site.email + "';",
    "$business_name = '" + site.name.replace(/'/g, "\\'") + "';",
    "",
    "function redirect_with($status) {",
    "\theader('Location: apply.html?apply=' . $status);",
    "\texit;",
    "}",
    "",
    "if ($_SERVER['REQUEST_METHOD'] !== 'POST') {",
    "\tredirect_with('error');",
    "}",
    "",
    "if (!empty($_POST['website'])) {",
    "\tredirect_with('success');",
    "}",
    "",
    "$name    = trim($_POST['name'] ?? '');",
    "$company = trim($_POST['company'] ?? '');",
    "$email   = trim($_POST['email'] ?? '');",
    "$phone   = trim($_POST['phone'] ?? '');",
    "$state   = trim($_POST['state'] ?? '');",
    "$message = trim($_POST['message'] ?? '');",
    "",
    "if ($name === '' || $company === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $phone === '' || $state === '') {",
    "\tredirect_with('error');",
    "}",
    "",
    "$csv = fopen(__DIR__ . '/dealer-leads.csv', 'a');",
    "if ($csv) {",
    "\tfputcsv($csv, array(date('Y-m-d H:i:s'), $name, $company, $email, $phone, $state, $message));",
    "\tfclose($csv);",
    "}",
    "",
    "$subject = '[' . $business_name . '] New dealer application from ' . $company;",
    "$body    = \"New dealer application:\\n\\n\"",
    "\t. 'Name: ' . $name . \"\\n\"",
    "\t. 'Company: ' . $company . \"\\n\"",
    "\t. 'Email: ' . $email . \"\\n\"",
    "\t. 'Phone: ' . $phone . \"\\n\"",
    "\t. 'State: ' . $state . \"\\n\"",
    "\t. 'Message: ' . $message . \"\\n\";",
    "$headers = 'Reply-To: ' . $name . ' <' . $email . '>';",
    "",
    "@mail($to, $subject, $body, $headers);",
    "",
    "redirect_with('success');",
  ].join("\n") + "\n";

  files["dealers/apply/.htaccess"] = `# Impide descargar la lista de solicitudes desde el navegador.
<Files "dealer-leads.csv">
	Require all denied
</Files>
`;
}

// ---- Dealers / Portal (login: html + css + js + php) ----
{
  const prefix = "../../";
  const main = `
<section class="flex flex-1 items-center justify-center bg-gray-50 py-24">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="portal-card mx-auto rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
			<div class="text-center">
				<img src="${prefix}assets/images/logo/logo-header.png" alt="${site.name}" class="portal-logo">
				<h1 class="mt-4 text-2xl font-bold text-dark">Dealer Portal</h1>
				<p class="mt-2 text-sm text-gray-600">Sign in to manage your quotes and orders.</p>
			</div>

			<p id="login-error" class="hidden mt-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">Invalid credentials. Dealer accounts are provisioned by our team — <a href="../apply/apply.html" class="font-semibold underline">apply here</a> if you don't have one yet.</p>

			<form id="login-form" method="post" action="portal.php" class="mt-6 space-y-5">
				<div>
					<label for="email" class="text-sm font-semibold text-dark">Email Address</label>
					<input id="email" name="email" type="email" required autocomplete="username" class="mt-1.5 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
				</div>
				<div>
					<label for="password" class="text-sm font-semibold text-dark">Password</label>
					<input id="password" name="password" type="password" required autocomplete="current-password" class="mt-1.5 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
				</div>
				<button type="submit" class="w-full rounded-md bg-primary px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:opacity-90">Sign In</button>
			</form>

			<p class="mt-6 text-center text-sm text-gray-500">Not a dealer yet? <a href="../apply/apply.html" class="font-semibold text-primary hover:underline">Apply to join our network</a></p>
		</div>
	</div>
</section>
`;
  files["dealers/portal/portal.html"] = page({
    title: `Dealer Portal — ${site.name}`,
    description: "Sign in to the dealer portal.",
    prefix,
    main,
    cssFile: "portal.css",
    jsFile: "portal.js",
  });

  files["dealers/portal/portal.css"] = `/* Estilos específicos del Dealer Portal (login).
   El diseño base compartido vive en ../../assets/css/main.css. */

.portal-card {
	max-width: 26rem;
}
`;

  files["dealers/portal/portal.js"] = `// Muestra el aviso de error del login según ?login=error
// (portal.php redirige aquí — todavía no hay backend real de cuentas).
(function () {
	var params = new URLSearchParams(window.location.search);
	if (params.get("login") === "error") {
		var error = document.getElementById("login-error");
		if (error) error.classList.remove("hidden");
	}
})();
`;

  files["dealers/portal/portal.php"] = [
    "<?php",
    "/**",
    " * Login del Dealer Portal — PLANTILLA SIN BACKEND REAL.",
    " * Todavía no existe un sistema de cuentas de dealers, así que todo",
    " * intento de login responde 'credenciales inválidas'. Cuando exista el",
    " * backend real, aquí va la verificación (password_verify contra la base",
    " * de datos, sesión, redirección al panel, etc.).",
    " */",
    "",
    "if ($_SERVER['REQUEST_METHOD'] !== 'POST') {",
    "\theader('Location: portal.html');",
    "\texit;",
    "}",
    "",
    "header('Location: portal.html?login=error');",
    "exit;",
  ].join("\n") + "\n";
}

// ---- Terms ----
{
  const prefix = "../";
  const main = `
<section class="py-20">
	<div class="mx-auto w-full max-w-3xl space-y-4 px-4 text-sm text-gray-600 sm:px-6 lg:px-8">
		<h1 class="text-3xl font-bold text-dark">Terms &amp; Conditions</h1>
		<p>This is placeholder legal content. Replace it with your business's actual terms and conditions, reviewed by a qualified attorney, before launching ${site.name} publicly.</p>
	</div>
</section>
`;
  files["terms/terms.html"] = page({
    title: `Terms & Conditions — ${site.name}`,
    description: `Terms and conditions for ${site.name}.`,
    prefix,
    main,
    cssFile: "terms.css",
  });
  files["terms/terms.css"] = `/* Estilos específicos de la página Terms.
   El diseño base compartido vive en ../assets/css/main.css. */
`;
}

// ---- Privacy ----
{
  const prefix = "../";
  const main = `
<section class="py-20">
	<div class="mx-auto w-full max-w-3xl space-y-4 px-4 text-sm text-gray-600 sm:px-6 lg:px-8">
		<h1 class="text-3xl font-bold text-dark">Privacy Policy</h1>
		<p>This is placeholder legal content. Replace it with your business's actual privacy policy, reviewed by a qualified attorney, before launching ${site.name} publicly, especially once analytics or marketing pixels are added.</p>
	</div>
</section>
`;
  files["privacy/privacy.html"] = page({
    title: `Privacy Policy — ${site.name}`,
    description: `Privacy policy for ${site.name}.`,
    prefix,
    main,
    cssFile: "privacy.css",
  });
  files["privacy/privacy.css"] = `/* Estilos específicos de la página Privacy.
   El diseño base compartido vive en ../assets/css/main.css. */
`;
}

// ---- 404 ----
{
  const prefix = "../";
  const main = `
<section class="flex flex-1 items-center justify-center py-24">
	<div class="mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
		<p class="text-sm font-semibold uppercase tracking-wide text-accent">404</p>
		<h1 class="mt-2 text-3xl font-bold text-dark">Page not found</h1>
		<p class="mt-3 text-gray-600">The page you're looking for doesn't exist or has moved.</p>
		<a href="${prefix}index.html" class="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white">Back to Home</a>
	</div>
</section>
`;
  files["404/404.html"] = page({
    title: `Page not found — ${site.name}`,
    description: "Page not found.",
    prefix,
    main,
    cssFile: "404.css",
  });
  files["404/404.css"] = `/* Estilos específicos de la página 404.
   El diseño base compartido vive en ../assets/css/main.css. */
`;
}

// ---- README ----
files["README.md"] = `# ${site.name} — sitio estático (HTML/CSS/JS/PHP)

Conversión a HTML/CSS estático del tema WordPress \`ironclad-steel\`
(mismo diseño Tailwind, mismo contenido demo), con **una carpeta por
página**: cada carpeta contiene el \`.html\` de la página, su \`.css\`
propio y, cuando hace falta, su \`.js\` y \`.php\`.

## Estructura

\`\`\`
sitio-html/
  index.html + index.css      Portada (en la raíz, como pediste)
  assets/                     Recursos compartidos por todas las páginas
    css/main.css              Tailwind compilado (el diseño completo)
    css/site.css              Estilos propios compartidos (mega-menú del header)
    js/main.js                Menú móvil (todas las páginas)
    js/motion.js              Animaciones de scroll (solo portada)
    js/shader-hero.js         Fondo animado WebGL del hero (solo portada)
    images/logo/              Logo real: logo.png (original) y
                              logo-header.png (versión liviana usada en
                              header, footer, portal y favicon)
    images/                   Placeholders SVG (hero, productos…)
  products/
    garages/garages.html + garages.css
    carports/ · barns/ · commercial/ · utility-units/ · rv-covers/
    lean-tos/ · combo-units/  (igual: carpeta con html + css)
  pricing/pricing.html + pricing.css
  dealers/
    apply/apply.html + apply.css + apply.js + apply.php + .htaccess
    portal/portal.html + portal.css + portal.js + portal.php  (login)
  about/about.html + about.css
  financing/financing.html + financing.css
  faqs/faqs.html + faqs.css
  contact/contact.html + contact.css + contact.js + contact.php + .htaccess
  terms/terms.html + terms.css
  privacy/privacy.html + privacy.css
  404/404.html + 404.css
\`\`\`

## Navegación (desplegables por columna)

En escritorio, la barra superior muestra Product · Financing · Pricing ·
Dealers · About Us. Al pasar el mouse (o con Tab) sobre un ítem se
despliega **solo su propio menú**:
**Product** → Garages, Carports, Barns, Commercial Structures, Utility
Units, RV Covers, Lean-Tos · **Financing** → Heartland Capital RTO, HSF
Portal, RTO National · **Pricing** → enlace directo (sin desplegable) ·
**Dealers** → Apply, Portal · **About Us** → Area, Staff, Reviews.
En móvil se usa el menú hamburguesa con los mismos grupos. Los enlaces
de Financing llevan a anclas de la página Financing — cuando tengas las
URLs reales de los portales (HSF, RTO National), cambialas regenerando
el sitio.

El **Dealer Portal** (\`dealers/portal/\`) es la plantilla de login:
todavía no hay sistema de cuentas, así que \`portal.php\` siempre
responde "credenciales inválidas". El backend real va ahí.

## Cómo verlo

- **Solo HTML**: abrí \`index.html\` con doble clic — todo funciona
  menos el envío real del formulario de contacto.
- **Con PHP (formulario funcionando)**: copiá esta carpeta dentro de
  \`C:\\xampp\\htdocs\\\` y entrá a \`http://localhost/sitio-html/\`.
  Los envíos del formulario se guardan en \`contact/leads.csv\` y se
  intenta enviar un correo a la dirección configurada en
  \`contact/contact.php\` (en XAMPP local el correo no sale, pero el
  CSV siempre se guarda).

## Cómo editar

- **Textos**: directamente en el \`.html\` de cada carpeta.
- **Colores de marca**: la paleta AZ Sunset vive en el bloque \`:root\`
  de \`assets/css/site.css\` (oscuros #121212 / #2A2F35 / #5E666E /
  #B8BEC4, dorado #D89A1F, sol #F4B400, naranja #D66C1D, rojo #98291E,
  claro #F5F5F5) y pisa los valores por defecto de \`main.css\`.
  Cambiá ahí cualquier color.
- **Estilos de una sola página**: en el \`.css\` de su carpeta.
- **Imágenes**: reemplazá los SVG placeholder en \`assets/images/\`
  manteniendo el mismo nombre de archivo.
- **Correo del formulario**: variable \`$to\` al inicio de
  \`contact/contact.php\`.

Nota: las clases de diseño son de Tailwind CSS v4 ya compilado en
\`assets/css/main.css\`; si agregás clases Tailwind *nuevas* en el HTML
que no existan ya en ese archivo, agregá la regla equivalente en el
\`.css\` de la página.
`;

// Placeholders SVG con la paleta de marca (fondos negros, líneas doradas).
function placeholderSvg(label, w, h, bg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="${bg}"/>
  <g fill="none" stroke="#d89a1f" stroke-width="2" opacity="0.35">
    <line x1="0" y1="0" x2="${w}" y2="${h}"/>
    <line x1="${w}" y1="0" x2="0" y2="${h}"/>
  </g>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#ffffff" opacity="0.85">${label}</text>
</svg>
`;
}
for (const p of products) {
  files[`assets/images/products/${p.slug}/card-placeholder.svg`] = placeholderSvg(p.title, 800, 600, "#2a2f35");
  files[`assets/images/products/${p.slug}/hero-placeholder.svg`] = placeholderSvg(p.title, 1600, 700, "#121212");
}
files["assets/images/hero/hero-placeholder.svg"] = placeholderSvg(site.shortName, 1600, 700, "#121212");
files["assets/images/testimonials/avatar-placeholder.svg"] = placeholderSvg("", 200, 200, "#5e666e");

// -------------------------------------------------------------- escribir
for (const [rel, content] of Object.entries(files)) {
  const abs = join(OUT, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, content, "utf8");
}

// Copiar assets compartidos desde el tema (solo si el tema todavía existe;
// tras la conversión inicial el tema WordPress fue eliminado y los assets
// ya viven en sitio-html/assets/).
import { existsSync } from "node:fs";
if (existsSync(THEME)) {
  mkdirSync(join(OUT, "assets/css"), { recursive: true });
  cpSync(join(THEME, "assets/css/main.css"), join(OUT, "assets/css/main.css"));
  cpSync(join(THEME, "assets/js"), join(OUT, "assets/js"), { recursive: true });
  cpSync(join(THEME, "assets/images"), join(OUT, "assets/images"), { recursive: true });
}

console.log("OK — páginas generadas:", Object.keys(files).length);
