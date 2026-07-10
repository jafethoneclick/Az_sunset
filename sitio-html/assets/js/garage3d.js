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

  // --- Luces: fill suave + sol calido (atardecer) + rim naranja de marca ---
  scene.add(new THREE.HemisphereLight(0xfff1e0, 0x140f0a, 0.85));
  var sun = new THREE.DirectionalLight(0xffd9a0, 1.6);
  sun.position.set(7, 11, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 60;
  sun.shadow.camera.left = -14;
  sun.shadow.camera.right = 14;
  sun.shadow.camera.top = 14;
  sun.shadow.camera.bottom = -14;
  sun.shadow.bias = -0.0004;
  scene.add(sun);
  var rim = new THREE.DirectionalLight(0xf26a21, 0.6);
  rim.position.set(-7, 4, -6);
  scene.add(rim);

  function mat(color, metal, rough) {
    return new THREE.MeshStandardMaterial({ color: color, metalness: metal, roughness: rough });
  }
  var steel = mat(0x4f7189, 0.55, 0.5);
  var steelDark = mat(0x334654, 0.6, 0.5);
  var roofMat = mat(0x2a2d31, 0.45, 0.55);
  var doorMat = mat(0xc2c8cd, 0.7, 0.35);
  var trimMat = mat(0xf26a21, 0.25, 0.5);
  var slabMat = mat(0x3c3c3c, 0.0, 0.95);
  var glassMat = mat(0x0b1a26, 0.2, 0.1);

  var W = 6, D = 8, H = 3.3, roofH = 1.5;
  var garage = new THREE.Group();

  // Losa de concreto
  var slab = new THREE.Mesh(new THREE.BoxGeometry(W + 1.6, 0.25, D + 1.6), slabMat);
  slab.position.y = -0.125;
  slab.receiveShadow = true;
  garage.add(slab);

  // Cuerpo (paredes) + zocalo mas oscuro
  var body = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), steel);
  body.position.y = H / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  garage.add(body);
  var skirt = new THREE.Mesh(new THREE.BoxGeometry(W + 0.04, 0.5, D + 0.04), steelDark);
  skirt.position.y = 0.25;
  skirt.castShadow = true;
  garage.add(skirt);

  // Techo a dos aguas
  var slant = Math.hypot(W / 2, roofH);
  var ang = Math.atan2(roofH, W / 2);
  var roofGeo = new THREE.BoxGeometry(slant + 0.25, 0.14, D + 0.7);
  var roofL = new THREE.Mesh(roofGeo, roofMat);
  roofL.position.set(-W / 4, H + roofH / 2, 0);
  roofL.rotation.z = ang;
  roofL.castShadow = true;
  garage.add(roofL);
  var roofR = new THREE.Mesh(roofGeo, roofMat);
  roofR.position.set(W / 4, H + roofH / 2, 0);
  roofR.rotation.z = -ang;
  roofR.castShadow = true;
  garage.add(roofR);

  // Frontones (triangulos) frente y fondo
  var tri = new THREE.Shape();
  tri.moveTo(-W / 2, 0);
  tri.lineTo(W / 2, 0);
  tri.lineTo(0, roofH);
  tri.lineTo(-W / 2, 0);
  var triGeo = new THREE.ShapeGeometry(tri);
  var gableF = new THREE.Mesh(triGeo, steel);
  gableF.position.set(0, H, D / 2 + 0.005);
  garage.add(gableF);
  var gableB = new THREE.Mesh(triGeo, steel);
  gableB.position.set(0, H, -D / 2 - 0.005);
  gableB.rotation.y = Math.PI;
  garage.add(gableB);

  // Puerta enrollable (frente) con lineas horizontales
  var dW = 3.2, dH = 2.5, fz = D / 2 + 0.02;
  var door = new THREE.Mesh(new THREE.BoxGeometry(dW, dH, 0.12), doorMat);
  door.position.set(0, dH / 2 + 0.15, fz + 0.05);
  garage.add(door);
  var seg = 8;
  for (var i = 1; i < seg; i++) {
    var ln = new THREE.Mesh(new THREE.BoxGeometry(dW, 0.035, 0.14), steelDark);
    ln.position.set(0, 0.15 + (i * dH) / seg, fz + 0.11);
    garage.add(ln);
  }
  // Marco naranja de la puerta
  var fT = 0.14;
  function frameBar(w, h, x, y) {
    var b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.16), trimMat);
    b.position.set(x, y, fz + 0.08);
    garage.add(b);
  }
  frameBar(dW + fT * 2, fT, 0, 0.15 + dH + fT / 2);
  frameBar(fT, dH + fT, -(dW / 2 + fT / 2), 0.15 + dH / 2);
  frameBar(fT, dH + fT, dW / 2 + fT / 2, 0.15 + dH / 2);

  // Puerta peatonal + ventana en el lateral derecho (x = +W/2)
  var sx = W / 2 + 0.02;
  var pDoor = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.0, 0.9), doorMat);
  pDoor.position.set(sx + 0.04, 1.0, D / 2 - 1.7);
  garage.add(pDoor);
  var win = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.8, 1.0), glassMat);
  win.position.set(sx + 0.04, 2.1, -1.6);
  garage.add(win);

  // Trim naranja en los aleros (frente y fondo)
  var eaveGeo = new THREE.BoxGeometry(W + 0.3, 0.12, 0.12);
  [D / 2 + 0.2, -D / 2 - 0.2].forEach(function (z) {
    var e = new THREE.Mesh(eaveGeo, trimMat);
    e.position.set(0, H + 0.02, z);
    garage.add(e);
  });

  garage.position.y = 0.12;
  scene.add(garage);

  // Sombra de contacto sobre suelo transparente
  var ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.33 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.26;
  ground.receiveShadow = true;
  scene.add(ground);

  // --- Orbit propio (arrastrar = rotar, rueda = zoom) ---
  var target = new THREE.Vector3(0, H * 0.5, 0);
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
