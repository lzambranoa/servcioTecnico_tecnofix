<?php
require_once 'conexion.php';  // Conexión y funciones CRUD

header('Content-Type: application/json; charset=utf-8');

$resultado = obtenerClientes();

$clientes = [];
if ($resultado && $resultado->num_rows > 0) {
    while ($fila = $resultado->fetch_assoc()) {
        $clientes[] = $fila;
    }
}

echo json_encode($clientes);
?>
