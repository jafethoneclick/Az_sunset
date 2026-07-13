/**
 * Brasas flotantes de fondo (solo portada). Partículas cálidas (chispas de
 * acero al atardecer) que suben lento y titilan. Se pintan en un canvas fijo a
 * pantalla completa con mix-blend-mode: screen, de modo que sólo se ven sobre
 * las zonas oscuras y desaparecen sobre las tarjetas claras (no estorban la
 * lectura). Respeta prefers-reduced-motion y se pausa con la pestaña oculta.
 */
(function () {
  "use strict";
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;mix-blend-mode:screen;";
  document.body.appendChild(canvas);
  var ctx = canvas.getContext("2d");

  var W = 0, H = 0;
  function resize() {
    W = canvas.width = Math.floor(window.innerWidth * DPR);
    H = canvas.height = Math.floor(window.innerHeight * DPR);
  }
  resize();
  window.addEventListener("resize", resize);

  // Sprite de la brasa (radial cálido) pre-renderizado → dibujar es barato.
  var spr = document.createElement("canvas");
  spr.width = spr.height = 64;
  var sc = spr.getContext("2d");
  var sg = sc.createRadialGradient(32, 32, 0, 32, 32, 32);
  sg.addColorStop(0, "rgba(255,200,130,1)");
  sg.addColorStop(0.35, "rgba(242,140,60,0.55)");
  sg.addColorStop(1, "rgba(242,106,33,0)");
  sc.fillStyle = sg;
  sc.fillRect(0, 0, 64, 64);

  // Densidad según el ancho de pantalla (menos en móvil).
  var N = Math.max(24, Math.min(70, Math.floor(window.innerWidth / 22)));
  var parts = [];
  function spawn(fromBottom) {
    return {
      x: Math.random() * W,
      y: fromBottom ? H + Math.random() * 40 : Math.random() * H,
      r: (Math.random() * 1.6 + 0.7) * DPR,
      vy: -(Math.random() * 0.35 + 0.12) * DPR,
      vx: (Math.random() - 0.5) * 0.18 * DPR,
      tw: Math.random() * Math.PI * 2,
      sp: Math.random() * 0.03 + 0.006,
    };
  }
  for (var i = 0; i < N; i++) parts.push(spawn(false));

  var visible = true;
  document.addEventListener("visibilitychange", function () {
    visible = !document.hidden;
  });

  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      p.y += p.vy;
      p.x += p.vx;
      p.tw += p.sp;
      if (p.y < -20) {
        parts[i] = spawn(true);
        continue;
      }
      var a = 0.3 + 0.35 * Math.sin(p.tw); // parpadeo
      if (a <= 0.02) continue;
      var s = p.r * 5;
      ctx.globalAlpha = a;
      ctx.drawImage(spr, p.x - s, p.y - s, s * 2, s * 2);
    }
    ctx.globalAlpha = 1;
  }
  requestAnimationFrame(frame);
})();
