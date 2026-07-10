// Lógica de la página Contact — versión FRONT-END ONLY.
// El formulario muestra su estado de éxito directamente en el navegador,
// sin depender de un backend. Cuando conectes un servicio real de
// formularios (Formspree, Web3Forms, tu propio endpoint…), enviá los datos
// en el punto marcado con TODO más abajo y luego llamá a showSuccess().
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

			// TODO (entrega del lead): acá va el envío real. Ejemplo con
			// Formspree / Web3Forms (reemplazá la URL por la tuya):
			//   fetch("https://formspree.io/f/XXXXXXXX", {
			//     method: "POST",
			//     headers: { Accept: "application/json" },
			//     body: new FormData(form)
			//   }).then(showSuccess).catch(function () {
			//     if (error) error.classList.remove("hidden");
			//   });
			// Mientras no haya endpoint, mostramos el éxito directamente:
			showSuccess();
		});
	}
})();
