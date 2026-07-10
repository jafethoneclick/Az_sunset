// Scroll-to-expand media hero — puerto vanilla del componente React
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
