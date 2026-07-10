// Sonido de interfaz para AZ Sunset — sintetizado con la Web Audio API (sin
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
