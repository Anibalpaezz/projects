<?php
include("conexion.php");

session_start();
if (!isset($_SESSION['usuario'])) {
    header('Location: ../HTML/sesion.html');
}

$id = isset($_GET['id']) ? $_GET['id'] : null;

if ($id) {
    $consulta_producto = $conexion->prepare("SELECT * FROM productos WHERE producto_ID = ?");
    $consulta_producto->bindParam(1, $id);
    $consulta_producto->execute();
    $row = $consulta_producto->fetch(PDO::FETCH_ASSOC);

    $consulta_compras = $conexion->prepare("SELECT SUM(unidades) FROM item_pedido INNER JOIN pedidos ON item_pedido.pedido_ID = pedidos.pedido_ID WHERE pedidos.email = :usuario AND pedidos.fecha_pedido >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)");
    $consulta_compras->bindParam(":usuario", $_SESSION['usuario']);

    if ($consulta_compras->execute()) {
        $resultado_compras = $consulta_compras->fetchColumn();

        $consulta_cesta = $conexion->prepare("SELECT SUM(cantidad) FROM item_cesta INNER JOIN cesta ON item_cesta.cesta_ID = cesta.cesta_ID WHERE email = :usuario");
        $consulta_cesta->bindParam(":usuario", $_SESSION['usuario']);

        if ($consulta_cesta->execute()) {
            $resultado_cesta = $consulta_cesta->fetchColumn();

            echo '<h1>' . $row['nombre'] . '</h1>';
            echo '<div>';
            echo '<img src="' . $row['imagen'] . '" alt="' . $row['nombre'] . '">';
            echo '<p>' . $row['descripcion'] . '</p>';
            echo '</div>';

            echo '<form action="carrito.php" method="post">';
            echo '<input type="number" name="cantidad" id="numero" name="numero" min="0" max="' . ($resultado_compras || $resultado_cesta == 2 ? 0 : ($resultado_compras == 1 && $resultado_cesta == 0 ? 1 : ($resultado_compras == 0 && $resultado_cesta == 1 ? 1 : ($resultado_compras == 1 && $resultado_cesta == 1 ? 0 : 2)))) . '" step="1">';
            echo '<input type="hidden" name="producto" value="' . $id . '">';
            echo '<button type="submit">Comprar</button>';
            echo '</form>';
        } else {
            echo "Error en la consulta de la cesta";
        }
    } else {
        echo "Error en consulta de las compras";
    }

} else {
    echo 'ID incorrecto.';
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="../Icon/favicon logo.png" type="image/x-icon">
    <title>
        <?php echo $row['nombre'] ?>
    </title>
    <link rel="stylesheet" href="../CSS/global.css">
    <link rel="stylesheet" href="../CSS/mostrar_jabon.css">
    <style>
        
    </style>
</head>

<body>
</body>

</html>