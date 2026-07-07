// Lógica de la página Contact:
// 1. Muestra el aviso de éxito/error según ?quote=success|error
//    (contact.php redirige de vuelta aquí con ese parámetro).
// 2. Validación ligera en el cliente antes de enviar.
(function () {
	var params = new URLSearchParams(window.location.search);
	var status = params.get("quote");
	var form = document.getElementById("quote-form");
	var success = document.getElementById("quote-success");
	var error = document.getElementById("quote-error");

	if (status === "success" && success && form) {
		success.classList.remove("hidden");
		form.classList.add("hidden");
	} else if (status === "error" && error) {
		error.classList.remove("hidden");
	}

	if (form) {
		form.addEventListener("submit", function (event) {
			if (!form.checkValidity()) {
				event.preventDefault();
				form.classList.add("was-validated");
				if (error) error.classList.remove("hidden");
			}
		});
	}
})();
