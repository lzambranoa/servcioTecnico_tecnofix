<?php
include 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id_cliente = $_POST['cliente'];
    $tipo = $_POST['tipo'];
    $estado = $_POST['estado'];
    $costo = $_POST['costo'];

    if (crearServicio($id_cliente, $tipo, $estado, $costo)) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
}
?>
