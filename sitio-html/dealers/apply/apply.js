// Lógica de la página Dealer Application — versión FRONT-END ONLY.
// Igual que contact.js: el éxito se muestra en el cliente y el envío real
// del lead va en el punto marcado con TODO (conectar Formspree/endpoint).
(function () {
	var params = new URLSearchParams(window.location.search);
	var status = params.get("apply");
	var form = document.getElementById("apply-form");
	var success = document.getElementById("apply-success");
	var error = document.getElementById("apply-error");

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

	if (status === "success") {
		showSuccess();
	} else if (status === "error" && error) {
		error.classList.remove("hidden");
	}

	if (form) {
		form.addEventListener("submit", function (event) {
			event.preventDefault();

			var honeypot = form.querySelector("#website");
			if (honeypot && honeypot.value) { showSuccess(); return; }

			if (!form.checkValidity()) {
				form.classList.add("was-validated");
				if (error) error.classList.remove("hidden");
				var firstInvalid = form.querySelector(":invalid");
				if (firstInvalid) firstInvalid.focus();
				return;
			}

			// TODO (entrega del lead): enviar a un endpoint real aquí, luego
			// llamar a showSuccess() (ver ejemplo en contact/contact.js).
			showSuccess();
		});
	}
})();
