<?php
include 'conexion.php';

if (isset($_GET['documento'])) {
  $documento = $_GET['documento'];

  $sql = "SELECT * FROM clientes WHERE documento = '$documento'";
  $resultado = $conexion->query($sql);

  if ($resultado->num_rows > 0) {
    $cliente = $resultado->fetch_assoc();
    echo json_encode($cliente);
  } else {
    echo json_encode([]);
  }

  $conexion->close();
} else {
  echo json_encode(["error" => "No se recibió el documento"]);
}
?>
