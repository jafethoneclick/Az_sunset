/**
 * Visor 3D interactivo de un garaje de acero (solo visualizacion) con Three.js.
 * El usuario arrastra para rotar y usa la rueda para acercar/alejar. Sin
 * OrbitControls (orbit propio, ligero). Respeta prefers-reduced-motion (sin
 * auto-giro) y se pausa cuando la seccion no esta en pantalla. El modelo se
 * construye por codigo (no requiere archivos .glb).
 */
(function () {
  "use strict";
  var mount = document.getElementById("garage3d");
  if (!mount || !window.THREE) return;
  var THREE = window.THREE;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    // Sin soporte WebGL: dejamos el stage con su fondo y ocultamos el hint.
    var h = mount.querySelector(".g3d-hint");
    if (h) h.style.display = "none";
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
  mount.appendChild(renderer.domElement);

  // --- Luces: día soleado (cielo + sol cálido + relleno suave) ---
  scene.add(new THREE.HemisphereLight(0xbfd6ef, 0x3f5c2c, 0.85));
  var sun = new THREE.DirectionalLight(0xfff2df, 1.85);
  sun.position.set(-8, 12, 9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 60;
  sun.shadow.camera.left = -16;
  sun.shadow.camera.right = 16;
  sun.shadow.camera.top = 16;
  sun.shadow.camera.bottom = -16;
  sun.shadow.bias = -0.0004;
  scene.add(sun);
  var fill = new THREE.DirectionalLight(0xdfe8f2, 0.4);
  fill.position.set(9, 5, -7);
  scene.add(fill);

  function mat(color, metal, rough) {
    return new THREE.MeshStandardMaterial({ color: color, metalness: metal, roughness: rough });
  }
  // Paleta tomada de la foto de referencia: paredes tostado, faldón y molduras
  // marrón, techo marrón, puertas blancas, losa de concreto y césped.
  var tan = mat(0xc6a068, 0.35, 0.62);
  var brown = mat(0x6a4327, 0.35, 0.6);
  var roofMat = mat(0x5c3a27, 0.4, 0.55);
  var ridgeMat = mat(0x4d3020, 0.4, 0.55);
  var doorMat = mat(0xf1f0ec, 0.25, 0.5);
  var frameMat = mat(0x5c3a27, 0.3, 0.6);
  var slabMat = mat(0xbdb9b1, 0.0, 0.95);
  var grassMat = mat(0x46672e, 0.0, 1.0);
  var glassMat = mat(0x0e1519, 0.15, 0.2);
  var darkMat = mat(0x090909, 0.0, 1.0);
  var ribMat = mat(0xb8925c, 0.35, 0.62);

  var W = 7.4, D = 8, H = 3.0, roofH = 1.25, wh = 1.05;
  var eave = 0.35;
  var garage = new THREE.Group();

  // Césped
  var grass = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), grassMat);
  grass.rotation.x = -Math.PI / 2;
  grass.position.y = 0;
  grass.receiveShadow = true;
  garage.add(grass);

  // Losa de concreto
  var slabH = 0.18;
  var slab = new THREE.Mesh(new THREE.BoxGeometry(W + 1.4, slabH, D + 1.2), slabMat);
  slab.position.y = slabH / 2;
  slab.receiveShadow = true;
  garage.add(slab);

  var base = slabH; // piso del edificio (cara superior de la losa)

  // Paredes superiores (tostado)
  var body = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), tan);
  body.position.y = base + H / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  garage.add(body);

  // Faldón inferior (wainscot) marrón, apenas saliente
  var skirt = new THREE.Mesh(new THREE.BoxGeometry(W + 0.06, wh, D + 0.06), brown);
  skirt.position.y = base + wh / 2;
  skirt.castShadow = true;
  skirt.receiveShadow = true;
  garage.add(skirt);

  // Techo a dos aguas (marrón) con alero
  var slant = Math.hypot(W / 2 + eave, roofH);
  var ang = Math.atan2(roofH, W / 2 + eave);
  var roofThick = 0.14;
  var roofGeo = new THREE.BoxGeometry(slant, roofThick, D + eave * 2);
  var roofL = new THREE.Mesh(roofGeo, roofMat);
  roofL.position.set(-(W / 2 + eave) / 2, base + H + roofH / 2, 0);
  roofL.rotation.z = ang;
  roofL.castShadow = true;
  roofL.receiveShadow = true;
  garage.add(roofL);
  var roofR = new THREE.Mesh(roofGeo, roofMat);
  roofR.position.set((W / 2 + eave) / 2, base + H + roofH / 2, 0);
  roofR.rotation.z = -ang;
  roofR.castShadow = true;
  roofR.receiveShadow = true;
  garage.add(roofR);
  // Cumbrera
  var ridge = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, D + eave * 2), ridgeMat);
  ridge.position.set(0, base + H + roofH + 0.02, 0);
  ridge.castShadow = true;
  garage.add(ridge);

  // Frontones (triángulos) tostado, frente y fondo
  var tri = new THREE.Shape();
  tri.moveTo(-W / 2, 0);
  tri.lineTo(W / 2, 0);
  tri.lineTo(0, roofH);
  tri.lineTo(-W / 2, 0);
  var triGeo = new THREE.ShapeGeometry(tri);
  var gableF = new THREE.Mesh(triGeo, tan);
  gableF.position.set(0, base + H, D / 2 + 0.004);
  gableF.castShadow = true;
  gableF.receiveShadow = true;
  garage.add(gableF);
  var gableB = new THREE.Mesh(triGeo, tan);
  gableB.position.set(0, base + H, -D / 2 - 0.004);
  gableB.rotation.y = Math.PI;
  garage.add(gableB);

  // --- Elementos del frente (gable end, z = +D/2) ---
  var fz = D / 2;
  var ft = 0.12;
  function frameBar(w, h, x, y, z) {
    var b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.14), frameMat);
    b.position.set(x, y, z);
    b.castShadow = true;
    garage.add(b);
  }

  // Puerta enrollable blanca (izquierda)
  var rdW = 2.2, rdH = 2.3, rdX = -2.35;
  var door = new THREE.Mesh(new THREE.BoxGeometry(rdW, rdH, 0.1), doorMat);
  door.position.set(rdX, base + rdH / 2 + 0.02, fz + 0.06);
  door.castShadow = true;
  garage.add(door);
  for (var i = 1; i < 9; i++) {
    var ln = new THREE.Mesh(new THREE.BoxGeometry(rdW, 0.03, 0.12), ribMat);
    ln.position.set(rdX, base + 0.02 + (i * rdH) / 9, fz + 0.1);
    garage.add(ln);
  }
  frameBar(rdW + ft * 2, ft, rdX, base + rdH + 0.02 + ft / 2, fz + 0.09);
  frameBar(ft, rdH + ft, rdX - rdW / 2 - ft / 2, base + rdH / 2 + 0.02, fz + 0.09);
  frameBar(ft, rdH + ft, rdX + rdW / 2 + ft / 2, base + rdH / 2 + 0.02, fz + 0.09);

  // Bahía abierta (centro): panel oscuro con marco
  var obW = 2.0, obH = 2.35, obX = 0.15;
  var opening = new THREE.Mesh(new THREE.BoxGeometry(obW, obH, 0.04), darkMat);
  opening.position.set(obX, base + obH / 2, fz + 0.04);
  garage.add(opening);
  frameBar(obW + ft * 2, ft, obX, base + obH + ft / 2, fz + 0.06);
  frameBar(ft, obH + ft, obX - obW / 2 - ft / 2, base + obH / 2, fz + 0.06);
  frameBar(ft, obH + ft, obX + obW / 2 + ft / 2, base + obH / 2, fz + 0.06);

  // Puerta peatonal blanca (derecha)
  var wdW = 0.95, wdH = 2.05, wdX = 2.35;
  var wdoor = new THREE.Mesh(new THREE.BoxGeometry(wdW, wdH, 0.1), doorMat);
  wdoor.position.set(wdX, base + wdH / 2 + 0.02, fz + 0.06);
  wdoor.castShadow = true;
  garage.add(wdoor);
  frameBar(wdW + ft, ft, wdX, base + wdH + 0.02 + ft / 2, fz + 0.08);
  frameBar(ft, wdH + ft, wdX - wdW / 2 - ft / 2, base + wdH / 2 + 0.02, fz + 0.08);
  frameBar(ft, wdH + ft, wdX + wdW / 2 + ft / 2, base + wdH / 2 + 0.02, fz + 0.08);
  var knob = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), frameMat);
  knob.position.set(wdX + wdW / 2 - 0.18, base + 1.05, fz + 0.12);
  garage.add(knob);

  // Ventana (derecha, arriba) con marco blanco
  var winW = 0.8, winH = 0.8, winX = 3.15, winY = base + 2.05;
  var win = new THREE.Mesh(new THREE.BoxGeometry(winW, winH, 0.06), glassMat);
  win.position.set(winX, winY, fz + 0.05);
  garage.add(win);
  function winFrame(w, h, x, y) {
    var b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.12), doorMat);
    b.position.set(x, y, fz + 0.06);
    garage.add(b);
  }
  winFrame(winW + ft, ft, winX, winY + winH / 2 + ft / 2);
  winFrame(winW + ft, ft, winX, winY - winH / 2 - ft / 2);
  winFrame(ft, winH, winX - winW / 2 - ft / 2, winY);
  winFrame(ft, winH, winX + winW / 2 + ft / 2, winY);

  // Molduras de esquina (marrón) — 4 verticales salientes
  var cornerGeo = new THREE.BoxGeometry(0.16, H, 0.16);
  [[-W / 2, D / 2], [W / 2, D / 2], [-W / 2, -D / 2], [W / 2, -D / 2]].forEach(function (c) {
    var cc = new THREE.Mesh(cornerGeo, brown);
    cc.position.set(c[0], base + H / 2, c[1]);
    cc.castShadow = true;
    garage.add(cc);
  });

  // Fascia del alero (marrón) en los lados largos
  var fasciaGeo = new THREE.BoxGeometry(0.1, 0.22, D + eave * 2);
  [-(W / 2 + eave), W / 2 + eave].forEach(function (x) {
    var fa = new THREE.Mesh(fasciaGeo, brown);
    fa.position.set(x, base + H + 0.02, 0);
    fa.castShadow = true;
    garage.add(fa);
  });

  garage.position.y = 0;
  scene.add(garage);

  // --- Orbit propio (arrastrar = rotar, rueda = zoom) ---
  var target = new THREE.Vector3(0, 1.7, 0);
  var az = 0.7, el = 0.28, dist = 17;
  var minEl = 0.06, maxEl = 1.15, minD = 11, maxD = 26;
  function applyCam() {
    var ce = Math.cos(el), se = Math.sin(el);
    camera.position.set(
      target.x + dist * ce * Math.sin(az),
      target.y + dist * se,
      target.z + dist * ce * Math.cos(az)
    );
    camera.lookAt(target);
  }

  var dragging = false, lx = 0, ly = 0, idleT = 0;
  mount.addEventListener("pointerdown", function (e) {
    dragging = true; lx = e.clientX; ly = e.clientY; idleT = 0;
    if (mount.setPointerCapture) { try { mount.setPointerCapture(e.pointerId); } catch (er) {} }
  });
  mount.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var dx = e.clientX - lx, dy = e.clientY - ly;
    lx = e.clientX; ly = e.clientY;
    az -= dx * 0.006;
    el += dy * 0.006;
    if (el < minEl) el = minEl;
    if (el > maxEl) el = maxEl;
    idleT = 0;
  });
  function endDrag() { dragging = false; }
  mount.addEventListener("pointerup", endDrag);
  mount.addEventListener("pointercancel", endDrag);
  mount.addEventListener("pointerleave", endDrag);
  mount.addEventListener("wheel", function (e) {
    e.preventDefault();
    dist += e.deltaY * 0.012;
    if (dist < minD) dist = minD;
    if (dist > maxD) dist = maxD;
    idleT = 0;
  }, { passive: false });

  // Tamano responsivo
  function resize() {
    var w = mount.clientWidth || 1, h = mount.clientHeight || 1;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);
  if (window.ResizeObserver) new ResizeObserver(resize).observe(mount);

  // Pausa el render cuando la seccion no esta visible
  var visible = true;
  if (window.IntersectionObserver) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0.02 }).observe(mount);
  }

  var last = performance.now();
  function loop(now) {
    requestAnimationFrame(loop);
    if (!visible) { last = now; return; }
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!dragging) {
      idleT += dt;
      if (!reduce && idleT > 1.2) az += dt * 0.25; // auto-giro lento tras 1.2s inactivo
    }
    applyCam();
    renderer.render(scene, camera);
  }
  applyCam();
  requestAnimationFrame(loop);
})();
