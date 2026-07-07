<?php
/**
 * Login del Dealer Portal — PLANTILLA SIN BACKEND REAL.
 * Todavía no existe un sistema de cuentas de dealers, así que todo
 * intento de login responde 'credenciales inválidas'. Cuando exista el
 * backend real, aquí va la verificación (password_verify contra la base
 * de datos, sesión, redirección al panel, etc.).
 */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	header('Location: portal.html');
	exit;
}

header('Location: portal.html?login=error');
exit;
