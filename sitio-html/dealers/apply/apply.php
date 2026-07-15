<?php
/**
 * Manejador del formulario de solicitud de dealers.
 * Igual que contact/contact.php: guarda cada solicitud en
 * dealer-leads.csv (protegido por el .htaccess de esta carpeta),
 * intenta avisar por correo y redirige a apply.html?apply=success|error.
 */

$to            = 'Azsunsetsteelstructures@gmail.com';
$business_name = 'AZ Sunset Steel Structures & Carports';

function redirect_with($status) {
	header('Location: apply.html?apply=' . $status);
	exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	redirect_with('error');
}

if (!empty($_POST['website'])) {
	redirect_with('success');
}

$name    = trim($_POST['name'] ?? '');
$company = trim($_POST['company'] ?? '');
$email   = trim($_POST['email'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$state   = trim($_POST['state'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $company === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $phone === '' || $state === '') {
	redirect_with('error');
}

$csv = fopen(__DIR__ . '/dealer-leads.csv', 'a');
if ($csv) {
	fputcsv($csv, array(date('Y-m-d H:i:s'), $name, $company, $email, $phone, $state, $message));
	fclose($csv);
}

$subject = '[' . $business_name . '] New dealer application from ' . $company;
$body    = "New dealer application:\n\n"
	. 'Name: ' . $name . "\n"
	. 'Company: ' . $company . "\n"
	. 'Email: ' . $email . "\n"
	. 'Phone: ' . $phone . "\n"
	. 'State: ' . $state . "\n"
	. 'Message: ' . $message . "\n";
$headers = 'Reply-To: ' . $name . ' <' . $email . '>';

@mail($to, $subject, $body, $headers);

redirect_with('success');
