<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Jabones</title>
    <link rel="stylesheet" href="../CSS/global.css">
    <link rel="stylesheet" href="../CSS/productos-login.css">
</head>

<body>
    <nav class="navegacion">
        <a href="../index.html"><button>Iniciar sesion</button></a>
        <a href="../index.html"><button>Menu</button></a>
        <a href="registro.php"><button>Registrarse</button></a>
    </nav>
    <div class="portada-cont">
        <img class="portada" src="../Images/portada.avif" alt="Foto de portada">
    </div>

    <h1>Bienvenido a ENJABON-(ARTE)</h1>
    <h2>35% de descuento en la primera compra</h2>
    <div class="jabones-caja">

        <?php
        include("conexion.php");

        try {
            $consulta = "SELECT * FROM productos";
            $resultado = $conexion->prepare($consulta);
            $resultado->execute();

            if ($resultado->rowCount() > 0) {
                while ($row = $resultado->fetch(PDO::FETCH_ASSOC)) {
                    echo '<a href="mostrar_jabon.php?id=' . $row['producto_ID'] . '">';
                    echo '<div class="soap-box">';
                    echo '<img src="' . $row['imagen'] . '" alt="' . $row['nombre'] . '" class="soap-image"><br>';
                    echo '<strong>' . $row['nombre'] . '</strong><br>';
                    echo '</div>';
                    echo '</a>';
                }

            } else {
                echo "No se encontraron jabones en la base de datos.";
            }
        } catch (PDOException $e) {
            echo "Error al ejecutar la consulta: " . $e->getMessage();
        }

        $conexion = null;
        ?>
    </div>

</body>

</html>
