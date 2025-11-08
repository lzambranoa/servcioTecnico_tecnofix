<?php
include 'conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["id_servicio"])) {
    $id = $_POST["id_servicio"];

    if (eliminarServicio($id)) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Error al eliminar el servicio."]);
    }
}
?>
