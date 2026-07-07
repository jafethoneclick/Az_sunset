/**
 * Homepage motion design: scroll-triggered reveals, animated stat counters,
 * a subtle hero parallax, and smooth scrolling (Lenis + GSAP ScrollTrigger).
 *
 * Deliberately restrained — no custom cursor, no 3D/WebGL set pieces here.
 * The brief asked for a toned-down "premium but professional" feel, so
 * this sticks to elegant reveals, gentle parallax and a polished scroll
 * feel rather than agency-showcase-style flourishes.
 *
 * Loaded only on the homepage for now (see functions.php) while the rest
 * of the site's sections are migrated to the same `[data-reveal]` /
 * `.js-reveal-card` conventions used here, incrementally.
 */
(function () {
	"use strict";

	var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	if (reduceMotion || !window.gsap) return;

	var gsap = window.gsap;
	gsap.registerPlugin(window.ScrollTrigger);

	// ---- Smooth scroll (Lenis), synced to GSAP's ticker/ScrollTrigger ----
	if (window.Lenis) {
		var lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
		lenis.on("scroll", window.ScrollTrigger.update);
		gsap.ticker.add(function (time) {
			lenis.raf(time * 1000);
		});
		gsap.ticker.lagSmoothing(0);
	}

	// ---- Hero entrance timeline ----
	function initHero() {
		var hero = document.querySelector("[data-hero]");
		if (!hero) return;

		var eyebrow = hero.querySelector("[data-hero-eyebrow]");
		var heading = hero.querySelector("[data-hero-heading]");
		var subtitle = hero.querySelector("[data-hero-subtitle]");
		var actions = hero.querySelector("[data-hero-actions]");
		var actionItems = actions ? Array.prototype.slice.call(actions.children) : [];
		var trust = hero.querySelector("[data-hero-trust]");
		var trustItems = trust ? Array.prototype.slice.call(trust.children) : [];
		var indicator = hero.querySelector("[data-scroll-indicator]");

		// Explicit set-then-animate (rather than chained .from() calls with
		// negative timeline overlaps) — more predictable with staggered
		// collections than GSAP's .from() "read current, flip, animate back"
		// approach, which was observed to leave the CTA buttons stuck at
		// their hidden state in this exact eyebrow/heading/subtitle/actions
		// overlap sequence.
		var allTargets = [eyebrow, heading, subtitle, indicator].filter(Boolean).concat(actionItems, trustItems);
		gsap.set(allTargets, { opacity: 0, y: 20 });

		var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

		if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.6 });
		if (heading) tl.to(heading, { opacity: 1, y: 0, duration: 0.8 }, "-=0.35");
		if (subtitle) tl.to(subtitle, { opacity: 1, y: 0, duration: 0.7 }, "-=0.45");
		if (actionItems.length) tl.to(actionItems, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, "-=0.4");
		if (trustItems.length) tl.to(trustItems, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, "-=0.3");
		if (indicator) tl.to(indicator, { opacity: 1, y: 0, duration: 0.6 }, "-=0.2");

		// Subtle mouse parallax on the hero content — kept small (max ~10px)
		// so it reads as depth, not a gimmick.
		var content = hero.querySelector("[data-hero-parallax]");
		if (content && window.matchMedia("(pointer: fine)").matches) {
			hero.addEventListener("mousemove", function (e) {
				var rect = hero.getBoundingClientRect();
				var relX = (e.clientX - rect.left) / rect.width - 0.5;
				var relY = (e.clientY - rect.top) / rect.height - 0.5;
				gsap.to(content, {
					x: relX * 12,
					y: relY * 10,
					duration: 0.6,
					ease: "power2.out",
				});
			});
			hero.addEventListener("mouseleave", function () {
				gsap.to(content, { x: 0, y: 0, duration: 0.8, ease: "power3.out" });
			});
		}

		// Scroll indicator: gentle bounce, fades once the user scrolls away.
		if (indicator) {
			gsap.to(indicator, {
				y: 8,
				duration: 1.1,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
			});
			window.ScrollTrigger.create({
				trigger: hero,
				start: "top top",
				end: "bottom top",
				onUpdate: function (self) {
					gsap.to(indicator, { opacity: 1 - self.progress * 2.5, duration: 0.2, overwrite: true });
				},
			});
		}
	}

	// ---- Animated stat counters ----
	// The server-rendered number stays in the markup as the real value (so
	// it's correct with no-JS, reduced-motion, or if this script fails to
	// load). Only once the element actually scrolls into view do we reset
	// it to 0 and count back up to that same value.
	function initCounters() {
		var counters = document.querySelectorAll("[data-counter]");
		counters.forEach(function (el) {
			var target = parseFloat(el.getAttribute("data-counter"));
			if (isNaN(target)) return;
			var suffix = el.getAttribute("data-suffix") || "";
			var proxy = { value: 0 };

			window.ScrollTrigger.create({
				trigger: el,
				start: "top 88%",
				once: true,
				onEnter: function () {
					el.textContent = "0" + suffix;
					gsap.to(proxy, {
						value: target,
						duration: 1.6,
						ease: "power2.out",
						onUpdate: function () {
							el.textContent = Math.round(proxy.value).toLocaleString("en-US") + suffix;
						},
					});
				},
			});
		});
	}

	// ---- Generic scroll reveals for card grids ----
	// Same set-then-.to() pattern as the hero (see initHero's comment):
	// .from() inside batch/trigger callbacks was observed leaving elements
	// frozen mid-stagger at partial opacity, so the hidden state is applied
	// once up front and onEnter only ever animates *to* fully visible.
	function initCardReveals() {
		var groups = {};
		document.querySelectorAll(".js-reveal-card").forEach(function (card) {
			var group = card.getAttribute("data-reveal-group") || "default";
			(groups[group] = groups[group] || []).push(card);
		});

		Object.keys(groups).forEach(function (key) {
			gsap.set(groups[key], { opacity: 0, y: 28 });
			window.ScrollTrigger.batch(groups[key], {
				start: "top 85%",
				once: true,
				onEnter: function (batch) {
					gsap.to(batch, {
						opacity: 1,
						y: 0,
						duration: 0.7,
						stagger: 0.12,
						ease: "power3.out",
						overwrite: true,
					});
				},
			});
		});
	}

	// ---- Generic single-element reveals (section headings, etc.) ----
	function initSimpleReveals() {
		document.querySelectorAll("[data-reveal]").forEach(function (el) {
			gsap.set(el, { opacity: 0, y: 24 });
			window.ScrollTrigger.create({
				trigger: el,
				start: "top 88%",
				once: true,
				onEnter: function () {
					gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", overwrite: true });
				},
			});
		});
	}

	function init() {
		initHero();
		initCounters();
		initCardReveals();
		initSimpleReveals();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();
