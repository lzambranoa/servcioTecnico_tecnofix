<?php
include 'conexion.php';

if (isset($_GET['documento'])) {
    $documento = $_GET['documento'];

    $sql = "DELETE FROM clientes WHERE documento = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("s", $documento);

    $response = [];
    if ($stmt->execute()) {
        $response['success'] = true;
    } else {
        $response['success'] = false;
    }

    echo json_encode($response);
}
?>
