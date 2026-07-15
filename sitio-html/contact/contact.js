// Lógica de la página Contact. El envío se hace con FormSubmit
// (https://formsubmit.co) — un servicio gratuito de correo para sitios
// estáticos. El lead se manda por AJAX al correo configurado en site.leadEmail.
// IMPORTANTE: la primera vez hay que activar el correo haciendo clic en el
// enlace que FormSubmit envía al buzón de destino.
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

			// Envío real vía FormSubmit (AJAX). Mostramos estado "enviando"
			// y, si algo falla, reactivamos el botón y avisamos.
			var btn = form.querySelector("button[type=submit]");
			var btnLabel = btn ? btn.textContent : "";
			if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
			if (error) error.classList.add("hidden");

			fetch("https://formsubmit.co/ajax/jafethjimenezsanchez@gmail.com", {
				method: "POST",
				headers: { Accept: "application/json" },
				body: new FormData(form)
			})
				.then(function (r) { if (!r.ok) { throw new Error("HTTP " + r.status); } return r.json(); })
				.then(function () { showSuccess(); })
				.catch(function () {
					if (btn) { btn.disabled = false; btn.textContent = btnLabel; }
					if (error) error.classList.remove("hidden");
				});
		});
	}
})();
