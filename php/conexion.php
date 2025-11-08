<?php
// ==========================================
// TecnoFix - Conexión y CRUD para el sistema
// ==========================================

// Parámetros de conexión
$host = 'localhost';
$usuario = 'root';
$contrasena = '';
$base_datos = 'tecnofix_db';

// Crear conexión
$conexion = new mysqli($host, $usuario, $contrasena, $base_datos);

// Verificar conexión
if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

// Establecer codificación
$conexion->set_charset("utf8");

// ===============================
// CRUD para tabla CLIENTES
// ===============================

// Crear cliente
function crearCliente($documento, $nombre, $telefono, $direccion) {
    global $conexion;
    $sql = "INSERT INTO clientes (documento, nombre, telefono, direccion) 
            VALUES (?, ?, ?, ?)";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("ssss", $documento, $nombre, $telefono, $direccion);
    return $stmt->execute();
}

// Leer clientes
function obtenerClientes() {
    global $conexion;
    $sql = "SELECT * FROM clientes ORDER BY id_cliente DESC";
    return $conexion->query($sql);
}

// Actualizar cliente
function actualizarCliente($id, $documento, $nombre, $telefono, $direccion) {
    global $conexion;
    $sql = "UPDATE clientes SET documento=?, nombre=?, telefono=?, direccion=? 
            WHERE id_cliente=?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("ssssi", $documento, $nombre, $telefono, $direccion, $id);
    return $stmt->execute();
}

// Eliminar cliente
function eliminarCliente($id) {
    global $conexion;
    $sql = "DELETE FROM clientes WHERE id_cliente=?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $id);
    return $stmt->execute();
}

// ===============================
// CRUD para tabla SERVICIOS
// ===============================

// Crear servicio
function crearServicio($id_cliente, $tipo_servicio, $estado, $costo_estimado) {
    global $conexion;
    $sql = "INSERT INTO servicios (id_cliente, tipo_servicio, estado, costo_estimado) 
            VALUES (?, ?, ?, ?)";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("issd", $id_cliente, $tipo_servicio, $estado, $costo_estimado);
    return $stmt->execute();
}

// Leer servicios
function obtenerServicios() {
    global $conexion;
    $sql = "SELECT s.*, c.nombre AS cliente 
            FROM servicios s 
            JOIN clientes c ON s.id_cliente = c.id_cliente 
            ORDER BY s.id_servicio DESC";
    return $conexion->query($sql);
}

// Actualizar servicio
function actualizarServicio($id, $id_cliente, $tipo_servicio, $estado, $costo_estimado) {
    global $conexion;
    $sql = "UPDATE servicios SET id_cliente=?, tipo_servicio=?, estado=?, costo_estimado=? 
            WHERE id_servicio=?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("issdi", $id_cliente, $tipo_servicio, $estado, $costo_estimado, $id);
    return $stmt->execute();
}

// Eliminar servicio
function eliminarServicio($id) {
    global $conexion;
    $sql = "DELETE FROM servicios WHERE id_servicio=?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $id);
    return $stmt->execute();
}
?>