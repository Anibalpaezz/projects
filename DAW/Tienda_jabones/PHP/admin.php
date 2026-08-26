<?php
include("conexion.php");

try {
    $conexion = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conexion->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    
    $query = $conexion->prepare("SELECT * FROM productos");
    $query->execute();
    $productos = $query->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Error al conectar: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="../Icon/favicon logo.png" type="image/x-icon">
    <title>Enjabon-arte</title>
    <link rel="stylesheet" href="../CSS/global.css">
    <link rel="stylesheet" href="../CSS/admin.css">
</head>

<body>

    <h1>Lista de Productos</h1>

    <table border="1">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Peso</th>
                <th>Precio</th>
                <th colspan="2">Acciones</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($productos as $producto) : ?>
                <tr>
                    <td><?php echo $producto['producto_ID']; ?></td>
                    <td><?php echo $producto['nombre']; ?></td>
                    <td><?php echo $producto['descripcion']; ?></td>
                    <td><?php echo $producto['peso']; ?></td>
                    <td><?php echo $producto['precio']; ?></td>
                    <td>
                        <form method="post" action="acciones.php">
                            <input type="hidden" name="elim_id" value="<?php echo $producto['producto_ID']; ?>">
                            <input type="hidden" name="eliminar_producto" value="true">
                            <button type="submit">Eliminar</button>
                        </form>
                    </td>
                    <td>
                        <form method="post" action="acciones.php">
                            <input type="hidden" name="edit_id" value="<?php echo $producto['producto_ID']; ?>">
                            <input type="hidden" name="editar_producto" value="true">
                            <button type="submit">Editar</button>
                        </form>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <br>

    <form method="post" action="añadir.php">
        <button type="submit">Añadir Nuevo Producto</button>
    </form>

</body>

</html>
