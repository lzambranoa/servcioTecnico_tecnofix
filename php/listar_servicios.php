<?php
header("Content-Type: application/json");
require_once "conexion.php";

try {
    $sql = "SELECT s.id_servicio, c.nombre AS cliente, s.tipo_servicio, s.estado, s.costo_estimado
            FROM servicios s
            INNER JOIN clientes c ON s.id_cliente = c.id_cliente
            ORDER BY s.id_servicio DESC";

    $stmt = $conexion->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();

    $servicios = [];

    while ($row = $result->fetch_assoc()) {
        $servicios[] = $row;
    }

    echo json_encode($servicios);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

$conexion->close();
?>
