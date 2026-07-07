/**
 * Animated WebGL shader background for the homepage hero.
 *
 * Ported from a React component to plain JS/Canvas — the original only
 * used React for lifecycle (mount/unmount) and props, the actual
 * rendering is vanilla WebGL2, so no framework is needed here. Falls back
 * silently to the static hero image (already in the markup, this canvas
 * just paints over it) if WebGL2 isn't available, and is skipped entirely
 * for users who prefer reduced motion.
 */
(function () {
	"use strict";

	var CANVAS_ID = "ironclad-hero-shader";

	var vertexSrc =
		"#version 300 es\nprecision highp float;\nin vec4 position;\nvoid main(){gl_Position=position;}";

	var fragmentSrc =
		"#version 300 es\n" +
		"precision highp float;\n" +
		"out vec4 O;\n" +
		"uniform vec2 resolution;\n" +
		"uniform float time;\n" +
		"#define FC gl_FragCoord.xy\n" +
		"#define T time\n" +
		"#define R resolution\n" +
		"#define MN min(R.x,R.y)\n" +
		"float rnd(vec2 p) {\n" +
		"  p=fract(p*vec2(12.9898,78.233));\n" +
		"  p+=dot(p,p+34.56);\n" +
		"  return fract(p.x*p.y);\n" +
		"}\n" +
		"float noise(in vec2 p) {\n" +
		"  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);\n" +
		"  float a=rnd(i), b=rnd(i+vec2(1,0)), c=rnd(i+vec2(0,1)), d=rnd(i+1.);\n" +
		"  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);\n" +
		"}\n" +
		"float fbm(vec2 p) {\n" +
		"  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);\n" +
		"  for (int i=0; i<5; i++) {\n" +
		"    t+=a*noise(p);\n" +
		"    p*=2.*m;\n" +
		"    a*=.5;\n" +
		"  }\n" +
		"  return t;\n" +
		"}\n" +
		"float clouds(vec2 p) {\n" +
		"	float d=1., t=.0;\n" +
		"	for (float i=.0; i<3.; i++) {\n" +
		"		float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);\n" +
		"		t=mix(t,d,a);\n" +
		"		d=a;\n" +
		"		p*=2./(i+1.);\n" +
		"	}\n" +
		"	return t;\n" +
		"}\n" +
		"void main(void) {\n" +
		"	vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);\n" +
		"	vec3 col=vec3(0);\n" +
		"	float bg=clouds(vec2(st.x+T*.5,-st.y));\n" +
		"	uv*=1.-.3*(sin(T*.2)*.5+.5);\n" +
		"	for (float i=1.; i<12.; i++) {\n" +
		"		uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);\n" +
		"		vec2 p=uv;\n" +
		"		float d=length(p);\n" +
		"		col+=.00125/d*(cos(sin(i)*vec3(1,2,3))+1.);\n" +
		"		float b=noise(i+p+bg*1.731);\n" +
		"		col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));\n" +
		"		col=mix(col,vec3(bg*.25,bg*.137,bg*.05),d);\n" +
		"	}\n" +
		"	O=vec4(col,1);\n" +
		"}";

	var vertices = [-1, 1, -1, -1, 1, 1, 1, -1];

	function WebGLRenderer(canvas, scale) {
		this.canvas = canvas;
		this.scale = scale;
		this.gl = canvas.getContext("webgl2");
		this.program = null;
		this.vs = null;
		this.fs = null;
		this.buffer = null;
		this.mouseMove = [0, 0];
		this.mouseCoords = [0, 0];
		this.pointerCoords = [0, 0];
		this.nbrOfPointers = 0;

		if (this.gl) {
			this.gl.viewport(0, 0, canvas.width * scale, canvas.height * scale);
		}
	}

	WebGLRenderer.prototype.isSupported = function () {
		return !!this.gl;
	};

	WebGLRenderer.prototype.updateScale = function (scale) {
		this.scale = scale;
		this.gl.viewport(0, 0, this.canvas.width * scale, this.canvas.height * scale);
	};

	WebGLRenderer.prototype.compile = function (shader, source) {
		var gl = this.gl;
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
		}
	};

	WebGLRenderer.prototype.setup = function () {
		var gl = this.gl;
		this.vs = gl.createShader(gl.VERTEX_SHADER);
		this.fs = gl.createShader(gl.FRAGMENT_SHADER);
		this.compile(this.vs, vertexSrc);
		this.compile(this.fs, fragmentSrc);
		this.program = gl.createProgram();
		gl.attachShader(this.program, this.vs);
		gl.attachShader(this.program, this.fs);
		gl.linkProgram(this.program);
		if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
			console.error(gl.getProgramInfoLog(this.program));
		}
	};

	WebGLRenderer.prototype.init = function () {
		var gl = this.gl;
		var program = this.program;

		this.buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		var position = gl.getAttribLocation(program, "position");
		gl.enableVertexAttribArray(position);
		gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

		program.resolution = gl.getUniformLocation(program, "resolution");
		program.time = gl.getUniformLocation(program, "time");
		program.move = gl.getUniformLocation(program, "move");
		program.touch = gl.getUniformLocation(program, "touch");
		program.pointerCount = gl.getUniformLocation(program, "pointerCount");
		program.pointers = gl.getUniformLocation(program, "pointers");
	};

	WebGLRenderer.prototype.render = function (now) {
		var gl = this.gl;
		var program = this.program;
		if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) return;

		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.useProgram(program);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

		gl.uniform2f(program.resolution, this.canvas.width, this.canvas.height);
		gl.uniform1f(program.time, now * 1e-3);
		gl.uniform2f.apply(gl, [program.move].concat(this.mouseMove));
		gl.uniform2f.apply(gl, [program.touch].concat(this.mouseCoords));
		gl.uniform1i(program.pointerCount, this.nbrOfPointers);
		gl.uniform2fv(program.pointers, this.pointerCoords);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	};

	WebGLRenderer.prototype.reset = function () {
		var gl = this.gl;
		if (this.program && !gl.getProgramParameter(this.program, gl.DELETE_STATUS)) {
			if (this.vs) {
				gl.detachShader(this.program, this.vs);
				gl.deleteShader(this.vs);
			}
			if (this.fs) {
				gl.detachShader(this.program, this.fs);
				gl.deleteShader(this.fs);
			}
			gl.deleteProgram(this.program);
		}
	};

	function PointerHandler(element, scale) {
		this.scale = scale;
		this.active = false;
		this.pointers = new Map();
		this.lastCoords = [0, 0];
		this.moves = [0, 0];

		var self = this;
		function map(x, y) {
			return [x * self.scale, element.height - y * self.scale];
		}

		element.addEventListener("pointerdown", function (e) {
			self.active = true;
			self.pointers.set(e.pointerId, map(e.clientX, e.clientY));
		});

		element.addEventListener("pointerup", function (e) {
			if (self.pointers.size === 1) {
				self.lastCoords = self.first();
			}
			self.pointers.delete(e.pointerId);
			self.active = self.pointers.size > 0;
		});

		element.addEventListener("pointerleave", function (e) {
			if (self.pointers.size === 1) {
				self.lastCoords = self.first();
			}
			self.pointers.delete(e.pointerId);
			self.active = self.pointers.size > 0;
		});

		element.addEventListener("pointermove", function (e) {
			if (!self.active) return;
			self.pointers.set(e.pointerId, map(e.clientX, e.clientY));
			self.moves = [self.moves[0] + e.movementX, self.moves[1] + e.movementY];
		});
	}

	PointerHandler.prototype.first = function () {
		var it = this.pointers.values().next();
		return it.done ? this.lastCoords : it.value;
	};

	PointerHandler.prototype.coords = function () {
		return this.pointers.size > 0 ? Array.prototype.concat.apply([], Array.from(this.pointers.values())) : [0, 0];
	};

	function initHeroShader() {
		var canvas = document.getElementById(CANVAS_ID);
		if (!canvas) return;

		var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (reduceMotion) return;

		var dpr = Math.max(1, 0.5 * (window.devicePixelRatio || 1));
		var renderer = new WebGLRenderer(canvas, dpr);

		if (!renderer.isSupported()) {
			return; // static hero-placeholder image underneath stays visible
		}

		var pointers = new PointerHandler(canvas, dpr);

		function resize() {
			canvas.width = canvas.clientWidth * dpr;
			canvas.height = canvas.clientHeight * dpr;
			renderer.updateScale(dpr);
		}

		renderer.setup();
		renderer.init();
		// Un-hide before measuring: clientWidth/clientHeight are 0 while the
		// canvas is display:none, which would otherwise leave the WebGL
		// drawing buffer permanently sized 0x0 (renders as a solid black box)
		// until an actual window resize event happened to fire.
		canvas.classList.remove("hidden");
		resize();

		var rafId;
		function loop(now) {
			renderer.mouseCoords = pointers.first();
			renderer.nbrOfPointers = pointers.pointers.size;
			renderer.pointerCoords = pointers.coords();
			renderer.mouseMove = pointers.moves;
			renderer.render(now);
			rafId = requestAnimationFrame(loop);
		}
		loop(0);

		window.addEventListener("resize", resize);
		window.addEventListener("pagehide", function () {
			if (rafId) cancelAnimationFrame(rafId);
			renderer.reset();
		});
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initHeroShader);
	} else {
		initHeroShader();
	}
})();
