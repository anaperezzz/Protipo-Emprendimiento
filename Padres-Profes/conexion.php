<?php
$host = "localhost";
$dbname = "click-crea";
$user = "postgres";// <-- cambia esto por tu usuario
$password = "1234s-";// <-- cambia esto por la contraseña de tu usuario

try {
  $conn = new PDO("pgsql:host=$host;dbname=$dbname", $user, $password);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
 //echo "Conexión exitosa";
} catch(PDOException $e) {
  echo "Error de conexión: " . $e->getMessage();
}
?>
