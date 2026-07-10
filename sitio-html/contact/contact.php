<?php
/**
 * Manejador del formulario de cotización (versión estática, sin WordPress).
 * Requiere un servidor con PHP (por ejemplo XAMPP). Cada envío:
 *   1. Se guarda como una fila en leads.csv (junto a este archivo),
 *      para que ningún lead se pierda aunque el correo falle.
 *   2. Se intenta enviar por correo con mail() — en XAMPP local no hay
 *      servidor de correo, así que ese paso fallará silenciosamente.
 * Al terminar redirige a contact.html?quote=success|error.
 */

$to            = 'quotes@azsunsetsteel.com';
$business_name = 'AZ Sunset Steel Structures & Carports';

function redirect_with($status) {
	header('Location: contact.html?quote=' . $status);
	exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	redirect_with('error');
}

// Honeypot: los visitantes reales nunca llenan este campo oculto.
if (!empty($_POST['website'])) {
	redirect_with('success');
}

$name          = trim($_POST['name'] ?? '');
$phone         = trim($_POST['phone'] ?? '');
$email         = trim($_POST['email'] ?? '');
$zip           = trim($_POST['zip'] ?? '');
$building_type = trim($_POST['building_type'] ?? '');
$message       = trim($_POST['message'] ?? '');

if ($name === '' || $phone === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $zip === '' || $building_type === '') {
	redirect_with('error');
}

// 1. Guardar el lead en leads.csv (protegido por el .htaccess de esta carpeta).
$csv = fopen(__DIR__ . '/leads.csv', 'a');
if ($csv) {
	fputcsv($csv, array(date('Y-m-d H:i:s'), $name, $phone, $email, $zip, $building_type, $message));
	fclose($csv);
}

// 2. Intentar enviar el correo de aviso.
$subject = '[' . $business_name . '] New quote request from ' . $name;
$body    = "New quote request:\n\n"
	. 'Name: ' . $name . "\n"
	. 'Phone: ' . $phone . "\n"
	. 'Email: ' . $email . "\n"
	. 'ZIP/State: ' . $zip . "\n"
	. 'Building type: ' . $building_type . "\n"
	. 'Message: ' . $message . "\n";
$headers = 'Reply-To: ' . $name . ' <' . $email . '>';

@mail($to, $subject, $body, $headers);

redirect_with('success');
