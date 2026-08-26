<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="shortcut icon" href="../Icon/favicon logo.png" type="image/x-icon">
    <title>Enjabon-arte</title>
    <link rel="stylesheet" href="CSS/global.css">
    <style>
        .soap-box {
            border: 1px solid #ccc;
            padding: 10px;
            margin: 10px;
            width: 110px;
            text-align: center;
            display: inline-block;
        }

        .soap-image {
            max-width: 100px;
            height: 75px;
        }
    </style>
</head>

<body>

    <?php
    include("conectar.php");

    try {
        $sql = "SELECT * FROM productos";
        $stmt = $conexion->prepare($sql);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                echo '<div class="soap-box">';
                echo '<img src="' . $row['imagen'] . '" alt="' . $row['nombre'] . '" class="soap-image"><br>';
                echo '<strong>' . $row['nombre'] . '</strong><br>';
                echo '</div>';
            }
        } else {
            echo "No se encontraron jabones en la base de datos.";
        }
    } catch (PDOException $e) {
        echo "Error al ejecutar la consulta: " . $e->getMessage();
    }
    
    $conexion = null;
    ?>

</body>

</html>