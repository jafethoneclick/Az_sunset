// Muestra el aviso de error del login según ?login=error
// (portal.php redirige aquí — todavía no hay backend real de cuentas).
(function () {
	var params = new URLSearchParams(window.location.search);
	if (params.get("login") === "error") {
		var error = document.getElementById("login-error");
		if (error) error.classList.remove("hidden");
	}
})();
