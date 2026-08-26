<?php
if (isset($_POST['eliminar_producto']) && $_POST['eliminar_producto'] === 'true') {
        include("conexion.php");
        $id = $_POST['elim_id'];
        try {
            $eliminado = $conexion->prepare("DELETE FROM productos WHERE producto_ID like :id");
            $eliminado->bindParam(":id", $id, PDO::PARAM_INT);
            if ($eliminado->execute()) {
                header("Location: admin.php");
            } else {
                echo "no";
            }
        } catch (PDOException $e) {
            die("Error al conectar: " . $e->getMessage());
        }
} /*else if ($_POST['editar_producto']) {
    function editar() {
        include("conexion.php");
        $id = $_POST['elim_id'];
        $eliminado = $conexion->prepare("DELETE FROM productos WHERE producto_ID like :id");
        $eliminado->bindParam(":id", $id, PDO::PARAM_INT);
        $eliminado->execute();
    }
} else if ($_POST["nuevo_prod"]) {

} */
