// Header: al hacer scroll, agrega .is-scrolled (pliega la barra de utilidad,
// suma sombra y oscurece un poco el fondo).
(function () {
  var header = document.querySelector(".site-header");
  if (!header) return;
  var onScroll = function () {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

(function () {
  var toggle = document.getElementById("ironclad-mobile-nav-toggle");
  var nav = document.getElementById("ironclad-mobile-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var isOpen = !nav.classList.contains("hidden");
    nav.classList.toggle("hidden");
    toggle.setAttribute("aria-expanded", String(!isOpen));
  });
})();

// Efecto "imán": el botón CTA del header sigue sutilmente al cursor. Sólo con
// puntero fino (mouse) y si el usuario no pidió reducir movimiento.
(function () {
  if (window.matchMedia) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  }
  var strength = 0.3;
  var ctas = document.querySelectorAll("header a.bg-accent");
  Array.prototype.forEach.call(ctas, function (btn) {
    btn.addEventListener("mousemove", function (e) {
      var r = btn.getBoundingClientRect();
      var x = (e.clientX - (r.left + r.width / 2)) * strength;
      var y = (e.clientY - (r.top + r.height / 2)) * strength;
      btn.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
    });
    btn.addEventListener("mouseleave", function () {
      btn.style.transform = "";
    });
  });
})();

// Pie de página: las cuatro columnas entran escalonadas al hacer scroll hasta
// la parte baja de la página. Funciona en todo el sitio (main.js está en todas
// las páginas). Respeta "reducir movimiento": si está activo, se muestran ya.
(function () {
  var cols = document.querySelectorAll("[data-footer-reveal]");
  if (!cols.length) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !window.IntersectionObserver) {
    Array.prototype.forEach.call(cols, function (c) { c.classList.add("is-in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      var i = Number(el.getAttribute("data-i")) || 0;
      setTimeout(function () { el.classList.add("is-in"); }, i * 120);
      io.unobserve(el);
    });
  }, { threshold: 0.15 });
  Array.prototype.forEach.call(cols, function (c, i) {
    c.setAttribute("data-i", i);
    io.observe(c);
  });
})();

// Revelado genérico al hacer scroll para páginas internas (sin GSAP). Todo
// elemento con .reveal-rise se levanta y aparece al entrar en pantalla, con un
// escalonado según su posición entre hermanos .reveal-rise. Respeta "reducir
// movimiento" (se muestran de una).
(function () {
  var els = document.querySelectorAll(".reveal-rise");
  if (!els.length) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !window.IntersectionObserver) {
    Array.prototype.forEach.call(els, function (el) { el.classList.add("is-in"); });
    return;
  }
  // Escalonado: cada elemento recibe un retraso según su índice entre los
  // hermanos .reveal-rise de su mismo contenedor.
  Array.prototype.forEach.call(els, function (el) {
    var parent = el.parentElement;
    if (!parent) return;
    var sibs = parent.querySelectorAll(":scope > .reveal-rise");
    var idx = Array.prototype.indexOf.call(sibs, el);
    if (idx > 0) el.style.transitionDelay = (idx * 80) + "ms";
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add("is-in");
      io.unobserve(en.target);
    });
  }, { threshold: 0.12 });
  Array.prototype.forEach.call(els, function (el) { io.observe(el); });
})();

// Tarjetas de producto (Top Picks / grilla): inclinación 3D sutil + un foco
// de luz naranja que siguen al cursor. El vaivén lateral en reposo lo pone el
// CSS (animación card-sway); aquí sólo agregamos la reacción al puntero.
// Sólo con puntero fino y sin "reducir movimiento".
(function () {
  if (window.matchMedia) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  }
  var cards = document.querySelectorAll(".js-tilt-card");
  Array.prototype.forEach.call(cards, function (card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width; // 0..1
      var py = (e.clientY - r.top) / r.height; // 0..1
      var rx = (0.5 - py) * 4; // grados de inclinación vertical
      var ry = (px - 0.5) * 5.5; // grados de inclinación horizontal (lateral)
      card.classList.add("is-tilting");
      card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
      card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      card.style.transform =
        "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) translateY(-4px)";
    });
    card.addEventListener("pointerleave", function () {
      card.classList.remove("is-tilting");
      card.style.transform = "";
    });
  });
})();
