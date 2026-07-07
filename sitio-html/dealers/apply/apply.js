// Lógica de la página Dealer Application:
// muestra éxito/error según ?apply=success|error (apply.php redirige aquí)
// y valida en el cliente antes de enviar.
(function () {
	var params = new URLSearchParams(window.location.search);
	var status = params.get("apply");
	var form = document.getElementById("apply-form");
	var success = document.getElementById("apply-success");
	var error = document.getElementById("apply-error");

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
