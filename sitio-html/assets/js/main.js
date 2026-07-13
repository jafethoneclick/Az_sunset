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

// Parallax de scroll del hero de la portada: la imagen (.home-hero-bg) se
// desplaza más lento que el contenido al bajar → sensación de profundidad.
// Sólo en la portada (existe [data-hero-bg]) y si no se pidió reducir movimiento.
(function () {
  var bg = document.querySelector("[data-hero-bg]");
  if (!bg) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var ticking = false;
  function update() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset || 0;
    var cap = window.innerHeight * 0.1; // tope: no revela bordes (inset -12%)
    var t = Math.min(y * 0.2, cap);
    bg.style.transform = "translate3d(0," + t.toFixed(1) + "px,0)";
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
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

// Parallax 3D con profundidad (2.5D). En una escena [data-parallax3d] la capa
// de imagen (.ph-bg-layer) y la de texto (.ph-fg-layer) se desplazan a
// distinta velocidad siguiendo el cursor, y la imagen se inclina levemente en
// 3D. La diferencia de movimiento entre capas produce la sensación de
// profundidad. Sólo con puntero fino y sin "reducir movimiento".
(function () {
  if (window.matchMedia) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  }
  var scenes = document.querySelectorAll("[data-parallax3d]");
  Array.prototype.forEach.call(scenes, function (scene) {
    var bg = scene.querySelector(".ph-bg-layer");
    var fg = scene.querySelector(".ph-fg-layer");
    var glow = scene.querySelector(".product-hero-glow");
    scene.addEventListener("pointermove", function (e) {
      var r = scene.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width - 0.5;  // -0.5..0.5
      var ny = (e.clientY - r.top) / r.height - 0.5;
      if (bg) {
        // Capa lejana: se inclina en 3D y se desplaza en sentido contrario.
        bg.style.transform =
          "perspective(1100px) rotateY(" + (nx * 6).toFixed(2) + "deg) rotateX(" +
          (-ny * 4.5).toFixed(2) + "deg) scale(1.14) translate(" +
          (nx * -38).toFixed(1) + "px," + (ny * -26).toFixed(1) + "px)";
      }
      // Capa cercana (texto): se mueve más y a favor del cursor → parallax.
      if (fg) fg.style.transform = "translate(" + (nx * 26).toFixed(1) + "px," + (ny * 19).toFixed(1) + "px)";
      // Brillo de marca sigue al cursor para el toque "glossy".
      if (glow) glow.style.transform = "translate(" + (nx * 60).toFixed(1) + "px," + (ny * 44).toFixed(1) + "px)";
    });
    scene.addEventListener("pointerleave", function () {
      if (bg) bg.style.transform = "scale(1.08)";
      if (fg) fg.style.transform = "";
      if (glow) glow.style.transform = "";  // restaura la animación heroGlowDrift
    });
  });
})();

// Parallax de profundidad en la imagen del hero de inicio: la foto se desliza
// dentro de su marco recortado (.sxm-media) siguiendo el cursor. El scroll-
// expand controla el tamaño del marco y los títulos, no la imagen, así que no
// hay conflicto. Sólo con puntero fino y sin "reducir movimiento".
(function () {
  if (window.matchMedia) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  }
  var stage = document.querySelector(".sxm-stage");
  var img = stage && stage.querySelector(".sxm-scene");
  if (!img) return;
  stage.addEventListener("pointermove", function (e) {
    var r = stage.getBoundingClientRect();
    var nx = (e.clientX - r.left) / r.width - 0.5;
    var ny = (e.clientY - r.top) / r.height - 0.5;
    img.style.transform =
      "scale(1.12) translate(" + (nx * -30).toFixed(1) + "px," + (ny * -22).toFixed(1) + "px)";
  });
  stage.addEventListener("pointerleave", function () {
    img.style.transform = "";
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
    var img = card.querySelector("img");
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width; // 0..1
      var py = (e.clientY - r.top) / r.height; // 0..1
      var rx = (0.5 - py) * 6; // grados de inclinación vertical
      var ry = (px - 0.5) * 8; // grados de inclinación horizontal (lateral)
      card.classList.add("is-tilting");
      card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
      card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      card.style.transform =
        "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) translateY(-6px)";
      // Parallax de profundidad: la foto se desliza dentro de su marco
      // (overflow oculto) en sentido contrario al cursor → sensación 3D.
      if (img) {
        img.style.transform =
          "scale(1.12) translate(" + ((0.5 - px) * 16).toFixed(1) + "px," + ((0.5 - py) * 16).toFixed(1) + "px)";
      }
    });
    card.addEventListener("pointerleave", function () {
      card.classList.remove("is-tilting");
      card.style.transform = "";
      if (img) img.style.transform = "";
    });
  });
})();
