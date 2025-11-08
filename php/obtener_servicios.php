<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

if (!isset($_GET['id'])) {
    echo json_encode([]);
    exit;
}

$id = intval($_GET['id']);
$sql = "SELECT * FROM servicios WHERE id_servicio = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$servicio = $result->fetch_assoc();

echo json_encode($servicio ?: []);
?>
