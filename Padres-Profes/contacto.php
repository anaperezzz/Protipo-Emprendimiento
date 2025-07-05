<?php
include 'conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $nombre = $_POST["nombre"];
  $correo = $_POST["correo"];
  $mensaje = $_POST["mensaje"];

  if (!empty($nombre) && !empty($correo)) {
    $sql = "INSERT INTO contacto (nombre, correo, mensaje) VALUES (:nombre, :correo, :mensaje)";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':correo', $correo);
    $stmt->bindParam(':mensaje', $mensaje);

    if ($stmt->execute()) {
      echo "Mensaje enviado exitosamente.";
    } else {
      echo "Error al enviar el mensaje.";
    }
  } else {
    echo "Por favor completa todos los campos requeridos.";
  }
}
?>
