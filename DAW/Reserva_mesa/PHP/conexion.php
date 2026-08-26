<?php
function conectarBD() {
    $host = 'localhost';
    $dbname = 'MIMESA';
    $username = 'anibal';
    $password = 'nico';

    try {
        $conexion = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
        $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $conexion->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        return $conexion;
    } catch (PDOException $e) {
        die("Error al conectar: " . $e->getMessage());
    }
}

$conexion = conectarBD();
