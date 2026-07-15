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
  // Dominio placeholder — cambialo por el real antes de publicar (se usa en
  // las URLs absolutas de Open Graph y del schema LocalBusiness).
  url: "https://www.azsunsetsteel.com",
  tagline: "Giving Life to Your Projects",
  shortTagline: "Custom-built steel structures, delivered and installed",
  phone: "(480) 555-0199",
  phoneHref: "+14805550199",
  email: "quotes@azsunsetsteel.com",
  address1: "2450 W Deer Valley Rd, Suite 12",
  city: "Phoenix",
  state: "AZ",
  zip: "85027",
  hoursWeekday: "8:00 AM – 6:00 PM",
  hoursSaturday: "9:00 AM – 4:00 PM",
  hoursSunday: "Closed",
  // Ciudades y regiones de Arizona donde se entrega e instala (antes eran
  // estados; ahora la empresa es 100% Arizona). Se usan como "chips" en la
  // sección "Where We Build" y para el contador de cobertura.
  states: ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale", "Gilbert", "Glendale", "Flagstaff", "Prescott", "Yuma", "Casa Grande", "Kingman"],
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
    location: "Phoenix, AZ",
    quote:
      "From the first call to the final install, the team walked us through every option. Our garage went up in under a week and it handles the Phoenix heat without a creak.",
  },
  {
    name: "Marisol D.",
    location: "Tucson, AZ",
    quote:
      "Great price, great communication, and the crew that installed our barn was fast and professional. Would recommend to anyone in Southern Arizona.",
  },
  {
    name: "Dusty H.",
    location: "Mesa, AZ",
    quote:
      "The financing options made it easy to get exactly the size building we needed without waiting years to save up. Couldn't be happier.",
  },
  {
    name: "Dakota S.",
    location: "Prescott, AZ",
    quote:
      "Our RV cover has already shrugged off two monsoon storms without a scratch. Solid steel, solid company — built for Arizona weather.",
  },
  {
    name: "Carlos M.",
    location: "Gilbert, AZ",
    quote:
      "The shade carport dropped our patio temperature by what feels like twenty degrees. Clean install, on schedule, and the crew hauled away every scrap.",
  },
  {
    name: "Angela T.",
    location: "Chandler, AZ",
    quote:
      "I turned my extra bay into a real workshop. They helped me spec the right height and door, and the whole thing was permitted without a headache.",
  },
  {
    name: "Ray V.",
    location: "Flagstaff, AZ",
    quote:
      "Up here the snow load matters, and they engineered the roof for it. Two winters in and it hasn't budged an inch. Worth every penny.",
  },
  {
    name: "Priya S.",
    location: "Scottsdale, AZ",
    quote:
      "We needed a commercial building fast for the business, and their team handled engineering, delivery and install end to end. Truly one point of contact.",
  },
  {
    name: "Jesse W.",
    location: "Yuma, AZ",
    quote:
      "Yuma sun is brutal on everything, but the finish still looks brand new. Great value and the price they quoted was the price we paid.",
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
    a: "We deliver and install across all of Arizona — from Phoenix, Mesa and Tucson to the high country around Flagstaff and Prescott. Contact us to confirm scheduling in your area.",
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
    q: "How long does delivery and installation take?",
    a: "Most builds are delivered and installed within 4–8 weeks of your order, depending on size and site preparation.",
  },
];

const whyUs = [
  {
    title: "Engineered & certified",
    desc: "Wind- and snow-rated, heavy-gauge steel built to Arizona code on every project.",
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
        { label: "HSF", href: `${prefix}financing/financing.html#hsf-portal` },
        { label: "RTO National", href: `${prefix}financing/financing.html#rto-national` },
      ],
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
        { label: "Our Work", href: `${prefix}our-work/our-work.html` },
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
        return `\t\t\t<a href="${c.href}" class="flex h-20 items-center gap-1.5 text-sm font-semibold text-dark hover:text-primary">${c.icon}${c.label}</a>`;
      }
      const links = c.links
        .map(
          (l) =>
            `\t\t\t\t\t<a href="${l.href}" class="block rounded px-3 py-2 text-sm text-dark hover:bg-gray-50 hover:text-primary">${l.label}</a>`
        )
        .join("\n");
      return `\t\t\t<div class="group relative">
				<a href="${c.href}" class="flex h-20 items-center gap-1.5 text-sm font-semibold text-dark hover:text-primary" aria-haspopup="true">
					${c.icon}${c.label}
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
      return `\t\t<p class="mt-4 mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">${c.icon}${c.label}</p>
		<div class="flex flex-col">
${links}
		</div>`;
    })
    .join("\n");

  const icPin = '<svg class="util-ic" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M8 1.6a4.4 4.4 0 0 0-4.4 4.4c0 3.1 4.4 8 4.4 8s4.4-4.9 4.4-8A4.4 4.4 0 0 0 8 1.6z"/><circle cx="8" cy="6" r="1.6"/></svg>';
  const icMail = '<svg class="util-ic" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="2" y="3.5" width="12" height="9" rx="1.6"/><path d="M2.6 4.6 8 8.4l5.4-3.8"/></svg>';
  const icPhone = '<svg class="phone-ic" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M4 3h3l1.4 3.9-2 1.4a10 10 0 0 0 5 5l1.4-2 3.9 1.4V17a1.5 1.5 0 0 1-1.6 1.5A14 14 0 0 1 2.5 5.6 1.5 1.5 0 0 1 4 4z"/></svg>';
  const icArrow = '<svg class="cta-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"/></svg>';
  const icFb = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8c0-.9.3-1.5 1.6-1.5H17V3.9c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.1H8v3h2.8v8z"/></svg>';
  const icIg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4.6"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.1" cy="6.9" r="1" fill="currentColor" stroke="none"/></svg>';
  const icLi = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0zM3.3 8.3h3.28V21H3.3zM9.2 8.3h3.14v1.74h.05c.44-.83 1.5-1.71 3.1-1.71 3.3 0 3.9 2.18 3.9 5V21h-3.27v-6.8c0-1.62-.03-3.7-2.26-3.7-2.26 0-2.6 1.77-2.6 3.6V21H9.2z"/></svg>';

  return `<header class="site-header sticky top-0 z-50 bg-white/95 backdrop-blur">
		<div class="header-main mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
			<a href="${prefix}index.html" class="logo-badge flex items-center gap-2 text-xl font-bold text-primary">
				<img src="${prefix}assets/images/logo/logo-header.png" alt="${site.name}" class="site-logo">
				<span class="sr-only">${site.name}</span>
			</a>

			<nav class="site-nav hidden h-20 items-center gap-8 lg:flex" aria-label="Main">
${navItems}
			</nav>

			<div class="hidden items-center gap-3 lg:flex">
				<a href="tel:${site.phoneHref}" class="phone-pill flex items-center gap-2">${icPhone}<span>${site.phone}</span></a>
				<a href="${prefix}contact/contact.html" class="cta-quote bg-accent flex items-center gap-2">
					<span>Get a Free Quote</span>${icArrow}
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
				<a href="tel:${site.phoneHref}" class="phone-pill inline-flex items-center justify-center gap-2">${icPhone}<span>${site.phone}</span></a>
				<a href="${prefix}contact/contact.html" class="cta-quote bg-accent inline-flex items-center justify-center gap-2"><span>Get a Free Quote</span>${icArrow}</a>
			</div>
		</div>
	</header>`;
}

function footer(prefix) {
  const footProducts = products
    .map(
      (p) =>
        `\t\t\t\t\t<li><a href="${productHref(prefix, p)}" class="footer-link hover:text-white">${p.title}</a></li>`
    )
    .join("\n");

  const icFb = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/></svg>`;
  const icIg = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.9 4.9 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.88 4.88 0 0 1-1.153 1.772 4.9 4.9 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.9 4.9 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.9 4.9 0 0 1 1.153-1.772A4.9 4.9 0 0 1 5.45 2.525c.638-.248 1.363-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/></svg>`;
  const icLi = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z"/></svg>`;

  return `<footer class="site-footer mt-auto bg-dark text-gray-300">
	<span class="footer-hairline" aria-hidden="true"></span>
	<div class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
		<div class="footer-col" data-footer-reveal>
			<img src="${prefix}assets/images/logo/logo-header.png" alt="" class="footer-logo">
			<p class="mt-4 text-lg font-bold text-white">${site.name}</p>
			<p class="mt-3 text-sm text-gray-400">${site.shortTagline}</p>
			<div class="mt-4 space-y-1 text-sm">
				<p><span class="text-gray-400">Monday – Friday:</span> ${site.hoursWeekday}</p>
				<p><span class="text-gray-400">Saturday:</span> ${site.hoursSaturday}</p>
				<p><span class="text-gray-400">Sunday:</span> ${site.hoursSunday}</p>
			</div>
			<div class="mt-5 flex gap-3">
				<a href="${site.facebook}" class="footer-social" aria-label="Facebook">${icFb}</a>
				<a href="${site.instagram}" class="footer-social" aria-label="Instagram">${icIg}</a>
				<a href="${site.linkedin}" class="footer-social" aria-label="LinkedIn">${icLi}</a>
			</div>
		</div>

		<div class="footer-col" data-footer-reveal>
			<p class="footer-col-title text-sm font-semibold uppercase tracking-wide text-white">Products</p>
			<ul class="mt-4 space-y-2 text-sm">
${footProducts}
			</ul>
		</div>

		<div class="footer-col" data-footer-reveal>
			<p class="footer-col-title text-sm font-semibold uppercase tracking-wide text-white">Quick Links</p>
			<ul class="mt-4 space-y-2 text-sm">
				<li><a href="${prefix}our-work/our-work.html" class="footer-link hover:text-white">Our Work</a></li>
				<li><a href="${prefix}financing/financing.html" class="footer-link hover:text-white">Financing</a></li>
				<li><a href="${prefix}faqs/faqs.html" class="footer-link hover:text-white">FAQs</a></li>
				<li><a href="${prefix}about/about.html" class="footer-link hover:text-white">About Us</a></li>
				<li><a href="${prefix}contact/contact.html" class="footer-link hover:text-white">Contact</a></li>
			</ul>
		</div>

		<div class="footer-col" data-footer-reveal>
			<p class="footer-col-title text-sm font-semibold uppercase tracking-wide text-white">Company</p>
			<ul class="mt-4 space-y-2 text-sm">
				<li><a href="${prefix}contact/contact.html" class="footer-link hover:text-white">Get a Quote</a></li>
				<li><a href="${prefix}terms/terms.html" class="footer-link hover:text-white">Terms &amp; Conditions</a></li>
				<li><a href="${prefix}privacy/privacy.html" class="footer-link hover:text-white">Privacy Policy</a></li>
			</ul>
			<p class="mt-6 text-sm"><a href="tel:${site.phoneHref}" class="footer-link hover:text-white">${site.phone}</a></p>
			<p class="text-sm"><a href="mailto:${site.email}" class="footer-link hover:text-white">${site.email}</a></p>
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
  const eyebrowClass = light ? "eyebrow-amber" : "eyebrow-red";
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

// Imágenes de producto: SOLO fotos reales de obra que subió el cliente (las de
// assets/images/projects). Nada de fotos de stock de internet. Como todas las
// fotos reales son de garajes, se reparten entre los productos por índice para
// dar variedad. PROJECT_CARD_COVERS son 4:3 (tarjetas); PROJECT_HERO_SHOTS son
// panorámicas (hero de la página de producto).
const PROJECT_CARD_COVERS = [
  "proyecto-1/cover.webp",
  "proyecto-2/cover.webp",
  "proyecto-3/cover.webp",
];
const PROJECT_HERO_SHOTS = [
  "proyecto-1/02.webp",
  "proyecto-2/01.webp",
  "proyecto-3/01.webp",
];
function productImage(prefix, p) {
  const i = Math.max(0, products.indexOf(p));
  const file = PROJECT_CARD_COVERS[i % PROJECT_CARD_COVERS.length];
  return `${prefix}assets/images/projects/${file}`;
}
function productHeroImage(prefix, p) {
  const i = Math.max(0, products.indexOf(p));
  const file = PROJECT_HERO_SHOTS[i % PROJECT_HERO_SHOTS.length];
  return `${prefix}assets/images/projects/${file}`;
}

function productCard(prefix, p) {
  return `<a href="${productHref(prefix, p)}" class="js-reveal-card js-tilt-card group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl" data-reveal-group="products">
					<div class="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
						<img src="${productImage(prefix, p)}" alt="${p.title}" class="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy">
					</div>
					<div class="flex flex-1 flex-col p-5">
						<h3 class="text-lg font-bold text-dark">${p.title}</h3>
						<p class="mt-2 flex-1 text-sm text-gray-600">${p.excerpt}</p>
						<span class="mt-4 text-sm font-semibold text-primary group-hover:underline">View ${p.title} →</span>
					</div>
				</a>`;
}

// Proyectos reales (fotos de obra). Cada carpeta en
// assets/images/projects/<slug>/ tiene cover.webp (portada 4:3) y las tomas
// numeradas 01.webp..NN.webp (mismo edificio en distintos ángulos). El
// lightbox arma las URLs con la base + count. Ver galleryLightbox() y el JS
// de main.js ([data-gallery-base]).
const projects = [
  {
    slug: "proyecto-1",
    tag: "Garage",
    title: "Enclosed Steel Garage",
    location: "Arizona · vertical roof, walk-in door",
    count: 7,
  },
  {
    slug: "proyecto-2",
    tag: "Workshop",
    title: "Three-Bay Steel Garage",
    location: "High country · roll-up doors",
    count: 11,
  },
  {
    slug: "proyecto-3",
    tag: "Garage",
    title: "Two-Bay Garage & Shop",
    location: "Panoramic valley view",
    count: 6,
  },
];

// Icono SVG inline (heroicons-ish) reutilizable en las tarjetas de proyecto.
function icon(name) {
  const paths = {
    camera:
      '<path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"/>',
    expand:
      '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/>',
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">${paths[name] || ""}</svg>`;
}

// Visor de fotos (lightbox) para las galerías de proyectos. Se pinta una vez
// por página; el JS de main.js lo llena al abrir según la tarjeta pulsada.
// Navegación: flechas ‹ ›, miniaturas, teclado (← → Esc) y swipe en táctil.
function galleryLightbox() {
  return `<div class="lightbox" id="project-lightbox" role="dialog" aria-modal="true" aria-label="Project photos" hidden>
	<div class="lightbox-backdrop" data-lightbox-close></div>
	<button type="button" class="lightbox-close" data-lightbox-close aria-label="Close gallery">
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>
	</button>
	<button type="button" class="lightbox-nav lightbox-prev" data-lightbox-prev aria-label="Previous photo">
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/></svg>
	</button>
	<button type="button" class="lightbox-nav lightbox-next" data-lightbox-next aria-label="Next photo">
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>
	</button>
	<figure class="lightbox-stage">
		<img class="lightbox-img" id="lightbox-img" alt="">
		<figcaption class="lightbox-caption">
			<span class="lightbox-title" id="lightbox-title"></span>
			<span class="lightbox-counter" id="lightbox-counter"></span>
		</figcaption>
	</figure>
	<div class="lightbox-thumbs" id="lightbox-thumbs"></div>
</div>`;
}

// Página "HSF Portal": versión resumida del portal de financiación (inspirada
// en HFS Financial). Es una página propia (financing/hsf-portal.html) a la que
// redirige el botón "Request access". `prefix` apunta a la raíz del sitio.
function hsfPortalMain(prefix) {
  const check =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>';
  const benefits = [
    "No home equity or collateral required",
    "No appraisals or prepayment penalties",
    "Soft credit check &mdash; it won&rsquo;t affect your score",
    "Funds in as little as 1 day for qualified buyers",
    "Available in all 50 states",
  ];
  const steps = [
    "Submit a 60-second inquiry with a soft credit check.",
    "Get prequalified with instant loan options the same day.",
    "Upload your documents securely online.",
    "Receive your funds within 48 hours of approval.",
  ];
  return `
<section class="bg-primary py-16">
	<div class="mx-auto w-full max-w-4xl px-4 text-center sm:px-6 lg:px-8">
		<img src="${prefix}assets/images/partners/hsf-logo.webp" alt="HFS Financial" width="326" height="105" class="mx-auto mb-6 h-14 w-auto" loading="lazy">
		<p class="fin-modal-eyebrow">Financing partner</p>
		<h1 class="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">You dream it, we finance it</h1>
		<p class="mx-auto mt-5 max-w-2xl text-lg text-white/85">Simple, fixed-rate financing for your steel building &mdash; no home equity, no appraisals, just a fast online application.</p>
		<div class="mt-8 flex flex-wrap justify-center gap-4">
			<a href="${prefix}contact/contact.html" class="hero-cta-primary">Start your inquiry</a>
			<a href="${prefix}financing/financing.html" class="hero-cta-ghost">Back to financing</a>
		</div>
	</div>
</section>

<section class="py-16">
	<div class="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
		<div class="fin-modal-stats reveal-rise">
			<div class="fin-stat"><b>$1k&ndash;$100k</b><span>Loan amounts</span></div>
			<div class="fin-stat"><b>7.80% APR</b><span>Fixed rates from</span></div>
			<div class="fin-stat"><b>1&ndash;30 yrs</b><span>Flexible terms</span></div>
		</div>
		<ul class="fin-modal-list reveal-rise">
${benefits.map((b) => `\t\t\t<li>${check}<span>${b}</span></li>`).join("\n")}
		</ul>
	</div>
</section>

<section class="bg-gray-50 py-16">
	<div class="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
		${sectionHeading("How it works", "Funded in four simple steps")}
		<div class="fin-steps reveal-rise mx-auto mt-10 max-w-2xl">
${steps.map((s, i) => `\t\t\t<div class="fin-step"><span class="fin-step-num">${i + 1}</span><p>${s}</p></div>`).join("\n")}
		</div>
		<p class="fin-modal-trust mt-10 text-center">100,000+ homeowners funded since 2011 &middot; 3,500+ five-star Trustpilot reviews</p>
		<p class="fin-modal-note mx-auto mt-3 max-w-2xl text-center">HSF Financial is an independent lending partner. Rates and terms shown are illustrative and subject to credit approval.</p>
	</div>
</section>

${ctaBanner(prefix, "Ready to finance your building?", "Start your 60-second inquiry &mdash; it won&rsquo;t affect your credit score.", "Start your inquiry")}
`;
}

// Página "RTO National": versión resumida del portal de alquiler con opción a
// compra (inspirada en rtonational.com). Es una página propia
// (financing/rto-national.html) a la que redirige el botón "Learn more".
function rtoNationalMain(prefix) {
  const check =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>';
  const benefits = [
    "Two ways to pay: lease or finance",
    "$0 down financing available",
    "No credit check on the lease option",
    "No early buyout or cancellation penalties",
    "Fixed APR and predictable monthly payments",
    "Own your building &mdash; buy it out anytime",
  ];
  const steps = [
    "Choose lease or finance and pick the terms that fit your budget.",
    "Get an instant approval decision online or in person, 24/7.",
    "Sign and take your building home with low monthly payments.",
    "Buy out early whenever you&rsquo;re ready &mdash; with no penalty.",
  ];
  return `
<section class="bg-primary py-16">
	<div class="mx-auto w-full max-w-4xl px-4 text-center sm:px-6 lg:px-8">
		<img src="${prefix}assets/images/partners/rto-national-logo.svg" alt="RTO National" width="553" height="275" class="mx-auto mb-6 h-20 w-auto" loading="lazy">
		<p class="fin-modal-eyebrow">Rent-to-own partner</p>
		<h1 class="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">Making success simple</h1>
		<p class="mx-auto mt-5 max-w-2xl text-lg text-white/85">Rent-to-own for your steel building &mdash; quick, easy and flexible. Lease with no credit check, or finance with $0 down.</p>
		<div class="mt-8 flex flex-wrap justify-center gap-4">
			<a href="${prefix}contact/contact.html" class="hero-cta-primary">Check your options</a>
			<a href="${prefix}financing/financing.html" class="hero-cta-ghost">Back to financing</a>
		</div>
	</div>
</section>

<section class="py-16">
	<div class="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
		<div class="fin-modal-stats reveal-rise">
			<div class="fin-stat"><b>$0 down</b><span>Finance option</span></div>
			<div class="fin-stat"><b>No credit check</b><span>Lease option</span></div>
			<div class="fin-stat"><b>Up to $20k</b><span>Building value</span></div>
		</div>
		<ul class="fin-modal-list reveal-rise">
${benefits.map((b) => `\t\t\t<li>${check}<span>${b}</span></li>`).join("\n")}
		</ul>
	</div>
</section>

<section class="bg-gray-50 py-16">
	<div class="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
		${sectionHeading("How it works", "Approved in minutes, yours to own")}
		<div class="fin-steps reveal-rise mx-auto mt-10 max-w-2xl">
${steps.map((s, i) => `\t\t\t<div class="fin-step"><span class="fin-step-num">${i + 1}</span><p>${s}</p></div>`).join("\n")}
		</div>
		<p class="fin-modal-trust mt-10 text-center">BBB-accredited &middot; Nationwide dealer network &middot; Online approvals 24/7</p>
		<p class="fin-modal-note mx-auto mt-3 max-w-2xl text-center">RTO National is an independent rent-to-own partner. Terms, availability and buyout options vary by state and are subject to approval.</p>
	</div>
</section>

${ctaBanner(prefix, "Ready to get started?", "Check your rent-to-own options &mdash; lease with no credit check or finance with $0 down.", "Check your options")}
`;
}

// Página "Heartland Capital RTO": resumen del programa de alquiler con opción a
// compra (inspirada en hci.net). Es una página propia
// (financing/heartland-capital-rto.html) a la que redirige "Ask about RTO".
function heartlandRtoMain(prefix) {
  const check =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>';
  const benefits = [
    "No upfront cost to get started",
    "No credit check and no credit reporting",
    "Month-to-month agreement &mdash; cancel anytime",
    "Early payoff available with no penalties",
    "Every payment is credited toward ownership",
    "Instant approval",
  ];
  const steps = [
    "Complete your rental information.",
    "Submit your first payment by card or check.",
    "Get an instant approval decision.",
    "Make affordable monthly payments &mdash; each one moves you closer to owning.",
  ];
  return `
<section class="bg-primary py-16">
	<div class="mx-auto w-full max-w-4xl px-4 text-center sm:px-6 lg:px-8">
		<img src="${prefix}assets/images/partners/heartland-logo-white.png" alt="Heartland Capital Investments" width="445" height="100" class="mx-auto mb-6 h-14 w-auto" loading="lazy">
		<p class="fin-modal-eyebrow">Rent-to-own partner</p>
		<h1 class="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">Rent today, own it tomorrow</h1>
		<p class="mx-auto mt-5 max-w-2xl text-lg text-white/85">Affordable monthly payments on your steel building &mdash; no credit check, no upfront cost, and every payment works toward ownership.</p>
		<div class="mt-8 flex flex-wrap justify-center gap-4">
			<a href="${prefix}contact/contact.html" class="hero-cta-primary">Ask about RTO</a>
			<a href="${prefix}financing/financing.html" class="hero-cta-ghost">Back to financing</a>
		</div>
	</div>
</section>

<section class="py-16">
	<div class="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
		<div class="fin-modal-stats reveal-rise">
			<div class="fin-stat"><b>$0 upfront</b><span>To get started</span></div>
			<div class="fin-stat"><b>No credit check</b><span>No credit reporting</span></div>
			<div class="fin-stat"><b>Since 2007</b><span>Rent-to-own experts</span></div>
		</div>
		<ul class="fin-modal-list reveal-rise">
${benefits.map((b) => `\t\t\t<li>${check}<span>${b}</span></li>`).join("\n")}
		</ul>
	</div>
</section>

<section class="bg-gray-50 py-16">
	<div class="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
		${sectionHeading("How it works", "From application to ownership")}
		<div class="fin-steps reveal-rise mx-auto mt-10 max-w-2xl">
${steps.map((s, i) => `\t\t\t<div class="fin-step"><span class="fin-step-num">${i + 1}</span><p>${s}</p></div>`).join("\n")}
		</div>
		<p class="fin-modal-trust mt-10 text-center">In business since 2007 &middot; BBB accredited &middot; 1,000+ five-star Google reviews &middot; Serving the continental U.S.</p>
		<p class="fin-modal-note mx-auto mt-3 max-w-2xl text-center">Heartland Capital Investments is an independent rent-to-own partner. Terms and availability vary by state and are subject to approval.</p>
	</div>
</section>

${ctaBanner(prefix, "Ready to rent to own?", "No credit check, no upfront cost &mdash; ask us how rent-to-own works for your building.", "Ask about RTO")}
`;
}

// Datos estructurados schema.org para SEO local (rich results de Google:
// nombre, dirección, teléfono, horarios, zona de servicio y rating). Va en la
// portada. OJO: usa site.url (dominio placeholder) — cambialo por el real.
function localBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: site.name,
    image: `${site.url}/assets/images/logo/logo-header.png`,
    logo: `${site.url}/assets/images/logo/logo-header.png`,
    url: site.url,
    telephone: site.phoneHref,
    email: site.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address1,
      addressLocality: site.city,
      addressRegion: site.state,
      postalCode: site.zip,
      addressCountry: "US",
    },
    areaServed: site.states.map((c) => ({ "@type": "City", name: `${c}, AZ` })),
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "16:00" },
    ],
    aggregateRating: { "@type": "AggregateRating", ratingValue: site.googleRating, reviewCount: site.googleReviews },
    sameAs: [site.facebook, site.instagram, site.linkedin],
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>\n`;
}

function page({ title, description, prefix, main, extraHead = "", extraScripts = "", cssFile, jsFile }) {
  return `<!DOCTYPE html>
<html lang="en" class="h-full antialiased">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>${title}</title>
	<meta name="description" content="${description}">
	<meta name="theme-color" content="#0d0d0d">
	<link rel="icon" type="image/png" href="${prefix}assets/images/logo/logo-header.png">
	<meta property="og:type" content="website">
	<meta property="og:site_name" content="${site.name}">
	<meta property="og:title" content="${title}">
	<meta property="og:description" content="${description}">
	<meta property="og:image" content="${site.url}/assets/images/logo/logo-header.png">
	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:title" content="${title}">
	<meta name="twitter:description" content="${description}">
	<meta name="twitter:image" content="${site.url}/assets/images/logo/logo-header.png">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Hanken+Grotesk:wght@300;400;500;600;700&display=swap">
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
<script src="${prefix}assets/js/sound.js"></script>
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

/* ============ Paleta de marca AZ Sunset — Steel & Sunset ============
   Tema NEGRO + NARANJA: lienzo casi negro con el naranja de marca como color
   PROTAGONISTA (CTAs, links, precios, números, estrellas, eyebrows, brillos),
   y texto claro para lectura. Estas variables pisan las de main.css (este
   archivo carga después), así que casi todo el re-tematizado sucede acá sin
   tocar el Tailwind ya compilado.
     Negro:   #0D0D0D fondo · #141414 / #171717 superficies · #000 footer
     Naranja: #F26A21 marca/CTA/acento · #FF8033 hover · #F9B24A ámbar/brillo
     Texto:   #E8E8E8 cuerpo · #F4F4F4 títulos/labels */
:root {
	--color-primary: #161616;       /* casi negro: fondo de secciones "bg-primary" (heros, CTA, footer alterno) */
	--color-primary-dark: #0d0d0d;  /* negro: extremo del degradado del hero */
	--color-primary-light: #2a2a2a; /* gris muy oscuro */
	--color-accent: #f26a21;        /* NARANJA protagonista: CTA, links, precios, números */
	--color-accent-hover: #ff8033;  /* naranja más brillante: hover de los CTA */
	--color-sun: #f9b24a;           /* ámbar: brillo del hero, estrellas, detalles cálidos */
	--color-brand-red: #98291e;     /* rojo del logo: errores de formulario */

	--color-dark: #f4f4f4;          /* "text-dark" (títulos/labels) ahora es claro sobre negro */

	/* Texto claro sobre superficies negras (hero y secciones bg-primary). */
	--color-blue-100: #ededed;      /* subtítulos */
	--color-blue-200: #bdbdbd;      /* rótulos apagados */

	/* Escala de grises remapeada a oscuro (el tema base asumía fondo blanco). */
	--color-gray-50: #141414;       /* secciones alternas */
	--color-gray-100: #1a1a1a;      /* fondos suaves / imágenes */
	--color-gray-200: #2b2b2b;      /* bordes de tarjetas y divisores */
	--color-gray-300: #3a3a3a;      /* bordes de inputs */
	--color-gray-400: #8f8f8f;      /* rótulos apagados */
	--color-gray-500: #a2a2a2;      /* texto terciario */
	--color-gray-600: #c6c6c6;      /* texto secundario */
	--color-gray-700: #d8d8d8;      /* texto de párrafos largos */
}

/* ---- Superficies oscuras (clases del tema que asumían fondo blanco) ---- */
body { background-color: #0d0d0d; color: #e8e8e8; }
.bg-white { background-color: #171717; }                       /* tarjetas y paneles */
.bg-white\\/95 { background-color: rgba(13, 13, 13, 0.9); }    /* barra del header */
.bg-dark { background-color: #000; }                           /* footer, el más negro */
.text-dark { color: #f4f4f4; }                                 /* títulos y labels claros */
.text-gray-300 { color: #c6c6c6; }                             /* texto del footer */

/* ---- El NARANJA toma protagonismo (utilidades que eran del primario) ---- */
.text-primary { color: var(--color-accent); }                  /* links, precios, números, "View →" */
.border-primary { border-color: var(--color-accent); }
.bg-primary\\/10 { background-color: rgba(242, 106, 33, 0.14); } /* círculos numerados */

/* Campos de formulario con relleno propio sobre el negro. */
form input:not([type="hidden"]), form select, form textarea {
	background-color: #141414;
	color: #ededed;
}

/* CTAs sólidos: relleno naranja con texto casi negro (look naranja+negro y
   contraste AA, que el texto blanco sobre naranja no alcanza). Los botones
   "bg-primary" (Sign In, Back to Home) pasan a naranja para que se vean. */
a.bg-accent, button.bg-accent,
a.bg-primary, button.bg-primary {
	color: #160a02 !important;
}
a.bg-primary, button.bg-primary { background-color: var(--color-accent); }
.hover\\:bg-primary:hover { background-color: var(--color-accent) !important; color: #160a02 !important; }

/* ===== Micro-interacciones del header (hover con el cursor) =====
   Subrayado que crece, chevron que gira, dropdown con slide, sub-links que
   se desplazan, logo con zoom y CTA con brillo + imán (el imán en main.js).
   Todo scoped al <header> y desactivado con prefers-reduced-motion. */

/* Logo: leve zoom/tilt. */
header .site-logo { transition: transform .35s cubic-bezier(.2, .7, .3, 1); }
header a:hover .site-logo { transform: scale(1.06) rotate(-1deg); }

/* Links de nav (nivel superior): subrayado naranja que crece desde el centro
   + micro-lift. */
.site-nav > a,
.site-nav > .group > a { position: relative; transition: color .2s ease, transform .2s ease; }
.site-nav > a::after,
.site-nav > .group > a::after {
	content: "";
	position: absolute;
	left: 0; right: 0; bottom: 1.5rem;
	height: 2px;
	background: var(--color-accent);
	transform: scaleX(0);
	transform-origin: center;
	transition: transform .3s cubic-bezier(.2, .7, .3, 1);
}
.site-nav > a:hover::after,
.site-nav > .group:hover > a::after,
.site-nav > .group:focus-within > a::after { transform: scaleX(1); }
.site-nav > a:hover,
.site-nav > .group:hover > a { transform: translateY(-1px); }

/* Icono guía de cada ítem del nav (Product, Financing, …). */
.site-nav .mega-icon { width: 1.05rem; height: 1.05rem; flex: none; color: var(--color-accent); transition: transform .28s cubic-bezier(.2, .7, .3, 1); }
#ironclad-mobile-nav .mega-icon { width: 1rem; height: 1rem; flex: none; color: var(--color-accent); }
.site-nav > a:hover .mega-icon,
.site-nav > .group:hover > a .mega-icon,
.site-nav > .group:focus-within > a .mega-icon { transform: translateY(-1px) scale(1.08); }

/* Chevron (el svg SIN clase .mega-icon): gira al abrir el menú. */
.site-nav > .group > a svg:not(.mega-icon) { transition: transform .28s cubic-bezier(.2, .7, .3, 1); }
.site-nav > .group:hover > a svg:not(.mega-icon),
.site-nav > .group:focus-within > a svg:not(.mega-icon) { transform: rotate(180deg); }

/* Dropdown: aparece con fade + slide hacia abajo. */
.site-nav .group > div { transform: translateY(8px); transition: opacity .25s ease, transform .25s ease, visibility .25s; }
.site-nav .group:hover > div,
.site-nav .group:focus-within > div { transform: translateY(0); }

/* Sub-links del dropdown: se desplazan a la derecha al hover. */
.site-nav .group > div a { transition: background-color .2s ease, color .2s ease, transform .2s ease; }
.site-nav .group > div a:hover { transform: translateX(4px); }

/* Teléfono: micro-lift al hover. */
header a[href^="tel:"] { transition: color .2s ease, transform .2s ease; }
header a[href^="tel:"]:hover { transform: translateY(-1px); }

/* CTA del header: brillo que barre (el lift/sombra vienen del hover de
   bg-accent; el imán lo agrega main.js). */
header a.bg-accent { position: relative; overflow: hidden; }
header a.bg-accent::before {
	content: "";
	position: absolute;
	top: 0; left: -120%;
	width: 55%; height: 100%;
	background: linear-gradient(100deg, transparent, rgba(255, 255, 255, .4), transparent);
	transform: skewX(-18deg);
	transition: left .6s ease;
	pointer-events: none;
}
header a.bg-accent:hover::before { left: 140%; }

/* ===== Header rediseñado: barra de utilidad + main bar premium ===== */
.site-header { border-bottom: 1px solid rgba(255, 255, 255, 0.08); transition: box-shadow .3s ease, background-color .3s ease; }
/* Hairline naranja de atardecer bajo el header. */
.site-header::after {
	content: "";
	position: absolute;
	left: 0; right: 0; bottom: 0;
	height: 2px;
	background: linear-gradient(90deg, transparent, rgba(242, 106, 33, .55), rgba(249, 178, 74, .5), rgba(242, 106, 33, .55), transparent);
	pointer-events: none;
}
.site-header.is-scrolled { box-shadow: 0 14px 34px -18px rgba(0, 0, 0, .75); background-color: rgba(10, 10, 10, .92); }

/* Barra superior de utilidad (ubicación · garantía · email · redes).
   Visible sólo en desktop vía media query propia (Tailwind compilado no
   incluye lg:block, así que no lo usamos aquí). */
.top-utility { display: none; background: rgba(0, 0, 0, .28); border-bottom: 1px solid rgba(255, 255, 255, 0.06); max-height: 3rem; overflow: hidden; transition: max-height .35s ease, opacity .3s ease; }
@media (min-width: 1024px) { .top-utility { display: block; } }
.top-utility .util-left, .top-utility .util-link, .top-utility .util-social { color: #9a9a9a; }
.util-ic { width: .9rem; height: .9rem; color: var(--color-accent); flex: none; }
.util-sep { color: rgba(255, 255, 255, .2); }
.util-link { transition: color .2s ease; }
.util-link:hover { color: var(--color-accent); }
.util-social { display: inline-flex; width: 1.15rem; height: 1.15rem; transition: color .2s ease, transform .2s ease; }
.util-social svg { width: 100%; height: 100%; }
.util-social:hover { color: var(--color-accent); transform: translateY(-1px); }
/* Al hacer scroll, la barra de utilidad se pliega (header más compacto). */
.site-header.is-scrolled .top-utility { max-height: 0; opacity: 0; border-bottom-color: transparent; }

/* Logo: leve resplandor cálido para que el emblema resalte sobre el negro. */
.logo-badge { position: relative; }
.logo-badge::before {
	content: "";
	position: absolute;
	left: -10px; top: 50%;
	width: 66px; height: 66px;
	transform: translateY(-50%);
	border-radius: 9999px;
	background: radial-gradient(circle, rgba(242, 106, 33, .30), transparent 70%);
	opacity: .45;
	z-index: -1;
	pointer-events: none;
	transition: opacity .3s ease;
}
.logo-badge:hover::before { opacity: 1; }

/* Teléfono como "pill" con ícono. */
.phone-pill { border: 1px solid rgba(242, 106, 33, .35); border-radius: 9999px; padding: .5rem .95rem; font-size: .875rem; font-weight: 600; color: #f4f4f4; transition: border-color .2s ease, background-color .2s ease, transform .2s ease; }
.phone-pill .phone-ic { width: 1rem; height: 1rem; color: var(--color-accent); flex: none; }
.phone-pill:hover { border-color: var(--color-accent); background: rgba(242, 106, 33, .1); }

/* CTA "Get a Free Quote": más presencia + flecha que avanza al hover. */
.cta-quote { border-radius: .6rem; padding: .7rem 1.2rem; font-size: .875rem; font-weight: 700; box-shadow: 0 8px 22px -10px rgba(242, 106, 33, .6); transition: box-shadow .25s ease, transform .2s ease; }
.cta-quote .cta-arrow { width: 1rem; height: 1rem; flex: none; transition: transform .25s ease; }
.cta-quote:hover { box-shadow: 0 12px 28px -8px rgba(242, 106, 33, .78); }
.cta-quote:hover .cta-arrow { transform: translateX(3px); }

/* ===== Visor 3D del garaje (Three.js) ===== */
.g3d-stage {
	position: relative;
	width: 100%;
	height: 380px;
	border-radius: 1.25rem;
	overflow: hidden;
	background: radial-gradient(120% 100% at 50% 0%, #2a1d12 0%, #141414 55%, #0d0d0d 100%);
	border: 1px solid rgba(242, 106, 33, .2);
	box-shadow: inset 0 0 60px rgba(0, 0, 0, .5);
	cursor: grab;
	touch-action: pan-y;
}
.g3d-stage:active { cursor: grabbing; }
.g3d-stage canvas { display: block; }
@media (min-width: 768px) { .g3d-stage { height: 520px; } }
.g3d-hint {
	position: absolute;
	bottom: .85rem; left: 50%;
	transform: translateX(-50%);
	z-index: 2;
	pointer-events: none;
	display: inline-flex;
	align-items: center;
	gap: .4rem;
	padding: .4rem .85rem;
	border-radius: 9999px;
	background: rgba(0, 0, 0, .45);
	-webkit-backdrop-filter: blur(4px);
	backdrop-filter: blur(4px);
	border: 1px solid rgba(255, 255, 255, .1);
	font-size: .72rem;
	letter-spacing: .04em;
	text-transform: uppercase;
	color: #cfcfcf;
}
.g3d-hint-ic { color: var(--color-accent); font-size: .95rem; }

/* Tarjetas de producto (Top Picks / grilla): flotación continua (arriba/abajo
   + lateral) para que se vean dinámicas en reposo, un "brillo" que barre cada
   tarjeta, y la inclinación 3D + foco que siguen al cursor. La flotación usa la
   propiedad translate (independiente de transform) para que NO pelee con la
   inclinación 3D de main.js ni con el hover-lift de Tailwind. */
.js-tilt-card { position: relative; transform-style: preserve-3d; transition: transform .3s cubic-bezier(.2, .7, .3, 1), border-color .3s ease, box-shadow .3s ease; }
.js-tilt-card.is-tilting { transition: transform .08s linear, border-color .3s ease, box-shadow .3s ease; }
/* Foco de luz que sigue al cursor. */
.js-tilt-card::before {
	content: "";
	position: absolute;
	inset: 0;
	z-index: 2;
	pointer-events: none;
	border-radius: inherit;
	opacity: 0;
	transition: opacity .3s ease;
	background: radial-gradient(20rem 20rem at var(--mx, 50%) var(--my, 50%), rgba(242, 106, 33, .18), transparent 60%);
}
/* Brillo diagonal que barre la tarjeta en bucle. */
.js-tilt-card::after {
	content: "";
	position: absolute;
	top: 0; bottom: 0; left: 0;
	width: 60%;
	z-index: 3;
	pointer-events: none;
	border-radius: inherit;
	opacity: 0;
	background: linear-gradient(105deg, transparent, rgba(255, 255, 255, .06) 45%, rgba(242, 106, 33, .10) 55%, transparent);
	transform: translateX(-180%) skewX(-12deg);
}
.js-tilt-card:hover { border-color: rgba(242, 106, 33, .5); box-shadow: 0 16px 40px -20px rgba(242, 106, 33, .38); }
.js-tilt-card:hover::before { opacity: 1; }
@media (hover: hover) and (pointer: fine) {
	.js-tilt-card { animation: card-float 8s ease-in-out infinite; }
	.js-tilt-card:nth-child(3n+2) { animation-delay: -2.8s; animation-duration: 9s; }
	.js-tilt-card:nth-child(3n) { animation-delay: -5s; animation-duration: 8.6s; }
	.js-tilt-card:hover { animation-play-state: paused; }
	.js-tilt-card::after { animation: card-sheen 9s ease-in-out infinite; }
	.js-tilt-card:nth-child(3n+2)::after { animation-delay: 3s; }
	.js-tilt-card:nth-child(3n)::after { animation-delay: 5.5s; }
}
@keyframes card-float {
	0%   { translate: 0 0; }
	20%  { translate: 3px -5px; }
	50%  { translate: 0 -7px; }
	80%  { translate: -3px -5px; }
	100% { translate: 0 0; }
}
@keyframes card-sheen {
	0%   { transform: translateX(-180%) skewX(-12deg); opacity: 0; }
	8%   { opacity: .7; }
	28%  { transform: translateX(240%) skewX(-12deg); opacity: 0; }
	100% { transform: translateX(240%) skewX(-12deg); opacity: 0; }
}

/* Botón flotante para silenciar el sonido de interfaz (lo inyecta sound.js). */
.snd-toggle {
	position: fixed;
	right: 1rem;
	bottom: 1rem;
	z-index: 60;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 2.75rem;
	height: 2.75rem;
	border-radius: 9999px;
	border: 1px solid rgba(242, 106, 33, .4);
	background: rgba(20, 20, 20, .8);
	color: var(--color-accent);
	-webkit-backdrop-filter: blur(6px);
	backdrop-filter: blur(6px);
	box-shadow: 0 8px 24px -10px rgba(0, 0, 0, .7);
	cursor: pointer;
	transition: transform .2s ease, border-color .2s ease, color .2s ease;
}
.snd-toggle svg { width: 1.25rem; height: 1.25rem; }
.snd-toggle:hover { transform: translateY(-2px); border-color: var(--color-accent); }
.snd-toggle.is-muted { color: #9a9a9a; border-color: rgba(255, 255, 255, .14); }
@media (min-width: 1024px) { .snd-toggle { right: 1.5rem; bottom: 1.5rem; } }

/* Reducir movimiento: sin desplazamientos ni brillos. */
@media (prefers-reduced-motion: reduce) {
	.js-tilt-card { animation: none !important; transform: none !important; translate: none !important; }
	.js-tilt-card::before, .js-tilt-card::after { display: none; }
	header .site-logo,
	.site-nav > a, .site-nav > .group > a,
	.site-nav .group > div, .site-nav .group > div a,
	header a[href^="tel:"] { transition: none; transform: none; }
	.site-nav > a::after, .site-nav > .group > a::after { transition: none; }
	header a.bg-accent::before { display: none; }
}

/* ===== Testimonios: marquee vertical infinito (puerto del componente React
   "TestimonialsColumn"). Cada columna se desliza sola en bucle y se PAUSA al
   pasar el cursor; las tarjetas tienen micro-lift naranja. El bucle usa
   margin-bottom (no gap) para que el -50% sea perfectamente continuo. ===== */
.tcols {
	display: flex;
	justify-content: center;
	gap: 1.5rem;
	margin-top: 2.5rem;
	max-height: 44rem;
	overflow: hidden;
	-webkit-mask-image: linear-gradient(to bottom, transparent, #000 20%, #000 80%, transparent);
	mask-image: linear-gradient(to bottom, transparent, #000 20%, #000 80%, transparent);
}
.tcol { width: 100%; max-width: 22rem; }
/* Columnas responsivas propias (la Tailwind compilada no trae md:block /
   lg:block): 1 columna en móvil, 2 desde 768px, 3 desde 1024px. */
.tcol--md, .tcol--lg { display: none; }
@media (min-width: 768px) { .tcol--md { display: block; } }
@media (min-width: 1024px) { .tcol--lg { display: block; } }
.tcol-track {
	display: flex;
	flex-direction: column;
	animation: tcol-scroll var(--dur, 26s) linear infinite;
	will-change: transform;
}
.tcol-track > .tcard { margin-bottom: 1.5rem; }
.tcol--reverse .tcol-track { animation-direction: reverse; }
.tcol:hover .tcol-track { animation-play-state: paused; } /* pausa al pasar el cursor */

@keyframes tcol-scroll {
	from { transform: translateY(0); }
	to { transform: translateY(-50%); }
}

/* Tarjetas de testimonio: micro-lift + borde/sombra naranja al hover. */
.tcard { transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease; }
.tcard:hover {
	transform: translateY(-4px);
	border-color: rgba(242, 106, 33, .55);
	box-shadow: 0 14px 34px -14px rgba(242, 106, 33, .4);
}

/* Reducir movimiento: sin marquee. Se muestran todas las columnas y tarjetas
   (sin duplicados) en un layout estático que envuelve en pantallas chicas. */
@media (prefers-reduced-motion: reduce) {
	.tcols {
		max-height: none;
		overflow: visible;
		flex-wrap: wrap;
		align-items: flex-start;
		-webkit-mask-image: none;
		mask-image: none;
	}
	.tcol, .tcol--md, .tcol--lg { display: block; flex: 1 1 18rem; }
	.tcol-track { animation: none; }
	.tcol-track > .tdup { display: none; }
	.tcard:hover { transform: none; }
}

/* ---- Sistema tipográfico (con carácter, no "de fábrica") ----
   Títulos en Fraunces (serif display con personalidad — soft/wonky, óptico),
   todo lo demás en Hanken Grotesk (grotesque humanista cálido). Deliberadamente
   NO usamos Inter/Roboto ni Playfair (las opciones "por defecto" de lo premium).
   Se cargan por <link> en el <head>. */
body {
	font-family: "Hanken Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
	font-weight: 400;
	-webkit-font-smoothing: antialiased;
	text-rendering: optimizeLegibility;
}

/* H1 / H2: serif display Fraunces. Peso 600, óptico automático (opsz) para que
   en tamaños grandes gane presencia editorial; ligero tracking negativo. */
h1, h2 {
	font-family: "Fraunces", Georgia, "Times New Roman", serif;
	font-weight: 600;
	font-optical-sizing: auto;
	letter-spacing: -0.015em;
}

/* H3–H6: Hanken Grotesk en negrita, contraste "galería" con el serif. */
h3, h4, h5, h6 {
	font-family: "Hanken Grotesk", sans-serif;
	font-weight: 700;
	letter-spacing: -0.01em;
}

/* Contadores y precios: Hanken Grotesk con cifras tabulares (no "saltan"). */
[data-counter] {
	font-family: "Hanken Grotesk", sans-serif;
	font-variant-numeric: tabular-nums;
	font-feature-settings: "tnum" 1;
}

/* Menús de navegación y links del pie: Inter en MAYÚSCULAS con espaciado
   amplio ("alta costura"). Sólo los ítems de menú, no los CTA ni el cuerpo. */
.site-nav > a,
.site-nav > .group > a,
footer ul a {
	text-transform: uppercase;
	letter-spacing: 0.13em;
}
footer ul a { font-size: 0.75rem; }

/* Selección de texto con el naranja de marca. */
::selection {
	background: rgba(194, 65, 12, 0.16);
}

/* ---- Rótulos de sección (eyebrows) ---- */
.eyebrow-red {
	color: var(--color-accent);   /* atardecer sobre fondos claros */
}

.eyebrow-amber {
	color: var(--color-sun);      /* ámbar sobre secciones de acero */
}

/* ---- Botones sólidos (CTA de atardecer y de acero) ----
   Transición suave, leve elevación y sombra cálida al pasar el mouse. */
a.bg-accent, button.bg-accent,
a.bg-primary, button.bg-primary {
	transition: background-color .2s ease, box-shadow .2s ease, transform .2s ease;
}

a.bg-accent:hover, button.bg-accent:hover {
	background-color: var(--color-accent-hover);
	opacity: 1;
	transform: translateY(-1px);
	box-shadow: 0 10px 24px -8px rgba(194, 65, 12, 0.55);
}

a.bg-primary:hover, button.bg-primary:hover {
	opacity: 1;
	transform: translateY(-1px);
	box-shadow: 0 10px 24px -10px rgba(20, 26, 33, 0.5);
}

/* En las tarjetas (enlaces con .group) el borde se tiñe de atardecer
   al pasar el mouse, reforzando el "hover-lift" del diseño base. */
a.group:hover {
	border-color: rgba(194, 65, 12, 0.35);
}

/* Enlaces y textos que usaban el azul primario ahora van al atardecer
   al pasar el mouse (nav, "quick links", etc.). */
.hover\\:text-primary:hover {
	color: var(--color-accent);
}

/* Foco visible y cálido para navegación por teclado (accesibilidad). */
a:focus-visible, button:focus-visible,
input:focus-visible, select:focus-visible,
textarea:focus-visible, summary:focus-visible {
	outline: 2px solid var(--color-accent);
	outline-offset: 2px;
	border-radius: 4px;
}

/* Campos de formulario: foco en naranja de marca (en vez del azul base). */
.focus\\:border-primary:focus {
	border-color: var(--color-accent);
}

.focus\\:ring-primary:focus {
	--tw-ring-color: var(--color-accent);
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
	animation: footerFloat 6s ease-in-out infinite;
}
@keyframes footerFloat {
	0%, 100% { transform: translateY(0); }
	50%      { transform: translateY(-6px); }
}

/* ============ PIE DE PÁGINA DINÁMICO ============
   Aurora de atardecer que "respira", hairline naranja que recorre el borde,
   columnas que entran al hacer scroll, enlaces con marcador deslizante y
   redes sociales como píldoras que se elevan. */
.site-footer {
	position: relative;
	overflow: hidden;
	isolation: isolate;
}
/* Resplandor de atardecer que sube desde el borde superior y late suave. */
.site-footer::before {
	content: "";
	position: absolute;
	top: -160px;
	left: 50%;
	width: 130%;
	height: 340px;
	transform: translateX(-50%);
	background: radial-gradient(60% 100% at 50% 100%,
		rgba(242, 106, 33, 0.22), rgba(242, 106, 33, 0.06) 45%, transparent 72%);
	pointer-events: none;
	z-index: -1;
	animation: footerAurora 9s ease-in-out infinite;
}
@keyframes footerAurora {
	0%, 100% { opacity: 0.5;  transform: translateX(-50%) scale(1); }
	50%      { opacity: 1;    transform: translateX(-50%) scale(1.08); }
}
/* Filamento naranja que barre el borde superior del pie. */
.footer-hairline {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 2px;
	background: linear-gradient(90deg, transparent, rgba(242, 106, 33, 0.95), transparent);
	background-size: 45% 100%;
	background-repeat: no-repeat;
	animation: footerSweep 6s linear infinite;
}
@keyframes footerSweep {
	0%   { background-position: -45% 0; }
	100% { background-position: 145% 0; }
}

/* Entrada de columnas al hacer scroll (main.js pone .is-in). */
.footer-col {
	opacity: 0;
	transform: translateY(26px);
	transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.footer-col.is-in {
	opacity: 1;
	transform: none;
}

/* Título de columna con barra de acento que crece al pasar el mouse. */
.footer-col-title {
	position: relative;
	display: inline-block;
}
.footer-col-title::after {
	content: "";
	position: absolute;
	left: 0;
	bottom: -6px;
	height: 2px;
	width: 0;
	background: var(--color-accent);
	transition: width 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.footer-col:hover .footer-col-title::after {
	width: 100%;
}

/* Enlaces del pie: aparece un marcador naranja y el texto se desliza. */
.footer-link {
	position: relative;
	display: inline-block;
	transition: color 0.25s ease, transform 0.25s ease, padding-left 0.25s ease;
}
.footer-link::before {
	content: "";
	position: absolute;
	left: 0;
	top: 50%;
	width: 0;
	height: 1.5px;
	background: var(--color-accent);
	transform: translateY(-50%);
	transition: width 0.25s ease;
}
.footer-link:hover {
	color: #fff;
	transform: translateX(2px);
	padding-left: 18px;
}
.footer-link:hover::before {
	width: 12px;
}

/* Redes sociales como píldoras circulares que se elevan. */
.footer-social {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	border-radius: 9999px;
	border: 1px solid rgba(255, 255, 255, 0.12);
	color: #c6c6c6;
	transition: transform 0.25s ease, background-color 0.25s ease,
		border-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
}
.footer-social svg {
	width: 18px;
	height: 18px;
}
.footer-social:hover {
	transform: translateY(-3px);
	background: var(--color-accent);
	border-color: var(--color-accent);
	color: #fff;
	box-shadow: 0 12px 24px -8px rgba(242, 106, 33, 0.6);
}

@media (prefers-reduced-motion: reduce) {
	.footer-logo,
	.site-footer::before,
	.footer-hairline {
		animation: none;
	}
	.footer-col {
		opacity: 1;
		transform: none;
		transition: none;
	}
}

/* ============ REVELADO GENÉRICO AL HACER SCROLL ============
   Para páginas internas (sin GSAP). main.js añade .is-in cuando el elemento
   entra en pantalla; el escalonado (transition-delay) también lo pone main.js
   según la posición entre hermanos. */
.reveal-rise {
	opacity: 0;
	transform: translateY(28px);
	transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	will-change: transform, opacity;
}
.reveal-rise.is-in {
	opacity: 1;
	transform: none;
}

/* ============ PÁGINA DE PRODUCTO DINÁMICA ============ */
/* Hero: la foto de fondo hace un "Ken Burns" lento + un resplandor de marca. */
.product-hero-img {
	animation: kenBurns 20s ease-in-out infinite alternate;
	transform-origin: center;
}
@keyframes kenBurns {
	from { transform: scale(1); }
	to   { transform: scale(1.12) translateY(-1.5%); }
}
.product-hero-glow {
	position: absolute;
	top: -20%;
	right: -10%;
	width: 55%;
	height: 140%;
	background: radial-gradient(45% 50% at 50% 50%,
		rgba(242, 106, 33, 0.28), transparent 70%);
	pointer-events: none;
	animation: heroGlowDrift 12s ease-in-out infinite;
}
@keyframes heroGlowDrift {
	0%, 100% { opacity: 0.55; transform: translate(0, 0); }
	50%      { opacity: 1;    transform: translate(-6%, 4%); }
}

/* Parallax 3D del hero: la imagen (capa lejana) y el texto (capa cercana) se
   mueven a distinta velocidad siguiendo el cursor, y toda la escena se inclina
   un poco en 3D → sensación de profundidad. Lo maneja main.js. */
.product-hero {
	perspective: 1200px;
}
.ph-bg-layer {
	transform: scale(1.08);
	transform-origin: center;
	transition: transform 0.3s ease-out;
	will-change: transform;
}
.ph-fg-layer {
	transition: transform 0.3s ease-out;
	will-change: transform;
}
@media (prefers-reduced-motion: reduce) {
	.ph-bg-layer,
	.ph-fg-layer {
		transition: none;
	}
}

/* Lista de características: cada ítem se desliza y el check "salta" al hover. */
.feature-item {
	transition: transform 0.25s ease, color 0.25s ease;
}
.feature-item:hover {
	transform: translateX(5px);
	color: #111827;
}
.feature-check {
	display: inline-block;
	transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.feature-item:hover .feature-check {
	transform: scale(1.35);
}

/* Tarjetas de tamaños: se elevan, borde de acento, barra lateral que crece
   y el precio hace un leve "punch". */
.size-card {
	position: relative;
	overflow: hidden;
	/* Sin fondo propio: se funde con el fondo de la sección (claro u oscuro). */
	background: transparent;
	transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1),
		border-color 0.28s ease, box-shadow 0.28s ease;
}
.size-card::before {
	content: "";
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	width: 3px;
	background: var(--color-accent);
	transform: scaleY(0);
	transform-origin: bottom;
	transition: transform 0.3s ease;
}
.size-card:hover {
	transform: translateY(-4px);
	border-color: rgba(242, 106, 33, 0.4);
	box-shadow: 0 18px 34px -20px rgba(0, 0, 0, 0.45);
}
.size-card:hover::before {
	transform: scaleY(1);
}
.size-price {
	display: inline-block;
	transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.size-card:hover .size-price {
	transform: scale(1.08);
}

/* ============ TARJETAS CON ELEVACIÓN (páginas internas) ============
   Se elevan al hover, con una barra de acento que se despliega arriba.
   Usadas en Financiamiento (opciones y socios) y reutilizables en más páginas. */
.lift-card {
	position: relative;
	overflow: hidden;
	transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
		border-color 0.3s ease, box-shadow 0.3s ease;
}
.lift-card::before {
	content: "";
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	height: 3px;
	background: linear-gradient(90deg, var(--color-accent), var(--color-sun));
	transform: scaleX(0);
	transform-origin: left;
	transition: transform 0.35s ease;
}
.lift-card:hover {
	transform: translateY(-6px);
	border-color: rgba(242, 106, 33, 0.4);
	box-shadow: 0 22px 42px -26px rgba(0, 0, 0, 0.6);
}
.lift-card:hover::before {
	transform: scaleX(1);
}
@media (prefers-reduced-motion: reduce) {
	.lift-card {
		transition: none;
	}
}

@media (prefers-reduced-motion: reduce) {
	.reveal-rise {
		opacity: 1;
		transform: none;
		transition: none;
	}
	.product-hero-img,
	.product-hero-glow {
		animation: none;
	}
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

/* ===== Scroll-to-expand media hero (.sxm-*) — puerto vanilla del componente
   React "ScrollExpandMedia". Compartido por la portada (index) y "Our Work".
   El JS (assets/js/scroll-expand.js) sólo actualiza tamaños y opacidades. ===== */
.sxm { overflow-x: hidden; }
.sxm-stage { position: relative; display: flex; flex-direction: column; align-items: center; min-height: 100dvh; }
.sxm-bg { position: absolute; inset: 0; z-index: 0; background: radial-gradient(120% 90% at 82% 0%, rgba(242, 106, 33, 0.42), rgba(242, 106, 33, 0) 58%), linear-gradient(160deg, #1a1a1a 0%, #0f0f0f 55%, #000 100%); }
.sxm-bg::after { content: ""; position: absolute; inset: 0; background: rgba(0, 0, 0, 0.12); }
.sxm-container { position: relative; z-index: 10; width: 100%; max-width: 80rem; margin: 0 auto; display: flex; flex-direction: column; align-items: center; }
.sxm-center { position: relative; width: 100%; height: 100dvh; display: flex; align-items: center; justify-content: center; }
.sxm-media { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 0; border-radius: 1rem; overflow: hidden; width: min(1100px, 95vw); height: min(78vh, 680px); max-width: 95vw; max-height: 85vh; box-shadow: 0 24px 70px -20px rgba(0, 0, 0, 0.6); }
.sxm-media > video, .sxm-media > img { width: 100%; height: 100%; object-fit: cover; border-radius: 1rem; display: block; }
/* Parallax de profundidad de la imagen del hero (main.js la desplaza dentro
   del marco recortado siguiendo el cursor). El scroll-expand no toca .sxm-scene. */
.sxm-scene { transition: transform 0.3s ease-out; will-change: transform; }
@media (prefers-reduced-motion: reduce) { .sxm-scene { transition: none; } }
.sxm-veil { position: absolute; inset: 0; border-radius: 1rem; background: rgba(15, 20, 26, 0.35); }
.sxm-hint { position: absolute; left: 0; right: 0; bottom: 1.25rem; z-index: 10; display: flex; flex-direction: column; align-items: center; gap: 0.15rem; text-align: center; pointer-events: none; transition: opacity 0.4s ease; }
.sxm-date { font-family: "Hanken Grotesk", sans-serif; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-sun); }
.sxm-scroll { font-size: 0.9rem; font-weight: 500; letter-spacing: 0.02em; color: #c9cfd6; }
.sxm.is-expanded .sxm-hint { opacity: 0; }
.sxm-title { position: relative; z-index: 10; margin: 0; display: flex; flex-direction: column; align-items: center; gap: 0.25rem; width: 100%; text-align: center; }
.sxm-title-first, .sxm-title-rest { display: block; margin: 0; color: #fff; font-family: "Fraunces", Georgia, "Times New Roman", serif; font-weight: 600; line-height: 1.05; font-size: clamp(2.6rem, 7.2vw, 4.25rem); text-shadow: 0 2px 24px rgba(0, 0, 0, 0.45); }
.sxm-content { width: 100%; padding: 3rem 2rem 5rem; opacity: 0; }
.sxm-media, .sxm-title-first, .sxm-title-rest, .sxm-date, .sxm-scroll { transition: none; }
.sxm-bg, .sxm-veil { transition: opacity 0.1s linear; }
.sxm-content { transition: opacity 0.7s ease; }
@media (prefers-reduced-motion: reduce) { .sxm-content { opacity: 1; } .sxm-hint { display: none; } }

/* ===== Hero de la portada: imagen a pantalla completa con parallax =====
   La imagen (.home-hero-bg) se desplaza más lento que el contenido al hacer
   scroll (main.js) y hay un parallax sutil de ratón sobre el contenido
   (motion.js, [data-hero-parallax]). El scrim asegura legibilidad del texto. */
.home-hero {
	position: relative;
	display: flex;
	align-items: center;
	min-height: 92vh;
	min-height: 92dvh;
	overflow: hidden;
	background: #0d0d0d;
}
.home-hero-bg {
	position: absolute;
	inset: -12% 0;
	z-index: 0;
	overflow: hidden;
	will-change: transform;
}
.home-hero-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
	transform: scale(1.06);
}
.home-hero-scrim {
	position: absolute;
	inset: 0;
	z-index: 1;
	background:
		linear-gradient(90deg, rgba(6, 8, 10, 0.88) 0%, rgba(6, 8, 10, 0.55) 42%, rgba(6, 8, 10, 0.12) 72%, rgba(6, 8, 10, 0.32) 100%),
		linear-gradient(0deg, rgba(6, 8, 10, 0.72) 0%, rgba(6, 8, 10, 0) 46%);
}
.home-hero-inner {
	position: relative;
	z-index: 2;
	box-sizing: border-box;
	width: 100%;
	max-width: 80rem;
	margin: 0 auto;
	/* Top relativo al alto de pantalla → el bloque baja de forma responsiva
	   (más abajo en pantallas altas), con mínimo y máximo para no pasarse. */
	padding: clamp(11rem, 30vh, 18rem) 1.5rem 3rem;
}
@media (min-width: 640px) {
	.home-hero-inner { padding-left: 2rem; padding-right: 2rem; }
}
.home-hero-content {
	box-sizing: border-box;
	width: 100%;
	max-width: 42rem;
	text-align: center;
}

/* Entrada animada del hero (CSS puro, sin GSAP): la imagen hace fade-in y los
   textos + botones suben escalonados al cargar la página. */
.home-hero-bg {
	animation: heroFadeIn 1.1s ease both;
}
.home-hero-content > * {
	animation: heroRise 0.75s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.home-hero-eyebrow { animation-delay: 0.15s; }
.home-hero-title   { animation-delay: 0.28s; }
.home-hero-sub     { animation-delay: 0.44s; }
.home-hero-actions { animation-delay: 0.60s; }
@keyframes heroFadeIn {
	from { opacity: 0; }
	to   { opacity: 1; }
}
@keyframes heroRise {
	from { opacity: 0; transform: translateY(26px); }
	to   { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
	.home-hero-bg,
	.home-hero-content > * {
		animation: none;
	}
}
.home-hero-eyebrow {
	font-family: "Hanken Grotesk", sans-serif;
	text-transform: uppercase;
	letter-spacing: 0.17em;
	font-size: 0.8rem;
	font-weight: 600;
	color: var(--color-sun);
}
.home-hero-title {
	margin-top: 0.7rem;
	color: #fff;
	font-family: "Fraunces", Georgia, "Times New Roman", serif;
	font-weight: 600;
	line-height: 1.05;
	letter-spacing: -0.015em;
	font-size: clamp(1.95rem, 6.6vw, 4.6rem);
	max-width: 100%;
	overflow-wrap: break-word;
	text-shadow: 0 3px 34px rgba(0, 0, 0, 0.5);
}
.home-hero-sub {
	margin: 1.3rem auto 0;
	max-width: 38rem;
	color: rgba(255, 255, 255, 0.88);
	font-size: clamp(0.98rem, 3.4vw, 1.2rem);
	line-height: 1.6;
	overflow-wrap: break-word;
	text-shadow: 0 1px 12px rgba(0, 0, 0, 0.45);
}
.home-hero-actions {
	margin-top: 2.1rem;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 1rem;
}
.hero-cta-primary,
.hero-cta-ghost {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 0.6rem;
	padding: 0.95rem 2rem;
	font-weight: 600;
	transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}
.hero-cta-primary {
	background: var(--color-accent);
	color: #fff;
	box-shadow: 0 14px 30px -12px rgba(242, 106, 33, 0.6);
}
.hero-cta-primary:hover {
	transform: translateY(-2px);
	background: var(--color-accent-hover);
	box-shadow: 0 18px 38px -12px rgba(242, 106, 33, 0.7);
}
.hero-cta-ghost {
	border: 1px solid rgba(255, 255, 255, 0.42);
	color: #fff;
	backdrop-filter: blur(4px);
}
.hero-cta-ghost:hover {
	transform: translateY(-2px);
	background: rgba(255, 255, 255, 0.12);
	border-color: #fff;
}
.home-hero-trust {
	margin-top: 2.3rem;
	display: flex;
	flex-wrap: wrap;
	gap: 0.55rem 1.5rem;
	list-style: none;
	padding: 0;
	margin-bottom: 0;
}
.home-hero-trust li {
	display: inline-flex;
	align-items: center;
	gap: 0.4rem;
	color: rgba(255, 255, 255, 0.82);
	font-size: 0.86rem;
}
.home-hero-trust strong { color: #fff; font-weight: 700; }
.hero-stars { color: var(--color-sun); letter-spacing: 0.05em; }
.home-hero-trust li svg { flex-shrink: 0; }
.hero-trust-g { width: 16px; height: 16px; }
.hero-trust-ic { width: 16px; height: 16px; color: var(--color-sun); }
.home-hero-scroll {
	position: absolute;
	z-index: 2;
	left: 50%;
	bottom: 1.5rem;
	transform: translateX(-50%);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.25rem;
	color: rgba(255, 255, 255, 0.75);
	font-size: 0.7rem;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	text-decoration: none;
}
.home-hero-scroll svg { width: 20px; height: 20px; }
@media (prefers-reduced-motion: reduce) {
	.home-hero-img { transform: scale(1.03); }
}

/* ===== Resplandor ambiental (portada): reemplaza las chispas por un brillo
   cálido, tenue y muy lento que da profundidad sin robar atención. Con
   mix-blend screen sólo aclara zonas oscuras; sobre tarjetas claras es
   invisible. ===== */
.ambient {
	position: fixed;
	inset: 0;
	z-index: 2;
	pointer-events: none;
	mix-blend-mode: screen;
	background:
		radial-gradient(42% 46% at 16% 20%, rgba(242, 106, 33, 0.09), transparent 60%),
		radial-gradient(46% 52% at 84% 80%, rgba(242, 150, 70, 0.07), transparent 62%);
	animation: ambientDrift 46s ease-in-out infinite alternate;
	will-change: transform, opacity;
}
@keyframes ambientDrift {
	0%   { opacity: 0.75; transform: translate3d(0, 0, 0) scale(1); }
	100% { opacity: 1;    transform: translate3d(-3%, 2.5%, 0) scale(1.06); }
}
@media (prefers-reduced-motion: reduce) {
	.ambient { animation: none; opacity: 0.85; }
}

/* ===== "Cómo funciona": 4 pasos con línea conectora (timeline) =====
   La grilla se define aquí (no con clases Tailwind md:grid-cols-4, que están
   purgadas del CSS compilado). */
.process-grid {
	position: relative;
	display: grid;
	grid-template-columns: 1fr;
	gap: 2.5rem;
}
@media (min-width: 640px) { .process-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 768px) { .process-grid { grid-template-columns: repeat(4, 1fr); gap: 1.5rem; } }
@media (min-width: 768px) {
	.process-grid::before {
		content: "";
		position: absolute;
		left: 12.5%;
		right: 12.5%;
		top: 40px;
		height: 2px;
		background: linear-gradient(90deg, transparent, rgba(242, 106, 33, 0.45) 15%, rgba(242, 106, 33, 0.45) 85%, transparent);
		z-index: 0;
	}
}
.process-step { position: relative; z-index: 1; text-align: center; }
.process-badge {
	position: relative;
	margin: 0 auto;
	width: 80px;
	height: 80px;
	border-radius: 9999px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #141414;
	border: 1px solid rgba(242, 106, 33, 0.35);
	color: var(--color-accent);
	box-shadow: 0 12px 30px -14px rgba(0, 0, 0, 0.7);
	transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}
.process-step:hover .process-badge {
	transform: translateY(-4px);
	border-color: rgba(242, 106, 33, 0.7);
	box-shadow: 0 18px 36px -16px rgba(242, 106, 33, 0.4);
}
.process-badge svg { width: 34px; height: 34px; }
.process-num {
	position: absolute;
	top: -6px;
	right: -6px;
	width: 26px;
	height: 26px;
	border-radius: 9999px;
	background: var(--color-accent);
	color: #fff;
	font-size: 0.78rem;
	font-weight: 700;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4px 10px -3px rgba(242, 106, 33, 0.6);
}

/* ===== Galería de proyectos (obra real) ===== */
.projects-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 1.75rem;
}
@media (min-width: 640px) {
	.projects-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
	.projects-grid { grid-template-columns: repeat(3, 1fr); }
}
.project-card {
	position: relative;
	display: flex;
	flex-direction: column;
	text-align: left;
	padding: 0;
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 1rem;
	overflow: hidden;
	background: #141414;
	cursor: pointer;
	color: inherit;
	font: inherit;
	box-shadow: 0 14px 40px -22px rgba(0, 0, 0, 0.9);
	transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.35s ease, box-shadow 0.35s ease;
}
.project-card:hover,
.project-card:focus-visible {
	transform: translateY(-6px);
	border-color: rgba(242, 106, 33, 0.45);
	box-shadow: 0 26px 50px -24px rgba(0, 0, 0, 0.95);
	outline: none;
}
.project-card:focus-visible { box-shadow: 0 0 0 3px rgba(242, 106, 33, 0.55), 0 26px 50px -24px rgba(0, 0, 0, 0.95); }
.project-card-media {
	position: relative;
	display: block;
	aspect-ratio: 4 / 3;
	overflow: hidden;
	background: #0d0d0d;
}
.project-card-media img {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.project-card:hover .project-card-media img,
.project-card:focus-visible .project-card-media img { transform: scale(1.07); }
.project-card-scrim {
	position: absolute;
	inset: 0;
	background: linear-gradient(to top, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0) 45%);
}
.project-card-badge {
	position: absolute;
	top: 0.85rem;
	right: 0.85rem;
	display: inline-flex;
	align-items: center;
	gap: 0.35rem;
	padding: 0.32rem 0.6rem;
	border-radius: 9999px;
	background: rgba(13, 13, 13, 0.72);
	backdrop-filter: blur(6px);
	color: #fff;
	font-size: 0.78rem;
	font-weight: 700;
	line-height: 1;
}
.project-card-badge svg { width: 15px; height: 15px; }
.project-card-zoom {
	position: absolute;
	inset: 0;
	margin: auto;
	width: 56px;
	height: 56px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 9999px;
	background: rgba(242, 106, 33, 0.92);
	color: #fff;
	opacity: 0;
	transform: scale(0.8);
	transition: opacity 0.3s ease, transform 0.3s ease;
	box-shadow: 0 10px 24px -8px rgba(242, 106, 33, 0.7);
}
.project-card-zoom svg { width: 26px; height: 26px; }
.project-card:hover .project-card-zoom,
.project-card:focus-visible .project-card-zoom { opacity: 1; transform: scale(1); }
.project-card-body { padding: 1.15rem 1.25rem 1.35rem; }
.project-card-tag {
	display: inline-block;
	font-size: 0.72rem;
	font-weight: 700;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--color-accent);
}
.project-card-title {
	display: block;
	margin-top: 0.35rem;
	font-size: 1.15rem;
	font-weight: 700;
	color: var(--color-text-strong, #f5f5f5);
}
.project-card-loc {
	display: block;
	margin-top: 0.3rem;
	font-size: 0.86rem;
	color: #9ca3af;
}

/* ===== Lightbox ===== */
.lightbox {
	position: fixed;
	inset: 0;
	z-index: 1000;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: clamp(0.75rem, 3vw, 2rem);
	background: rgba(8, 8, 8, 0.94);
	backdrop-filter: blur(10px);
	opacity: 0;
	transition: opacity 0.28s ease;
}
.lightbox[hidden] { display: none; }
.lightbox.is-open { opacity: 1; }
.lightbox-backdrop { position: absolute; inset: 0; cursor: zoom-out; }
.lightbox-stage {
	position: relative;
	z-index: 1;
	margin: 0;
	max-width: min(100%, 1200px);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.9rem;
}
.lightbox-img {
	max-width: 100%;
	max-height: 74vh;
	width: auto;
	height: auto;
	border-radius: 0.75rem;
	box-shadow: 0 30px 70px -25px rgba(0, 0, 0, 0.9);
	animation: lightboxIn 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
@keyframes lightboxIn {
	from { opacity: 0; transform: scale(0.97); }
	to { opacity: 1; transform: scale(1); }
}
.lightbox-caption {
	display: flex;
	align-items: baseline;
	gap: 0.75rem;
	color: #e5e7eb;
	font-size: 0.92rem;
}
.lightbox-title { font-weight: 600; }
.lightbox-counter { color: #9ca3af; font-variant-numeric: tabular-nums; }
.lightbox-thumbs {
	position: relative;
	z-index: 1;
	margin-top: 1rem;
	display: flex;
	gap: 0.55rem;
	max-width: 100%;
	overflow-x: auto;
	padding: 0.35rem 0.15rem 0.5rem;
	scrollbar-width: thin;
}
.lightbox-thumb {
	flex: 0 0 auto;
	width: 74px;
	height: 54px;
	padding: 0;
	border: 2px solid transparent;
	border-radius: 0.5rem;
	overflow: hidden;
	background: #111;
	cursor: pointer;
	opacity: 0.55;
	transition: opacity 0.25s ease, border-color 0.25s ease;
}
.lightbox-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.lightbox-thumb:hover { opacity: 0.85; }
.lightbox-thumb.is-active { opacity: 1; border-color: var(--color-accent); }
.lightbox-close,
.lightbox-nav {
	position: absolute;
	z-index: 2;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 9999px;
	background: rgba(20, 20, 20, 0.72);
	color: #fff;
	border: 1px solid rgba(255, 255, 255, 0.12);
	cursor: pointer;
	transition: background 0.25s ease, transform 0.25s ease;
}
.lightbox-close:hover,
.lightbox-nav:hover { background: var(--color-accent); }
.lightbox-close { top: 1rem; right: 1rem; width: 44px; height: 44px; }
.lightbox-close svg { width: 22px; height: 22px; }
.lightbox-nav { top: 50%; transform: translateY(-50%); width: 48px; height: 48px; }
.lightbox-nav:hover { transform: translateY(-50%) scale(1.08); }
.lightbox-nav svg { width: 24px; height: 24px; }
.lightbox-prev { left: clamp(0.5rem, 2vw, 1.5rem); }
.lightbox-next { right: clamp(0.5rem, 2vw, 1.5rem); }
@media (max-width: 600px) {
	.lightbox-nav { width: 40px; height: 40px; }
	.lightbox-img { max-height: 62vh; }
}
@media (prefers-reduced-motion: reduce) {
	.project-card,
	.project-card-media img,
	.project-card-zoom,
	.lightbox,
	.lightbox-img { transition: none; animation: none; }
}

/* ===== Modal HSF Portal (financiación) ===== */
.fin-modal {
	position: fixed;
	inset: 0;
	z-index: 1000;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: clamp(1rem, 4vw, 2rem);
	background: rgba(8, 8, 8, 0.9);
	backdrop-filter: blur(10px);
	opacity: 0;
	transition: opacity 0.28s ease;
}
.fin-modal[hidden] { display: none; }
.fin-modal.is-open { opacity: 1; }
.fin-modal-backdrop { position: absolute; inset: 0; cursor: pointer; }
.fin-modal-panel {
	position: relative;
	z-index: 1;
	width: 100%;
	max-width: 640px;
	max-height: 88vh;
	overflow-y: auto;
	background: #141414;
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 1.25rem;
	padding: clamp(1.5rem, 4vw, 2.5rem);
	box-shadow: 0 40px 80px -30px rgba(0, 0, 0, 0.9);
	opacity: 0;
	transform: translateY(16px) scale(0.98);
	transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.35s ease;
}
.fin-modal.is-open .fin-modal-panel { opacity: 1; transform: none; }
.fin-modal-close {
	position: absolute;
	top: 1rem;
	right: 1rem;
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 9999px;
	background: rgba(255, 255, 255, 0.06);
	border: 1px solid rgba(255, 255, 255, 0.12);
	color: #fff;
	cursor: pointer;
	transition: background 0.25s ease, transform 0.25s ease;
}
.fin-modal-close:hover { background: var(--color-accent); transform: rotate(90deg); }
.fin-modal-close svg { width: 20px; height: 20px; }
.fin-modal-eyebrow {
	font-size: 0.74rem;
	font-weight: 700;
	letter-spacing: 0.09em;
	text-transform: uppercase;
	color: var(--color-accent);
}
.fin-modal-title {
	margin-top: 0.5rem;
	font-size: clamp(1.5rem, 4vw, 2rem);
	font-weight: 700;
	color: #f5f5f5;
	line-height: 1.15;
}
.fin-modal-sub {
	margin-top: 0.65rem;
	font-size: 0.95rem;
	line-height: 1.6;
	color: #9ca3af;
}
.fin-modal-stats {
	margin-top: 1.4rem;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 0.65rem;
}
.fin-stat {
	background: #1b1b1b;
	border: 1px solid rgba(255, 255, 255, 0.06);
	border-radius: 0.75rem;
	padding: 0.85rem 0.4rem;
	text-align: center;
}
.fin-stat b { display: block; color: var(--color-accent); font-size: 1.02rem; font-variant-numeric: tabular-nums; }
.fin-stat span { display: block; margin-top: 0.2rem; font-size: 0.7rem; color: #9ca3af; }
.fin-modal-list { margin-top: 1.5rem; display: grid; gap: 0.7rem; list-style: none; padding: 0; }
.fin-modal-list li { display: flex; gap: 0.6rem; align-items: flex-start; font-size: 0.9rem; color: #d1d5db; }
.fin-modal-list svg { flex: 0 0 auto; width: 18px; height: 18px; color: var(--color-accent); margin-top: 1px; }
.fin-modal-heading {
	margin-top: 1.6rem;
	font-size: 0.74rem;
	font-weight: 700;
	letter-spacing: 0.09em;
	text-transform: uppercase;
	color: #e5e7eb;
}
.fin-steps { margin-top: 0.9rem; display: grid; gap: 0.8rem; }
.fin-step { display: flex; gap: 0.75rem; align-items: flex-start; }
.fin-step-num {
	flex: 0 0 auto;
	width: 28px;
	height: 28px;
	border-radius: 9999px;
	background: rgba(242, 106, 33, 0.15);
	color: var(--color-accent);
	font-weight: 700;
	font-size: 0.85rem;
	display: flex;
	align-items: center;
	justify-content: center;
}
.fin-step p { font-size: 0.9rem; color: #d1d5db; line-height: 1.5; }
.fin-modal-actions { margin-top: 1.8rem; display: flex; flex-wrap: wrap; gap: 0.8rem; }
.fin-modal-trust { margin-top: 1.3rem; font-size: 0.8rem; color: #9ca3af; }
.fin-modal-note { margin-top: 0.6rem; font-size: 0.72rem; color: #6b7280; line-height: 1.5; }
@media (prefers-reduced-motion: reduce) {
	.fin-modal,
	.fin-modal-panel { transition: none; }
	.fin-modal-close:hover { transform: none; }
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
      return `\t\t\t<a href="${productHref(prefix, p)}" class="js-reveal-card js-tilt-card group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl" data-reveal-group="top-picks">
				<div class="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
					<img src="${productImage(prefix, p)}" alt="${compact}" class="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy">
				</div>
				<div class="flex items-center justify-between p-5">
					<h3 class="text-lg font-bold text-dark">${compact}</h3>
					<span class="inline-flex items-center gap-1 text-sm font-semibold text-accent group-hover:underline">View Details ↗</span>
				</div>
			</a>`;
    })
    .join("\n");

  const productGrid = products.map((p) => `\t\t\t\t${productCard(prefix, p)}`).join("\n");

  // Tarjetas de proyecto (obra real). Son <button>: al hacer clic abren el
  // lightbox con los demás ángulos (JS en main.js lee data-gallery-*).
  const projectCards = projects
    .map((pr) => {
      const base = `${prefix}assets/images/projects/${pr.slug}`;
      return `\t\t\t<button type="button" class="project-card js-reveal-card" data-reveal-group="projects-gallery" data-gallery-base="${base}" data-gallery-count="${pr.count}" data-gallery-title="${pr.title}" aria-label="View gallery: ${pr.title} (${pr.count} photos)">
					<span class="project-card-media">
						<img src="${base}/cover.webp" alt="${pr.title}" width="1000" height="750" loading="lazy" decoding="async">
						<span class="project-card-scrim" aria-hidden="true"></span>
						<span class="project-card-badge">${icon("camera")}<span>${pr.count}</span></span>
						<span class="project-card-zoom" aria-hidden="true">${icon("expand")}</span>
					</span>
					<span class="project-card-body">
						<span class="project-card-tag">${pr.tag}</span>
						<span class="project-card-title">${pr.title}</span>
						<span class="project-card-loc">${pr.location}</span>
					</span>
				</button>`;
    })
    .join("\n");

  const whyUsCards = whyUs
    .map(
      (item, i) => `\t\t\t\t<div class="js-reveal-card js-tilt-card overflow-hidden rounded-xl bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg" data-reveal-group="why-us">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">${i + 1}</div>
					<h3 class="mt-4 text-base font-bold text-dark">${item.title}</h3>
					<p class="mt-2 text-sm text-gray-600">${item.desc}</p>
				</div>`
    )
    .join("\n");

  const purchaseCards = purchaseOptions
    .map(
      (opt) => `\t\t\t\t<div class="js-reveal-card js-tilt-card overflow-hidden flex flex-col rounded-xl border border-gray-200 p-8 text-center" data-reveal-group="purchase">
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

  // Testimonios en columnas con marquee vertical (puerto vanilla del
  // componente React "TestimonialsColumn"): cada columna se desplaza sola en
  // bucle infinito y se pausa al pasar el cursor. El track duplica las
  // tarjetas (clase .tdup) para que el bucle sea perfecto.
  const testimonialCard = (t, dup) =>
    `\t\t\t\t\t<figure class="tcard${dup ? " tdup" : ""} flex flex-col rounded-2xl border border-gray-200 bg-white p-6">
						<blockquote class="flex-1 text-sm text-gray-600">&ldquo;${t.quote}&rdquo;</blockquote>
						<figcaption class="mt-5 flex items-center gap-3">
							<span class="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
								<img src="${prefix}assets/images/testimonials/avatar-placeholder.svg" alt="" class="h-full w-full object-cover" loading="lazy">
							</span>
							<div>
								<p class="text-sm font-semibold text-dark">${t.name}</p>
								<p class="text-xs text-gray-500">${t.location}</p>
							</div>
						</figcaption>
					</figure>`;

  const testimonialColumn = (list, dur, extraClass, reverse) => {
    const set = (dup) => list.map((t) => testimonialCard(t, dup)).join("\n");
    return `\t\t\t<div class="tcol${extraClass ? " " + extraClass : ""}${reverse ? " tcol--reverse" : ""}" style="--dur: ${dur}s">
				<div class="tcol-track">
${set(false)}
${set(true)}
				</div>
			</div>`;
  };

  const testimonialMarquee = [
    testimonialColumn(testimonials.slice(0, 3), 26, "", false),
    testimonialColumn(testimonials.slice(3, 6), 32, "tcol--md", true),
    testimonialColumn(testimonials.slice(6, 9), 29, "tcol--lg", false),
  ].join("\n");

  const main = `
<div class="ambient" aria-hidden="true"></div>
<section class="home-hero" data-hero>
	<div class="home-hero-bg" data-hero-bg aria-hidden="true">
		<img class="home-hero-img" src="${prefix}assets/images/hero/hero-inicio.avif" alt="Custom 30x40 steel ranch building on an Arizona property" decoding="async">
	</div>
	<div class="home-hero-scrim" aria-hidden="true"></div>
	<div class="home-hero-inner">
		<div class="home-hero-content" data-hero-parallax>
			<p class="home-hero-eyebrow">Steel Structure Manufacturer</p>
			<h1 class="home-hero-title">Steel Buildings</h1>
			<p class="home-hero-sub">Custom garages, carports, barns and workshops, designed to withstand the heat and the monsoon, with delivery and installation.</p>
			<div class="home-hero-actions">
				<a href="${prefix}contact/contact.html" class="hero-cta-primary">Get a Free Quote</a>
				<a href="#our-products" class="hero-cta-ghost">Explore Buildings</a>
			</div>
			
		</div>
	</div>
	<a href="#our-products" class="home-hero-scroll" data-scroll-indicator aria-label="Scroll to explore">
		<span>Scroll</span>
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
	</a>
</section>
<section class="border-y border-gray-100 bg-gray-50 py-12">
	<div class="mx-auto grid w-full max-w-7xl grid-cols-2 gap-8 px-4 text-center sm:grid-cols-4 sm:px-6 lg:px-8">
		<div class="js-reveal-card" data-reveal-group="stats">
			<p class="text-3xl font-extrabold text-primary sm:text-4xl" data-counter="${site.completedCount}" data-suffix="+">${count}+</p>
			<p class="mt-1 text-sm text-gray-600">Buildings Delivered</p>
		</div>
		<div class="js-reveal-card" data-reveal-group="stats">
			<p class="text-3xl font-extrabold text-primary sm:text-4xl" data-counter="${site.googleReviews}" data-suffix="+">${site.googleReviews}+</p>
			<p class="mt-1 text-sm text-gray-600">5-Star Reviews</p>
		</div>
		<div class="js-reveal-card" data-reveal-group="stats">
			<p class="text-3xl font-extrabold text-primary sm:text-4xl" data-counter="${statesCount}" data-suffix="+">${statesCount}+</p>
			<p class="mt-1 text-sm text-gray-600">AZ Cities Served</p>
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
		<div class="projects-grid mt-10">
${projectCards}
		</div>
	</div>
</section>

${galleryLightbox()}

<!-- OCULTO TEMPORALMENTE: seccion Our Products (Built for Every Project). Quitar las marcas de comentario para volver a mostrarla.
<section id="our-products" class="scroll-mt-24 bg-gray-50 py-20">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		${sectionHeading("Our Products", "Built for Every Project", "From a single-car garage to a full commercial warehouse, we've got a structure for it.")}
		<div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
${productGrid}
		</div>
	</div>
</section>
-->

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
		${sectionHeading("Our Partners", "Financing Partners", "We work with trusted rent-to-own and financing partners to make your building affordable.")}
		<div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
			<div class="js-reveal-card lift-card rounded-xl bg-white p-8 shadow-sm" data-reveal-group="partners">
				<h3 class="text-xl font-bold text-dark">Heartland Capital RTO</h3>
				<p class="mt-3 text-sm text-gray-600">Rent-to-own plans up to $20,000 with no credit check and affordable monthly payments — with the option to buy out anytime.</p>
				<a href="${prefix}financing/heartland-capital-rto.html" class="mt-6 inline-flex items-center justify-center rounded-md border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white">Ask about RTO</a>
			</div>
			<div class="js-reveal-card lift-card rounded-xl bg-white p-8 shadow-sm" data-reveal-group="partners">
				<h3 class="text-xl font-bold text-dark">HSF</h3>
				<p class="mt-3 text-sm text-gray-600">Apply for traditional financing up to $100,000 through our HSF partner portal, with fast approval even with limited credit.</p>
				<a href="${prefix}financing/hsf-portal.html" class="mt-6 inline-flex items-center justify-center rounded-md border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white">Request access</a>
			</div>
			<div class="js-reveal-card lift-card rounded-xl bg-white p-8 shadow-sm" data-reveal-group="partners">
				<h3 class="text-xl font-bold text-dark">RTO National</h3>
				<p class="mt-3 text-sm text-gray-600">A nationwide rent-to-own program with flexible terms and early purchase options, available in most of the states we serve.</p>
				<a href="${prefix}financing/rto-national.html" class="mt-6 inline-flex items-center justify-center rounded-md border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white">Learn more</a>
			</div>
		</div>
	</div>
</section>

<section id="where-we-build" class="scroll-mt-24 bg-primary py-20">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		${sectionHeading("Where We Build", "Proudly Serving All of Arizona", "From the low desert to the high country, we deliver and install statewide.", true)}
		<div class="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
${stateChips}
		</div>
	</div>
</section>

<section id="customer-stories" class="scroll-mt-24 py-20">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		${sectionHeading("Customer Stories", "What Our Customers Say")}
		<div class="tcols" aria-label="Customer testimonials">
${testimonialMarquee}
		</div>
	</div>
</section>

<section class="bg-gray-50 py-20">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		${sectionHeading("How It Works", "From Idea to Installed in 4 Simple Steps", "We handle design, engineering, delivery and installation in-house — one point of contact from your first quote to final install.")}
		<div class="process-grid mt-14">
			<div class="js-reveal-card process-step" data-reveal-group="process">
				<div class="process-badge">
					<span class="process-num">1</span>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
				</div>
				<h3 class="mt-5 text-lg font-bold text-dark">Design</h3>
				<p class="mx-auto mt-2 max-w-xs text-sm text-gray-600">Tell us your size, use and site — we'll help you spec the perfect building.</p>
			</div>
			<div class="js-reveal-card process-step" data-reveal-group="process">
				<div class="process-badge">
					<span class="process-num">2</span>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6"/><path d="M9 17h4"/></svg>
				</div>
				<h3 class="mt-5 text-lg font-bold text-dark">Free Quote</h3>
				<p class="mx-auto mt-2 max-w-xs text-sm text-gray-600">Get a fast, no-obligation quote — with financing options if you need them.</p>
			</div>
			<div class="js-reveal-card process-step" data-reveal-group="process">
				<div class="process-badge">
					<span class="process-num">3</span>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h18"/><path d="M4 21V10l6 4V10l6 4V7l4 3v11"/><path d="M9 21v-4h2v4"/></svg>
				</div>
				<h3 class="mt-5 text-lg font-bold text-dark">Fabrication</h3>
				<p class="mx-auto mt-2 max-w-xs text-sm text-gray-600">We manufacture your building with certified, heavy-gauge steel, made to your exact spec.</p>
			</div>
			<div class="js-reveal-card process-step" data-reveal-group="process">
				<div class="process-badge">
					<span class="process-num">4</span>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h11v9H3z"/><path d="M14 9h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.7"/><circle cx="17.5" cy="18" r="1.7"/></svg>
				</div>
				<h3 class="mt-5 text-lg font-bold text-dark">Delivery &amp; Install</h3>
				<p class="mx-auto mt-2 max-w-xs text-sm text-gray-600">Our crew delivers and installs on your prepared site, usually in 4–8 weeks.</p>
			</div>
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
    extraHead: localBusinessJsonLd(),
    extraScripts: `<script>
// Video del hero: dos cuidados de performance/accesibilidad.
//  · "reducir movimiento" -> lo pausamos (scroll-expand ya deja el media
//    expandido y accesible).
//  · Conexión lenta / "ahorro de datos" (Save-Data) -> NO descargamos los
//    2.5 MB del video; queda el poster (la escena SVG del atardecer).
(function () {
	var v = document.querySelector(".sxm-video");
	if (!v) return;
	var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	var conn = navigator.connection || {};
	var save = conn.saveData === true || /(^|-)2g$/.test(conn.effectiveType || "");
	if (reduce) { v.removeAttribute("autoplay"); if (v.pause) v.pause(); }
	if (save) {
		v.removeAttribute("autoplay");
		v.preload = "none";
		var s = v.querySelector("source");
		if (s) s.remove();
		try { v.load(); } catch (e) {}
	}
})();
</script>
<script src="${prefix}assets/js/scroll-expand.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="${prefix}assets/js/motion.js"></script>
`,
  });

  files["index.css"] = `/* Estilos específicos de la portada (index.html).
   El diseño base compartido vive en assets/css/main.css. */

/* Video de fondo del hero (assets/video/hero.mp4).
   object-fit: cover hace que siempre llene el área sin deformarse,
   recortando lo que sobre desde el centro, en cualquier pantalla. */
.hero-video {
	opacity: 0.6;
	object-fit: cover;
	object-position: center;
}

/* Altura del hero adaptable al dispositivo (mobile-first):
   en celulares ocupa ~3/4 de la pantalla; en pantallas más grandes
   crece hasta un máximo cómodo. El video siempre acompaña porque
   cubre el 100% del contenedor. */
[data-hero-parallax] {
	min-height: 70vh;  /* respaldo para navegadores sin svh */
	min-height: min(78svh, 560px);
}

@media (min-width: 40rem) {
	[data-hero-parallax] {
		min-height: min(80svh, 620px);
	}
}

@media (min-width: 64rem) {
	[data-hero-parallax] {
		min-height: min(85svh, 720px);
	}
}

/* Velo acero + brillo de atardecer sobre el video. Dos capas:
   1. Un degradado de acero (más denso a la izquierda, donde va el titular)
      que mantiene el texto blanco legible sin apagar del todo el video.
   2. Un brillo radial ámbar arriba a la derecha: el "atardecer de Arizona"
      que da el toque cálido y premium. */
.hero-overlay {
	background:
		linear-gradient(
			100deg,
			rgba(20, 26, 33, 0.93) 0%,
			rgba(22, 28, 34, 0.80) 40%,
			rgba(28, 37, 46, 0.52) 72%,
			rgba(35, 43, 51, 0.36) 100%
		),
		radial-gradient(
			115% 90% at 88% 6%,
			rgba(244, 169, 60, 0.40),
			rgba(244, 169, 60, 0) 55%
		);
}

/* Con "reducir movimiento" activado se oculta el video (además el JS
   de la página lo pausa) y queda la imagen estática de respaldo. */
@media (prefers-reduced-motion: reduce) {
	.hero-video {
		display: none;
	}
}
`;
}

// ---- Páginas de producto (products/{slug}/{slug}.html) ----
for (const p of products) {
  const prefix = "../../";
  const related = products.filter((x) => x.slug !== p.slug).slice(0, 3);

  const featureItems = p.features
    .map(
      (f) => `\t\t\t\t\t<li class="feature-item reveal-rise flex gap-3 text-sm text-gray-700">
						<span class="feature-check mt-0.5 text-accent">&#10003;</span>
						${f}
					</li>`
    )
    .join("\n");

  const modelItems = p.models
    .map(
      (m) => `\t\t\t\t\t<div class="size-card reveal-rise flex items-center justify-between rounded-lg border border-gray-200 p-4">
						<div>
							<p class="font-semibold text-dark">${m.name}</p>
							<p class="text-sm text-gray-500">${m.size}</p>
						</div>
						<p class="size-price text-sm font-semibold text-accent">${m.price}</p>
					</div>`
    )
    .join("\n");

  const relatedCards = related.map((r) => `\t\t\t\t${productCard(prefix, r)}`).join("\n");

  const main = `
<section class="product-hero relative overflow-hidden bg-primary" data-parallax3d>
	<div class="absolute inset-0">
		<div class="ph-bg-layer absolute inset-0">
			<img src="${productHeroImage(prefix, p)}" alt="" class="product-hero-img h-full w-full object-cover opacity-30">
		</div>
		<div class="absolute inset-0 bg-primary/70"></div>
		<span class="product-hero-glow" aria-hidden="true"></span>
	</div>
	<div class="ph-fg-layer relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
		<p class="reveal-rise text-sm font-semibold uppercase tracking-widest text-blue-200">Products</p>
		<h1 class="reveal-rise mt-2 max-w-2xl text-4xl font-extrabold text-white sm:text-5xl">${p.title}</h1>
		<p class="reveal-rise mt-4 max-w-xl text-lg text-blue-100">${p.excerpt}</p>
		<a href="${prefix}contact/contact.html" class="reveal-rise mt-8 inline-flex items-center justify-center rounded-md bg-accent px-8 py-3.5 text-base font-semibold text-white shadow-sm transition hover:opacity-90">Get a Free Quote</a>
	</div>
</section>

<section class="py-20">
	<div class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
		<div>
			<h2 class="reveal-rise text-2xl font-bold text-dark">Overview</h2>
			<div class="reveal-rise mt-4 text-sm text-gray-700"><p>${p.content}</p></div>

			<h2 class="reveal-rise mt-8 text-2xl font-bold text-dark">Features</h2>
			<ul class="mt-6 space-y-3">
${featureItems}
			</ul>
		</div>

		<div>
			<h2 class="reveal-rise text-2xl font-bold text-dark">Popular Sizes</h2>
			<div class="mt-6 space-y-4">
${modelItems}
			</div>
		</div>
	</div>
</section>

<section class="bg-gray-50 py-20">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="reveal-rise text-2xl font-bold text-dark">You Might Also Like</h2>
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
		<p>${site.name} was built on a simple idea: every home and business in Arizona deserves a durable, affordable steel structure without the hassle. From our first garage to thousands of buildings delivered across the state, our team handles design, engineering, delivery and installation in-house — so you get one point of contact from quote to completion.</p>
		<p>We stand behind every build with a support team that's with you from your first quote through final installation.</p>
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
      (opt) => `\t\t\t<div class="lift-card reveal-rise rounded-xl border border-gray-200 p-8">
				<h2 class="text-xl font-bold text-dark">${opt.title}</h2>
				<p class="mt-3 text-sm text-gray-600">${opt.desc}</p>
			</div>`
    )
    .join("\n");

  const main = `
<!-- OCULTO TEMPORALMENTE: seccion Flexible Ways to Own Your Building (Payment Options) y sus tarjetas. Quitar las marcas de comentario para volver a mostrarla.
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
-->

<section class="bg-gray-50 py-20">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		${sectionHeading("Our Partners", "Financing Partners", "We work with trusted rent-to-own and financing partners to make your building affordable.")}
		<div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
			<div id="heartland-capital-rto" class="lift-card reveal-rise scroll-mt-24 rounded-xl bg-white p-8 shadow-sm">
				<h2 class="text-xl font-bold text-dark">Heartland Capital RTO</h2>
				<p class="mt-3 text-sm text-gray-600">Rent-to-own plans up to $20,000 with no credit check and affordable monthly payments — with the option to buy out anytime.</p>
				<a href="${prefix}financing/heartland-capital-rto.html" class="mt-6 inline-flex items-center justify-center rounded-md border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white">Ask about RTO</a>
			</div>
			<div id="hsf-portal" class="lift-card reveal-rise scroll-mt-24 rounded-xl bg-white p-8 shadow-sm">
				<h2 class="text-xl font-bold text-dark">HSF</h2>
				<p class="mt-3 text-sm text-gray-600">Apply for traditional financing up to $100,000 through our HSF partner portal, with fast approval even with limited credit.</p>
				<a href="${prefix}financing/hsf-portal.html" class="mt-6 inline-flex items-center justify-center rounded-md border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white">Request access</a>
			</div>
			<div id="rto-national" class="lift-card reveal-rise scroll-mt-24 rounded-xl bg-white p-8 shadow-sm">
				<h2 class="text-xl font-bold text-dark">RTO National</h2>
				<p class="mt-3 text-sm text-gray-600">A nationwide rent-to-own program with flexible terms and early purchase options, available in most of the states we serve.</p>
				<a href="${prefix}financing/rto-national.html" class="mt-6 inline-flex items-center justify-center rounded-md border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white">Learn more</a>
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

  // Página del portal de financiación HSF (resumen tipo HFS Financial).
  files["financing/hsf-portal.html"] = page({
    title: `HSF — Financing — ${site.name}`,
    description: "Fixed-rate financing for your steel building through our HSF partner — no home equity, no appraisals, funds in as little as one day.",
    prefix,
    main: hsfPortalMain(prefix),
    cssFile: "financing.css",
  });

  // Página de RTO National (resumen tipo rtonational.com).
  files["financing/rto-national.html"] = page({
    title: `RTO National — Financing — ${site.name}`,
    description: "Rent-to-own for your steel building through RTO National — lease with no credit check or finance with $0 down, and buy out anytime.",
    prefix,
    main: rtoNationalMain(prefix),
    cssFile: "financing.css",
  });

  // Página de Heartland Capital RTO (resumen tipo hci.net).
  files["financing/heartland-capital-rto.html"] = page({
    title: `Heartland Capital RTO — Financing — ${site.name}`,
    description: "Rent-to-own for your steel building through Heartland Capital — no credit check, no upfront cost, cancel anytime and every payment goes toward ownership.",
    prefix,
    main: heartlandRtoMain(prefix),
    cssFile: "financing.css",
  });
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
    description: "Frequently asked questions about our steel buildings, permits, delivery and installation.",
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

  files["contact/contact.js"] = `// Lógica de la página Contact — versión FRONT-END ONLY.
// El formulario muestra su estado de éxito directamente en el navegador,
// sin depender de un backend. Cuando conectes un servicio real de
// formularios (Formspree, Web3Forms, tu propio endpoint…), enviá los datos
// en el punto marcado con TODO más abajo y luego llamá a showSuccess().
(function () {
	var params = new URLSearchParams(window.location.search);
	var status = params.get("quote");
	var form = document.getElementById("quote-form");
	var success = document.getElementById("quote-success");
	var error = document.getElementById("quote-error");

	function showSuccess() {
		if (error) error.classList.add("hidden");
		if (form) form.classList.add("hidden");
		if (success) {
			success.classList.remove("hidden");
			success.setAttribute("tabindex", "-1");
			success.focus();
			success.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	}

	// Compatibilidad: si algún día se usa un backend que redirige con
	// ?quote=success|error, respetamos ese parámetro.
	if (status === "success") {
		showSuccess();
	} else if (status === "error" && error) {
		error.classList.remove("hidden");
	}

	if (form) {
		form.addEventListener("submit", function (event) {
			// Sin backend por ahora: manejamos el envío en el cliente.
			event.preventDefault();

			// Honeypot anti-spam: si el campo oculto está lleno, es un bot;
			// fingimos éxito y no hacemos nada más.
			var honeypot = form.querySelector("#website");
			if (honeypot && honeypot.value) { showSuccess(); return; }

			if (!form.checkValidity()) {
				form.classList.add("was-validated");
				if (error) error.classList.remove("hidden");
				var firstInvalid = form.querySelector(":invalid");
				if (firstInvalid) firstInvalid.focus();
				return;
			}

			// TODO (entrega del lead): acá va el envío real. Ejemplo con
			// Formspree / Web3Forms (reemplazá la URL por la tuya):
			//   fetch("https://formspree.io/f/XXXXXXXX", {
			//     method: "POST",
			//     headers: { Accept: "application/json" },
			//     body: new FormData(form)
			//   }).then(showSuccess).catch(function () {
			//     if (error) error.classList.remove("hidden");
			//   });
			// Mientras no haya endpoint, mostramos el éxito directamente:
			showSuccess();
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

  files["dealers/apply/apply.js"] = `// Lógica de la página Dealer Application — versión FRONT-END ONLY.
// Igual que contact.js: el éxito se muestra en el cliente y el envío real
// del lead va en el punto marcado con TODO (conectar Formspree/endpoint).
(function () {
	var params = new URLSearchParams(window.location.search);
	var status = params.get("apply");
	var form = document.getElementById("apply-form");
	var success = document.getElementById("apply-success");
	var error = document.getElementById("apply-error");

	function showSuccess() {
		if (error) error.classList.add("hidden");
		if (form) form.classList.add("hidden");
		if (success) {
			success.classList.remove("hidden");
			success.setAttribute("tabindex", "-1");
			success.focus();
			success.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	}

	if (status === "success") {
		showSuccess();
	} else if (status === "error" && error) {
		error.classList.remove("hidden");
	}

	if (form) {
		form.addEventListener("submit", function (event) {
			event.preventDefault();

			var honeypot = form.querySelector("#website");
			if (honeypot && honeypot.value) { showSuccess(); return; }

			if (!form.checkValidity()) {
				form.classList.add("was-validated");
				if (error) error.classList.remove("hidden");
				var firstInvalid = form.querySelector(":invalid");
				if (firstInvalid) firstInvalid.focus();
				return;
			}

			// TODO (entrega del lead): enviar a un endpoint real aquí, luego
			// llamar a showSuccess() (ver ejemplo en contact/contact.js).
			showSuccess();
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

// ---- Our Work (scroll-to-expand media hero, portado a vanilla) ----
// Recreación del componente React "ScrollExpandMedia" con HTML/CSS/JS
// planos: mientras no está expandido, el "scroll" (rueda/touch) no mueve la
// página sino que agranda el video y separa el título; al llegar al 100% se
// libera el scroll y aparece el contenido. El JS vive en
// assets/js/scroll-expand.js y respeta prefers-reduced-motion.
{
  const prefix = "../";
  const main = `
<section class="home-hero" data-hero>
	<div class="home-hero-bg" data-hero-bg aria-hidden="true">
		<img class="home-hero-img" src="${prefix}assets/images/hero/hero-inicio.avif" alt="Custom steel building on an Arizona property" decoding="async">
	</div>
	<div class="home-hero-scrim" aria-hidden="true"></div>
	<div class="home-hero-inner">
		<div class="home-hero-content">
			<p class="home-hero-eyebrow">Arizona Steel &middot; Built On-Site</p>
			<h1 class="home-hero-title">Built to Last</h1>
			<p class="home-hero-sub">Custom steel structures engineered for the Arizona climate and raised on your property by our own crews.</p>
			<div class="home-hero-actions">
				<a href="${prefix}contact/contact.html" class="hero-cta-primary">Get a Free Quote</a>
				<a href="${prefix}index.html#our-products" class="hero-cta-ghost">Explore Products</a>
			</div>
		</div>
	</div>
</section>

<section class="py-20">
	<div class="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
		<p class="text-sm font-semibold uppercase tracking-wide eyebrow-red">Our Work</p>
		<h2 class="mt-2 text-3xl font-bold tracking-tight text-dark sm:text-4xl">Craftsmanship you can see from the road</h2>
		<p class="mt-5 text-lg text-gray-600">Every AZ Sunset structure is engineered for the Arizona climate and raised on your property by our own crews — from a single-car carport to a full commercial warehouse. Heavy-gauge steel with certified wind and snow ratings on every build.</p>
	</div>
</section>

${ctaBanner(prefix, "Ready to start your project?", "Tell us what you need and we'll send a free, no-obligation quote.", "Get a Free Quote")}
`;
  files["our-work/our-work.html"] = page({
    title: `Our Work — ${site.name}`,
    description: "An immersive look at the custom steel structures we design, build and install across Arizona.",
    prefix,
    main,
    cssFile: "our-work.css",
  });

  files["our-work/our-work.css"] = `/* ===== Scroll-to-expand media hero (portado a vanilla desde el componente
   React "ScrollExpandMedia"). El JS (assets/js/scroll-expand.js) sólo
   actualiza tamaños y opacidades; toda la estructura vive en el HTML. ===== */
.sxm { overflow-x: hidden; }
.sxm-stage { position: relative; display: flex; flex-direction: column; align-items: center; min-height: 100dvh; }

.sxm-bg {
	position: absolute; inset: 0; z-index: 0;
	background:
		radial-gradient(120% 90% at 82% 0%, rgba(244, 169, 60, 0.38), rgba(244, 169, 60, 0) 55%),
		linear-gradient(160deg, #1d2630 0%, #141a21 55%, #0f141a 100%);
}
.sxm-bg::after { content: ""; position: absolute; inset: 0; background: rgba(0, 0, 0, 0.12); }

.sxm-container { position: relative; z-index: 10; width: 100%; max-width: 80rem; margin: 0 auto; display: flex; flex-direction: column; align-items: center; }
.sxm-center { position: relative; width: 100%; height: 100dvh; display: flex; align-items: center; justify-content: center; }

.sxm-media {
	position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
	z-index: 0; border-radius: 1rem; overflow: hidden;
	width: min(1100px, 95vw); height: min(78vh, 680px); /* respaldo si el JS no corre */
	max-width: 95vw; max-height: 85vh;
	box-shadow: 0 24px 70px -20px rgba(0, 0, 0, 0.6);
}
.sxm-media > video, .sxm-media > img { width: 100%; height: 100%; object-fit: cover; border-radius: 1rem; display: block; }
.sxm-veil { position: absolute; inset: 0; border-radius: 1rem; background: rgba(15, 20, 26, 0.35); }

.sxm-hint { position: absolute; left: 0; right: 0; bottom: 1.25rem; z-index: 10; display: flex; flex-direction: column; align-items: center; gap: 0.15rem; text-align: center; pointer-events: none; transition: opacity 0.4s ease; }
.sxm-date { font-family: "Hanken Grotesk", sans-serif; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-sun); }
.sxm-scroll { font-size: 0.9rem; font-weight: 500; letter-spacing: 0.02em; color: #c9cfd6; }
.sxm.is-expanded .sxm-hint { opacity: 0; }

.sxm-title { position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; gap: 0.25rem; width: 100%; text-align: center; }
.sxm-title h2 { margin: 0; color: #fff; font-family: "Fraunces", Georgia, "Times New Roman", serif; font-weight: 600; line-height: 1.05; font-size: clamp(2.8rem, 8vw, 4.75rem); text-shadow: 0 2px 24px rgba(0, 0, 0, 0.35); }

.sxm-content { width: 100%; padding: 3rem 2rem 5rem; opacity: 0; }

/* El tamaño del media y el desplazamiento del título siguen el "scroll" sin
   easing (instantáneo), igual que el original; el resto sí atenúa. */
.sxm-media, .sxm-title h2, .sxm-date, .sxm-scroll { transition: none; }
.sxm-bg, .sxm-veil { transition: opacity 0.1s linear; }
.sxm-content { transition: opacity 0.7s ease; }

/* Reducir movimiento: el JS deja el media expandido y el contenido visible;
   acá garantizamos que el contenido se vea aunque el JS no corra. */
@media (prefers-reduced-motion: reduce) {
	.sxm-content { opacity: 1; }
	.sxm-hint { display: none; }
}
`;

  // Módulo vanilla (sin dependencias). Se auto-inicializa sobre
  // [data-scroll-expand]; no construye DOM, sólo lo anima.
  files["assets/js/scroll-expand.js"] = `// Scroll-to-expand media hero — puerto vanilla del componente React
// "ScrollExpandMedia". Mientras no está expandido, intercepta rueda/touch
// para agrandar el media y separar el título en lugar de desplazar la
// página; al 100% libera el scroll y muestra el contenido. Respeta
// prefers-reduced-motion (queda expandido y accesible, sin secuestrar el
// scroll).
(function () {
	"use strict";

	var root = document.querySelector("[data-scroll-expand]");
	if (!root) return;

	var bg = root.querySelector(".sxm-bg");
	var media = root.querySelector(".sxm-media");
	var veil = root.querySelector(".sxm-veil");
	var isVideo = !!root.querySelector(".sxm-video");
	var titleFirst = root.querySelector(".sxm-title-first");
	var titleRest = root.querySelector(".sxm-title-rest");
	var dateEl = root.querySelector(".sxm-date");
	var scrollEl = root.querySelector(".sxm-scroll");
	var content = root.querySelector(".sxm-content");

	var progress = 0;
	var expanded = false;
	var touchStartY = 0;
	var isMobile = window.innerWidth < 768;
	var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	function apply() {
		var w = 300 + progress * (isMobile ? 650 : 1250);
		var h = 400 + progress * (isMobile ? 200 : 400);
		media.style.width = w + "px";
		media.style.height = h + "px";
		if (bg) bg.style.opacity = String(1 - progress);
		if (veil) veil.style.opacity = String((isVideo ? 0.5 : 0.32) - progress * 0.3);
		var t = progress * (isMobile ? 180 : 150);
		if (titleFirst) titleFirst.style.transform = "translateX(-" + t + "vw)";
		if (titleRest) titleRest.style.transform = "translateX(" + t + "vw)";
		if (dateEl) dateEl.style.transform = "translateX(-" + t + "vw)";
		if (scrollEl) scrollEl.style.transform = "translateX(" + t + "vw)";
	}

	function setContent(show) {
		if (!content) return;
		content.style.opacity = show ? "1" : "0";
		content.style.pointerEvents = show ? "auto" : "none";
		// Mientras está colapsado, el contenido queda fuera del orden de
		// tabulación (inert) para no atrapar a usuarios de teclado.
		content.inert = !show;
	}

	function expand() { expanded = true; root.classList.add("is-expanded"); setContent(true); }
	function collapse() { expanded = false; root.classList.remove("is-expanded"); setContent(false); }

	// Con "reducir movimiento": expandido de entrada, sin secuestrar scroll.
	if (reduce) { progress = 1; apply(); expand(); return; }

	apply();
	setContent(false);

	// Tween suave del progreso: en vez de secuestrar el scroll tick a tick
	// (lo que hacía que se sintiera "pegado"), UN gesto hacia abajo expande el
	// hero en una animación corta y LUEGO libera el scroll normal de la página.
	var animating = false;
	function tweenTo(target, dur, done) {
		animating = true;
		var start = progress;
		var t0 = (window.performance && performance.now) ? performance.now() : Date.now();
		function step() {
			var now = (window.performance && performance.now) ? performance.now() : Date.now();
			var k = Math.min(1, (now - t0) / dur);
			var e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; // easeInOutQuad
			progress = start + (target - start) * e;
			apply();
			try { if (window.AZSound) window.AZSound.heroProgress(progress); } catch (err) {}
			if (k < 1) { requestAnimationFrame(step); }
			else { progress = target; apply(); animating = false; if (done) done(); }
		}
		requestAnimationFrame(step);
	}
	function doExpand() { if (!expanded && !animating) tweenTo(1, 650, expand); }
	function doCollapse() { if (expanded && !animating) tweenTo(0, 480, collapse); }

	function onWheel(e) {
		if (!expanded) {
			// Antes de expandir: cualquier scroll hacia abajo dispara la
			// animación (y bloqueamos el scroll SÓLO durante esa animación).
			if (e.deltaY > 0 || animating) e.preventDefault();
			if (e.deltaY > 0) doExpand();
		} else if (e.deltaY < 0 && window.scrollY <= 0 && !animating) {
			// Ya expandido y arriba del todo: subir colapsa (efecto reversible).
			e.preventDefault();
			doCollapse();
		}
	}

	function onTouchStart(e) { touchStartY = e.touches[0].clientY; }
	function onTouchMove(e) {
		if (!touchStartY) return;
		var d = touchStartY - e.touches[0].clientY; // >0 = intención de bajar
		if (!expanded) {
			if (d > 8 || animating) e.preventDefault();
			if (d > 8) doExpand();
		} else if (d < -8 && window.scrollY <= 0 && !animating) {
			e.preventDefault();
			doCollapse();
		}
	}
	function onTouchEnd() { touchStartY = 0; }

	// Accesibilidad: operable con teclado. Abajo/Re Pág/Espacio/Fin expanden;
	// Arriba/Av Pág/Inicio (estando arriba del todo) colapsan.
	function onKey(e) {
		var k = e.key;
		if (!expanded && (k === "ArrowDown" || k === "PageDown" || k === " " || k === "Spacebar" || k === "End")) {
			e.preventDefault();
			doExpand();
		} else if (expanded && (k === "ArrowUp" || k === "PageUp" || k === "Home") && window.scrollY <= 0 && !animating) {
			e.preventDefault();
			doCollapse();
		}
	}

	window.addEventListener("resize", function () { isMobile = window.innerWidth < 768; apply(); });
	window.addEventListener("wheel", onWheel, { passive: false });
	window.addEventListener("keydown", onKey);
	window.addEventListener("touchstart", onTouchStart, { passive: false });
	window.addEventListener("touchmove", onTouchMove, { passive: false });
	window.addEventListener("touchend", onTouchEnd);
})();
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
    video/hero.mp4            Video de fondo del hero (solo portada;
                              con autoplay silencioso, respeta
                              "reducir movimiento" del sistema)
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
- **Colores de marca**: la paleta AZ Sunset (tema CLARO "Steel & Sunset")
  vive en el bloque \`:root\` de \`assets/css/site.css\` — acero #141A21 /
  #232B33 / #3A4650, atardecer #C2410C como acento/CTA (contraste AA sobre
  blanco) con hover #A5370C, ámbar #F4A93C para brillos y estrellas, rojo
  #98291E para errores — y pisa los valores por defecto de \`main.css\`.
  Cambiá ahí cualquier color.
- **Formulario de cotización**: hoy funciona *solo en el front-end*
  (\`contact/contact.js\`): valida y muestra el mensaje de éxito en el
  navegador sin backend. Para recibir los leads por correo, conectá un
  servicio de formularios (Formspree/Web3Forms/endpoint propio) en el
  punto marcado con \`TODO\` dentro de \`contact.js\` (y \`apply.js\`).
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

// Placeholders SVG en estilo "blueprint" claro, acordes al tema Steel &
// Sunset: fondo gris muy claro con una grilla técnica sutil, la silueta de
// una nave/edificio en acero y un "sol" ámbar de atardecer. Reemplazá estos
// archivos por fotos reales manteniendo el mismo nombre. (El 4º argumento
// de color ya no se usa; se conserva por compatibilidad con las llamadas.)
function placeholderSvg(label, w, h) {
  // Avatares de testimonios (sin etiqueta): silueta neutra sobre acero claro.
  if (!label) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Avatar">
  <rect width="100%" height="100%" fill="#1c1c1c"/>
  <circle cx="${w / 2}" cy="${h * 0.4}" r="${w * 0.16}" fill="#4a4a4a"/>
  <path d="M${w * 0.2} ${h * 0.95} a${w * 0.3} ${w * 0.3} 0 0 1 ${w * 0.6} 0 Z" fill="#4a4a4a"/>
</svg>
`;
  }
  const cx = w / 2;
  // NOTA: las animaciones (CSS @keyframes + SMIL en el patrón) SÍ corren aunque
  // el SVG se cargue con <img>, lo que da vida a las tarjetas de producto: sol
  // que late y sube, grilla que deriva y base naranja que respira.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1e1e1e"/>
      <stop offset="1" stop-color="#101010"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="#2e2e2e" stroke-width="1" opacity="0.7"/>
      <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="40 40" dur="14s" repeatCount="indefinite"/>
    </pattern>
    <style>
      .sun, .halo { transform-box: fill-box; transform-origin: center; }
      .sun { animation: sunBob 6s ease-in-out infinite; }
      .halo { animation: sunHalo 4.5s ease-in-out infinite; }
      .base { transform-box: fill-box; transform-origin: center; animation: baseGlow 3.6s ease-in-out infinite; }
      .frame { animation: frameGlow 6s ease-in-out infinite; }
      @keyframes sunBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
      @keyframes sunHalo { 0% { transform: scale(1); opacity: .32; } 70% { opacity: 0; } 100% { transform: scale(1.55); opacity: 0; } }
      @keyframes baseGlow { 0%, 100% { opacity: 1; transform: scaleX(1); } 50% { opacity: .6; transform: scaleX(.97); } }
      @keyframes frameGlow { 0%, 100% { opacity: .88; } 50% { opacity: 1; } }
      @media (prefers-reduced-motion: reduce) { .sun, .halo, .base, .frame { animation: none; } }
    </style>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <g class="sun">
    <circle class="halo" cx="${cx}" cy="${h * 0.3}" r="${h * 0.055}" fill="#f9b24a" opacity="0.4"/>
    <circle cx="${cx}" cy="${h * 0.3}" r="${h * 0.055}" fill="#f9b24a"/>
  </g>
  <g class="frame" fill="none" stroke="#7a7a7a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
    <path d="M${w * 0.26} ${h * 0.66} V${h * 0.44} L${cx} ${h * 0.32} L${w * 0.74} ${h * 0.44} V${h * 0.66}"/>
    <path d="M${w * 0.26} ${h * 0.66} H${w * 0.74}"/>
    <path d="M${w * 0.44} ${h * 0.66} V${h * 0.54} H${w * 0.56} V${h * 0.66}"/>
  </g>
  <rect class="base" x="${w * 0.24}" y="${h * 0.68}" width="${w * 0.52}" height="3" fill="#f26a21"/>
  <text x="50%" y="84%" dominant-baseline="middle" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="${Math.round(w / 24)}" font-weight="700" fill="#c6c6c6" opacity="0.95">${label}</text>
</svg>
`;
}
// Escena principal del hero (reemplaza el video): atardecer de Arizona con
// siluetas de estructuras de acero (taller/garaje, cochera y granero) — hecha
// a mano en SVG para que sea nítida, ligera y 100% on-brand (negro + naranja).
function heroSceneSvg() {
  let rays = "";
  for (let i = 0; i < 15; i++) {
    const ang = -84 + i * 12;
    const op = i % 2 === 0 ? 0.1 : 0.05;
    rays += `<polygon points="800,-900 776,565 824,565" fill="#ffd08a" opacity="${op}" transform="rotate(${ang} 800 565)"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Custom steel garages, carports and barns silhouetted against an Arizona sunset">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#120b20"/>
      <stop offset="0.34" stop-color="#3d183a"/>
      <stop offset="0.52" stop-color="#7c2a25"/>
      <stop offset="0.62" stop-color="#c94a1c"/>
      <stop offset="0.70" stop-color="#f39238"/>
      <stop offset="0.82" stop-color="#f9b24a"/>
    </linearGradient>
    <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#ffe9bf"/>
      <stop offset="0.45" stop-color="#ffbe57"/>
      <stop offset="1" stop-color="#ffb44e" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2b1017"/>
      <stop offset="1" stop-color="#070406"/>
    </linearGradient>
    <radialGradient id="vig" cx="0.5" cy="0.42" r="0.78">
      <stop offset="0.55" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.55"/>
    </radialGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0d0d0d" stop-opacity="0"/>
      <stop offset="1" stop-color="#0d0d0d"/>
    </linearGradient>
  </defs>

  <rect width="1600" height="1000" fill="url(#sky)"/>
  <g>${rays}</g>
  <circle cx="800" cy="565" r="360" fill="url(#sun)"/>
  <circle cx="800" cy="565" r="90" fill="#ffd587"/>

  <g stroke="#3a1c14" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.7">
    <path d="M1120 300 q12 -10 24 0 q12 -10 24 0"/>
    <path d="M1182 332 q9 -8 18 0 q9 -8 18 0"/>
    <path d="M1090 344 q8 -7 16 0 q8 -7 16 0"/>
  </g>

  <path d="M0 648 L180 612 L340 636 L520 596 L700 632 L900 604 L1090 638 L1280 606 L1460 634 L1600 616 L1600 706 L0 706 Z" fill="#5f2331" opacity="0.85"/>
  <path d="M0 672 L220 640 L430 668 L640 634 L860 666 L1080 642 L1300 670 L1520 648 L1600 660 L1600 720 L0 720 Z" fill="#39121f"/>
  <rect x="0" y="640" width="1600" height="10" fill="#ffca73" opacity="0.22"/>
  <rect x="0" y="700" width="1600" height="300" fill="url(#ground)"/>

  <!-- sombras de contacto -->
  <ellipse cx="465" cy="814" rx="150" ry="16" fill="#050303" opacity="0.7"/>
  <ellipse cx="800" cy="802" rx="175" ry="18" fill="#050303" opacity="0.7"/>
  <ellipse cx="1150" cy="814" rx="165" ry="16" fill="#050303" opacity="0.7"/>

  <!-- cactus izquierdo -->
  <g stroke="#080707" stroke-width="24" fill="none" stroke-linecap="round">
    <path d="M210 762 V486"/>
    <path d="M210 628 C178 628 170 616 170 588 V560"/>
    <path d="M210 600 C244 600 252 588 252 562 V532"/>
  </g>
  <!-- cactus derecho -->
  <g stroke="#080707" stroke-width="22" fill="none" stroke-linecap="round">
    <path d="M1392 770 V520"/>
    <path d="M1392 648 C1362 648 1355 636 1355 612 V586"/>
  </g>

  <!-- cochera / carport (izquierda) -->
  <g fill="#0b0b0b">
    <rect x="342" y="700" width="14" height="112"/>
    <rect x="586" y="700" width="14" height="112"/>
    <rect x="470" y="672" width="10" height="140" opacity="0.7"/>
    <polygon points="330,700 465,656 600,700 600,714 465,672 330,714"/>
    <rect x="384" y="756" width="176" height="56" rx="10" fill="#111111"/>
    <rect x="384" y="748" width="52" height="20" rx="6" fill="#111111"/>
  </g>
  <path d="M330 700 L465 656 L600 700" fill="none" stroke="#f26a21" stroke-width="4" stroke-linejoin="round" opacity="0.8"/>

  <!-- taller / garaje (centro) -->
  <polygon points="655,800 655,655 800,580 945,655 945,800" fill="#0b0b0b"/>
  <path d="M655 655 L800 580 L945 655" fill="none" stroke="#f26a21" stroke-width="5" stroke-linejoin="round" opacity="0.9"/>
  <path d="M655 655 V800" stroke="#f26a21" stroke-width="3" opacity="0.35"/>
  <rect x="676" y="676" width="118" height="124" fill="#161616"/>
  <rect x="806" y="676" width="118" height="124" fill="#161616"/>
  <g stroke="#242424" stroke-width="2">
    <path d="M676 708 H794 M676 740 H794 M676 772 H794"/>
    <path d="M806 708 H924 M806 740 H924 M806 772 H924"/>
  </g>
  <rect x="676" y="794" width="248" height="6" fill="#f26a21" opacity="0.75"/>

  <!-- granero (derecha) -->
  <polygon points="1010,812 1010,672 1150,596 1290,672 1290,812" fill="#0b0b0b"/>
  <rect x="1136" y="576" width="28" height="24" fill="#0b0b0b"/>
  <polygon points="1130,576 1150,560 1170,576" fill="#0b0b0b"/>
  <path d="M1010 672 L1150 596 L1290 672" fill="none" stroke="#f26a21" stroke-width="5" stroke-linejoin="round" opacity="0.85"/>
  <path d="M1130 576 L1150 560 L1170 576" fill="none" stroke="#f26a21" stroke-width="3" opacity="0.7"/>
  <rect x="1119" y="700" width="62" height="112" fill="#161616"/>
  <rect x="1119" y="806" width="62" height="6" fill="#f26a21" opacity="0.7"/>

  <rect width="1600" height="1000" fill="url(#vig)"/>
  <rect x="0" y="720" width="1600" height="280" fill="url(#fade)"/>
</svg>
`;
}
files["assets/images/hero/hero-scene.svg"] = heroSceneSvg();

// Sonido de interfaz (clic + hover) sintetizado con Web Audio API — sin
// archivos de audio que descargar. Estilo "UI moderno": tonos cortos, limpios
// y discretos. Incluye botón flotante de silencio que recuerda la preferencia.
files["assets/js/sound.js"] = `// Sonido de interfaz para AZ Sunset — sintetizado con la Web Audio API (sin
// assets de audio). Todo cálido y suave, SIN campanas ni audio de fondo:
//   1) UI: clic (gota de madera grave). Sólo en el clic.
//   2) Hero: al hacer scroll en el video, una ráfaga de viento CÁLIDA que
//      crece con el scroll.
// Los navegadores bloquean el audio hasta el primer gesto del usuario, por eso
// el AudioContext se crea/reanuda en el primer pointerdown/tecla/touch. Todo
// pasa por un "master" que el botón de silencio baja a 0.
(function () {
  "use strict";

  var STORAGE = "azsnd-muted-v2";
  var muted = false;
  try { muted = localStorage.getItem(STORAGE) === "1"; } catch (e) {}

  var ctx = null, master = null, noiseBuf = null;
  var heroWind = null, heroResolved = false;

  function ensureCtx() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 1;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  // Ruido marrón (integrado) en un buffer reutilizable: base del viento.
  function makeNoise() {
    if (noiseBuf || !ctx) return noiseBuf;
    var len = Math.floor(ctx.sampleRate * 3);
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = noiseBuf.getChannelData(0), last = 0;
    for (var i = 0; i < len; i++) {
      var white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      d[i] = last * 3.2;
    }
    return noiseBuf;
  }

  // Tono corto y suave (UI). f0/f1: barrido; dur en s; vol pico.
  function blip(f0, f1, dur, vol, type) {
    var c = ensureCtx(); if (!c) return;
    var t = c.currentTime;
    var osc = c.createOscillator(), gain = c.createGain(), lp = c.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 2400;
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(f0, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), t + dur);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(lp); lp.connect(gain); gain.connect(master);
    osc.start(t); osc.stop(t + dur + 0.05);
  }

  // Sonido de interfaz (cálido pero audible, sin campanas). Sólo en el clic.
  function playClick() { blip(440, 250, 0.16, 0.30, "triangle"); }

  // ---- Sonido del hero al hacer scroll (lo llama scroll-expand.js) ----
  // Sólo una ráfaga de viento cálida que crece con el scroll. Sin notas.
  function heroProgress(p) {
    var c = ensureCtx(); if (!c) return;
    if (!heroWind && p > 0.01 && !muted) {
      makeNoise();
      var src = c.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
      var lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 600; // cálido, sin silbido
      var g = c.createGain(); g.gain.value = 0.0001;
      src.connect(lp); lp.connect(g); g.connect(master);
      src.start();
      heroWind = { src: src, gain: g };
    }
    if (heroWind) {
      var target = muted ? 0.0001 : Math.max(0.0001, p * 0.14); // crece con el scroll
      heroWind.gain.setTargetAtTime(target, c.currentTime, 0.15);
    }
    if (p >= 0.999 && !heroResolved) {
      heroResolved = true; // al expandir: leve soplo cálido y luego se asienta
      if (heroWind) {
        heroWind.gain.setTargetAtTime(0.18, c.currentTime, 0.12);
        heroWind.gain.setTargetAtTime(0.03, c.currentTime + 0.5, 0.9);
      }
    }
    if (p < 0.9) heroResolved = false;
  }
  window.AZSound = { heroProgress: heroProgress };

  // Primer gesto: desbloquea el audio y arranca el viento de fondo.
  function unlock() { ensureCtx(); }
  window.addEventListener("wheel", function () { unlock(); }, { passive: true, once: true });

  // Dónde suena la UI: SÓLO clic en accionables (el hover ya no suena, para que
  // el audio "susurre" en vez de saturar).
  var CLICK_SEL = "a, button, [role=button], input[type=submit], summary";

  document.addEventListener("pointerdown", function (e) {
    unlock();
    if (e.target.closest && e.target.closest(CLICK_SEL)) playClick();
  }, { passive: true });

  document.addEventListener("keydown", function (e) {
    unlock();
    if ((e.key === "Enter" || e.key === " ") && document.activeElement &&
        document.activeElement.closest && document.activeElement.closest(CLICK_SEL)) {
      playClick();
    }
  });

  // ---- Botón flotante de silencio ----
  function icon(on) {
    return on
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8.5a5 5 0 0 1 0 7"/><path d="M18.7 6a8 8 0 0 1 0 12"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M22 9l-6 6M16 9l6 6"/></svg>';
  }
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "snd-toggle";
  function sync() {
    btn.innerHTML = icon(!muted);
    btn.setAttribute("aria-label", muted ? "Activar sonido de la interfaz" : "Silenciar sonido de la interfaz");
    btn.setAttribute("aria-pressed", String(muted));
    btn.classList.toggle("is-muted", muted);
  }
  btn.addEventListener("click", function () {
    muted = !muted;
    try { localStorage.setItem(STORAGE, muted ? "1" : "0"); } catch (e) {}
    sync();
    var c = ensureCtx();
    if (c && master) master.gain.setTargetAtTime(muted ? 0 : 1, c.currentTime, 0.08);
    if (!muted) playClick();
  });
  sync();
  if (document.body) document.body.appendChild(btn);
  else document.addEventListener("DOMContentLoaded", function () { document.body.appendChild(btn); });
})();
`;

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
