<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

// Capturar datos del formulario
$documento = $_POST['documento'] ?? '';
$nombre = $_POST['nombre'] ?? '';
$telefono = $_POST['telefono'] ?? '';
$direccion = $_POST['direccion'] ?? '';

if (!$documento || !$nombre || !$telefono || !$direccion) {
    echo json_encode(['success' => false, 'error' => 'missing_fields']);
    exit;
}

try {
    // Usar la función existente en conexion.php
    if (crearCliente($documento, $nombre, $telefono, $direccion)) {
        $id_cliente = $conexion->insert_id;
        echo json_encode(['success' => true, 'id_cliente' => $id_cliente]);
    } else {
        echo json_encode(['success' => false, 'error' => 'insert_failed']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
