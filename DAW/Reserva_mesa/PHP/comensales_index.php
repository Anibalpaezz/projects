<?php
include("PHP/conexion.php");

if (isset($_GET['restaurante'])) {
    $restaurante = $_GET['restaurante'];

    try {
        $consulta = conectarBD()->prepare("SELECT MAX(capacidad) FROM mesa WHERE restaurante = :restaurante");
        $consulta->bindParam(':restaurante', $restaurante);
        
        if ($consulta->execute()) {
            $capacidadMaxima = $consulta->fetchColumn();
            echo $capacidadMaxima;
        }
    } catch (\Throwable $th) {
        echo "Error al obtener la capacidad máxima.";
    }
}

