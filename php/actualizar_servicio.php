<?php
include("conexion.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = $_POST['id_servicio'];
    $id_cliente = $_POST['cliente'];
    $tipo_servicio = $_POST['tipo'];
    $estado = $_POST['estado'];
    $costo_estimado = $_POST['costo'];

    if (actualizarServicio($id, $id_cliente, $tipo_servicio, $estado, $costo_estimado)) {
        echo json_encode(["success" => true, "message" => "Servicio actualizado correctamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al actualizar el servicio."]);
    }
}
?>
