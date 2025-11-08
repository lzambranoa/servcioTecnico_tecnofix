<?php
include 'conexion.php';

if (
  isset($_POST['documento']) &&
  isset($_POST['nombre']) &&
  isset($_POST['telefono']) &&
  isset($_POST['direccion'])
) {
  $documento = $_POST['documento'];
  $nombre = $_POST['nombre'];
  $telefono = $_POST['telefono'];
  $direccion = $_POST['direccion'];

  // Actualizar cliente por documento
  $sql = "UPDATE clientes 
          SET nombre = ?, telefono = ?, direccion = ?
          WHERE documento = ?";

  $stmt = $conexion->prepare($sql);
  $stmt->bind_param("ssss", $nombre, $telefono, $direccion, $documento);

  if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Cliente actualizado correctamente."]);
  } else {
    echo json_encode(["success" => false, "message" => "Error al actualizar el cliente."]);
  }

  $stmt->close();
  $conexion->close();

} else {
  echo json_encode(["success" => false, "message" => "Faltan datos en el formulario."]);
}
?>
